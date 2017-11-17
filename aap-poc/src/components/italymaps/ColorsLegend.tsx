import * as React from 'react';
import { IndicatorOptionsType } from '../../actions/model';
import { AreaValue } from './ItalyMap';
import { groupBy } from 'lodash';
import { LangDictionary } from '../../reducers/language/interfaces';
import { formatAum } from '../../_db/utils';
import { Popup } from 'semantic-ui-react';
import { getMapOptionTypeCaption } from '../../commonUtils';


export const ColorsLegend = ({ type, values, lang }: { type: IndicatorOptionsType, values: AreaValue[], lang: LangDictionary }) => {
    const filtered = values.filter((val) => val.value !== undefined);
    const grouped = groupBy(filtered, (v) => v.value);
    let onlyValues: AreaValue[] = [];
    for (let group in grouped) {
        let key = grouped[group].reduce((acc, v) => acc += v.key + ' - ', '');
        onlyValues.push({
            key: key.substring(0, key.length - 3),
            color: grouped[group][0].color,
            perc: grouped[group][0].perc,
            value: grouped[group][0].value
        });
    }

    onlyValues = onlyValues.sort((a, b) => b.value < a.value ? 1 : 0);

    const min = onlyValues[0].value;
    const max = onlyValues[onlyValues.length - 1].value;

    let formattedMinValue = min.toString();
    let formattedMaxValue = max.toString();
    const isAum = type === IndicatorOptionsType.aum;

    if (isAum) {
        formattedMinValue = formatAum(min);
        formattedMaxValue = formatAum(max);
    }

    const ret = <div style={{ margin: 0 }}>
        <span style={{ float: 'right' }}>&nbsp;&nbsp;&nbsp;{formattedMinValue}</span>
        {
            onlyValues.map((areaValues, idx) => {
                const col = areaValues.color;
                const lbl = <span key={idx} style={{ float: 'right', cursor: areaValues.value > 0 ? 'pointer' : undefined, backgroundColor: col }}>&nbsp;&nbsp;&nbsp;&nbsp;</span>;
                if (areaValues.value > 0) return <Popup
                    key={idx}
                    trigger={lbl}
                    wide='very'
                    content={`${getMapOptionTypeCaption(type, lang)}: ${isAum ? formatAum(areaValues.value) : areaValues.value}`}
                    header={areaValues.key}
                />
                return lbl;
            })
        }
        <span style={{ float: 'right' }}>{formattedMaxValue}&nbsp;&nbsp;&nbsp;</span>
    </div>
    return ret;
}