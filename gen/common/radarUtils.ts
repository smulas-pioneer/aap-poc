import { PositionItem, RadarItem, StrategyItem, RadarStrategyParm, Breakdown, Alert, Radar, PerformancePeriod, Client, AlertHistory2, TimeHorizon } from "./interfaces";
import { sumBy, groupBy } from "lodash";
import * as moment from 'moment';
import * as math from 'mathjs';
import { networkInterfaces } from "os";

export const numArray = (num: number) => {
    let ret: number[] = [];
    for (let i = 0; i < num; i++) {
        ret.push(i);
    }
    return ret;
}
export const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;
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

export const getRAG = (act: number, limit: number, mifid: boolean): Alert => {
    return act > limit ? (mifid ? 'red' : 'orange') : 'green'
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
        concentrationAlert: getRAG(proposed.concentration, limits.concentration, false),
        consistencyAlert: getRAG(proposed.consistency, limits.consistency, false),
        efficencyAlert: getRAG(proposed.efficency, limits.efficency, false),
        overlapAlert: getRAG(proposed.overlap, limits.overlap, false),
        riskAdequacyAlert: getRAG(proposed.riskAdequacy, limits.riskAdequacy, true),
        riskAnalysisAlert: getRAG(proposed.riskAnalysis, limits.riskAnalysis, false),
    }

    const alerts = [data.concentrationAlert, data.consistencyAlert, data.efficencyAlert, data.riskAdequacyAlert, data.riskAnalysisAlert, data.overlapAlert];
    const reds = alerts.filter(r => r == 'red').length;
    const oranges = alerts.filter(r => r == 'orange').length;
    const numOfAlerts = reds + oranges;
    const color = numOfAlerts == 0 ? 'green' : reds == 0 ? 'orange' : 'red';

    return { ...data, numOfAlerts, color };

}

export const getRadarLimitSync = (radarItem: RadarItem): RadarItem => {
    return {
        concentration: radarItem.concentration + 0.8,//rnd(1, 20) / 10,
        efficency: radarItem.efficency + 0.8,// rnd(1, 20) / 10,
        consistency: radarItem.consistency + 0.8,// + rnd(1, 20) / 10,
        overlap: radarItem.overlap + 0.8,// + rnd(1, 20) / 10,
        riskAdequacy: radarItem.riskAdequacy + 0.8,// + rnd(1, 20) / 10,
        riskAnalysis: radarItem.riskAnalysis + 0.8,// + rnd(1, 20) / 10
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