import * as React from 'react';
import { LangDictionary } from '../../reducers/language/interfaces';
import { Segment } from 'semantic-ui-react';
import { groupBy, uniq } from 'lodash';
const { ScatterChart, XAxis, CartesianGrid, Legend, Scatter, Tooltip, YAxis, ResponsiveContainer, BarChart, Bar } = require('recharts');

const Colors = [
    "#F07D00",
    "#004F9F",
    "#E6325E",
    "#3B7296",
    "#39B2B6",
    "#ED00EE",
    "#003F03",
    '#D5D300',
    '#DA98D2',
    'aqua'
]

interface PerformanceContributionProps {
    data: any[];
    width?: number;
    height?: number;
    showLegend?: boolean
    lang: LangDictionary;
}

interface PerformanceContributionState {
    data: any[],
    ids: string[]
}

const perc = (num: number) => (num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export class PerformanceContributionGraph extends React.Component<PerformanceContributionProps, PerformanceContributionState> {

    constructor(props: PerformanceContributionProps) {
        super(props);

        let ids = {};
        this.props.data.forEach(d => {
            Object.keys(d).filter(k => k != 'year').forEach(i => {
                ids[i] = true;
            });
        });

        this.state = {
            data: this.props.data,
            ids: Object.keys(ids)
        };
    }

    render() {
        const data = this.props.data;
        return <ResponsiveContainer width="100%" height={this.props.height || 400}>
            <BarChart width={this.props.width || 500} height={this.props.height || 400} data={data}>
                <XAxis dataKey="year" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(d: number) => perc(d) + '%'} />
                <Legend />
                {
                    this.state.ids.map((d, i) => <Bar key={i} dataKey={d} stackId="a" fill={Colors[i]} />)
                }
            </BarChart>
        </ResponsiveContainer>
    }
}

