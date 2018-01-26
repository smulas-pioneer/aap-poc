import { clientList, securityList, history, strategies, alertHistory } from './data';
import * as Model from './common/interfaces';
import { sumBy, groupBy } from 'lodash'
import { rnd, numArray, getRndItem, hasFlag, getAgentViewsFromClients } from './utils';
import { SpotlightSearchParms, SpotlightContext, Holding, StrategyItem, InterviewResult } from './common/interfaces';
import * as ce from './coreEngine';
import { intersection } from 'lodash';
import * as moment from 'moment';
import { getRandomRadar, isFakeClient, currentPosition } from './common/radarUtils';
import { promisify } from 'util';
import { REFERENCE_DATE_TODAY, MainColors } from './common/consts';
import { Holdings } from '../components/clientView/Holdings';
import { Aggregation } from './interfaces';

export const patchHoldings = (holdings: Model.Holding[], transactions: Model.Transaction[]): Promise<Model.Holding[]> => {
    return Promise.resolve([]);
};

export const getPerformance = (securityId: string, date: string): Promise<Model.PerformanceStat> => {
    return Promise.resolve({
        data: [],
        date,
        perf: 0,
        perfBmk: 0
    });
};

const arrayContains = (array?: any[], value?: any) => {
    if (!array || !array.length) return true;
    const a = array.find(v => v === value.toString());
    return a ? true : false;
}

const checkAlerts = (alertToCheck: string[] | undefined, breaks: string[]) => {
    if (!alertToCheck || !alertToCheck.length) return true; // all
    return intersection(alertToCheck, breaks).length === alertToCheck.length;
}

export const searchClient = (parms: Model.SearchParms, visibility?: string[]): Promise<Model.SearchResult> => {
    let theList = clientList;
    if (visibility && visibility.length) theList = theList.filter(c => arrayContains(visibility, c.agent));
    if (parms.onlyWithAlerts) theList = theList.filter(r => r.radar.numOfAlerts);
    const result = theList
        .filter(c => c.name.toLowerCase().indexOf(parms.filter.toLocaleLowerCase()) > -1)
        .filter(c => arrayContains(parms.alerts, c.radar.numOfAlerts))
        .filter(c => checkAlerts(parms.alertTypes, c.breaks))
        .filter(c => arrayContains(parms.agents, c.agent))
        .filter(c => arrayContains(parms.clientStatus, c.clientStatus))
        .filter(c => arrayContains(parms.regions, c.address.region))
        .filter(c => arrayContains(parms.clientStatusDuration, c.clientStatusDuration))
        .filter(c => arrayContains(parms.size, c.size))
        .filter(c => arrayContains(parms.segments, c.segment))
        .filter(c => arrayContains(parms.branch, c.branch))

        .map(c => ({ ...c, holdings: [] }));



    return Promise.resolve({
        parms,
        result,
        radar: undefined,
        breakdowns: getClientsBreakdowns(result)
    });
};

export const getClient = (parms: { id: string }): Promise<Model.Client> => {

    let c = clientList.find(c => c.id === parms.id)!;
    //c.holdings = c.holdings.map(r => ({ ...r, security: securityList.find(i => i.IsinCode == r.securityId)! }));
    return Promise.resolve(c);
};
/*
export const getSuggestedTransactions = (actual: Model.Holding[], target: Model.Holding[]): Promise<Model.Transaction[]> => {
    return Promise.resolve([]);
};
*/
export const getSuggestedTransactions = (args: { holdings: Model.Holding[], proposed: Model.RadarItem }) => {
    // Random
    const nBuy = rnd(0, args.holdings.length * 2);
    const buy = numArray(nBuy).map(i => {
        const sec = getRndItem(securityList);
        return {
            security: sec,
            quantity: rnd(1, 100) * 100,
            type: "BUY"
        } as Model.Transaction
    });
    const sell = numArray(nBuy).map(i => {
        const sec = getRndItem(args.holdings);
        return {
            security: securityList.find(i => i.IsinCode == sec.securityId),
            quantity: rnd(1, sec.quantity),
            type: "SELL"
        } as Model.Transaction
    });
    return Promise.resolve(buy.concat(sell).sort((a, b) => a.security.SecurityName.localeCompare(b.security.SecurityName)));

}



