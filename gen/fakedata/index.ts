import { Security, PerformanceItem, StrategyItem, Radar, RadarItem } from '../common/interfaces';
import { uniqBy, groupBy, sumBy } from 'lodash';
import * as FD from './fakedata';
import * as P1 from './fds_c2_c';
import * as P2 from './fds_c3_c';
import * as P3 from './fds_c4_c';
import * as P4 from './fds_c2_m';
import * as P5 from './fds_c3_m';
import * as P6 from './fds_c4_m';
import * as P7 from './fds_c3_c_bis';
import { getRandomRadar } from '../index';
import { cash } from '../common/securities';
import { modelPosition, createRadarSync } from '../common/radarUtils';

const mapSecurity = (p: any) => {
    return {
        IsinCode: p.Symbol,
        SecurityName: p.Name,
        AssetId: p.Symbol,
        IsFund: '0',
        Kilovar: null,
        MacroAssetClass: p.AssetType,
        MicroAssetClass: p.MacroAssetClass,
        Sector: null,
        Currency: 'Eur',
        Rating: null,
        Country: null,
        Region: null,
        Maturity: null,
        SRRI: p.SRRI,
        Price: p.Price,
        pushed: FD.pushed.indexOf(p.Symbol) > -1,
    } as Security;
}

const mapSecurities = (pos: any[]): Security[] => {
    //const pos = FD.case_4_proposed;
    return pos.filter(p => p.Symbol != 'CASH_EUR').map(mapSecurity);
}



const mapStrategy = (pos: any[], mod: any[]): StrategyItem[] => {

    const modelSecs = mod.map(p => ({
        security: p.Symbol == 'CASH_EUR' ? cash : mapSecurity(p),
        radar: getRandomRadar(),
        currentWeight: 0,
        currentQuantity: 0,
        currentPrice: p.Price,
        currentAmount: 0,
        modelWeight: p.WEIGHT,
        suggestedDelta: 0,
        suggestionAccepted: false,
        isCash: p.Symbol == 'CASH_EUR',
        fee: 1,
        newSecurity: false
    }));

    const posSecs = pos.map(p => ({
        security: p.Symbol == 'CASH_EUR' ? cash : mapSecurity(p),
        radar: getRandomRadar(),
        currentWeight: p.WEIGHT,
        currentQuantity: p.Shares,
        currentPrice: p.Price,
        currentAmount: p.Amont,
        modelWeight: 0,
        suggestedDelta: 0,
        suggestionAccepted: false,
        isCash: p.Symbol == 'CASH_EUR',
        fee: 1,
        newSecurity: false,
        clientFavorites: FD.fav.indexOf(p.Symbol) > -1
    }));

    const gData = groupBy([...modelSecs, ...posSecs], g => g.security.IsinCode);

    return Object.keys(gData).map(k => {
        const items = gData[k];
        return {
            security: items[0].security,
            radar: items[0].radar,
            currentWeight: sumBy(items, w => w.currentWeight || 0),
            currentQuantity: sumBy(items, w => w.currentQuantity || 0),
            currentPrice: items[0].currentPrice,
            currentAmount: sumBy(items, w => w.currentAmount || 0),
            modelWeight: sumBy(items, w => w.modelWeight || 0),
            suggestedDelta: 0,
            suggestionAccepted: false,
            isCash: items[0].isCash,
            fee: 1,
            newSecurity: false
        }
    });
}

export const getAllSecuirities = () => {
    const data = [
        ...FD.case_2_initial,
        ...FD.case_2_model,
        ...FD.case_2_proposed,
        ...FD.case_3_initial,
        ...FD.case_3_model,
        ...FD.case_3_proposed,
        ...FD.case_4_initial,
        ...FD.case_4_model,
        ...FD.case_4_proposed,
    ]
    return uniqBy(mapSecurities(data), s => s.IsinCode);
}
const dateAdapt = (date: string) => date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2);


const getPerf = (obj: any[]): { [isin: string]: { date: string, perf: number }[] } => {
    return obj.reduce((prev, curr) => {
        const isin = Object.keys(curr).filter(k => k != 'date')[0];
        prev[isin] = [...prev[isin] || [], {
            date: dateAdapt(curr.date),
            perf: curr[isin],
        }]
        return prev;
    }, {} as { [isin: string]: { date: string, perf: number }[] });
}

export const getAllPerformances = () => {
    console.log('get all performances');
    //const dict = getAllSecuirities().reduce((p, c) => { p[c.SecurityName] = p.IsinCode; return p; }, {} as { [name: string]: string });
    const perf = [
        ...P1.perf,
        ...P2.perf,
        ...P3.perf,
        ...P4.perf,
        ...P5.perf,
        ...P6.perf,
        ...P7.perf,
    ]
    let allValues = getPerf(perf);
    Object.keys(allValues).forEach(k => {
        allValues[k] = allValues[k].sort((a, b) => a.date.localeCompare(b.date));
        const p = allValues[k][0].perf;
        allValues[k] = allValues[k].map(i => ({ ...i, perf: i.perf / p }))
    });
    return allValues;
}



