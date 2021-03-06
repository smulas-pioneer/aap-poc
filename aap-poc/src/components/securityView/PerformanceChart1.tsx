import * as React from 'react';
const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = require('recharts');

const Colors = {
    ACCENT: "#00B6ED",
    BLUE: "#004F9F",
    GRAY: "#3B7296",
    GRAY_60: "#447294",
    GREEN: "#39B2B6",
    GREEN_BL_50: "#226F71",
    RED: "#E6325E",
    ORANGE: "#F07D00",
    ORANGE_BL_50: "#C8361B",
    YELLOW: "#F07D00"//"#C1B000"// "#C19135",
}

const perc = (num: number) => (100 * num - 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface PerformanceChartProps {
    data: { date: string, perf: number }[];
    width?: number;
    height?: number;
    showLegend?: boolean
}

export const PerformanceChart = (props: PerformanceChartProps) => {
    return <LineChart width={props.width || 500} height={props.height || 200} data={props.data}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <XAxis dataKey="date" tickFormatter={() => ""} interval={10} />
        <YAxis tickFormatter={(d: number) => perc(d)} domain={['auto', 'auto']} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip formatter={(d: number) => perc(d) + '%'} />
        {props.showLegend && <Legend />}
        <Line type="monotone" dot={false} dataKey="perf"  strokeWidth={3}  stroke={Colors.RED} />
    </LineChart>
}