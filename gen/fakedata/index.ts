import { Security, PerformanceItem, StrategyItem } from '../common/interfaces';
import { uniqBy, groupBy, sumBy } from 'lodash';
import * as FD from './fakedata';
import * as P1 from './fds_c2_c';
import * as P2 from './fds_c3_c';
import * as P3 from './fds_c4_c';
import * as P4 from './fds_c2_m';
import * as P5 from './fds_c3_m';
import * as P6 from './fds_c4_m';
import { getRandomRadar } from '../index';
import { cash } from '../common/securities';

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
            currentWeight: sumBy(items, w => w.currentWeight||0),
            currentQuantity: sumBy(items, w => w.currentQuantity||0),
            currentPrice: items[0].currentPrice,
            currentAmount: sumBy(items, w => w.currentAmount||0),
            modelWeight: sumBy(items, w => w.modelWeight||0),
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
const dateAdapt = (date:string) => date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2);


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
    ];
    let allValues = getPerf(perf);
    Object.keys(allValues).forEach(k => {
        allValues[k] = allValues[k].sort((a, b) => a.date.localeCompare(b.date));
        const p = allValues[k][0].perf;
        allValues[k] = allValues[k].map(i => ({ ...i, perf: i.perf / p }))
    });
    return allValues;
}

export const getAllStrategies = () => {
    return {
        "0": mapStrategy(FD.case_2_initial, FD.case_2_model),
        "0!": mapStrategy(FD.case_2_proposed, FD.case_2_model),
        "1": mapStrategy(FD.case_3_initial, FD.case_3_model),
        "1!": mapStrategy(FD.case_3_proposed, FD.case_3_model),
        "2": mapStrategy(FD.case_4_initial, FD.case_3_model),
        "2!": mapStrategy(FD.case_4_proposed, FD.case_3_model),
    }
}