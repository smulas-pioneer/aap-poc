import { PositionItem, RadarItem, StrategyItem, RadarStrategyParm, Breakdown, Alert, Radar, PerformancePeriod, Client, AlertHistory2, TimeHorizon } from "./interfaces";
import { sumBy, groupBy } from "lodash";
import { numArray, rnd } from "./utils";
import { solve } from "./solver";
import { performances } from "./data/index";
import * as moment from 'moment';
import * as math from 'mathjs';
import { networkInterfaces } from "os";

// Calculate the radar of a position
export const avgRadar = (position: PositionItem[]): RadarItem => {
    return {
        concentration: sumBy(position, p => p.radar.concentration * p.weight),
        efficency: sumBy(position, p => p.radar.efficency * p.weight),
        consistency: sumBy(position, p => p.radar.consistency * p.weight),
        overlap: sumBy(position, p => p.radar.overlap * p.weight),
        riskAdequacy: sumBy(position, p => p.radar.riskAdequacy * p.weight),
        riskAnalysis: sumBy(position, p => p.radar.riskAnalysis * p.weight),
    }
}

export const getRAG = (act: number, limit: number): Alert => {
    const d = act - limit;
    if (d < -0.5) return 'green';
    if (d < 1) return 'orange';
    return 'red';
}

export const createRadarFromStrategy = (strategy: StrategyItem[]) => {
    const actual = currentPosition(strategy);
    const model = modelPosition(strategy);
    const sugg = suggestedPosition(strategy);

    const radarActual = avgRadar(actual);
    const radarModel = avgRadar(model);
    const radarLimit = getRadarLimitSync(radarModel);
    const radarSugg = avgRadar(sugg);

    return createRadarSync(radarModel, radarActual, radarLimit, radarSugg);
}

export const createRadarSync = (guideLines: RadarItem,
    actual: RadarItem,
    limits: RadarItem,
    proposed: RadarItem
): Radar => {
    const data = {
        guideLines,
        actual,
        limits,
        proposed,
        concentrationAlert: getRAG(proposed.concentration, limits.concentration),
        consistencyAlert: getRAG(proposed.consistency, limits.consistency),
        efficencyAlert: getRAG(proposed.efficency, limits.efficency),
        overlapAlert: getRAG(proposed.overlap, limits.overlap),
        riskAdequacyAlert: getRAG(proposed.riskAdequacy, limits.riskAdequacy),
        riskAnalysisAlert: getRAG(proposed.riskAnalysis, limits.riskAnalysis),
    }

    const alerts = [data.concentrationAlert, data.consistencyAlert, data.efficencyAlert, data.riskAdequacyAlert, data.riskAnalysisAlert, data.overlapAlert];
    const reds = alerts.filter(r => r == 'red').length;
    const oranges = alerts.filter(r => r == 'orange').length;
    const numOfAlerts = reds + oranges;
    const color = numOfAlerts == 0 ? 'green' :
        reds == 0 ? 'yellow' :
            oranges == 0 ? 'red' : 'orange';

    return { ...data, numOfAlerts, color };
}

export const getRadarLimitSync = (radarItem: RadarItem): RadarItem => {
    return {
        concentration: radarItem.concentration + 1,//rnd(1, 20) / 10,
        efficency: radarItem.efficency + 1,// rnd(1, 20) / 10,
        consistency: radarItem.consistency + 1,// + rnd(1, 20) / 10,
        overlap: radarItem.overlap + 1,// + rnd(1, 20) / 10,
        riskAdequacy: radarItem.riskAdequacy + 1,// + rnd(1, 20) / 10,
        riskAnalysis: radarItem.riskAnalysis + 1,// + rnd(1, 20) / 10
    }
};

export const currentPosition = (position: StrategyItem[]): PositionItem[] =>
    position.map(p => ({ security: p.security, radar: p.radar, weight: p.currentWeight }));

export const modelPosition = (position: StrategyItem[]): PositionItem[] =>
    position.map(p => ({ security: p.security, radar: p.radar, weight: p.modelWeight }));

