import { createAction, createPromiseAction, createPromiseWithThunkAction } from 'redux-helper';
import { SearchResult, Client, Transaction, Breakdown, InterviewResult, SpotlightSearchResult, Holding, StrategyItem, SearchParms, SpotlightSearchParms, AlertHistory, Security } from '../_db/interfaces';
import * as svc from '../_db/service';
import { UserInfo, ConfigJsonModel } from './model';
import { agents } from '../_db/data/index';
import { getCurrentUser } from '../reducers/index';
import { intersection } from 'lodash';
import { clientList } from '../_db/data';

export enum LoginType {
    Manager,
    Advisor
}
export const setConfigJson = createAction<ConfigJsonModel>('SET_CONFIGJSON');
export const logoutSuccess = createAction('LOGOUT');
export const logout = createPromiseAction('LOGOUT_SUCCESS', () => Promise.resolve(true), logoutSuccess);
export const loginSuccess = createAction<UserInfo>('LOGIN_SUCCESS');
export const login = createPromiseAction('LOGIN', (lt: LoginType | undefined) => {
    const getValidAgent = (): string => {
        const rndAge = 0;// Math.floor((Math.random() * agents.length)) + 1;
        const agent = agents[rndAge];
        if (!agent || !clientList.some(c => c.agent === agent)) return getValidAgent();
        return agent;
    }
    const agent = getValidAgent();
    const sn = agent.split(' ');
    switch (lt) {
        case LoginType.Advisor:
            return Promise.resolve<UserInfo>({
                firstName: sn[0],
                lastName: sn[1],
                isAgent: true,
                isManager: false,
                agents: [agent]
            });
        case LoginType.Manager:
            return Promise.resolve<UserInfo>({
                firstName: 'Walter',
                lastName: "White",
                isAgent: false,
                isManager: true,
                agents: [...agents]
            });
        default:
    }
    throw Error("Login not managed!");
}, loginSuccess);

export const setLanguage = createAction<'gb' | 'it' | 'de'>('SET_LANGUAGE');
export const searchClientSuccess = createAction<SearchResult>('SEARCH_CLIENT_SUCCESS');
export const searchClient = (args: SearchParms) => (dispatch: any, getState: () => any) => {
    const s = getState();
    const usr = getCurrentUser(s)!;
    svc.searchClient(args, usr.agents).then(r => dispatch(searchClientSuccess(r)));
}
export const getClientSuccess = createAction<Client>('GET_CLIENT_SUCCESS');
export const getClientSuggestedTranasactionsSuccess = createAction<Transaction[]>('GET_CLIENT_SUGGESTED_TRANSACTIONS_SUCCESS');
export const getClientSuggestedTranasactions = createPromiseAction('GET_CLIENT_SUGGESTED_TRANSACTIONS', svc.getSuggestedTransactions, getClientSuggestedTranasactionsSuccess);
export const getBreakdownsSuccess = createAction<Breakdown[]>('GET_BREAKDOWN_SUCCESS');
export const getBreakdowns = createPromiseAction('GET_BREAKDOWN', svc.getBreakdown, getBreakdownsSuccess);
export const spotlightSearchSuccess = createAction<SpotlightSearchResult>('SPL_SEARCH_SUCCESS');
export const spotlightSearch = (args: SpotlightSearchParms) => (dispatch: any, getState: () => any) => {
    const s = getState();
    const usr = getCurrentUser(s)!;
    const fltAgents = args.agents || [];

    svc.spotlightSearch(
        {
            ...args,
            agents: fltAgents.length === 0 ? usr.agents : intersection(fltAgents, usr.agents)
        })
        .then((r: any) => dispatch(spotlightSearchSuccess(r)));
}
export const getHistorySuccess = createAction<InterviewResult[]>('GET_HISTORY_SUCCESS');
export const getHistory = createPromiseAction('GET_HISTORY', svc.getHistory, getHistorySuccess);
export const getSuggestedAllocationSuccess = createAction<Holding[]>('GET_SUGGESTED_ALLOC_SUCCESS');
export const getSuggestedAllocation = createPromiseAction('GET_SUGGESTED_ALLOC', svc.getSuggestedAllocation, getSuggestedAllocationSuccess);
export const getStrategySuccess = createAction<StrategyItem[]>('GET_STRATEGY_SUCCESS');
export const getStrategy = createPromiseAction('GET_STRATEGY', svc.getStrategy, getStrategySuccess);
export const getSuggestions = createPromiseAction('GET_SUGGESTIONS', svc.getSuggestion, getStrategySuccess);
export const getAlertHistorySuccess = createAction<AlertHistory[]>('GET_ALERT_HISTORY_SUCCESS');
export const getAlertHistory = createPromiseAction('GET_ALERT_HISTORY', svc.getAlertHistory, getAlertHistorySuccess);
export const getClient = createPromiseWithThunkAction('GET_CLIENT', svc.getClient, getClientSuccess, (d, s, r, p) => {
    if (r) {
        d(getHistory(r.id))
        d(getStrategy(r.id))
    }
});
export const addSecurity = createPromiseWithThunkAction('ADD_SECURITY', svc.addSecurity, getClientSuccess, (d, s, r, p) => {
    if (r) {
        d(getHistory(r.id))
        // d(getStrategy(r.id))
    }
});
export const addHistory = createPromiseWithThunkAction('ADD_HISTORY', svc.addHistory, getClientSuccess, (d, s, r, p) => {
    if (r) {
        d(getHistory(r.id))
        //  d(getStrategy(r.id))
    }
});
export const ready = createAction<boolean>('READY');
