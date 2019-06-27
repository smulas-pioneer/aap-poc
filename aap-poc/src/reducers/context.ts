import { UserInfo } from "../actions/model";
import { loginSuccess, logoutSuccess, ready } from "../actions/index";

export interface ContextState {
    user?: UserInfo,
    ready: boolean
}

const defaultState: ContextState = {
    user: undefined,
    ready: false,
};

// Root Reducer
export default (state: ContextState = defaultState, action: any): ContextState => {
    if (loginSuccess.matchAction(action)) {
        return { user: action.payload, ready: state.ready }
    } else if (logoutSuccess.matchAction(action)) {
        return defaultState;
    } else if (ready.matchAction(action)) {
        return {user:state.user, ready: action.payload};
    }
    return state;
};

export const isManager = (state: ContextState) => state.user !== undefined && state.user.isManager;
export const isLogged = (state: ContextState) => state.user !== undefined;
export const getCurrentUser = (state: ContextState) => state.user;

export const getIsReady = (state:ContextState) => state.ready;
