import { Portfolio, Holding, Client, Radar, InterviewResult, StrategyItem, AlertHistory, TimeHorizon, TimeHorizonMonths, ClientState } from './common/interfaces';
import { securities, cash, wrapSecurities, wrapSecurity, SHOWMISSING } from './common/securities';
import { createRadarFromStrategy, isFakeClient, getRandomRadar } from './common/radarUtils';
import { REFERENCE_DATE_TODAY } from './common/consts';
//import * as svc from './_db/service';
import * as fs from 'fs';
import { sumBy, maxBy, groupBy } from 'lodash';
import moment from 'moment';
import { getAllSecuirities, getAllPerformances, getAllStrategies, createFakeRadar } from './fakedata'

import * as faker_ from 'faker';

const log = console.log;
const rnd = (min: number, max: number) => Math.round(Math.random() * (max - min)) + min;
const fmt = (num: number) => Math.ceil(num * 10) / 10
const rndS = (data: string[]) => data[rnd(0, data.length - 1)];
const dump = (file: string, data: any) => fs.writeFileSync(`./build/${file}`, JSON.stringify(data, null, 2));

const italyRegions = [
  'Nord Ovest',
  'Lombardia',
  'Nord Est',
  'Centro Nord',
  'Centro',
  'Sud',
  'Sicilia',
  'Germany',
  'Austria',
  'Luxemburg'];

const italyRegionsRate = {
  'Nord Ovest': 4,
  'Lombardia': 10,
  'Nord Est': 8,
  'Centro Nord': 6,
  'Centro': 9,
  'Sud': 6,
  'Sicilia': 5,
  'Germany': 6,
  'Austria': 7,
  'Luxemburg': 9
}
const getFake = (region: string) => {
  let faker = faker_ as any;
  if (region === 'Germany') {
    faker.locale = 'de';
  } else if (region === 'Austria') {
    faker.locale = 'at';
  } else if (region === 'Luxemburg') {
    faker.locale = 'lu';
  } else {
    faker.locale = 'it';
  }
  return faker as Faker.FakerStatic;
}

const MODEL_COUNT = 10;
const CLIENT_COUNT_IT = 2320;
const CLIENT_COUNT_DE = 1020;
const CLIENT_COUNT_LU = 27;
const CLIENT_COUNT_AT = 470;
const CLIENT_COUNT = CLIENT_COUNT_AT + CLIENT_COUNT_DE + CLIENT_COUNT_IT + CLIENT_COUNT_LU;
const MAX_CITIES_X_REGION = 3;
const MAX_BRANCH_X_CITY = 3;
const MAX_AGENT_X_BRANCH = 3;

const STRAGEGY_MIN_SECURITY_COUNT = 4;
const STRATEGY_MAX_SECURITY_COUNT = 8;

const numArray = (num: number) => {
  let ret: number[] = [];
  for (let i = 0; i < num; i++) {
    ret.push(i);
  }
  return ret;
}

const portfolioCreator = (id: string, name: string): Portfolio => {
  let num = rnd(3, 25);
  return {
    id,
    name,
    holdings: holdingsCreator(num),
    history: []
  }
}

var clientIndex = 0;
type Country = 'Italy' | 'Luxemburg' | 'Austria' | 'Germany'

const sameRegionAgents = (region:string) => {
  return agents.filter(p=>agentDictionary[p].region===region);
}

