import { getAlertHistorySuccess, logoutSuccess } from "../actions/index";
import { AlertHistory } from "../_db/interfaces";

export interface AlertState {
    alertHistory: AlertHistory[];
}

const defaultState: AlertState = {
    alertHistory: []
};

// Root Reducer
export default (state: AlertState = defaultState, action: any): AlertState => {
    if (getAlertHistorySuccess.matchAction(action)) {
        return { alertHistory: action.payload }
    } else if (logoutSuccess.matchAction(action)) {
        return defaultState;
    }
    return state;
};


export const selectAlertHistory = (state: AlertState) => state.alertHistory;