export const suggestedPosition = (position: StrategyItem[]): PositionItem[] =>
    position.map(p => ({ security: p.security, radar: p.radar, weight: p.suggestionAccepted ? p.currentWeight + p.suggestedDelta : p.currentWeight }));

export const suggestedPositionExCash = (position: StrategyItem[]): PositionItem[] =>
    position.map(p => ({ security: p.security, radar: p.radar, weight: p.suggestionAccepted && !p.isCash ? p.currentWeight + p.suggestedDelta : p.currentWeight }));

export const getSuggestion = (position: StrategyItem[], axes: RadarStrategyParm, calculateFromAxes: boolean): StrategyItem[] => {

    if (calculateFromAxes) {
        return solve(position, axes);
    } else {
        const w = suggestedPositionExCash(position);
        const delta = sumBy(w, s => s.weight) - 1;
        return [{ ...position[0], suggestedDelta: -delta, suggestionAccepted: delta != 0 }].concat(position.slice(1));
    }


};

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

export const getBreakdown = (holdings: PositionItem[]) => {
    const attributes = [
        'MacroAssetClass',
        'MicroAssetClass',
        'Sector',
        'Currency',
        'Rating',
        'Country',
        'Maturity'
    ];
    return attributes.map(r => getAttributeBreakDown(r, holdings));
}

