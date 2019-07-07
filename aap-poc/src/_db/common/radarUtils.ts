import { PositionItem, RadarItem, StrategyItem, Alert, Radar, Client, AlertHistory2 } from "./interfaces";
import { sumBy, endsWith, sum, } from "lodash";
import moment from 'moment';
import * as math from 'mathjs';
import { REFERENCE_DATE_TODAY } from "./consts";
import { radars, strategies } from "../data";
import { bigIntLiteral } from "@babel/types";

export const isFakeClient = (clientId: string) => ["0", "1", "2"].indexOf(clientId) > -1;

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
        concentration: adjustRadarValue(sumBy(position, p => p.radar.concentration * p.weight)),
        efficency: adjustRadarValue(sumBy(position, p => p.radar.efficency * p.weight)),
        consistency: adjustRadarValue(sumBy(position, p => p.radar.consistency * p.weight)),
        overlap: adjustRadarValue(sumBy(position, p => p.radar.overlap * p.weight)),
        riskAdequacy: adjustRadarValue(sumBy(position, p => p.radar.riskAdequacy * p.weight)),
        riskAnalysis: adjustRadarValue(sumBy(position, p => p.radar.riskAnalysis * p.weight)),
    }
}

export const adjustRadarValue = (value: number) => {
    if (value > 10) return value;
    return value * 20;
}

export const getRAG = (act: number, limit: number, mifid: boolean): Alert => {
    return act > (limit + 1) ? (mifid ? 'red' : 'orange') : 'green'
}

export const createRadarFromStrategy = (strategy: StrategyItem[], clientId: string, radars: any) => {
    let r = null;
    if (isFakeClient(clientId)) {

        if (strategy.filter(f => f.suggestionAccepted).length <=1) {
            // Simulation...
            r = radars[clientId]
        } else {
            r = getCustomRadar(strategy, clientId);
            // Real portfolio
        }

    }

    const actual = currentPosition(strategy);
    const model = modelPosition(strategy);
    const sugg = suggestedPosition(strategy);

    const radarActual = r ? r.actual : avgRadar(actual);
    const radarModel = r ? r.guideLines : avgRadar(model);
    const radarLimit = r ? r.guideLines : getRadarLimitSync(radarModel);
    const radarSugg = r ? r.proposed : avgRadar(sugg);

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
    const reds = alerts.filter(r => r === 'red').length;
    const oranges = alerts.filter(r => r === 'orange').length;
    const numOfAlerts = reds + oranges;

    const color = numOfAlerts === 0 ? 'green' : reds === 0 ? 'orange' : 'red';

    const f = (n: number) => n / 20

    const regulatoryIndicator = math.max(f(actual.riskAdequacy - guideLines.riskAdequacy), 0);
    const distances = [
        actual.concentration - guideLines.concentration,
        actual.consistency - guideLines.consistency,
        actual.efficency - guideLines.efficency,
        actual.overlap - guideLines.overlap,
        actual.riskAnalysis - guideLines.riskAnalysis,
    ]
    const aboveGuidelines = f(distances.filter(d => d > 0).reduce((a, b) => a + b, 0));
    const belowGuidelines = f(distances.filter(d => d < 0).reduce((a, b) => a + b, 0));
    return {
        ...data, numOfAlerts, color,

        belowGuidelines,
        aboveGuidelines,
        regulatoryIndicator
    };

}





export const getRadarLimitSync = (radarItem: RadarItem): RadarItem => {
    return {
        concentration: radarItem.concentration,//rnd(1, 20) / 10,
        efficency: radarItem.efficency,// rnd(1, 20) / 10,
        consistency: radarItem.consistency,// + rnd(1, 20) / 10,
        overlap: radarItem.overlap,// + rnd(1, 20) / 10,
        riskAdequacy: radarItem.riskAdequacy,// + rnd(1, 20) / 10,
        riskAnalysis: radarItem.riskAnalysis,// + rnd(1, 20) / 10
    }
};

export const currentPosition = (position: StrategyItem[]): PositionItem[] =>
    position.map(p => ({ security: p.security, radar: p.radar, weight: p.currentWeight }));

export const modelPosition = (position: StrategyItem[]): PositionItem[] =>
    position.map(p => ({ security: p.security, radar: p.radar, weight: p.modelWeight }));

export const suggestedPosition = (position: StrategyItem[]): PositionItem[] =>
    position.map(p => ({ security: p.security, radar: p.radar, weight: p.suggestionAccepted ? p.currentWeight + p.suggestedDelta : p.currentWeight }));

export const suggestedPositionExCash = (position: StrategyItem[]): PositionItem[] =>
    position.map(p => {
        return { security: p.security, radar: p.radar, weight: p.suggestionAccepted && !p.isCash ? p.currentWeight + p.suggestedDelta : p.currentWeight }
    });


const radarToAlertHistory = (clients: Client[], date: string): AlertHistory2 => {
    const count = (color: string) => sumBy(
        clients.map(c => c.radar)
            .map(radar => Object.keys(radar)
                .filter(k => endsWith(k, 'Alert'))
                .filter(k => radar[k] === color).length)
        , v => v);

    const countMifid = (color: string) => sumBy(
        clients.map(c => c.radar)
            .map(radar => Object.keys(radar)
                .filter(k => k === ('RiskAdequacyAlert'))
                .filter(k => radar[k] === color).length)
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
    const curDate = moment(REFERENCE_DATE_TODAY);
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
    const max = rnd(10, 200);
    return {
        concentration: rnd(10, max),
        efficency: rnd(10, max),
        consistency: rnd(10, max),
        overlap: rnd(10, max),
        riskAdequacy: rnd(10, max),
        riskAnalysis: rnd(10, max)
    };
};


const getCustomRadar = (strategy: StrategyItem[], clientId: string) => {
    const fake = strategies[clientId];
    const changesFromApprovedFake = strategyChanges(fake, strategy);
    if (changesFromApprovedFake === 0) {
        return radars[clientId + "!"];
    } else {
        return mixRadars(radars[clientId +"!"], radars[clientId], changesFromApprovedFake);
    }
}

const strategyChanges = (fake: StrategyItem[], curr: StrategyItem[]) => {
    let changes = fake.map((f, ix) => {
        const c = curr.find(i => i.security.IsinCode === f.security.IsinCode);
        if (!c) {
            return 1;
        } else {
            const fW = f.currentWeight + f.suggestedDelta;
            const cW = c.suggestionAccepted ? (c.currentWeight + c.suggestedDelta) : c.currentWeight;
            return Math.abs(cW - fW);
        }
    });
    return sum(changes) / fake.length;
}

const mixRadars = (r1:Radar, r2:Radar, k:number) => {
    const proposed: RadarItem = {
        riskAdequacy: r1.proposed.riskAdequacy* (1+k),
        riskAnalysis: r1.proposed.riskAnalysis* (1+k),
        overlap: r1.proposed.overlap* (1+k),
        concentration: r1.proposed.concentration* (1+k),
        consistency: r1.proposed.consistency* (1+k),
        efficency: r1.proposed.efficency* (1+k),
    }
    return {
        ...r1,
        proposed
    }
}