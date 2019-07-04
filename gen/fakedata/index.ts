import { Security, PerformanceItem, StrategyItem, Radar, RadarItem } from '../common/interfaces';
import { uniqBy, groupBy, sumBy, maxBy } from 'lodash';
import * as FD from './fakedata';
import * as P1 from './fds_c2_c';
import * as P2 from './fds_c3_c';
import * as P3 from './fds_c4_c';
import * as P4 from './fds_c2_m';
import * as P5 from './fds_c3_m';
import * as P6 from './fds_c4_m';
import * as P7 from './fds_c3_c_bis';
import * as BB from './baby';
import { cash, wrapSecurities, wrapSecurity } from '../common/securities';
import { modelPosition, createRadarSync, getRandomRadar } from '../common/radarUtils';

const mapSecurity = (p: any) => {
  return {
    IsinCode: p.Symbol,
    SecurityName: p.Name,
    AssetId: p.Symbol,
    Kilovar: null,
    IsFund: '0',
    MacroAssetClass: p.AssetClass,
    MicroAssetClass: p.AssetType,
    Sector: p.Sector,
    Currency: p.Currency,
    Rating: p.Rating,
    Country: p.Country,
    Region: p.Region,
    Maturity: p.Maturity,
    SRRI: p.SRRI,
    Price: p.Price,
    pushed: FD.pushed.indexOf(p.Symbol) > -1 ||
      p.Name.toLowerCase().indexOf("amundi") > -1 ||
      p.Name.toLowerCase().indexOf("pioneer") > -1
  } as Security;
}

const mapSecurities = (pos: any[]): Security[] => {
  //const pos = FD.case_4_proposed;
  return wrapSecurities(pos.filter(p => p.Symbol != 'CASH_EUR').map(mapSecurity));
}

const isCash = p=> p.Symbol == 'CASH_EUR' || p.Symbol === 'EUR';

const mapStrategy = (pos: any[], mod: any[]): StrategyItem[] => {

  const modelSecs = mod.map(p => ({
    security: (isCash(p)) ? cash : mapSecurity(p),
    radar: getRandomRadar(),
    currentWeight: 0,
    currentQuantity: 0,
    currentPrice: p.Price,
    currentAmount: 0,
    modelWeight: p.WEIGHT,
    suggestedDelta: 0,
    suggestionAccepted: false,
    isCash: isCash(p),
    fee: 1,
    newSecurity: false
  }));

  const posSecs = pos.map(p => ({
    security:  isCash(p) ? cash : mapSecurity(p),
    radar: getRandomRadar(),
    currentWeight: p.WEIGHT,
    currentQuantity: p.Shares,
    currentPrice: p.Price,
    currentAmount: p.Amont,
    modelWeight: 0,
    suggestedDelta: 0,
    suggestionAccepted: false,
    isCash: isCash(p),
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
    ...BB.bbCase,
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


const perfCreator = (sec: Security[]) => sec.reduce((prev, curr) => {
  const allP = createRandomPerformanceForSecurity('YYYYMMDD');
  allP.forEach(i => {
    prev.push(
      { date: i.date, [curr.IsinCode]: i.perf }
    );
  });
  return prev;
}, []);

export const getAllPerformances = () => {
  //const dict = getAllSecuirities().reduce((p, c) => { p[c.SecurityName] = p.IsinCode; return p; }, {} as { [name: string]: string });
  const bbPerf = perfCreator(BB.babySecurities);

  const perf = [
    ...bbPerf,
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
    currentPrice: p.Price,
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
  }));

  const gData = groupBy([...suggSecs, ...modelSecs, ...posSecs], g => g.security.IsinCode);

  return Object.keys(gData).map(k => {
    const items = gData[k];
    const suggDelta = sumBy(items, w => w.suggestedDelta || 0);
    const weight = sumBy(items, w => w.currentWeight || 0);
    return {
      security: wrapSecurity(items[0].security),
      radar: items[0].radar,
      currentWeight: weight,
      currentQuantity: sumBy(items, w => w.currentQuantity || 0),
      currentPrice: maxBy(items, w => w.currentPrice).currentPrice,//items[0].currentPrice,
      currentAmount: sumBy(items, w => w.currentAmount || 0),
      modelWeight: sumBy(items, w => w.modelWeight || 0),
      suggestedDelta: suggDelta - weight,
      suggestionAccepted: false,
      isCash: items[0].isCash,
      fee: 1,
      newSecurity: false,
      clientFavorites: FD.fav.indexOf(k) > -1
    }
  });
}

export const getAllStrategies = () => {
  let x = {
    //"0": mapSuggestion(FD.case_2_initial, FD.case_2_model, FD.case_2_proposed).sort((a, b) => a.isCash ? -1 : 1),
    "1": mapSuggestion(FD.case_3_initial, FD.case_3_model, FD.case_3_proposed).sort((a, b) => a.isCash ? -1 : 1),
    "2": mapSuggestion(FD.case_4_initial, FD.case_4_model, FD.case_4_proposed).sort((a, b) => a.isCash ? -1 : 1),
    "0": mapSuggestion(BB.bbCase, BB.bbCase, BB.bbCase).sort((a, b) => a.isCash ? -1 : 1),
  }
  return x;
}

import { radar2, radar3, radar4 } from './matthieu_radar.1';
import { createRandomPerformanceForSecurity } from '..';

const scale = (value: number, min: number, max: number) => {
  if (max >= min) {
    return 2 + 7 * (max - value) / (max - min) * .9
  } else {
    return scale(max - value, max, min);
  }
}

const createRadarItem = (x: any): RadarItem => {
  return {
    riskAdequacy: x.adequacy,// scale( x.adequacy,0,200),
    efficency: x.efficency, // scale(x.efficency,200,0),
    consistency: x.consistency,// scale(x.consistency,0,200),
    riskAnalysis: x.riskAnalysis,// scale(x.riskAnalysis,0,200),
    concentration: x.concentration,// scale(x.concentration,0,200),
    overlap: x.overlap// scale(x.overlap,0,200),
  }
}

const createRadar = (radar: any, suggested: boolean): Radar => {
  return createRadarSync(
    createRadarItem(radar.model),
    createRadarItem(radar.client),
    createRadarItem(radar.model),
    createRadarItem(suggested ? radar.proposed : radar.client)
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
