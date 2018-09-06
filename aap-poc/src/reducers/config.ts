import { ConfigJsonModel } from "../actions/model";
import { setConfigJson } from "../actions/index";

export interface ConfigLayout {
    client: string;
    color: string;
    interpolateColors?: { from: string, to: string } | [number, number, number][]
    titleStyle?: any;
    logoStyle?: any;
}


export interface ContextState {
    configJson?: ConfigJsonModel
    configLayout: ConfigLayout
}

const defaultState: ContextState = {
    configLayout: {
        client: 'UCG',
        color: '#db2828',
        interpolateColors: [
            [255, 210, 205],
            [255, 134, 121],
            [255, 67, 47],
            [226, 22, 0],
            [176, 18, 0],
            [92, 9, 0],
            [50, 5, 0]
        ]
    }
};

// Root Reducer
export default (state: ContextState = defaultState, action: any): ContextState => {
    if (setConfigJson.matchAction(action)) {
        const newState = { ...state, configJson: action.payload };

        if (newState.configJson.CLIENT && newState.configJson.CLIENT === 'BPER') {
            newState.configLayout = {
                client: newState.configJson.CLIENT,
                color: '#00b97f',
                logoStyle: { width: '70px' },
                titleStyle: { width: '100%', textAlign: 'right' },
                interpolateColors: { from: 'rgb(0, 230, 158)', to: 'rgb(0, 99, 105)' }
            }
        } else {
            newState.configLayout = defaultState.configLayout;
        }

        return newState;
    }

    return state;
};

export const getConfigJson = (state: ContextState) => state.configJson;
export const getConfigLayout = (state: ContextState) => state.configLayout;
