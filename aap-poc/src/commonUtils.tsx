import { LangDictionary } from "./reducers/language/interfaces";
import { IndicatorOptionsType } from "./actions/model";

export function getMapOptionTypeCaption(type: IndicatorOptionsType, lang: LangDictionary) {
    switch (type) {
        case IndicatorOptionsType.clients: return lang.MAP_OPTS_CLIENTS;
        case IndicatorOptionsType.aua: return lang.MAP_OPTS_AUA;
        case IndicatorOptionsType.proposals: return lang.MAP_OPTS_PROPOSALS;
        case IndicatorOptionsType.acceptedProposals: return lang.MAP_OPTS_PROPOSAL;
        case IndicatorOptionsType.alerts: return lang.MAP_OPTS_ALERTS;
    }
    return IndicatorOptionsType[type];
}