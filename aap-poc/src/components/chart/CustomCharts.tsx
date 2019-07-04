/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { getRndItem } from '../../_db/utils';
import { ChartBaseProps } from './ChartInterface';
import { Input, Button, Modal, Dropdown } from 'semantic-ui-react';
import { round } from 'mathjs';
import { DynamicFilterOperation, DynamicSearchFilter } from '../../_db/interfaces';
import { appConnector } from 'app-support';
import { searchClient } from '../../actions';
import { getSearchParms } from '../../reducers';
import { unCamelCase } from '../../commonUtils';
const { ComposedChart, Legend, ResponsiveContainer, Sector, PieChart, Pie, Cell, Bar, XAxis, YAxis } = require('recharts');

const Colors = {
  ORANGE: "#F07D00",
  BLUE: "#004F9F",
  RED: "#E6325E",
  GRAY: "#3B7296",
  GREEN: "#39B2B6",
  VIOLET: "#ED00EE",
  GREENDARK: "#003F03",
  YELLOW: '#D5D300',
  PINK: '#DA98D2',
  ACQUA: 'aqua'
}

export interface CustomChartProps extends ChartBaseProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  color?: string;
  attributeName?: string;
}

export interface CustomPieProps extends CustomChartProps {
  filterKey?: string,
  data: Partial<{ fillColor?: string, fillColorOpacity?: string, isActive?: boolean }>[],
  onClick?: (props: { name: string, value: number, percent: number, filter: string, isActive: boolean, payload: any }) => void;
}