const clientCreator = (id: string, models: Portfolio[], agents: string[], country: Country): Client => {
  const faker = getFake(country);

  const name = faker.name.firstName();
  const lastName = faker.name.lastName();
  const modelIx = Math.ceil(Math.random() * (MODEL_COUNT - 1));

  const agentName = isFakeClient(id) || (++clientIndex) < 200 ? sameRegionAgents[0] : sameRegionAgents[rnd(0, sameRegionAgents.length - 1)];
  const agent = agentDictionary[agentName];
  return {
    id,
    name: `${name} ${lastName}`,
    modelId: models[modelIx].id,
    radar: null,
    agent: agentName,
    lastInterviewDate: '2017-01-01',
    lastAdvicedate: '2017-01-01',
    clientStatusAge: '2017-01-01',
    clientStatusDuration: '<1W',
    projectAccomplishment: rnd(0, 100),
    country: country,
    address: {
      city: agent.branch.city.cityName,
      region: agent.branch.city.region,
      zipCode: faker.address.zipCode(),
      streetAddress: faker.address.streetAddress(true),
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude()
    },
    email: faker.internet.email(name, lastName),
    phone: faker.phone.phoneNumber(),
    size: '<1M',
    breaks: [],
    deltaAnalysis: faker.lorem.lines(1),
    modelName: id == "0" ? "Defensive" :
      id == "1" ? "Balanced" :
        id == "2" ? "Defensive" :
          faker.company.catchPhraseAdjective(),
    decision: '',
    clientRiskProfile: rndS(['Risk Adverse', 'Conservative', 'Balanced', 'Dynamic', 'Aggressive']),
    clientStatus: 'NO ALERT',
    mifid: rnd(1, 40),
    numOfAcceptedProposal: 0,
    numOfRejectedProposal: 0,
    numOfInterviews: 0,
    segment: 'Retail',
    timeHorizon: id == "0" ? '18 Months' :
      id == "1" ? '3 Years' :
        id == "2" ? '5 Years' :
          Object.keys(TimeHorizonMonths)[rnd(0, 2)] as TimeHorizon,
    branch: agent.branch.branchName,
    sales: 0,
    ongoingFees: 0,
    upfrontFees: 0,
    budget: 0,
    turnover: rnd(0, 100),
    regulatoryIndicator: 0,
    guidelineIndicator: 0,
    aboveGuidelines: 0,
    belowGuidelines: 0,
    allocationKPI: rnd(0, 100),
    productAppropriateness: rnd(1, 5),
    percentageOfDiscountFees: rnd(0, 5),
    project: rndS(['Wealth', 'Retirement', 'New House', 'New Car', 'University', 'Vacations']),
    Y1_Ongoing_FEES: 0,
    Y1_Upfront_FEES: 0,
    MTD_Ongoing_FEES: 0,
    MTD_Upfront_FEES: 0,
    YTD_Ongoing_FEES: 0,
    YTD_Upfront_FEES: 0,
    aua: 0// sumBy(cli.holdings, v => v.amount) || 0 //faker.random.number({ min: 0, max: 100000000 }),


  }
}

/*
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
*/
const clientStrategyCreator = (clients: Client[]) => {
  return clients.reduce((prev, curr) => {
    prev[curr.id] = strategyCreator();
    return prev;
  }, {} as { [cli: string]: StrategyItem[] })
}

let usedCurr: any = { 'USD': 0, 'EUR': 0 };
const getRandomSecurity = () => {
  let ret;
  do {
    ret = securities[rnd(1, securities.length - 1)];

  } while (ret.Currency == 'USD' && usedCurr.EUR < (usedCurr.USD * 2));
  usedCurr[ret.Currency]++;

  return ret;
}

const strategyCreator = (): StrategyItem[] => {
  let tot = 0;
  let totModel = 0;
  let num = rnd(STRAGEGY_MIN_SECURITY_COUNT, STRATEGY_MAX_SECURITY_COUNT);
  const cliType = rnd(0, 10);
  const qUbound = cliType < 5 ? 6000 :
    cliType < 6 ? 10000 :
      cliType < 7 ? 30000 :
        cliType < 8 ? 70000 : 100000

  return numArray(num).map(i => {
    const skipQ = i > (num - 2);
    const skipM = i > 2 && rnd(1, 7) < 3;

    const sec = i == 0 ? cash : getRandomSecurity();

    const quantity = skipQ ? 0 : Math.ceil(rnd(0, qUbound));
    const price = i == 0 ? 1 : rnd(0, 8000) / 100;
    const modelWeight = i == 0 ? 0 : skipM ? 0 : quantity * (1 + rnd(-50, 50) / 100);

    const amount = price * quantity;
    tot += amount;
    totModel += modelWeight;
    return {
      security: wrapSecurity(sec),
      radar: getRandomRadar(),
      currentWeight: 0,
      currentQuantity: quantity,
      currentAmount: amount,
      currentPrice: price,
      suggestionAccepted: false,
      modelWeight: modelWeight,
      suggestedDelta: 0,
      isCash: i == 0,
      fee: rnd(1000, 2500) / 100000,
      newSecurity: false,
    } as StrategyItem;
  }).map(r => ({ ...r, currentWeight: r.currentAmount / tot, modelWeight: r.modelWeight / totModel }));
}