const mapSuggestion = (pos: any[], mod: any[], sugg: any[]): StrategyItem[] => {

    const modelSecs = mod.map(p => ({
        security: p.Symbol == 'CASH_EUR' ? cash : mapSecurity(p),
        radar: getRandomRadar(),
        currentWeight: 0,
        currentQuantity: 0,
        currentPrice: p.Price,
        currentAmount: 0,
        modelWeight: p.WEIGHT,
        suggestedDelta: 0,
        suggestionAccepted: false,
        isCash: p.Symbol == 'CASH_EUR',
        fee: 1,
        newSecurity: false
    }));


    const suggSecs = sugg.map(p => ({
        security: p.Symbol == 'CASH_EUR' ? cash : mapSecurity(p),
        radar: getRandomRadar(),
        currentWeight: 0,
        currentQuantity: 0,
        currentPrice: 0,
        currentAmount: 0,
        modelWeight: 0,
        suggestedDelta: p.WEIGHT,
        suggestionAccepted: false,
        isCash: p.Symbol == 'CASH_EUR',
        fee: 1,
        newSecurity: false
    }));

    const posSecs = pos.map(p => ({
        security: p.Symbol == 'CASH_EUR' ? cash : mapSecurity(p),
        radar: getRandomRadar(),
        currentWeight: p.WEIGHT,
        currentQuantity: p.Shares,
        currentPrice: p.Price,
        currentAmount: p.Amont,
        modelWeight: 0,
        suggestedDelta: 0,
        suggestionAccepted: false,
        isCash: p.Symbol == 'CASH_EUR',
        fee: 1,
        newSecurity: false,
        clientFavorites: FD.fav.indexOf(p.Symbol) > -1
    }));

    const gData = groupBy([...suggSecs, ...modelSecs, ...posSecs], g => g.security.IsinCode);

    return Object.keys(gData).map(k => {
        const items = gData[k];
        const suggDelta = sumBy(items, w => w.suggestedDelta || 0);
        const weight = sumBy(items, w => w.currentWeight || 0);
        return {
            security: items[0].security,
            radar: items[0].radar,
            currentWeight: weight,
            currentQuantity: sumBy(items, w => w.currentQuantity || 0),
            currentPrice: items[0].currentPrice,
            currentAmount: sumBy(items, w => w.currentAmount || 0),
            modelWeight: sumBy(items, w => w.modelWeight || 0),
            suggestedDelta: suggDelta - weight,
            suggestionAccepted: false,
            isCash: items[0].isCash,
            fee: 1,
            newSecurity: false
        }
    });
}

export const getAllStrategies = () => {
    let x = {
        "0": mapSuggestion(FD.case_2_initial, FD.case_2_model, FD.case_2_proposed).sort((a, b) => a.isCash ? -1 : 1),
        "1": mapSuggestion(FD.case_3_initial, FD.case_3_model, FD.case_3_proposed).sort((a, b) => a.isCash ? -1 : 1),
        "2": mapSuggestion(FD.case_4_initial, FD.case_4_model, FD.case_4_proposed).sort((a, b) => a.isCash ? -1 : 1),
    }
    return x;
}

import { radar2 } from './radar_c2';
import { radar3 } from './radar_c3';
import { radar4 } from './radar_c4';

const scale = (value:number, min: number,max: number) => {
    if ( max > min) {
        return 2 + 7 * (max - value) / (max-min) * .9 
    } else {
        return 2 + 7 * (min - value) / (min-max) * .9
    }
}

const createRadarItem = (x: any): RadarItem => {
    return {
        riskAdequacy: scale( x.adequacy,0,100),
        efficency: scale(x.efficency,0,3),
        consistency: scale(x.consistency,0,100),
        riskAnalysis: scale(x.riskAnalysis,0,100),
        concentration: scale(x.concentration,0,100),
        overlap: scale(x.overlap,0,100),
    }
}

const createRadar = (radar: any, suggested: boolean): Radar => {
    return createRadarSync(
        createRadarItem(radar2.model),
        createRadarItem(radar2.client),
        createRadarItem(radar2.limit),
        createRadarItem(suggested ? radar2.proposed : radar2.client)
    );
}

export const createFakeRadar = () => {
    return {
        ["0"]: createRadar(radar2, false),
        ["0!"]: createRadar(radar2, true),
        ["1"]: createRadar(radar3, false),
        ["1!"]: createRadar(radar3, true),
        ["2"]: createRadar(radar4, false),
        ["2!"]: createRadar(radar4, true),
    }
}