interface CustomChartState {
  selected?: any;
  modalManageValueOpen?: boolean;
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
    return props.isActive ? this.renderActiveShape(props) : this.renderShape(props);
  }

  renderShape = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, paddingAngle, hasLabel } = props;
    if (hasLabel) {
      const percentLabel = (percent * 100).toFixed(0);
      if (percentLabel === '0') return null;

      const radiusX = innerRadius + (outerRadius - innerRadius) * 0.4;
      const radiusY = innerRadius + (outerRadius - innerRadius) * 0.5;
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
    const { cx, cy, midAngle, outerRadius, startAngle, endAngle, fill, isActive } = props;
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
    const { onClick, filterKey, legend = true, caption = true, ...pieProps } = this.props;

    const allowFilter = filterKey !== undefined ? true : false;

    let legendPayload: any[] = []

    let cellPayload = this.props.data.map((entry: any, key: number) => {
      const name = entry[this.props.nameKey];

      const isActive = entry.isActive;
      const fill = entry.fillColor || (colors[key % colors.length])
      const fillOpacity = entry.fillColorOpacity || (allowFilter ? (isActive ? '1' : '0.4') : '1');

      if (name && entry[this.props.dataKey]) {
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
      <CustomResponsiveContainer height={'100%'}>
        <PieChart width={500} height={500}>
          {legend && <Legend layout="horizontal" verticalAlign="bottom" payload={legendPayload} />}
          <Pie {...pieProps} onClick={this.onCellClick} cx={'50%'} cy={'50%'} innerRadius={'60%'} outerRadius={'90%'} label={caption && this.renderLabel} labelLine={false} >
            {cellPayload}
          </Pie>
        </ PieChart >
      </CustomResponsiveContainer>
    );
  }
}

const conn = appConnector<CustomChartProps>()(
  (s, p) => ({
    parms: getSearchParms(s, 'dashboard')
  }),
  { searchClient }
)

class CustomComposedChartCompo extends conn.StatefulCompo<CustomChartState> {
  constructor(props: any) {
    super(props);
    this.renderCustomizedLabel = this.renderCustomizedLabel.bind(this);
    this.state = {
      selected: undefined,
      modalManageValueOpen: false
    };
  }

  renderCustomizedLabel = (props: any) => {
    const { x, y, width, height, value } = props;

    const percentLabel = (value).toFixed(0);
    if (percentLabel === '0') return null;

    const actualX = value < 0 ? x : width > 150 ? x + width - 50 : x + width + 3;
    const color = 'white';

    return <text className="recharts-text recharts-bar-label" fill={color} x={x} y={Math.round(y + 14)} width={width} height={height} textAnchor={'start'}        >
      <tspan x={actualX} >
        {`${percentLabel}%`}
      </tspan>
    </text>
  }

  handleOnChange = (sender: any, operation: DynamicFilterOperation, value?: number) => {
    const previuosFilters = (this.props.parms && this.props.parms.dynamicFilters) || [];
    const newFilter: DynamicSearchFilter = {
      context: sender.attributeName,
      key: sender.attributeValue,
      operation,
      value
    }
    const newParms: any = { ...this.props.parms, dynamicFilters: [...previuosFilters, newFilter] };
    this.props.searchClient(newParms);
  }

  render() {
    const { data, dataKey, nameKey, attributeName } = this.props;
    const { legend = true, caption = true, actions = true } = this.props;

    const color = this.props.color || getRndItem(Object.keys(Colors).map(k => Colors[k]));
    const barActionableProps = actions && {
      cursor: "pointer",
      onClick: (data: any) => {
        this.setState(p => ({ selected: data, modalManageValueOpen: true }))
      }
    } || {};

    const ManageValueTooltip = ({ active = false, payload = [{ value: 0 }], label = undefined }) => {
      if (active) {
        return (
          <div className="custom-tooltip">
            <p className="label">{`${label} : ${payload[0].value}`}</p>
            <p className="desc">Anything you want can be displayed here.</p>
          </div>
        );
      }
      return null;
    };

    return (
      <>
        <CustomResponsiveContainer height={'100%'}>
          <ComposedChart layout="vertical" height={500} width={500} data={data}  >
            <XAxis type="number" hide={!caption} tick={false} height={1} />
            <YAxis dataKey={nameKey} type="category" width={70} hide={!caption} />
            <Bar {...barActionableProps} dataKey={dataKey} name={nameKey} barSize={18} fill={color} label={caption && this.renderCustomizedLabel} />
          </ComposedChart>
        </CustomResponsiveContainer>
        {actions && this.state.selected && <Modal size='small' open={this.state.modalManageValueOpen} onClose={() => this.setState(p => ({ modalManageValueOpen: false }))}>
          <Modal.Header>{unCamelCase(attributeName)} - Add dynamic filter</Modal.Header>
          <Modal.Content><CustomComposedChartValueChange onChange={this.handleOnChange} attributeName={attributeName} attributeValue={this.state.selected.payload.key} /></Modal.Content>
        </Modal>}
      </>
    );
  }
}

export const CustomComposedChart = conn.connect(CustomComposedChartCompo);

const CustomComposedChartValueChange = (props: any) => {
  const [value, setValue] = React.useState(0);
  const [textValue, setTextValue] = React.useState("0");
  const [operation, setOperation] = React.useState(DynamicFilterOperation.GraterEqualThan);
  const [error, setError] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (isNaN(textValue as any)) {
      setError(`not a valid number`);
    }
    else {
      const newValue = parseFloat(textValue);
      if (newValue !== value) {
        setValue(parseFloat(textValue));
        setError(undefined);
      }
    }
  }, [textValue, value]);

  const handleSliderChange = (value: string) => {
    if (!isNaN(value as any)) {
      const numValue = round(parseFloat(value));
      setTextValue(numValue.toString());
    }
  }

  const sendChange = (operation?: DynamicFilterOperation, value?: number) => {
    props.onChange(
      props,
      operation,
      ((value || 0) / 100)
    );
  }

  const reset = () => {
    setTextValue("0");
    sendChange();
  }

  const operations = [
    {
      key: DynamicFilterOperation.GraterEqualThan,
      text: "greater equal than",
      value: DynamicFilterOperation.GraterEqualThan
    },
    {
      key: DynamicFilterOperation.GreaterThan,
      text: "greater than",
      value: DynamicFilterOperation.GreaterThan
    },
    {
      key: DynamicFilterOperation.LesserEqualThan,
      text: "less equal than",
      value: DynamicFilterOperation.LesserEqualThan
    },
    {
      key: DynamicFilterOperation.LesserThan,
      text: "less than",
      value: DynamicFilterOperation.LesserThan
    },
  ]

  return <div style={{ display: 'flex', flexDirection: 'row', padding: 20 }}>

    <div style={{ flex: 3 }}>
      <h3>{props.attributeValue}</h3>
    </div>

    <div style={{ flex: 3 }}>
      <h3>
        <Dropdown
          inline
          options={operations}
          value={operation}
          onChange={(a, b) => setOperation(b.value as any)}
        />
      </h3>
    </div>

    <div style={{ flex: 2 }}>
      <Input type="range" min={0} max={100} value={value} onChange={(a, b) => handleSliderChange(b.value)} />
    </div>

    <div style={{ flex: 1 }}>
      <Input size="small" inverted fluid value={textValue || ""} onChange={(a, b) => setTextValue(b.value)} >
        <input style={{ color: value > 0 ? 'lightgreen' : 'red' }} />
      </Input>
    </div>

    <div style={{ flex: 1, display: 'flex' }}>
      <Button inverted size="small" negative icon="cancel" onClick={() => reset()} />
      <Button inverted size="small" positive icon="check" onClick={() => sendChange(operation, value)} />
    </div>
  </div>
};

