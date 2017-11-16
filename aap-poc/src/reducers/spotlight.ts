import { spotlightSearchSuccess, logoutSuccess } from "../actions/index";
import { SpotlightSearchResultItem } from "../_db/interfaces";

export interface State {
    items: { [key: string]: SpotlightSearchResultItem[] | undefined };
}

const defaultState: State = {
    items: {}
};

// Root Reducer
export default (state: State = defaultState, action: any): State => {
    if (spotlightSearchSuccess.matchAction(action)) {
        return { items: action.payload.items };
    } else if (logoutSuccess.matchAction(action)) {
        return defaultState;
    }
    return state;
};

export const getSpotlightData = (state: State) => state;