import { SpotlightSearchResultItem, Client, Security, AgentView, Holding, FinalHolding } from "./interfaces";
import { groupBy, sumBy } from "lodash";
import { SemanticCOLORS } from "semantic-ui-react";

export const numArray = (num: number) => {
    let ret: number[] = [];
    for (let i = 0; i < num; i++) {
        ret.push(i);
    }
    return ret;
}

export const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

export const getRndItem = <T>(data: T[]) => {
    return data[rnd(0, data.length - 1)];
}

export function hasFlag<TFlags extends number>(testFlag: TFlags, flag: TFlags) { return (testFlag & flag) === flag; }

export function isClient(item: SpotlightSearchResultItem): item is Client {
    return (item as Client).agent !== undefined;
}

export function isAgent(item: SpotlightSearchResultItem): item is AgentView {
    return (item as AgentView).clients !== undefined;
}

export function isSecurity(item: SpotlightSearchResultItem): item is Security {
    return (item as Security).SecurityName !== undefined;
}

export function formatAua(aua: number | undefined, fmt?: any) {
    if (aua === undefined) return '';
    let ret = Math.floor(aua / 1000000);
    if (fmt) ret = fmt(ret);
    return `${ret} M€`;
}

export const formatNumber = (fmt: string) => (num: number | undefined, digits: number = 0, defaultRet: string = "") => {
    if (!num) return defaultRet;
    return new Intl.NumberFormat(fmt, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(num);
}
export function getRegionsByClients(clients: Client[]) {
    const regions = groupBy(clients, c => c.address.region);
    const regComparer = ((a: { region: string }, b: { region: string }) => a.region.toLowerCase().indexOf('nor') === 0 ? -1 : a.region.localeCompare(b.region));
    return Object.keys(regions)
        .map(r => ({ region: r, clients: regions[r].length }))
        .sort(regComparer); //({ region: a }, { region: b }) => a.indexOf..localeCompare(b));
}

export const getAgentViewsFromClients = (clients: Client[]): AgentView[] => {
    const data = groupBy(clients, c => c.agent);
    return Object.keys(data).map(k => ({
        name: k,
        clients: data[k]
    })
    );
}

export const processHoldingsSuggestions = (holdings: Holding[], suggestionType: 'Q' | 'W') => {
    if (suggestionType === 'Q') {
        const r = holdings.map(h => {
            const p = h.amount / h.quantity;
            return {
                ...h,
                finalQuantity: h.accepted ? h.quantity + h.suggestion : h.quantity,
                finalAmount: h.quantity * p,
                finalWeight: 0
            } as FinalHolding
        });
        const tot = sumBy(r, h => h.finalAmount);
        return r.map(h => {
            return { ...h, finalWeight: h.finalAmount / tot };
        })
    } else {
        const r = holdings.map(h => {
            const p = h.amount / h.quantity;
            return {
                ...h,
                finalQuantity: h.accepted ? h.quantity + h.suggestion : h.quantity,
                finalAmount: h.quantity * p,
                finalWeight: 0
            } as FinalHolding
        });
        const tot = sumBy(r, h => h.finalAmount);
        return r.map(h => {
            return { ...h, finalWeight: h.finalAmount / tot };
        })
    }

}
export const getColorCustomClassName = (name?: SemanticCOLORS, className?: string) => (`${name} ${name ? `color-${name} ` : ''}${className || ''}`);