const holdingsCreator = (num: number): Holding[] => {
  let sNum = securities.length - 1;
  let tot = 0;
  return numArray(num).map(i => {
    const sec = i == 0 ? cash : securities[rnd(1, securities.length - 1)];
    const quantity = Math.ceil(rnd(0, 100000));
    const amount = i == 0 ? quantity : Math.ceil(rnd(0, 1000000));
    tot += amount;
    return {
      securityId: sec.IsinCode,
      weight: 0,
      quantity,
      amount,
      accepted: false,
      suggestion: 0,
      feeImpact: 0,
      suggestionType: "Q"
    } as Holding;
  }).map(r => ({ ...r, weight: r.amount / tot }));
}

const radarToAlertHistory = (clients: Client[], date: string): AlertHistory => {
  const count = (color: string) => sumBy(
    clients.map(c => c.radar)
      .map(radar => Object.keys(radar)
        .filter(k => k.endsWith('Alert'))
        .filter(k => radar[k] == color).length)
    , v => v);
  return {
    date,
    Red: count('red'),
    Orange: count('orange'),
    Green: count('green')
  }
}


const alertHistoryCreator = (date: string, days: number, clients: Client[]): AlertHistory[] => {
  const curDate = moment(date);
  let ret: AlertHistory[] = [];
  ret.push(radarToAlertHistory(clients, date));
  numArray(days).forEach(i => {
    const newDate = curDate.subtract(i, 'days').format('YYYY-MM-DD');
    const lastItem = ret[i];
    const newItem: AlertHistory = {
      date: newDate,
      Red: lastItem.Red + (rnd(lastItem.Red > 10 ? -5 : 1, 10)),
      Green: lastItem.Green + (rnd(lastItem.Green > 10 ? -5 : 1, 10)),
      Orange: lastItem.Orange + (rnd(lastItem.Orange > 10 ? -5 : 1, 10))
    }
    ret.push(newItem);
  });

  return ret.reverse();
}

const historyCreator = (clients: Client[]): { [clientId: string]: InterviewResult[] } => {
  const today=new Date(REFERENCE_DATE_TODAY);
  return clients.reduce((prev, curr) => {
    const faker = getFake(curr.country);
    log('history for', curr.name);
    const n = rnd(4, 12);
    prev[curr.id] = numArray(n).map(i => {
      const r = rnd(1, 100);
      const status = r < 30 ? 'REJECTED' : 'ACCEPTED';
      let date = faker.date.past(3,today);
      /*
      while (moment(date).format('YYYY-MM-DD') >= REFERENCE_DATE_TODAY) {
        date = faker.date.past(3,today);
      }*/

      return {
        date: moment(date).format('YYYY-MM-DD'),
        status,
        notes: faker.lorem.lines(1)
      } as InterviewResult;
    }).sort((a, b) => a.date.localeCompare(b.date));

    // LAst one is accepted for fake client and possibly ongoing for others.
    if (isFakeClient(curr.id)) {
      prev[curr.id][prev[curr.id].length - 1].status = 'ACCEPTED';
    } else {
      const nr = rnd(1, 10);
      prev[curr.id][prev[curr.id].length - 1].status = nr < 3 ? 'ONGOING' : (nr < 6 ? 'ON HOLD' : prev[curr.id][0].status)

      if (prev[curr.id][prev[curr.id].length - 1].status == 'ONGOING') {
        prev[curr.id][prev[curr.id].length - 1].date = moment(REFERENCE_DATE_TODAY).add(rnd(-1, -5), 'days').format('YYYY-MM-DD');
      }
    }
    return prev;
  }, {

  } as { [clientId: string]: InterviewResult[] });
}

