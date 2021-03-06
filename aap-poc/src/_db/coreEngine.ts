import { PositionItem, RadarItem, StrategyItem, RadarStrategyParm, Breakdown, Alert, Radar, PerformancePeriod, Client, AlertHistory2, TimeHorizon } from "./interfaces";
import { sumBy, groupBy } from "lodash";
import { numArray, rnd } from "./utils";
import { solve } from "./solver";
import { performances, perfSummary } from "./data/index";
import * as moment from 'moment';
import * as math from 'mathjs';
import { networkInterfaces } from "os";
import { suggestedPositionExCash, currentPosition, suggestedPosition } from "./common/radarUtils";
import { securityList } from "./data";


export const getSuggestion = (position: StrategyItem[], axes: RadarStrategyParm, calculateFromAxes: boolean, forced?: StrategyItem[]): StrategyItem[] => {
  const k = getSuggestion1(position, axes, calculateFromAxes, forced);
  return fixCash(k);
}
const getSuggestion1 = (position: StrategyItem[], axes: RadarStrategyParm, calculateFromAxes: boolean, forced?: StrategyItem[]): StrategyItem[] => {
  if (calculateFromAxes) {
    if (forced && axes.concentration && axes.consistency && axes.efficency && axes.overlap && axes.riskAdequacy && axes.riskAnalysis) return acceptAll(forced);
    return acceptAll(solve(position, axes));
  } else {

    let newPos = forced
      ? forced.map(p => ({ ...p, suggestionAccepted: position.find(r => r.security.IsinCode === p.security.IsinCode)!.suggestionAccepted }))
      : position;
    const w = suggestedPositionExCash(newPos)
    const delta = sumBy(w, s => s.weight) - 1;
    const cp = position.find(p => p.isCash)!
    const cashPosition = { ...cp, suggestedDelta: -delta, suggestionAccepted: delta != 0 };
    const secPositions = position.filter(p => !p.isCash);
    return [cashPosition, ...secPositions]
  }
};




const fixCash = (strategy: StrategyItem[]) => {
  const delta = sumBy(strategy, f => (f.currentWeight + (f.suggestionAccepted ? f.suggestedDelta : 0))) - 1;
  return strategy.map(s => {
    return s.isCash ? { ...s, suggestedDelta: s.suggestedDelta - delta, suggestionAccepted: true }
      : { ...s }
  });
}

const acceptAll = (forced: StrategyItem[]) => {
  return forced.map(s => {
    return { ...s, suggestionAccepted: s.suggestedDelta != 0 ? true : false }
  });
}


const getAttributeBreakDown = (attributeName: string, holdings: PositionItem[]): Breakdown => {
  const mappedData = holdings
    .filter(f => f.security![attributeName] !== null)
    .map(s => ({ value: s.security![attributeName], weight: s.weight, bmk: s.weight }));
  const agg = groupBy(mappedData, v => v.value);
  const data = Object.keys(agg).map(k => {
    return {
      value: k,
      weight: sumBy(agg[k], x => x.weight),
      bmk: sumBy(agg[k], x => x.bmk)
    }
  });
  return {
    data,
    attributeName,
    weight: sumBy(mappedData, w => w.weight)
  }
}

export const getBreakdowns = (clients: Client[]) => {

}

export const getBreakdown = (holdings: PositionItem[]) => {
  const attributes = [
    'MacroAssetClass',
    'MicroAssetClass',
    'Sector',
    'Currency',
    'Rating',
    'Region',
    'Maturity'
  ];
  return attributes.map(r => getAttributeBreakDown(r, holdings));
}

const performanceForPeriod = (isin: string, period: PerformancePeriod) => {
  const data = performances[isin];
  if (!data) {
    console.error('performances not found for:', isin);
    return [];
  }
  const maxDate = moment(data[data.length - 1].date);
  const minDate = period == '1M' ? maxDate.subtract(1, 'month') :
    period == '3M' ? maxDate.subtract(3, 'month') :
      period == '6M' ? maxDate.subtract(6, 'month') :
        period == '1Y' ? maxDate.subtract(1, 'year') :
          period == 'YTD' ? moment([maxDate.year(), 0, 1]) : moment(data[0].date);
  const minDateStr = minDate.format('YYYY-MM-DD');
  const filteredData = data.filter(p => p.date >= minDateStr);
  return filteredData.map(p => ({
    ...p,
    perf: p.perf - filteredData[0].perf
  }));
}

export const getPerformances = (isin: string[], period: PerformancePeriod) => {
  return (isin.reduce((p, c) => {
    p[c] = performanceForPeriod(c, period);
    return p;
  }, {} as { [isin: string]: { date: string, perf: number }[] }));
}

export const getRiskReturnFromPerfomance = (data: { date: string, perf: number }[]) => {
  return {
    perf: 100 * data[data.length - 1].perf,
    devSt: 100 * math.std(data.map(p => p.perf))
  }
}

