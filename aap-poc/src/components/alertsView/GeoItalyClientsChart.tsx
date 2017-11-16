import * as React from 'react';
import { render } from 'react-dom';
import { minBy } from 'lodash';
import { ClientFilters, SearchFilter } from '../../actions/model';
const { Chart } = require('react-google-charts');

type AreaType = 'North' | 'Center' | 'South'

type AreaValue = {
    [k in AreaType]: number;
}

function hasRegions(val: AreaValue | { Regions: SearchFilter }): val is { Regions: SearchFilter } {
    return ((val as { Regions: SearchFilter }).Regions !== undefined);

}
export interface GeoItalyClientsChartProps {
    width?: string | number;
    height?: string | number;
    values: AreaValue | { Regions: SearchFilter };
    captions?: {
        clients: string,
        north: string,
        center: string,
        south: string,
    }
}

export const GeoItalyClientsChart = (props: GeoItalyClientsChartProps) => {

    const fillChartProps = (props: GeoItalyClientsChartProps) => {
        let northValue = 0;
        let centerValue = 0;
        let southValue = 0;

        if (hasRegions(props.values)) {
            northValue = props.values.Regions['Nord'].current;
            centerValue = props.values.Regions['Centro'].current;
            southValue = props.values.Regions['Sud'].current;
        } else {
            northValue = props.values.North;
            centerValue = props.values.Center;
            southValue = props.values.South;
        }

        let max = southValue;
        if (centerValue > max) max = centerValue;
        if (northValue > max) max = northValue;

        const options = {
            sizeAxis: { minValue: 0, maxValue: max },
            region: 'IT',
            displayMode: 'markers',
            magnifyingGlass: { enable: true, zoomFactor: 7.5 },
            colorAxis: { colors: ['#fdfd66', '#4374e0'] }
        };

        const { clients = "Clients", north = "Nord", center = "Centro", south = "Sud" } = props.captions || {};
        const rows = [
            ['Lombardy', north, northValue],
            ['Lazio', center, centerValue],
            ['Sicily', south, southValue],
        ];

        const columns = [
            {
                'type': 'string',
                'label': 'Province'
            },
            {
                'type': 'string',
                'label': 'Caption'
            },
            {
                'type': 'number',
                'label': clients
            }
        ];
        let { width = '100%', height = '400px' } = props;
        if (typeof (width) === "number") width = `${width}px`;
        if (typeof (height) === "number") height = `${height}px`;

        return { columns, rows, width, height, options };
    }

    const chartProps = fillChartProps(props);

    return (
        <Chart
            chartType="GeoChart"
            graph_id="GeoItalyClientsChart"
            {...chartProps}
        />
    )
}