const createAgents = () => {
  let bc = 1;
  let clientId = 0;
  let ret = {} as any;
  italyRegions.forEach(region => {
    const faker = getFake(region);

    const max = italyRegionsRate[region];
    const cities = numArray(max).map(i => {
      return {
        cityName: faker.address.city(),
        region
      }
    });
    cities.forEach(city => {
      const branches = numArray(rnd(1, MAX_BRANCH_X_CITY)).map(i => {
        return {
          branchName: 'AG' + (1000 + bc++).toString(),
          city
        }
      });
      branches.forEach(branch => {
        numArray(rnd(1, MAX_AGENT_X_BRANCH)).forEach(i => {
          const ag = {
            agentName: faker.name.findName(),
            branch
          }
          ret[ag.agentName] = ag;
        });
      });
    });
  });
  return ret;
}

const agentDictionary = createAgents();
const agents = Object.keys(agentDictionary);
// START BY CREATING AGENTS
//export const agents = numArray(AGENT_COUNT).map(i => faker.name.findName());


const modelFaker = getFake('Italy');
export const createModels = () => numArray(MODEL_COUNT)
  .map(i => portfolioCreator(i.toString(), modelFaker.commerce.productName()));

  export const clientsCreator = (models: Portfolio[]) => {
  let id=0;
  return [
    ...numArray(CLIENT_COUNT_IT).map(i => clientCreator((id++).toString(), models, agents, 'Italy')),
    ...numArray(CLIENT_COUNT_AT).map(i => clientCreator((id++).toString(), models, agents, 'Austria')),
    ...numArray(CLIENT_COUNT_DE).map(i => clientCreator((id++).toString(), models, agents, 'Germany')),
    ...numArray(CLIENT_COUNT_LU).map(i => clientCreator((id++).toString(), models, agents, 'Luxemburg')),
  ]

}

export const createRandomPerformanceForSecurity = (dateFormat='YYYY-MM-DD') => {
  let s = 1;
  let date = moment(REFERENCE_DATE_TODAY).subtract(500,'days');
  let ret = [
    { date: date.format(dateFormat), perf: 1 }
  ]

  const min = rnd(-10, -100);
  const max = rnd(10, 170);
  numArray(50).forEach(i => {
    s = s + rnd(min, max) / 10000;
    date = date.add(10,'days');
    ret.push({ date: date.format(dateFormat), perf: s });
  });
  return ret;
}

const createAllSecuritiesPerformance = () => {
  return securities.reduce((prev, curr) => {
    prev[curr.IsinCode] = createRandomPerformanceForSecurity();
    return prev;
  }, {});
}

const fixPerformance = (perf: { date: string, perf: number }[]) => {
  const dict = perf.reduce((prev, curr) => {
    prev[curr.date] = curr.perf;
    return prev;
  }, {});

  const maxDate = maxBy(perf, d => d.date).date;
  let dt = moment(new Date(maxDate));
  let ret: { date: string, perf: number }[] = [];
  let lastPerf = dict[maxDate];

  while (dt.year() >= 2013) {
    const date = dt.format('YYYY-MM-DD');
    lastPerf = dict[date] || lastPerf;
    ret.push({
      date,
      perf: lastPerf
    });
    dt = dt.subtract(10,'days');
  }
  return ret.sort((a, b) => a.date.localeCompare(b.date));
}



const fixPerformances = (perf: { [id: string]: { date: string, perf: number }[] }) => {
  const ret = Object.keys(perf).reduce((prev, curr) => {
    prev[curr] = fixPerformance(perf[curr]);
    return prev;
  }, {} as { [id: string]: { date: string, perf: number }[] });
  const onlyCash = ret['FR0010314401'].map(r => ({ ...r, perf: 1 }));
  return { ...ret, ['CASH']: onlyCash };
}

