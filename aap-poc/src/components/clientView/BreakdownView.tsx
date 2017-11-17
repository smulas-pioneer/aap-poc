import * as React from 'react';
import { Breakdown } from '../../_db/interfaces';
import { Segment } from 'semantic-ui-react';
import { getRndItem } from '../../_db/utils';
import { CustomPieChart, CustomComposedChart } from '../chart/CustomCharts';

interface Props {
    breakdown: Breakdown,
    chartView?: 'pie' | 'composed'
    onClick?: () => void,
    width: number,
    height: number,
    responsiveHeight?: number | string
}
interface State {

}

const Colors = {
    ORANGE: "#F07D00",
    BLUE: "#004F9F",
    RED: "#E6325E",
    GRAY: "#3B7296",
    GREEN: "#39B2B6",
}

export const perc = (num: number) => (100 * num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export class BreakdownView extends React.Component<Props, State> {
    render() {
        const { breakdown, chartView, onClick, width, height, responsiveHeight } = this.props;

        if (!breakdown || !breakdown.data) {
            return <div />
        }

        const data = breakdown.data.map(curr => {
            return { key: curr.value, description: curr.value, weight: curr.weight * 100, fillColor: undefined }
        });

        return chartView === 'pie'
            ? <CustomPieChart data={data} dataKey='weight' nameKey="key" width={width} height={height} />
            : <CustomComposedChart data={data} dataKey='weight' nameKey="key" width={width} height={height} />
    }
}