const performanceForPeriod = (isin: string, period: PerformancePeriod) => {
    const data = performances[isin];
    const maxDate = moment(data[data.length - 1].date);
    const minDate = period == '1M' ? maxDate.subtract(1, 'month') :
        period == '3M' ? maxDate.subtract(3, 'month') :
            period == '6M' ? maxDate.subtract(6, 'month') :
                period == '1Y' ? maxDate.subtract(1, 'year') :
                    period == 'YTD' ? moment([maxDate.year(), 0, 1]) : moment(data[0].date);
    const minDateStr = minDate.format('YYYY-MM-DD');
    const filteredData = data.filter(p => p.date >= minDateStr).slice(0,200);
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
        prev[curr.security.IsinCode] = curr.security.SecurityName
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

export const getPositionPerformance = (position: PositionItem[], period: PerformancePeriod = 'All') => {
    const filteredPos = position.filter(w => w.weight != 0);
    const keys = filteredPos.map(p => p.security.IsinCode);
    const weights = filteredPos.reduce((prev, curr) => {
        prev[curr.security.IsinCode] = curr.weight;
        return prev;
    }, {} as { [key: string]: number });
    

    const perfCompo = getPerformances(keys, period);
    console.log('perf compo keys' ,keys);
    console.log('perf compo ' + period,perfCompo);
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

export const calculateProjection = (data: { date: string, perf: number }[], days: number, startValue:number) => {
    let newData = [] as { date: string, perf?: number, projection?: number, min?: number, max?: number }[];

    const r = calculateRegression(data);
    let date = moment(data[data.length-1].date);
    let perf = startValue;
    newData.push({
        date:data[data.length-1].date,
        projection:startValue,
        perf: startValue,
        min:startValue,
        max:startValue,
    });
    for (let i = 0; i < days; i++) {
        date = date.add('days', 1);
        perf += r.gradient;
        newData.push({
            date: moment(date).format('YYYY-MM-DD'),
            projection: perf,
            min: perf - Math.log(2 + i) / 80,
            max: perf + Math.log(2 + i) / 80,
        });
    }
    const r95 =  math.ceil(10000 * (newData[newData.length-1].projection! - startValue))/100;

    const getProbabilityByTimeHorizon = (th:TimeHorizon , targetReturn: number) => {
        const min = r95  > 0 ? 0 : r95;
        const max = r95 > 0 ?  r95: 0;

        const d = targetReturn < min ? min- targetReturn :
                targetReturn > max ? targetReturn -max :
                0;
        const prob = math.round( 96 - (30* d/(max-min)));
        return math.max(prob,1);
    }  

    const returnFor95 = (th:TimeHorizon ) => {
      return r95;
    }
        
    return {
        data:newData,
        getProbabilityByTimeHorizon,
        returnFor95 
    };
}

export const calculateProjection_ = (data: { date: string, perf: number }[], days: number) => {
    let newData = [...data] as { date: string, perf?: number, projection?: number, min?: number, max?: number }[];

    const r = calculateRegression(data);
    const lastValue = data[data.length - 1];
    let date = moment(lastValue.date);
    let perf = lastValue.perf;
    newData[newData.length - 1].projection = perf;
    newData[newData.length - 1].min = perf;
    newData[newData.length - 1].max = perf;

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
    return newData;
}
const radarToAlertHistory = (clients: Client[], date: string): AlertHistory2 => {
    const count = (color: string) => sumBy(
        clients.map(c => c.radar)
            .map(radar => Object.keys(radar)
                .filter(k => k.endsWith('Alert'))
                .filter(k => radar[k] == color).length)
        , v => v);

    const countMifid = (color: string) => sumBy(
        clients.map(c => c.radar)
            .map(radar => Object.keys(radar)
                .filter(k => k == ('RiskAdequacyAlert'))
                .filter(k => radar[k] == color).length)
        , v => v);

    const totAlerts = clients.length * 6;
    const breaked = count('red') + count('orange');
    const mifidBreaked = countMifid('red') + countMifid('orange');
    const nonBreaked = totAlerts - breaked;
    const nonMifidBreaked = breaked - mifidBreaked;
    return {
        date,
        breaked,
        mifidBreaked,
        nonBreaked,
        nonMifidBreaked
    }
}

export const calculateAlertHistory = (clients: Client[]): AlertHistory2[] => {
    const curDate = moment();
    let ret: AlertHistory2[] = [];
    ret.push(radarToAlertHistory(clients, curDate.format('YYYY-MM-DD')));

    const l = 1;//clients.length ;

    KAPPA.forEach((k, i) => {
        const newDate = curDate.subtract(i, 'days').format('YYYY-MM-DD');
        const lastItem = ret[i];

        const mifidbreak = k.m * l;
        const nonMifidBreak = k.n * l;
        const nonBreaked = k.o * l;
        const newItem: AlertHistory2 = {
            date: newDate,
            breaked: lastItem.breaked + mifidbreak + nonMifidBreak,
            mifidBreaked: lastItem.mifidBreaked + mifidbreak,
            nonBreaked: lastItem.nonBreaked + nonBreaked,
            nonMifidBreaked: lastItem.nonMifidBreaked + nonMifidBreak
        }
        ret.push(newItem);
    });
    return ret.reverse();
}


const KAPPA = [
    { m: 0, n: 1, o: 0 },
    { m: 1, n: 1, o: 1 },
    { m: -1, n: 2, o: -2 },
    { m: 1, n: 1, o: 2 },
    { m: -1, n: -2, o: -4 },
    { m: 2, n: 1, o: 3 },
    { m: 3, n: 0, o: 3 },
    { m: -1, n: -2, o: -4 },
    { m: 2, n: 3, o: 1 },
    { m: -1, n: 2, o: -2 },
    { m: 3, n: 2, o: 3 },
    { m: -1, n: -2, o: -2 },
    { m: 2, n: 2, o: -3 },
    { m: 3, n: 0, o: 3 },
    { m: -1, n: -2, o: -4 },
    { m: 2, n: 1, o: -1 },
    { m: 3, n: -1, o: 3 },
    { m: -1, n: -2, o: -2 },
    { m: 2, n: -3, o: 3 },
    { m: -1, n: 2, o: -2 },
    { m: 3, n: 4, o: -3 },
    { m: 2, n: 3, o: 3 }
]

export const getRandomRadar = () => {
    const max = rnd(10, 70);
    return {
        concentration: rnd(10, max) / 10,
        efficency: rnd(10, max) / 10,
        consistency: rnd(10, max) / 10,
        overlap: rnd(10, max) / 10,
        riskAdequacy: rnd(10, max) / 10,
        riskAnalysis: rnd(10, max) / 10
    };
};