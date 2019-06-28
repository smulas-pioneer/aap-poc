import * as React from 'react';
import { LangDictionary } from '../../reducers/language/interfaces';
import { AlertHistory2 } from '../../_db/interfaces';
const { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } = require('recharts');

const Colors = {
  ACCENT: "#00B6ED",
  BLUE: "#004F9F",
  GRAY: "#3B7296",
  BLACK: "#000000",
  GRAY_60: "#447294",
  GREEN: "#39B2B6",
  GREEN_BL_50: "#226F71",
  RED: "#E6325E",
  ORANGE: "#F07D00",
  ORANGE_BL_50: "#C8361B",
  YELLOW: "#F07D00"//"#C1B000"// "#C19135",
}

//const perc = (num: number) => (100 * num - 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface AlertsChartProps {
  data: AlertHistory2[];
  width?: number;
  height?: number;
  showLegend?: boolean

  lang: LangDictionary;
}

interface AlertsChartState {
}
export class AlertsChart extends React.Component<AlertsChartProps, AlertsChartState> {

  constructor(props: AlertsChartProps) {
    super(props)
    this.state = {
      data: props.data,
      showProjection: false
    }
  }

  render() {

    const { width, height, showLegend, data } = this.props;

    return <div>
      <ResponsiveContainer width={'100%'} height={height}>
        <ComposedChart width={width || 500} height={height} data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <XAxis dataKey="date" tickFormatter={() => ""} interval={10} />
          <YAxis yAxisId="left" orientation="left" tickFormatter={(d: number) => d} domain={[0, 'auto']} />
          <YAxis yAxisId="right" orientation="right" tickFormatter={(d: number) => d} domain={[0, 'auto']} />
          <CartesianGrid strokeDasharray="3 3" />
          {showLegend && <Legend />}
          <Tooltip />
          <Area yAxisId="right" type="monotone" stackId="1" dot={false} dataKey="nonBreaked" strokeWidth={1} stroke={Colors.ACCENT} fill={Colors.ACCENT} />
          <Area yAxisId="right" type="monotone" stackId="1" dot={false} dataKey="breaked" strokeWidth={1} stroke={Colors.YELLOW} fill={Colors.YELLOW} />
          <Line yAxisId="left" type="monotone" dot={false} dataKey="mifidBreaked" strokeWidth={3} stroke={Colors.RED} />
          <Line yAxisId="left" type="monotone" dot={false} dataKey="nonMifidBreaked" strokeWidth={2} stroke={Colors.BLACK} />
        </ComposedChart >
      </ResponsiveContainer>

    </div>
  }
}
