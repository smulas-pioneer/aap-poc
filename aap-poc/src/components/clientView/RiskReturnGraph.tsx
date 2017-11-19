import * as React from 'react';
import { LangDictionary } from '../../reducers/language/interfaces';
import { Segment } from 'semantic-ui-react';
const { ScatterChart, XAxis, CartesianGrid, Legend,Scatter, Tooltip, YAxis, ResponsiveContainer } = require('recharts');

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
}

const perc = (num: number) => (num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export class RiskReturnGraph extends React.Component<RiskReturnChartProps, RiskReturnChartState> {

    render() {
        const model = this.props.data.filter(p=>p.id=='Model');
        const portfolio = this.props.data.filter(p=>p.id=='Portfolio');
        const data = this.props.data.filter(p=>p.id !== 'Model'  && p.id !== 'Portfolio');

return <ResponsiveContainer width="100%" height={this.props.height || 400}>
            <ScatterChart width={this.props.width || 500} height={this.props.height || 400}>
                <XAxis type="number" tickFormatter={(d: number) => perc(d)} unit="%" dataKey={'perf'} name='perf' range={['auto','auto']} />
                <YAxis type="number" tickFormatter={(d: number) => perc(d)} unit="%" dataKey={'devSt'} name='devSt'  range={['auto','auto']}  />
                <CartesianGrid />
                <Legend/>
                <Scatter name='Constituents' data={data} fill={Colors.GRAY} shape="circle" size={200}  />
                <Scatter name='Portfolio' data={portfolio} fill={Colors.ORANGE} shape="cross" />
                <Scatter name='Model' data={model} fill={Colors.GREEN} shape="circle" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={renderTooltip}/>
            </ScatterChart>
        </ResponsiveContainer>
    }
}

const renderScatter = (props: any) => {
    return <span>A</span>

}

const renderTooltip = (props: any) => {
    if ( props.payload.length > 0) {
        const {perf, devSt, id} = props.payload[0].payload;
        return <Segment>
            {id} <br/>
            {`Perf: ${perc(perf)}%`}<br/>
            {`DevSt: ${perc(devSt)}%`}
        </Segment>
    }
    return null;
} 