const getAttributeBreakDown = (attributeName: string, holdings: Model.Holding[]): Model.Breakdown => {
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

export const getBreakdown = (holdings: Model.Holding[]) => {
    const attributes = [
        'MacroAssetClass',
        'MicroAssetClass',
        'Sector',
        'Currency',
        'Rating',
        'Country',
        'Maturity'
    ];
    return Promise.resolve(attributes.map(r => getAttributeBreakDown(r, holdings)));
}

export const getHistory = (clientId: string) => {
    return Promise.resolve(history[clientId]);
}
export const getStrategy = (clientId: string) => {
    return Promise.resolve(
        strategies[clientId]
            .sort((a, b) => a.isCash ? -1 :  // CASH FIRST
                b.newSecurity ? -1 :
                    b.currentWeight - a.currentWeight)
    );
}


const strategyToAggreg = (position: StrategyItem): Aggregation => {
    return {
        weight: position.currentWeight,
        MacroAssetClass: position.security.MacroAssetClass,
        MicroAssetClass: position.security.MicroAssetClass,
        Sector: position.security.Sector || '',
        Currency: position.security.Currency,
        Country: position.security.Country || '',
        Rating: position.security.Rating || '',
        Maturity: position.security.Maturity || '',
        Region: position.security.Region || '',
    }
}
const aggToBreakdown = (data: Aggregation[], key: string): Model.Breakdown => {
    const d = data.reduce((prev, curr) => {
        prev[curr[key]] = prev[curr[key]] || 0 + curr.weight;
        return prev;
    }, {} as { [key: string]: number }
    );

    const tot = Object.keys(d).reduce((a, b) => a + d[b], 0);

    return {
        attributeName: key,
        weight: 1,
        data: top10(Object.keys(d).map(k => ({ value: k, weight: d[k] / tot, bmk: d[k] / tot })).filter(i => i.value.trim() !== '')),
        color: MainColors[key]
    }
}

const top10 = (data: { value: string, weight: number, bmk: number }[]) => {
    const sortedData = data.sort((a, b) => b.weight - a.weight);
    if (sortedData.length < 10) return sortedData;
    const others = sortedData.slice(10);

    return sortedData.slice(0,10).concat([{
        value:'Other',
        weight:sumBy(others,i=>i.weight),
        bmk:0
    }]);

}


export const getClientsBreakdowns = (clients: Model.Client[]) => {
    const agg = clients.map(c => strategies[c.id])
        .reduce((prev, curr) => {
            prev = prev.concat(curr.filter(f => f.currentWeight > 0).map(strategyToAggreg));
            return prev;
        }, [] as Model.Aggregation[]);

    return [
        aggToBreakdown(agg, 'MacroAssetClass'),
        aggToBreakdown(agg, 'MicroAssetClass'),
        aggToBreakdown(agg, 'Currency'),
       // aggToBreakdown(agg, 'Sector'),
       // aggToBreakdown(agg, 'Country'),
        aggToBreakdown(agg, 'Rating'),
      //  aggToBreakdown(agg, 'Maturity'),
        //aggToBreakdown(agg, 'Region'),

    ];
}


export const getSuggestion = (args: { id: string, position: Model.StrategyItem[], axes: Model.RadarStrategyParm, calculateFromAxes: boolean }) => {
    if (isFakeClient(args.id)) {
        const ret = strategies[args.id];
        return Promise.resolve(ce.getSuggestion(args.position, args.axes, args.calculateFromAxes, ret));
    }
    return Promise.resolve(ce.getSuggestion(args.position, args.axes, args.calculateFromAxes));
};

export const spotlightSearch = (parms: SpotlightSearchParms): Promise<Model.SpotlightSearchResult> => {
    const ctx = parms.context;
    const limit = parms.limit || 5;
    const filter = parms.filter.toLowerCase();
    const onlyPushed = parms.onlyPushedSecurity || false;

    let cc = SpotlightContext.All;
    if (ctx) cc = SpotlightContext[ctx];
    let cli: Model.Client[] = [];
    let sec: Model.Security[] = [];
    let age: Model.AgentView[] = [];

    if (filter && filter.length) {
        if (hasFlag(cc, SpotlightContext.Client)) {
            cli = clientList.filter(c => arrayContains(parms.agents, c.agent)).filter(c => c.name.toLowerCase().indexOf(filter) !== -1);
        }
        if (hasFlag(cc, SpotlightContext.Agent)) {
            age = getAgentViewsFromClients(clientList.filter(c => arrayContains(parms.agents, c.agent)).filter(c => c.agent.toLowerCase().indexOf(filter) !== -1));
        }
        if (hasFlag(cc, SpotlightContext.Security)) {
            sec = securityList.filter((s, ix) => ix != 0 
                && (!parms.macroAssetClass || s.MacroAssetClass == parms.macroAssetClass)                
                &&
                (s.SecurityName.toLowerCase().indexOf(filter) !== -1 ||
                    s.IsinCode.toLowerCase().indexOf(filter) !== -1)
            ); // skip 0 cash
            if (onlyPushed) sec = sec.filter(sec => sec.pushed === true);
        }
    }
    let ret: any = {};
    if (cli.length) ret.client = cli.slice(0, limit);
    if (sec.length) ret.security = sec.slice(0, limit);
    if (age.length) ret.agents = age.slice(0, limit);

    return Promise.resolve({ items: ret });
}

export const getRandomSecurities = (max: number, except: string[]): Model.Security[] => {
    return numArray(max).map(r => {
        const ix = rnd(1, securityList.length - 1);
        return securityList[ix]
    }).filter(s => { !except.find(i => i == s.IsinCode) });
}

export const getSuggestedAllocation = (args: {
    holdings: Model.Holding[],
    modelId: string,
    axes: Model.RadarStrategyParm,
}): Promise<Model.Holding[]> => {
    const ret = args.holdings.map(h => {
        const quantity = h.quantity + rnd(-h.quantity, h.quantity);
        return { ...h, quantity, accepted: false }
    });
    return Promise.resolve(ret);
}


export const getAlertHistory = () => {
    return Promise.resolve(alertHistory)
}


export const addSecurity = ({ securityId, clientId }: { securityId: string, clientId: string }) => {
    const h: StrategyItem = {
        security: securityList.find(s => s.IsinCode == securityId)!,
        currentAmount: 0,
        currentPrice: 1,
        currentQuantity: 0,
        currentWeight: 0,
        isCash: false,
        fee: 0,
        modelWeight: 0,
        radar: getRandomRadar(),
        suggestedDelta: 0,
        suggestionAccepted: false,
        newSecurity: true,
    }
    strategies[clientId] = [...strategies[clientId], h];
    return getClient({ id: clientId })
}

export const addHistory = ({ clientId, notes }: { clientId: string, notes: string }) => {
    const h: InterviewResult = {
        status: 'ONGOING',
        date: moment(REFERENCE_DATE_TODAY).format(),
        notes
    }

    history[clientId] = [...history[clientId], h];
    return getClient({ id: clientId })
}