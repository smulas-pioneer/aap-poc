import { Client } from "../../_db/interfaces";
import * as React from "react";
import { getRegionsByClients } from "../../_db/utils";

const { PieChart, Pie, Legend, Cell } = require('recharts');

export const AgentGeoPie = ({ clients, width = 700, height = 300 }: { clients: Client[], width?: number, height?: number }) => {
    const data = getRegionsByClients(clients);
    const REGION_COLORS = ['#00C49F', '#0088FE', '#F58300', '#006400', '#604DD8'];
    // const RADIAN = Math.PI / 180;
    // const renderCustomizedLabel2 = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    //     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    //     const x = cx + radius * Math.cos(-midAngle * RADIAN);
    //     const y = cy + radius * Math.sin(-midAngle * RADIAN);

    //     return (
    //         <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
    //             {`${(percent * 100).toFixed(0)}%`}
    //         </text>
    //     );
    // };

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => `${(percent * 100).toFixed(0)}%`;

    return (
        <PieChart width={width} height={height}>
            <Legend />
            <Pie
                data={data}
                nameKey='region'
                dataKey='clients'
                cx='50$%'
                cy='50$%'
                labelLine
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"            >
                {
                    data.map((entry: any, index: any) => <Cell key={index} fill={REGION_COLORS[index % REGION_COLORS.length]} />)
                }
            </Pie>
        </PieChart>
    );
}