import { Client, Transaction, Breakdown, InterviewResult, StrategyItem } from "../_db/interfaces";
import { getClientSuccess, getClientSuggestedTranasactionsSuccess, getBreakdownsSuccess, getHistorySuccess, getStrategySuccess, logoutSuccess, addHistory } from "../actions/index";

export interface ClientState {
    clientData: Client | undefined;
    suggestedTransactions: Transaction[],
    breakdowns: Breakdown[],
    history: InterviewResult[],
    strategy: StrategyItem[],
    strategySuccessCount: number
}

const defaultState: ClientState = {
    clientData: undefined,
    suggestedTransactions: [],
    breakdowns: [],
    history: [],
    strategy: [],
    strategySuccessCount: 0
};

// Root Reducer
export default (state: ClientState = defaultState, action: any): ClientState => {
    if (getClientSuccess.matchAction(action)) {
        return { ...state, clientData: action.payload };
    } else if (getClientSuggestedTranasactionsSuccess.matchAction(action)) {
        return { ...state, suggestedTransactions: action.payload };
    } else if (getBreakdownsSuccess.matchAction(action)) {
        return { ...state, breakdowns: action.payload }
    } else if (getHistorySuccess.matchAction(action)) {
        return { ...state, history: action.payload }
    } else if (getStrategySuccess.matchAction(action)) {
        return { ...state, strategy: action.payload, strategySuccessCount: state.strategySuccessCount + 1 }
    } else if (logoutSuccess.matchAction(action)) {
        return defaultState;
    }
    return state;
};

export const getCurrentClient = (s: ClientState) => s.clientData;
export const getSuggestedTransactions = (s: ClientState) => s.suggestedTransactions;
export const getBreakdowns = (s: ClientState) => s.breakdowns;
export const getHistory = (s: ClientState) => s.history;
export const selectStrategy = (s: ClientState) => s.strategy;
export const selectStrategySuccessCount = (s: ClientState) => s.strategySuccessCount;
