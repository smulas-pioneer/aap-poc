import * as React from 'react';
import { LangDictionary } from "../../reducers/language/interfaces";
import { AreaValue } from './ItalyMap';

import { Label } from 'semantic-ui-react';
import { formatAum, } from '../../_db/utils';
import { getMapOptionTypeCaption } from '../../commonUtils';
import { IndicatorOptionsType, MapLegend } from '../../actions/model';
import { Dictionary } from 'lodash';
const { Legend } = require('recharts');

export const FillAreaLegend = ({ legend }: { legend: MapLegend<string | number> | undefined }) => {
    let payload = [];
    if (legend) {
        for (let prop in legend.dic) {
            payload.push({
                id: prop, type: 'circle', color: '#1281ca', value: `${legend.dic[prop].label}: ${legend.dic[prop].value}`
            });
        }
    }
    return <Legend verticalAlign='bottom' align='right' layout='horizontal' payload={payload} />
}