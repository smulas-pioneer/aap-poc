import * as React from 'react';
import { Breakdown } from '../../_db/interfaces';
import { CustomPieChart, CustomComposedChart } from '../chart/CustomCharts';

interface Props {
  breakdown: Breakdown,
  chartView?: 'pie' | 'composed' | 'bar'
  onClick?: () => void,
  width: number,
  height: number,
  responsiveHeight?: number | string
  legend?: boolean;
  caption?: boolean;
}
interface State {

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const { breakdown, chartView, width, height, responsiveHeight, legend, caption } = this.props;

    if (!breakdown || !breakdown.data) {
      return <div />
    }

    const data = breakdown.data.map(curr => {
      const newweight = curr.weight * 100;
      return { key: curr.value, description: curr.value, weight: newweight > 100 ? 100 : newweight, fillColor: undefined }
    });

    return chartView === 'pie'
      ? <CustomPieChart data={data} dataKey='weight' nameKey="key" width={width} height={height} responsiveHeight={responsiveHeight} legend={legend} caption={caption} />
      :  <CustomComposedChart data={data} dataKey='weight' nameKey="key" width={width} height={height} color={breakdown.color} responsiveHeight={responsiveHeight} legend={legend} caption={caption} />
      }
}
