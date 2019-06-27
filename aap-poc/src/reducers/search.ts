import { SearchResult, AgentView, Client, SearchParms, AlertHistory2 } from '../_db/interfaces';
import { searchClientSuccess, logoutSuccess } from '../actions/index';
import * as Model from '../actions/model';
import { getAgentViewsFromClients } from '../_db/utils';
import { createSelector } from 'reselect';
import { intersection } from 'lodash';
import { access } from 'fs';
import { calculateAlertHistory } from '../_db/common/radarUtils';

export interface State {
    result: {
        [uid: string]: SearchResult | undefined
    };
    filter: {
        [uid: string]: Model.ClientFilters | undefined
    };
    agentView: {
        [uid: string]: { parms: SearchParms, result: AgentView[] | undefined }
    };

    alertHistory: {
        [uid: string]: AlertHistory2[] | undefined
    }
}

const defaultState: State = {
    result: {},
    filter: {},
    agentView: {},
    alertHistory: {}
};

// Root Reducer
export default (state: State = defaultState, action: any): State => {
    if (searchClientSuccess.matchAction(action)) {
        const uid = action.payload.parms.uid;
        return {
            ...state,
            result: {
                ...state.result,
                [uid]: action.payload
            },
            filter: {
                ...state.filter,
                [uid]: Model.createFilterAdv(action.payload.result, action.payload.parms, state.filter && state.filter[uid])
            },
            agentView: {
                ...state.agentView,
                [uid]: {
                    parms: action.payload.parms,
                    result: getAgentViewsFromClients(action.payload.result)
                }
            },
            alertHistory: {
                ...state.alertHistory,
                [uid]: uid === 'alerts' || uid === 'dashboard' ? calculateAlertHistory(action.payload.result) : undefined
            }
        };
    } else if (logoutSuccess.matchAction(action)) {
        return defaultState;
    }
    return state;
};

export const getSearchResult = (state: State, uid: string) => state.result[uid];
export const getSearchFilter = (state: State, uid: string) => state.filter[uid];
export const getAgentView = (state: State, uid: string) => state.agentView[uid];
export const getSearchParms = (state: State, uid: string) => state.result[uid] && state.result[uid]!.parms;
export const getAlertHistory = (state: State) => state.alertHistory['alerts'];
