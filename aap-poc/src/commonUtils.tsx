import { LangDictionary } from "./reducers/language/interfaces";
import { IndicatorOptionsType } from "./actions/model";

export function getMapOptionTypeCaption(type: IndicatorOptionsType, lang: LangDictionary) {
    switch (type) {
        case IndicatorOptionsType.clients: return lang.MAP_OPTS_CLIENTS;
        case IndicatorOptionsType.aum: return lang.MAP_OPTS_AUM;
        case IndicatorOptionsType.interviews: return lang.MAP_OPTS_PROPOSALS;
        case IndicatorOptionsType.acceptedProposals: return lang.MAP_OPTS_PROPOSAL;
        case IndicatorOptionsType.alerts: return lang.MAP_OPTS_ALERTS;
    }
    return IndicatorOptionsType[type];
}