const perfSummary = (perf: { date: string, perf: number }[]) => {
  const gData = groupBy(perf, p => p.date.substr(0, 4));
  return Object.keys(gData).map(k => {
    return {
      date: k,
      perf: gData[k][gData[k].length - 1].perf / gData[k][0].perf - 1
    }
  });
}
const perfSummaryAll = (perf: { [id: string]: { date: string, perf: number }[] }) => {
  const ret = Object.keys(perf).reduce((prev, curr) => {
    prev[curr] = perfSummary(perf[curr]);
    return prev;
  }, {} as { [id: string]: { date: string, perf: number }[] });
  return ret;
}
const deltaAnalysis = (radar: Radar) => {
  let ret = ""
  ret += radar.concentrationAlert == 'green' ? "" : " concentration: +" + fmt(radar.actual.concentration - radar.limits.concentration).toString()
  ret += radar.consistencyAlert == 'green' ? "" : " consistency: +" + fmt(radar.actual.consistency - radar.limits.consistency).toString()
  ret += radar.efficencyAlert == 'green' ? "" : " efficency: +" + fmt(radar.actual.efficency - radar.limits.efficency).toString()
  ret += radar.overlapAlert == 'green' ? "" : " overlap: +" + fmt(radar.actual.overlap - radar.limits.overlap).toString()
  ret += radar.riskAdequacyAlert == 'green' ? "" : " adequacy: +" + fmt(radar.actual.riskAdequacy - radar.limits.riskAdequacy).toString()
  ret += radar.riskAnalysisAlert == 'green' ? "" : " risk analysis: +" + fmt(radar.actual.riskAnalysis - radar.limits.riskAnalysis).toString()
  return ret;
}
const getClientStatusDuration = (date: string) => {
  if (moment(REFERENCE_DATE_TODAY).diff(moment(date), 'weeks') <= 1) return '<1W';
  if (moment(REFERENCE_DATE_TODAY).diff(moment(date), 'months') <= 1) return '1W-1M';
  if (moment(REFERENCE_DATE_TODAY).diff(moment(date), 'months') <= 6) return '1M-6M';
  return '>6M'
}

const getClientState = (decision: string, radar: Radar): ClientState => {
  //decisopm ='ACCEPTED' | 'REJECTED' | 'ONGOING' | 'ONHOLD'
  //state =  'NO ALERT' | 'REGULATOR ALERT' | 'GUIDELINE ALERT' | 'ON HOLD' | 'PENDING PROPOSAL' | 'PENDING EXECUTION'
  switch (decision) {
    case 'ACCEPTED':
    case 'REJECTED': {
      if (radar.riskAdequacyAlert !== 'green') return 'REGULATOR ALERT';
      if (radar.numOfAlerts > 0) return 'GUIDELINE ALERT';
      return 'NO ALERT';
    }
    case 'ONGOING': {
      return rnd(1, 2) == 1 ? 'PENDING PROPOSAL' : 'PENDING EXECUTION';
    }
    default:
    case 'ONHOLD': {
      return 'ON HOLD';
    }

  }
}

