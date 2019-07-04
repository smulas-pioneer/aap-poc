import { LangDictionary } from "./reducers/language/interfaces";
import { IndicatorOptionsType } from "./actions/model";

export function getMapOptionTypeCaption(type: IndicatorOptionsType, lang: LangDictionary) {
  switch (type) {
    case IndicatorOptionsType.clients: return lang.MAP_OPTS_CLIENTS;
    case IndicatorOptionsType.aua: return lang.MAP_OPTS_AUA;
    case IndicatorOptionsType.proposals: return lang.MAP_OPTS_PROPOSALS;
    case IndicatorOptionsType.acceptedProposals: return lang.MAP_OPTS_ACC_PROPOSAL;
    case IndicatorOptionsType.alerts: return lang.MAP_OPTS_ALERTS;
  }
  return IndicatorOptionsType[type];
}


export function arrayHasValue(array?: any[], value?: any) {
  if (!array || !array.length) return false;
  const a = array.find(v => v === value.toString());
  return a ? true : false;
}

/**
 * Add space between camelCase text.
 */
export function unCamelCase(str?: string) {
  if (!str) return str;
  str = str.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, '$1 $2');
  str = str.replace(/^\w|\s\w/g, s => s.toUpperCase());
  return str;
}
