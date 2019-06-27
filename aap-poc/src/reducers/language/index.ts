
import { LanguageState } from './interfaces';
import { English } from './language_english';
import { Italiano } from './language_italiano';
import { German } from './language_german';
import { setLanguage } from '../../actions/index';
// export { LanguageState };

// Root Reducer
export default (state: LanguageState = English, action: any): LanguageState => {
  if (setLanguage.matchAction(action)) {
    if (action.payload === 'it') {
      return Italiano;
    } else if (action.payload === 'gb') {
      return English;
    } else if (action.payload === 'de') {
      return German;
    }
  }
  return state;
};

// Selectors
export const getLanguage = (state: LanguageState) => state;
