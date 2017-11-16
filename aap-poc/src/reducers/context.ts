import { UserInfo } from "../actions/model";
import { loginSuccess, logoutSuccess } from "../actions/index";

export interface ContextState {
    user?: UserInfo
}

const defaultState: ContextState = {
    user: undefined
};

// Root Reducer
export default (state: ContextState = defaultState, action: any): ContextState => {
    if (loginSuccess.matchAction(action)) {
        return { user: action.payload }
    } else if (logoutSuccess.matchAction(action)) {
        return defaultState;
    }
    return state;
};

export const isManager = (state: ContextState) => state.user != undefined && state.user.isManager;
export const isLogged = (state: ContextState) => state.user != undefined;
export const getCurrentUser = (state: ContextState) => state.user;