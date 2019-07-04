import * as React from 'react';
import { Breakdown } from '../../_db/interfaces';
import { CustomPieChart, CustomComposedChart } from '../chart/CustomCharts';

interface Props {
  uid: string;
  breakdown: Breakdown;
  chartView?: 'pie' | 'composed' | 'bar';
  onClick?: () => void;
  legend?: boolean;
  caption?: boolean;
  actions?: boolean;
  attributeName?: string;
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
    const { uid, breakdown, chartView, legend, caption, actions, attributeName } = this.props;

    if (!breakdown || !breakdown.data) {
      return <div />
    }

    const data = breakdown.data.map(curr => {
      const newweight = curr.weight * 100;
      return { key: curr.value, description: curr.value, weight: newweight > 100 ? 100 : newweight, fillColor: undefined }
    });

    return chartView === 'pie'
      ? <CustomPieChart uid={uid} attributeName={attributeName} data={data} dataKey='weight' nameKey="key" legend={legend} caption={caption} actions={actions} />
      : <CustomComposedChart uid={uid} attributeName={attributeName} data={data} dataKey='weight' nameKey="key" color={breakdown.color} legend={legend} caption={caption} actions={actions} />
  }
}
