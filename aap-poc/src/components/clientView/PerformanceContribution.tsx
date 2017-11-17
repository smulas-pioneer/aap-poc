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
    "red",
    "green",
    "yellow",
    "blue",
    "orange"
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
        /*
        const gData = groupBy(props.data, d => d.year)
        const data = Object.keys(gData).reduce((prev, curr) => {
            prev.push(
                gData[curr].reduce((p, c) => {
                    p[c.id] = c.perf;
                    return p;
                })
            );
            return prev;
        }, [] as any[]);
*/
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
        const model = this.props.data.filter(p => p.id == 'Model');
        const portfolio = this.props.data.filter(p => p.id == 'Portfolio');
        const data = this.props.data.filter(p => p.id !== 'Model' && p.id !== 'Portfolio');
        return <ResponsiveContainer width="100%" height={this.props.height || 400}>
            <BarChart width={this.props.width || 500} height={this.props.height || 400} data={data}>
                <XAxis dataKey="year" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                {
                    this.state.ids.map((d, i) => <Bar key={i} dataKey={d} stackId="a" fill={Colors[i]} />)
                }
            </BarChart>
        </ResponsiveContainer>
    }
}

