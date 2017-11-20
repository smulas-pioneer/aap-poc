import * as React from 'react';
import { LangDictionary } from '../../reducers/language/interfaces';
import { Segment, Button } from 'semantic-ui-react';
const { ScatterChart, Dot, Cross, XAxis, CartesianGrid, Legend, Scatter, Tooltip, YAxis, ResponsiveContainer } = require('recharts');

const Colors = {
    ORANGE: "#F07D00",
    BLUE: "#004F9F",
    RED: "#E6325E",
    GRAY: "#3B7296",
    GREEN: "#39B2B6",
}

interface RiskReturnChartProps {
    data: { id: string, perf: number, devSt: number }[];
    width?: number;
    height?: number;
    showLegend?: boolean
    lang: LangDictionary;
}

interface RiskReturnChartState {
    scatterShapeCustom: boolean;
}

const perc = (num: number) => (num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export class RiskReturnGraph extends React.Component<RiskReturnChartProps, RiskReturnChartState> {
    state = { scatterShapeCustom: false };

    render() {
        const { scatterShapeCustom } = this.state;

        const model = this.props.data.filter(p => p.id == 'Model');
        const portfolio = this.props.data.filter(p => p.id == 'Portfolio');
        const data = this.props.data.filter(p => p.id !== 'Model' && p.id !== 'Portfolio');

        return <div>
            <ResponsiveContainer width="100%" height={this.props.height || 400}>
                <ScatterChart width={this.props.width || 500} height={this.props.height || 400}>
                    <XAxis type="number" tickFormatter={(d: number) => perc(d)} unit="%" dataKey={'perf'} name='perf' range={['auto', 'auto']} />
                    <YAxis type="number" tickFormatter={(d: number) => perc(d)} unit="%" dataKey={'devSt'} name='devSt' range={['auto', 'auto']} />
                    <CartesianGrid />
                    <Legend />
                    <Scatter name='Constituents' data={data} fill={Colors.GRAY} shape={renderScatter('circle', scatterShapeCustom)} />
                    <Scatter name='Portfolio' data={portfolio} fill={Colors.ORANGE} shape={renderScatter('circle', scatterShapeCustom)} />
                    <Scatter name='Model' data={model} fill={Colors.GREEN} shape={renderScatter('circle', scatterShapeCustom) } />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={renderTooltip} />
                </ScatterChart>
            </ResponsiveContainer>
            <Button icon='grid layout' onClick={() => this.setState({ scatterShapeCustom: !scatterShapeCustom })} color='yellow' circular style={{ position: 'absolute', bottom: '5px', zOrder: 9999, right: '25px' }} />
        </div>
    }
}

const renderScatter = (shapeform: string, viewText: boolean) => (props: any) => {
    const { cx, cy, fill, payload: { perf, devSt, id } } = props;
    if (id) {
        return (
            <g>
                <Dot cx={cx} cy={cy} r={7} fill={fill} />
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
