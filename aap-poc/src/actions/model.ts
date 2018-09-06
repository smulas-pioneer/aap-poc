import { SemanticICONS, SemanticCOLORS } from 'semantic-ui-react';
import { LangDictionary } from '../reducers/language/interfaces';
import { Client, SearchParms } from '../_db/interfaces';
import { isArray, startCase, Dictionary, camelCase } from 'lodash';
import { MouseEventHandler } from 'react';
import { ClientFilter } from '../components/shared/ClientFilter';

export interface MapLegend<T> {
    title: string,
    dic: Dictionary<LabelValue<T>>;
}

export interface LabelValue<T> {
    value?: T;
    label: string
}

export enum IndicatorOptionsType {
    clients = 0,
    aua,
    proposals,
    acceptedProposals,
    alerts,
    upfrontFees,
    ongoingFees,
    budget,
    budgetAccomplishedYTD,
   // allocation,
    turnover
}
export type IndicatorType = keyof typeof IndicatorOptionsType;

export interface UserInfo {
    firstName: string,
    lastName: string,
    isAgent: boolean;
    isManager: boolean;
    agents: string[];
}

export interface MemuItemModel {
    langProps: string;
    linkTo: string | undefined;
    color: SemanticCOLORS;
    icon: SemanticICONS;
    innewline?: boolean;
    excludeHomePage?: boolean;
}
export const memuItems: MemuItemModel[] = [
    { langProps: 'DASHBOARD', linkTo: '/dashboard', color: 'blue', icon: 'users', excludeHomePage: true },
    { langProps: 'MY_CLIENTS', linkTo: '/clients', color: 'blue', icon: 'users', innewline: true },
    { langProps: 'MY_ALERTS', linkTo: '/alerts', color: 'red', icon: 'alarm' },
    { langProps: 'MY_PORTFOLIOS', linkTo: '/manager', color: 'yellow', icon: 'group', innewline: true },
    { langProps: 'MY_BUSINNESS', linkTo: undefined, color: 'teal', icon: 'pie graph' },
    { langProps: 'NEWS_INSIGHTS', linkTo: undefined, color: 'grey', icon: 'newspaper', innewline: true }
]

export type FilterMapTypes = 'Regions' | 'Alerts' | 'Agents' | 'Aua' | 'AlertType' | 'Segment' | 'Branch' | 'ClientStatus' | 'ClientStatusDuration' | 'RiskProfile';

export interface ConfigJsonModel {
    APPNAME: string, 
    CLIENT: string 
} 
export interface FilterMap {
    prop: string;
    subprop?: string;
    searchprop: string;
    render: { header: string, icon: SemanticICONS, max?: number | undefined, label: ((value: any, lang?: LangDictionary) => string) | undefined };
    enableClearAll?: boolean;
}
export const filterMapItems: {[key in FilterMapTypes]: FilterMap } = {
    Regions: {
        prop: 'address',
        subprop: 'region',
        searchprop: 'regions',
        render: { header: 'Regions', icon: 'globe', label: undefined }
    },
    Alerts: {
        prop: 'radar',
        subprop: 'numOfAlerts',
        searchprop: 'alerts',
        render: { header: 'Alerts', icon: 'alarm outline', label: (value: number) => `${value} alert${value > 1 ? 's' : ''}` }
    },
    Agents: {
        prop: 'agent',
        searchprop: 'agents',
        render: { header: 'Financial Advisors', icon: 'address book outline', label: undefined, max: 5 }
    },
    Aua: {
        prop: 'size',
        searchprop: 'size',
        render: { header: 'AUA', icon: 'money', label: undefined }
    },
    AlertType: {
        prop: 'breaks',
        searchprop: 'alertTypes',
        render: { header: 'Alert Type', icon: 'alarm outline', label: (value: string) => startCase(value) }
    },
    Segment: {
        prop: 'segment',
        searchprop: 'segments',
        render: { header: 'Segment', icon: 'id badge', label: undefined }
    },
    Branch: {
        prop: 'branch',
        searchprop: 'branch',
        render: { header: 'Branch', icon: 'id badge', label: undefined, max: 5 }
    },
    ClientStatus: {
        prop: 'clientStatus',
        searchprop: 'clientStatus',
        render: { header: 'Client Status', icon: 'adjust', label: (value: string) => startCase(camelCase(value)) }
    },
    ClientStatusDuration: {
        prop: 'clientStatusDuration',
        searchprop: 'clientStatusDuration',
        render: { header: 'Client Status Duration', icon: 'time', label: undefined }
    },
    RiskProfile: {
        prop: 'clientRiskProfile',
        searchprop: 'clientRiskProfile',
        render: { header: 'Client Risk Profile', icon: 'american express card', label: undefined }

    }
}
export interface SearchFilter {
    [key: string]: { init: number, current: number, isInUse: boolean };
}
export interface ClientFilters {
    Regions: SearchFilter;
    Alerts: SearchFilter;
    Agents: SearchFilter;
    Aua: SearchFilter;
    AlertType: SearchFilter;
    Segment: SearchFilter;
    Branch: SearchFilter;
}
export const createFilterAdv = (data: Client[], searchParms?: SearchParms | undefined, from?: ClientFilters | undefined) => {

    const isChecked = (array?: any[], value?: any) => {
        if (!array || !array.length) return false;
        const a = array.find(v => v === value.toString());
        return a ? true : false;
    }

    return Object.keys(filterMapItems).reduce((memo, key) => {
        const { prop, subprop, searchprop } = filterMapItems[key];

        let filter = { ...memo[key] } || {};
        let appliedFilters = searchParms && searchParms[searchprop];

        Object.keys(filter).forEach(v => {
            filter[v] = { ...filter[v], current: 0, isInUse: isChecked(appliedFilters, v) };
        })

        data.forEach(client => {
            let currentValues = subprop ? client[prop][subprop] : client[prop];

            if (!isArray(currentValues)) currentValues = [currentValues];

            if (isArray(currentValues)) {
                currentValues.forEach((v, i) => {
                    const pre = filter[v];
                    filter = { ...filter, [v]: { ...pre, current: (pre && pre.current || 0) + 1 } }
                });
            }
        });

        Object.keys(filter).forEach(v => {
            filter[v] = { ...filter[v], init: filter[v].init || filter[v].current };
        })

        return { ...memo, [key]: filter };
    }, {} = from || {} as ClientFilters);
};



