import { Portfolio, Holding, Client, Radar, InterviewResult, StrategyItem, AlertHistory, TimeHorizon, TimeHorizonMonths } from './common/interfaces';
import { securities, cash } from './common/securities';
import { createRadarFromStrategy, isFakeClient } from './common/radarUtils';
//import * as ce from './_db/coreEngine';

import * as faker from 'faker';
//import * as svc from './_db/service';
import * as fs from 'fs';
import { sumBy, maxBy, groupBy } from 'lodash';
import * as moment from 'moment';
import { getAllSecuirities, getAllPerformances, getAllStrategies, createFakeRadar } from './fakedata'
var f = faker;
f.locale = 'it';

const log = console.log;
const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;
const fmt = (num: number) => Math.ceil(num * 10) / 10

const dump = (file: string, data: any) => fs.writeFileSync(`./build/${file}`, JSON.stringify(data, null, 2));
const italyRegions = ['Nord Ovest', 'Lombardia', 'Nord Est', 'Centro Nord', 'Centro', 'Sud', 'Sicilia'];
const italyRegionsRate = {
    'Nord Ovest': 4,
    'Lombardia': 10,
    'Nord Est': 8,
    'Centro Nord': 6,
    'Centro': 9,
    'Sud': 6,
    'Sicilia': 5
}
const MODEL_COUNT = 10;
const CLIENT_COUNT = 3000;
const MAX_CITIES_X_REGION = 4;
const MAX_BRANCH_X_CITY = 3;
const MAX_AGENT_X_BRANCH = 4;

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


const clientCreator = (id: string, models: Portfolio[], agents: string[]): Client => {
    const name = faker.name.firstName();
    const lastName = faker.name.lastName();
    const modelIx = Math.ceil(Math.random() * (MODEL_COUNT - 1));

    const agentName = isFakeClient(id) ? agents[0] : agents[rnd(0, agents.length - 1)];
    const agent = agentDictionary[agentName];
    return {
        id,
        name: `${name} ${lastName}`,
        modelId: models[modelIx].id,
        radar: null,
        agent: agentName,
        lastInterviewDate: '2017-01-01',
        lastAdvicedate: '2017-01-01',
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
        aua: 0// sumBy(cli.holdings, v => v.amount) || 0 //faker.random.number({ min: 0, max: 100000000 }),

    }
}

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
const clientStrategyCreator = (clients: Client[]) => {
    return clients.reduce((prev, curr) => {
        prev[curr.id] = strategyCreator();
        return prev;
    }, {} as { [cli: string]: StrategyItem[] })
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

        const sec = i == 0 ? cash : securities[rnd(1, securities.length - 1)];


        //Client AUM


        const quantity = skipQ ? 0 : Math.ceil(rnd(0, qUbound));
        const price = i == 0 ? 1 : rnd(0, 8000) / 100;
        const modelWeight = i == 0 ? 0 : skipM ? 0 : quantity * (1 + rnd(-50, 50) / 100);

        const amount = price * quantity;
        tot += amount;
        totModel += modelWeight;
        return {
            security: sec,
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
    return clients.reduce((prev, curr) => {
        const n = rnd(4, 12);
        prev[curr.id] = numArray(n).map(i => {
            const r = rnd(1, 100);
            const status = r < 30 ? 'REJECTED' : 'ACCEPTED';
            return {
                date: moment(faker.date.past()).format('YYYY-MM-DD'),
                status,
                notes: faker.lorem.lines(1)
            } as InterviewResult;
        }).sort((a, b) => a.date.localeCompare(b.date));

        // LAst one is accepted for fake client and possibly ongoing for others. 
        if (isFakeClient(curr.id)) {
            prev[curr.id][prev[curr.id].length - 1].status = 'ACCEPTED';
        } else {
            prev[curr.id][prev[curr.id].length - 1].status = rnd(1, 10) < 3 ? 'ONGOING' : prev[curr.id][0].status;
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


export const createModels = () => numArray(MODEL_COUNT).map(i => portfolioCreator(i.toString(), faker.commerce.productName()));
export const clientsCreator = (models: Portfolio[]) => numArray(CLIENT_COUNT).map(i => clientCreator(i.toString(), models, agents));

const createPerformance = () => {
    let s = 1;
    let date = moment().subtract('days', 500);
    let ret = [
        { date: date.format('YYYY-MM-DD'), perf: 1 }
    ]

    const min = rnd(-10, -100);
    const max = rnd(10, 170);
    numArray(50).forEach(i => {
        s = s + rnd(min, max) / 10000;
        date = date.add('days', 10);
        ret.push({ date: date.format('YYYY-MM-DD'), perf: s });
    });
    return ret;
}

const createAllSecuritiesPerformance = () => {
    return securities.reduce((prev, curr) => {
        prev[curr.IsinCode] = createPerformance();
        return prev;
    }, {});
}

const fixPerformance = (perf: { date: string, perf: number }[]) => {
    const dict = perf.reduce((prev, curr) => {
        prev[curr.date] = curr.perf;
        return prev;
    }, {});

    const maxDate = maxBy(perf, d => d.date).date;
    let dt = moment(maxDate);
    let ret: { date: string, perf: number }[] = [];
    let lastPerf = dict[maxDate];

    while (dt.year() >= 2013) {
        const date = dt.format('YYYY-MM-DD');
        lastPerf = dict[date] || lastPerf;
        ret.push({
            date,
            perf: lastPerf
        });
        dt = dt.subtract('days', 10);
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

const go = async () => {
    try {
        if (!fs.existsSync('build/output')) fs.mkdirSync('build/output');

        const models = createModels();
        const clients = clientsCreator(models);
        const histories = historyCreator(clients);
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
            c.radar = createRadarFromStrategy(strategies[c.id], c.id, radars);
            c.aua = sumBy(strategies[c.id], v => v.currentAmount);
            c.size = c.aua > 20000000 ? '>20M' : c.aua > 10000000 ? '10-20M' : c.aua > 5000000 ? '5-10M' : c.aua > 1000000 ? '1-5M' : '<1M';
            c.segment = c.aua > 15000000 ? 'Private' : c.aua > 2000000 ? 'Mass Affluent' : 'Retail';
            c.breaks = Object.keys(c.radar).filter(k => k.endsWith("Alert")).filter(k => c.radar[k] !== "green").map(k => k.replace('Alert', ''));
            c.lastInterviewDate = histories[c.id][0].date;
            const acc = histories[c.id].filter(p => p.status == 'ACCEPTED');
            c.lastAdvicedate = acc.length > 0 ? acc[0].date : '';
            c.decision = histories[c.id][0].status;
            c.numOfInterviews = histories[c.id].length;
            c.numOfAcceptedProposal = histories[c.id].filter(p => p.status == 'ACCEPTED').length;
            c.numOfRejectedProposal = histories[c.id].filter(p => p.status == 'REJECTED').length;
            c.sales = c.aua * rnd(-100, 100) / 1000;
            c.deltaAnalysis = deltaAnalysis(c.radar);
        });

        const alertHistory = alertHistoryCreator(moment().format('YYYY-MM-DD'), 100, clients);

        dump('output/radars.json', radars);

        console.log(`created ${alertHistory.length} Alert History`);
        dump('output/securities2.json', secuirities);

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

    } catch (error) {
        console.error(error);
    }
}

go();