const go = async () => {
  log('generating...')
  try {
    if (!fs.existsSync('build/output')) fs.mkdirSync('build/output');

    const models = createModels();
    const clients = clientsCreator(models);
    let histories = historyCreator(clients);
    const strategies1 = clientStrategyCreator(clients);
    const strategies2 = getAllStrategies();
    const preformances = createAllSecuritiesPerformance();
    const performances2 = getAllPerformances();
    const secuirities = getAllSecuirities();
    const allPerf = { ...preformances, ...performances2 };
    const radars = createFakeRadar();
    //Calculate Clients Radar and aua

    const strategies = { ...strategies1, ...strategies2 } as { [cli: string]: StrategyItem[] }

    clients.forEach(c => {
      const faker = getFake(c.country);
      if (isFakeClient(c.id)) {
        c.radar = radars[c.id]
      } else {
        c.radar = createRadarFromStrategy(strategies[c.id], c.id, radars);
      }
      c.aua = sumBy(strategies[c.id], v => v.currentAmount);
      c.ongoingFees = c.aua * rnd(1, 10) / 1000;
      c.upfrontFees = c.aua * rnd(0, 6) / 1000;
      c.budget = c.aua * rnd(0, 30) / 1000;

      c.MTD_Ongoing_FEES = rnd(-50, 50) / 10;
      c.YTD_Ongoing_FEES = rnd(-50, 50) / 10;
      c.Y1_Ongoing_FEES = rnd(-50, 50) / 10;

      c.MTD_Upfront_FEES = rnd(0, c.budget / 2 / 12);
      c.YTD_Upfront_FEES = rnd(0, c.budget / 2);
      c.Y1_Upfront_FEES = rnd(-c.MTD_Upfront_FEES, c.MTD_Ongoing_FEES);

      c.size = c.aua > 20000000 ? '>20M' : c.aua > 10000000 ? '10-20M' : c.aua > 5000000 ? '5-10M' : c.aua > 1000000 ? '1-5M' : '<1M';
      c.segment = c.aua > 15000000 ? 'Private' : c.aua > 5000000 ? 'Wealth Management' : c.aua > 2000000 ? 'Mass Affluent' : 'Retail';
      c.breaks = Object.keys(c.radar).filter(k => k.endsWith("Alert")).filter(k => c.radar[k] !== "green").map(k => k.replace('Alert', ''));

      const acc = histories[c.id].filter(p => p.status == 'ACCEPTED');
      c.lastAdvicedate = acc.length > 0 ? acc[0].date : '';

      const hist = histories[c.id][histories[c.id].length - 1];
      c.lastInterviewDate = hist.date;
      c.decision = hist.status;
      c.clientStatus = getClientState(c.decision, c.radar);
      c.aboveGuidelines = c.radar.aboveGuidelines;
      c.regulatoryIndicator = c.radar.regulatoryIndicator;
      c.belowGuidelines = c.radar.belowGuidelines;
      c.guidelineIndicator = c.aboveGuidelines + c.belowGuidelines;

      const dtAlert = rnd(moment(c.lastInterviewDate).unix(), moment(REFERENCE_DATE_TODAY).unix());
      c.clientStatusAge = moment.unix(dtAlert).format('YYYY-MM-DD');

      // Add Current State in History
      histories[c.id].push({
        date: c.clientStatusAge,
        status: c.clientStatus,
        notes: faker.lorem.lines(1)
      });

      c.clientStatusDuration = getClientStatusDuration(c.clientStatusAge);

      c.numOfInterviews = Math.round(histories[c.id].length / 5);
      c.numOfAcceptedProposal = Math.round(histories[c.id].filter(p => p.status == 'ACCEPTED').length / 5);
      c.numOfRejectedProposal = c.numOfInterviews - c.numOfAcceptedProposal;// Math.round(histories[c.id].filter(p => p.status == 'REJECTED').length / 5);

      c.sales = c.aua * rnd(-100, 100) / 1000;
      c.deltaAnalysis = deltaAnalysis(c.radar);
    });

    const alertHistory = alertHistoryCreator(moment(REFERENCE_DATE_TODAY).format('YYYY-MM-DD'), 100, clients);

    dump('output/radars.json', radars);

    console.log(`created ${alertHistory.length} Alert History`);
    dump('output/securities2.json', wrapSecurities(secuirities));

    console.log(`created ${alertHistory.length} Alert History`);
    dump('output/alertHistory.json', alertHistory);

    console.log(`created ${clients.length} clients`);
    dump('output/clients.json', clients);

    console.log(`created ${agents.length} agents`);
    dump('output/agents.json', agents);

    console.log(`created ${Object.keys(histories).length} history`);
    dump('output/history.json', histories);

    console.log(`created ${Object.keys(strategies).length} strategy`);
    dump('output/strategy.json', strategies);

    console.log(`created ${Object.keys(preformances).length} performances`);
    const perf = fixPerformances(allPerf)
    dump('output/performances.json', perf);
    dump('output/perfSummary.json', perfSummaryAll(perf));

    SHOWMISSING();

  } catch (error) {
    console.error(error);
  }
}


go();


