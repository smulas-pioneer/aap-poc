import * as React from 'react';
import { LangDictionary } from "../../../reducers/language/interfaces";

import { Label } from 'semantic-ui-react';
import { formatAua, } from '../../../_db/utils';
import { getMapOptionTypeCaption } from '../../../commonUtils';
import { IndicatorOptionsType } from '../../../actions/model';
import { AreaValue } from '../../shared/AreaMapProps';

export const SingleAreaLegend = ({ type, value, lang }: { type: IndicatorOptionsType, value: AreaValue, lang: LangDictionary }) => {
  if (!value) return null;
  let formattedValue = value.value.toString();
  if (type === IndicatorOptionsType.aua) formattedValue = formatAua(value.value);
  const ret = <div style={{ margin: 0 }}>
    <Label size="medium" color="blue" ribbon >{value.key}</Label>
    <span style={{ float: 'right', fontWeight: 'bolder' }}>{formattedValue}</span>
    <span style={{ float: 'right', paddingRight: 4 }}>{getMapOptionTypeCaption(type, lang)}:</span>
  </div>
  return ret;
}