export const getRiskReturn = (position: PositionItem[], model: PositionItem[], period: PerformancePeriod) => {
  const names = position.reduce((prev, curr) => {
    if (curr.weight > 0) {
      prev[curr.security.IsinCode] = curr.security.SecurityName
    }
    return prev;
  }, {} as { [id: string]: string });
  const perfs = getPerformances(position.map(p => p.security.IsinCode), period);

  let ret = Object.keys(perfs)
    .map(id => {
      return { ...getRiskReturnFromPerfomance(perfs[id]), id: names[id] }
    }, {} as { [id: string]: { perf: number, devSt: number } })
  ret.push({ ...getRiskReturnFromPerfomance(getPositionPerformance(position, period)), id: 'Portfolio' });
  ret.push({ ...getRiskReturnFromPerfomance(getPositionPerformance(model, period)), id: 'Model' });
  return ret.filter(o => o.id !== 'CASH').sort((a, b) => a.devSt - b.devSt);
}

const getPerfContrib = (isin: string[]) => {

  let ret: { perf: number, date: string, id: string }[] = [];
  isin.forEach(i => {


    ret = [
      ...ret,
      ...perfSummary[i].map(p => {
        return { ...p, id: i };
      })];
  });
  return ret;
}

export const getPerfContribution = (position: PositionItem[]) => {
  const filteredPos = position.filter(w => w.weight != 0);
  const keys = filteredPos.map(p => p.security.IsinCode);
  const weights = filteredPos.reduce((prev, curr) => {
    prev[curr.security.IsinCode] = curr.weight;
    return prev;
  }, {} as { [key: string]: number });
  const perfCompo = getPerfContrib(keys);

  const gPerf = groupBy(perfCompo, g => g.date);
  const ret = Object.keys(gPerf).map(k => {
    const o = gPerf[k].reduce((pr, cu) => {
      const secNameRes = securityList.find(sec => sec.IsinCode == cu.id);
      const secName = secNameRes ? secNameRes.SecurityName : cu.id;
      pr[secName] = cu.perf * weights[cu.id] * 100;
      return pr;
    }, { year: parseInt(k) } as any);
    return o;
  });
  return ret;
  // Replace isin code with security name.
}


export const getPositionPerformance = (position: PositionItem[], period: PerformancePeriod = 'All') => {
  const filteredPos = position.filter(w => w.weight != 0);
  const keys = filteredPos.map(p => p.security.IsinCode);
  const weights = filteredPos.reduce((prev, curr) => {
    prev[curr.security.IsinCode] = curr.weight;
    return prev;
  }, {} as { [key: string]: number });

  const perfCompo = getPerformances(keys, period);
  return perfCompo[keys[0]].map((i, ix) => {
    return {
      date: i.date,
      perf: keys.reduce((prev, curr) => {
        return prev + perfCompo[curr][ix].perf * weights[curr];
      }, 0)
    }
  });
}

const regression = require('regression');
export const calculateRegression = (data: { date: string, perf: number }[]) => {
  const newData = data.map((v, i) => ([i, v.perf * 100]));
  const result = regression.linear(newData);
  return {
    gradient: result.equation[0] / 100,
    yIntercept: result.equation[1],
    result
  }
}

export const calculateProjection = (data: { date: string, perf: number }[], days: number, startValue: number) => {
  let newData = [] as { date: string, perf?: number, projection?: number, min?: number, max?: number }[];

  const r = calculateRegression(data);

  let date = moment(data[data.length - 1].date);
  let perf = startValue;
  newData.push({
    date: data[data.length - 1].date,
    projection: startValue,
    perf: startValue,
    min: startValue,
    max: startValue,
  });
  for (let i = 0; i < days; i++) {
    date = date.add('days', 10);
    perf += r.gradient;
    newData.push({
      date: moment(date).format('YYYY-MM-DD'),
      projection: perf,
      min: perf - Math.log(2 + i) / 80,
      max: perf + Math.log(2 + i) / 80,
    });
  }
  const r95 = math.ceil(10000 * (newData[newData.length - 1].projection! - startValue)) / 100;

  const getProbabilityByTimeHorizon = (th: TimeHorizon, targetReturn: number) => {
    const min = r95 > 0 ? 0 : r95;
    const max = r95 > 0 ? r95 : 0;

    const d = targetReturn < min ? min - targetReturn :
      targetReturn > max ? targetReturn - max :
        0;
    const prob = math.round(96 - (30 * d / (max - min)));
    return math.max(prob, 1);
  }

  const returnFor95 = (th: TimeHorizon) => {
    return r95;
  }

  const ret = {
    data: newData,
    getProbabilityByTimeHorizon,
    returnFor95
  };
  return ret;
}
