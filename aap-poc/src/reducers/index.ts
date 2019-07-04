import { Redux } from 'app-support';
import * as fromSearch from './search';
import * as fromClient from './client';
import * as fromAlerts from './alerts';
import * as fromLanguage from './language';
import * as fromSpotlight from './spotlight';
import * as fromContext from './context';
import * as fromConfig from './config';

import '../styles/index.css';

// Store Model
export interface AppContext {
  store: Redux.Store<AppState>;
}

export interface AppState {
  config: fromConfig.ContextState;
  context: fromContext.ContextState;
  search: fromSearch.State;
  client: fromClient.ClientState;
  language: fromLanguage.LanguageState;
  spl: fromSpotlight.State;
  alerts: fromAlerts.AlertState;
}

// Root Reducer
export default Redux.combineReducers<AppState>({
  config: fromConfig.default,
  context: fromContext.default,
  search: fromSearch.default,
  client: fromClient.default,
  language: fromLanguage.default,
  spl: fromSpotlight.default,
  alerts: fromAlerts.default,
});

// Selectors
export const getConfigJson = (state: AppState) => fromConfig.getConfigJson(state.config);
export const getConfigLayout = (state: AppState) => fromConfig.getConfigLayout(state.config);

export const isLogged = (state: AppState) => fromContext.isLogged(state.context);
export const isManager = (state: AppState) => fromContext.isManager(state.context);
export const getCurrentUser = (state: AppState) => fromContext.getCurrentUser(state.context);
export const getLanguage = (state: AppState) => fromLanguage.getLanguage(state.language).dictionary;
export const getLanguageName = (state: AppState) => fromLanguage.getLanguage(state.language).name;
export const getLanguageFlag = (state: AppState) => fromLanguage.getLanguage(state.language).id;

export const getSearchResult = (state: AppState, uid: string) => fromSearch.getSearchResult(state.search, uid);
export const getSearchFilter = (state: AppState, uid: string) => fromSearch.getSearchFilter(state.search, uid);
export const getIsOnlyItaly = (state: AppState, uid: string) => fromSearch.getIsOnlyItaly(state.search, uid);
export const getIsCountryActive = (state: AppState, uid: string) => (country: string) => fromSearch.getIsSearchActive(state.search, uid, 'countries', country);
export const getIsRegionActive = (state: AppState, uid: string) => (region: string) => fromSearch.getIsSearchActive(state.search, uid, 'regions', region);

export const getCurrentClient = (state: AppState) => fromClient.getCurrentClient(state.client);
export const getSuggestedTransactions = (state: AppState) => fromClient.getSuggestedTransactions(state.client);
export const selectStrategySuccessCount = (state: AppState) => fromClient.selectStrategySuccessCount(state.client);

export const getAgentView = (state: AppState, uid: string) => fromSearch.getAgentView(state.search, uid);
export const getBreakdowns = (state: AppState) => fromClient.getBreakdowns(state.client);

export const getSpotlightData = (state: AppState) => fromSpotlight.getSpotlightData(state.spl);
export const getHistory = (state: AppState) => fromClient.getHistory(state.client);
export const selectStrategy = (state: AppState) => fromClient.selectStrategy(state.client);

export const selectAlertHistory = (state: AppState) => fromSearch.getAlertHistory(state.search);
export const getIsReady = (state: AppState) => fromContext.getIsReady(state.context);
export const getTheme = (state: AppState) => fromContext.getTheme(state.context);
