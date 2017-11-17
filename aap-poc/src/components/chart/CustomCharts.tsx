import * as React from 'react';
import { getRndItem } from '../../_db/utils';
import { findIndex } from 'lodash';
const { ComposedChart, Legend, ResponsiveContainer, Sector, PieChart, Pie, Cell, Bar, XAxis, YAxis, CartesianGrid } = require('recharts');

const Colors = {
    ORANGE: "#F07D00",
    BLUE: "#004F9F",
    RED: "#E6325E",
    GRAY: "#3B7296",
    GREEN: "#39B2B6",
    VIOLET : "#ED00EE",
    GREENDARK : "#003F03",
    YELLOW: '#D5D300',
    PINK: '#DA98D2',
    ACQUA: 'aqua'
}


export interface CustomChartProps {
    data: any[],
    dataKey: string,
    nameKey: string,
    width: number,
    height: number,
    responsiveHeight?: number | string
}

export interface CustomPieProps extends CustomChartProps {
    filterKey?: string,
    data: Partial<{ fillColor?: string, fillColorOpacity?: string, isActive?: boolean }>[],
    onClick?: (props: { name: string, value: number, percent: number, filter: string, isActive: boolean, payload: any }) => void;
}

interface CustomChartState {
}


const CustomResponsiveContainer = (props: { height: any, children: any }) => {
    return (
        <ResponsiveContainer width="100%" height={props.height} >
            {props.children}
        </ResponsiveContainer >
    )
}

export class CustomPieChart extends React.Component<CustomPieProps, CustomChartState> {
    RADIAN = Math.PI / 180;

    constructor(props: any) {
        super(props);

        this.renderLabel = this.renderLabel.bind(this);
        this.renderShape = this.renderShape.bind(this);
        this.renderActiveShape = this.renderActiveShape.bind(this);
        this.onCellClick = this.onCellClick.bind(this);
    }

    onCellClick = (data: any) => {
        const filter = this.props.filterKey && data.payload.payload[this.props.filterKey];

        if (this.props.onClick && data && filter) {
            this.props.onClick({
                name: data.name,
                value: data.value,
                percent: data.percent,
                isActive: data.isActive,
                payload: data.payload.payload,
                filter
            });
        }
    }

    renderLabel = (props: any) => {
        //return this.renderActiveShape(props);
        return props.isActive ? this.renderActiveShape(props) : this.renderShape(props);
    }

    renderShape = (props: any) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, percent, paddingAngle, hasLabel } = props;
        if (hasLabel) {
            const percentLabel = (percent * 100).toFixed(0);
            if (percentLabel === '0') return null;

            const radiusX = innerRadius + (outerRadius - innerRadius) * 0.5;
            const radiusY = innerRadius + (outerRadius - innerRadius) * 0.6;
            const x = cx - paddingAngle + radiusX * Math.cos(-midAngle * this.RADIAN);
            const y = cy - paddingAngle + radiusY * Math.sin(-midAngle * this.RADIAN);

            return (
                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                    {`${percentLabel}%`}
                </text>
            );
        }
        return null;
    };

    renderActiveShape = (props: any) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, name, isActive } = props;
        const sin = Math.sin(-this.RADIAN * midAngle);
        const cos = Math.cos(-this.RADIAN * midAngle);

        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 10) * cos;
        const my = cy + (outerRadius + 10) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 15;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={isActive ? 'green' : fill} />
                {this.renderShape(props)}
            </g>
        );
    };

    render() {
        const colors = Object.keys(Colors).map(k => Colors[k]);
        const { width, height, responsiveHeight, onClick, filterKey, ...pieProps } = this.props;

        const allowFilter = filterKey !== undefined ? true : false;

        let legendPayload: any[] = []

        let cellPayload = this.props.data.map((entry: any, key: number) => {
            const name = entry[this.props.nameKey];

            const isActive = entry.isActive;
            const fill = entry.fillColor || (colors[key % colors.length])
            const fillOpacity = entry.fillColorOpacity || (allowFilter ? (isActive ? '1' : '0.4') : '1');

            if (name && entry[this.props.dataKey])  {
                legendPayload.push({ value: name, id: key, type: 'rect', color: fill });
            }

            const props = {
                key,
                fill,
                fillOpacity,
                isActive,
                stroke: 'black',
                hasLabel: name !== undefined
            }

            return <Cell {...props} style={{ cursor: allowFilter ? (name ? 'pointer' : 'not-allowed') : 'auto' }} />
        })

        return (
            <CustomResponsiveContainer height={responsiveHeight || height}>
                <PieChart width={width} height={height}>
                    <Legend layout="horizontal" verticalAlign="bottom" payload={legendPayload} />
                    <Pie {...pieProps} onClick={this.onCellClick} cx={'50%'} cy={'50%'} innerRadius={'20%'} outerRadius={'75%'} label={this.renderLabel} labelLine={false} >
                        {cellPayload}
                    </Pie>
                </ PieChart >
            </CustomResponsiveContainer>
        );
    }
}

export class CustomComposedChart extends React.Component<CustomChartProps, CustomChartState> {
    constructor(props: any) {
        super(props);
        this.renderCustomizedLabel = this.renderCustomizedLabel.bind(this);
    }

    renderCustomizedLabel = (props: any) => {
        const { x, y, width, height, value } = props;

        const percentLabel = (value).toFixed(0);
        if (percentLabel === '0') return null;

        const actualX = value < 0 ? x : width > 150 ? x + width - 50 : x + width + 3;
        const color = width > 150 ? 'white' : 'black';

        return <text className="recharts-text recharts-bar-label" fill={color} x={x} y={Math.round(y + 14)} width={width} height={height} fontSize={12} textAnchor={'start'}        >
            <tspan x={actualX} >
                {`${percentLabel}%`}
            </tspan>
        </text>
    }

    render() {
        const { data, width, height, responsiveHeight, dataKey, nameKey } = this.props;
        const color = getRndItem(Object.keys(Colors).map(k => Colors[k]));
        return (
            <CustomResponsiveContainer height={responsiveHeight || height}>
                <ComposedChart layout="vertical" height={height} width={width} data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }} >
                    <XAxis type="number" hide />
                    <YAxis dataKey={nameKey} type="category" width={width / 3} />
                    <CartesianGrid stroke='#f5f5f5' />
                    <Bar dataKey={dataKey} name={nameKey} barSize={20} fill={color} label={this.renderCustomizedLabel} />
                </ComposedChart>
            </CustomResponsiveContainer>
        );
    }
}

