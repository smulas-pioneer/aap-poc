import * as React from 'react';
import { LangDictionary } from '../../reducers/language/interfaces';
import { Segment, Button } from 'semantic-ui-react';
import { ChartBaseProps } from './ChartInterface';
const { ScatterChart, Dot, XAxis, CartesianGrid, Legend, Scatter, Tooltip, YAxis, ResponsiveContainer } = require('recharts');

const Colors = {
    ORANGE: "#F07D00",
    BLUE: "#004F9F",
    RED: "#E6325E",
    GRAY: "#3B7296",
    GREEN: "#39B2B6",
}

interface RiskReturnChartProps extends ChartBaseProps {
    data: { id: string, perf: number, devSt: number }[];
    lang: LangDictionary;
}

interface RiskReturnChartState {
    scatterShapeCustom: boolean;
}

const perc = (num: number) => (num).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export class RiskReturnGraph extends React.Component<RiskReturnChartProps, RiskReturnChartState> {
    state = { scatterShapeCustom: false };

    render() {
        const { scatterShapeCustom } = this.state;
        const { legend = true, caption = true, actions = true } = this.props;

        const model = this.props.data.filter(p => p.id === 'Model');
        const portfolio = this.props.data.filter(p => p.id === 'Portfolio');
        const data = this.props.data.filter(p => p.id !== 'Model' && p.id !== 'Portfolio');

        return <div style={{ height: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart width={500} height={500}>
                    <XAxis type="number" tickFormatter={(d: number) => perc(d)} unit="%" dataKey={'perf'} name='perf' range={['auto', 'auto']} hide={!caption} />
                    <YAxis type="number" tickFormatter={(d: number) => perc(d)} unit="%" dataKey={'devSt'} name='devSt' range={['auto', 'auto']} hide={!caption} />
                    <CartesianGrid />
                    {actions && <Tooltip cursor={{ strokeDasharray: '3 3' }} content={renderTooltip} />}
                    {legend && <Legend />}
                    <Scatter name='Constituents' data={data} fill={Colors.GRAY} shape={renderScatter('circle', scatterShapeCustom)} />
                    <Scatter name='Portfolio' data={portfolio} fill={Colors.ORANGE} shape={renderScatter('circle', scatterShapeCustom, 11)} />
                    <Scatter name='Model' data={model} fill={Colors.GREEN} shape={renderScatter('circle', scatterShapeCustom, 8)} />
                </ScatterChart>
            </ResponsiveContainer>
            {actions && <Button icon='grid layout' onClick={() => this.setState({ scatterShapeCustom: !scatterShapeCustom })} color='yellow' circular style={{ position: 'absolute', top: '10px', zOrder: 9999, right: '10px' }} />}
        </div>
    }
}

const renderScatter = (shapeform: string, viewText: boolean, radius?: number) => (props: any) => {
    const { cx, cy, fill, payload: { id } } = props;
    if (id) {
        return (
            <g>
                <Dot cx={cx} cy={cy} r={radius || 7} fill={fill} />
                {viewText &&
                    <g transform={`translate(${cx},${cy})`} >
                        <text x={10} y={0} dy={4} textAnchor="left">{`${id}`}</text>
                    </g>
                }
            </g>
        );
    }
    return null;
}

const renderTooltip = (props: any) => {
    if (props.payload.length > 0) {
        const { perf, devSt, id } = props.payload[0].payload;
        return <Segment>
            {id} <br />
            {`Perf: ${perc(perf)}%`}<br />
            {`DevSt: ${perc(devSt)}%`}
        </Segment>
    }
    return null;
}
