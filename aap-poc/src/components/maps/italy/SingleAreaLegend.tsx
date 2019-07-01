import * as React from 'react';
import { LangDictionary } from "../../../reducers/language/interfaces";

import { Label, Segment } from 'semantic-ui-react';
import { formatAua, } from '../../../_db/utils';
import { getMapOptionTypeCaption } from '../../../commonUtils';
import { IndicatorOptionsType } from '../../../actions/model';
import { AreaValue } from '../../shared/AreaMapProps';

export const SingleAreaLegend = ({ type, value, lang, showTitle = true }: { type: IndicatorOptionsType, value: AreaValue, lang: LangDictionary, showTitle?: boolean }) => {
  if (!value) return null;
  let formattedValue = value.value.toString();
  if (type === IndicatorOptionsType.aua) formattedValue = formatAua(value.value);
  const ret = <div className='singleAreaLegend' style={{ margin: 0 }}>
    {showTitle && <span className='title' color='blue' style={{ float: 'left', fontWeight: 'bolder' }}>{value.key}</span>}
    <span style={{ float: 'right', fontWeight: 'bolder' }}>{formattedValue}</span>
    <span style={{ float: 'right', paddingRight: 4 }}>{getMapOptionTypeCaption(type, lang)}:</span>

    {/* <Label ribbon size="small" color="blue" >{value.key}</Label> */}
  </div>
  return ret;
}
