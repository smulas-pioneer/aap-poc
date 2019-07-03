import * as React from 'react';
import { Menu, Button, Input, Grid, Dropdown, Progress, Icon } from 'semantic-ui-react';
import { calculateProjection } from '../../_db/coreEngine';
import { LangDictionary } from '../../reducers/language/interfaces';
import moment from 'moment';
import { TimeHorizon, TimeHorizonMonths, PerformancePeriod } from '../../_db/interfaces';
import { ChartBaseProps } from './ChartInterface';
const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = require('recharts');

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

const perc = (num: number) => (100 * num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface PerformanceChartProps extends ChartBaseProps {
  data: { date: string, perf: number }[];
  actualData?: { date: string, perf: number }[];
  lang: LangDictionary;
  advancedView?: boolean;
  clientTimeHorizon?: TimeHorizon;
  version: number;
  onCalculate95TargetRetForClientTimeHorizon?: (value: number) => void;
}

interface PerformanceChartState {
  data: { date: string, perf?: number, projection?: number, l0?: number, l1?: number }[];
  period: '1M' | '3M' | '6M' | 'YTD' | '1Y' | 'All',
  target_Return: string;
  timeHorizon: TimeHorizon
  probability: number;
  initalPerf: number;
}
export class PerformanceChart extends React.Component<PerformanceChartProps, PerformanceChartState> {

  getProbabilityByTimeHorizon = (th: TimeHorizon, targetReturn: number) => {
    return 1;
  }
  returnFor95 = (th: TimeHorizon) => {
    return 1;
  }

  constructor(props: PerformanceChartProps) {
    super(props)
    /*
            const reg = regression(props.advancedView || false, TimeHorizonMonths[props.clientTimeHorizon || '18 Months'],
                this.props.data, this.props.actualData || this.props.data
            );

            this.getProbabilityByTimeHorizon = reg.getProbabilityByTimeHorizon;

            this.returnFor95 = reg.returnFor95;

            const targetReturn = this.returnFor95(props.clientTimeHorizon || '18 Months');
    */

    this.state = {
      data: [],
      period: 'YTD',
      target_Return: '',
      timeHorizon: props.clientTimeHorizon || '18 Months',
      probability: 95,
      initalPerf: 0
    }

    //  this.props.onCalculate95TargetRetForClientTimeHorizon && this.props.onCalculate95TargetRetForClientTimeHorizon(targetReturn);
  }

  componentDidMount() {
    this.setData({ showProjection: true, period: this.state.period, data: this.props.data, actualData: this.props.actualData || this.props.data })
  }

  componentWillReceiveProps(next: PerformanceChartProps) {
    if (next.data && next.data[next.data.length - 1].perf !== this.state.data[this.state.data.length - 1].perf) {
      this.setData({ data: next.data })
    }
    if (next.version !== this.props.version) {
      const targetReturn = this.returnFor95(next.clientTimeHorizon || '18 Months');
      this.setState({
        target_Return: targetReturn.toString(),
        probability: 95,
      }, () => {
        this.props.onCalculate95TargetRetForClientTimeHorizon && this.props.onCalculate95TargetRetForClientTimeHorizon(targetReturn);
      });
    }
  }

  setData = (args: { showProjection?: boolean, period?: PerformancePeriod, data?: { date: string, perf: number }[], actualData?: { date: string, perf: number }[] }) => {
    const { data = this.props.data, period = this.state.period, actualData = this.props.actualData || this.props.data } = args

    const maxDate = moment(data[data.length - 1].date);
    const minDate = period === '1M' ? maxDate.subtract(1, 'month') :
      period === '3M' ? maxDate.subtract(3, 'month') :
        period === '6M' ? maxDate.subtract(6, 'month') :
          period === '1Y' ? maxDate.subtract(1, 'year') :
            period === 'YTD' ? moment([maxDate.year(), 0, 1]) : moment(data[0].date);
    const minDateStr = minDate.format('YYYY-MM-DD');
    const filteredActuals = actualData.filter(p => p.date >= minDateStr);

    const regr = regression(
      this.props.advancedView || false,
      TimeHorizonMonths[this.state.timeHorizon || '18 Months'],
      data.filter(p => p.date >= minDateStr),
      filteredActuals
    );

    this.getProbabilityByTimeHorizon = regr.getProbabilityByTimeHorizon;
    this.returnFor95 = regr.returnFor95;
    this.setState({
      data: regr.data,
      period: period,
      initalPerf: filteredActuals[0].perf!,
      target_Return: this.returnFor95(this.state.timeHorizon).toString()
    });
  }

  handleChangeTimeHorizon = (th: TimeHorizon) => {
    this.setState({
      timeHorizon: th,
    }, () => {
      this.setData({});
      this.setState({
        probability: this.getProbabilityByTimeHorizon(this.state.timeHorizon, parseFloat(this.state.target_Return))
      })

    });
  }

  handleChangeTargetReturn = (value: string) => {
    const n = parseFloat(value);

    this.setState({
      target_Return: value,
      probability: this.getProbabilityByTimeHorizon(this.state.timeHorizon, n)
    });
  }
  render() {
    const { lang, actualData } = this.props;
    const { legend = true, caption = true, actions = true } = this.props;

    const { data, period, initalPerf } = this.state;
    const fmt = new Intl.NumberFormat(lang.NUMBER_FORMAT, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    if (data.length === 0) return null;

    // OPTIONALS
    const displayedData = data.filter((d, i) => d.date < "2018-03");

    const perf = actualData && fmt.format(100 * (actualData[actualData.length - 1].perf! - initalPerf));
    const primary = actualData && actualData[actualData.length - 1].perf! > 0;
    const minDate = data && moment(data[0].date).format(lang.DATE_FORMAT);
    const maxDate = displayedData && moment(displayedData[displayedData.length - 1].date).format(lang.DATE_FORMAT);

    return <div style={{ height: '100%' }}>
      {actions && <Menu compact borderless fluid>
        <Menu.Menu>
          <Menu.Item>
            <Input style={{}} type='number' label="Target Return (%)" size="mini" value={this.state.target_Return} onChange={(a, b) => this.handleChangeTargetReturn(b.value)} />
          </Menu.Item>
          <Menu.Item>
            <Dropdown text={`${lang.TIME_HORIZON}: ${this.state.timeHorizon}`} pointing='left' className='link item'>
              <Dropdown.Menu>
                {Object.keys(TimeHorizonMonths).map((th, iTh) => {
                  return <Dropdown.Item key={iTh} onClick={() => this.handleChangeTimeHorizon(th as TimeHorizon)} >{th}</Dropdown.Item>
                })}
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu position="right">
          <Menu.Item position="right">
            Probability: &nbsp;&nbsp;<Progress style={{ width: 100, margin: 0 }} color={this.state.probability >= 95 ? 'green' : this.state.probability > 60 ? 'orange' : 'red'} percent={this.state.probability} progress />
          </Menu.Item>
        </Menu.Menu>
      </Menu>}
      <ResponsiveContainer width="100%" height={actions ? '80%' : '100%'}>
        <LineChart width={500} height={700} data={displayedData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <XAxis dataKey="date" tickFormatter={() => ""} interval={10} hide={!caption} />
          <YAxis tickFormatter={(d: number) => perc(d)} domain={['auto', 'auto']} hide={!caption} />
          <CartesianGrid strokeDasharray="3 3" />
          {actions && <Tooltip formatter={(d: number) => perc(d) + '%'} />}
          <Line type="monotone" dot={false} dataKey="perf" strokeWidth={3} stroke={Colors.RED} />
          <Line type="monotone" dot={false} dataKey="projection" strokeWidth={2} stroke={Colors.BLUE} />
          <Line type="monotone" dot={false} dataKey="min" strokeWidth={1} stroke={Colors.YELLOW} />
          <Line type="monotone" dot={false} dataKey="max" strokeWidth={1} stroke={Colors.YELLOW} />
        </LineChart >
      </ResponsiveContainer>
      {actions &&
        <Grid size="mini">
          <Grid.Row columns="1" >
            <Grid.Column textAlign="center">
              <Button.Group compact size="tiny">
                <Button active={period === '1M'} size="tiny" content="1m" onClick={() => this.setData({ period: '1M' })} />
                <Button active={period === '3M'} size="tiny" content="3m" onClick={() => this.setData({ period: '3M' })} />
                <Button active={period === '6M'} size="tiny" content="6m" onClick={() => this.setData({ period: '6M' })} />
                <Button active={period === 'YTD'} size="tiny" content="YTD" onClick={() => this.setData({ period: 'YTD' })} />
                <Button active={period === '1Y'} size="tiny" content="1Y" onClick={() => this.setData({ period: '1Y' })} />
                <Button active={period === 'All'} size="tiny" content="All" onClick={() => this.setData({ period: 'All' })} />
              </Button.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>}
    </div>
  }
}

const regression = (show: boolean, days: number, data: { date: string, perf: number }[], actualData: { date: string, perf: number }[]) => {
  const d = data[0].perf;
  const newData = data.map(p => ({ ...p, perf: p.perf - d }));

  if (!show) {
    return {
      data: newData,
      getProbabilityByTimeHorizon: (th: TimeHorizon) => 1,
      returnFor95: (th: TimeHorizon) => 1
    }
  };

  const ad = actualData[0].perf;
  const oldData = actualData.map(p => ({ ...p, perf: p.perf - ad }));
  const ret = calculateProjection(newData, days, oldData[oldData.length - 1].perf);

  return {
    data: [...oldData.slice(0, oldData.length - 1), ...ret.data],
    getProbabilityByTimeHorizon: ret.getProbabilityByTimeHorizon,
    returnFor95: ret.returnFor95
  };
}
