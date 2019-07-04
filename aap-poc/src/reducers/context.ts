import { UserInfo } from "../actions/model";
import { loginSuccess, logoutSuccess, ready, setAppTheme } from "../actions/index";

export interface ContextState {
    user?: UserInfo,
    ready: boolean,
    theme: 'dark' | 'white'
}

const defaultState: ContextState = {
    user: undefined,
    ready: false,
    theme: 'dark'
};

// Root Reducer
export default (state: ContextState = defaultState, action: any): ContextState => {
    if (loginSuccess.matchAction(action)) {
        return { ...state, user: action.payload, ready: state.ready }
    } else if (logoutSuccess.matchAction(action)) {
        return defaultState;
    } else if (ready.matchAction(action)) {
        return { ...state, user: state.user, ready: action.payload };
    }

    if (setAppTheme.matchAction(action)) {
        return { ...state, theme: action.payload }
    }

    return state;
};

export const isManager = (state: ContextState) => state.user !== undefined && state.user.isManager;
export const isLogged = (state: ContextState) => state.user !== undefined;
export const getCurrentUser = (state: ContextState) => state.user;
export const getIsReady = (state: ContextState) => state.ready;
export const getTheme = (state: ContextState) => state.theme;
