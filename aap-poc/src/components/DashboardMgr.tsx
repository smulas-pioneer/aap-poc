import * as React from 'react';
import { SearchParms, Client } from '../_db/interfaces';
import { appConnector } from 'app-support';
import { searchClient } from '../actions/index';
import { getSearchResult, getSearchFilter, getLanguage, getConfigLayout, getIsCountryActive, getIsRegionActive } from '../reducers/index';
import { SemanticICONS, Statistic, Grid, Segment, SemanticCOLORS, Icon, Menu, Tab } from 'semantic-ui-react';
import { filterMapItems, FilterMap, FilterMapTypes } from '../actions/model';
import { TopClient } from './topClientView/index';
import { CustomPieChart } from './chart/CustomCharts';
import { AdvancedGrid } from './shared/GridOverflow';
import { ManagerView } from './managerView/managerView';
import { AlertsView } from './alertsView/AlertsView';
import { formatAua, formatNumber, getColorCustomClassName } from '../_db/utils';
import { ClientFilter } from './shared/ClientFilter';
import { WidgetTitle } from './shared/WidgetTitle';
import { BreakdownView } from './clientView/BreakdownView';
import { ClientsView } from './clientsView/ClientsView';
import { SliderGraph, SliderGraphThumb } from './chart/SliderGraph';
import { EuropaMap } from './maps/europe/EuropeMap';
import { getIsOnlyItaly } from '../reducers';


const sprintf = require("sprintf-js").sprintf;

export interface DashboardMgrProps {
  uid: string,
  commonMenu?: React.ReactChildren;

}
export interface DashboardMgrState {
  searchParms: SearchParms,
  graphMode: number
}

const conn = appConnector<DashboardMgrProps>()(
  (s, p) => ({
    data: getSearchResult(s, p.uid),
    filter: getSearchFilter(s, p.uid),
    lang: getLanguage(s),
    layout: getConfigLayout(s),
    isOnlyItaly: getIsOnlyItaly(s, p.uid),
    isCountryActive: getIsCountryActive(s, p.uid),
    isRegionActive: getIsRegionActive(s, p.uid)
  }),
  { searchClient }
)

class DashboardMgrCompo extends conn.StatefulCompo<DashboardMgrState> {
  constructor(props: any) {
    super(props);
    this.state = {
      searchParms: this.props.data && this.props.data.parms ? this.props.data.parms : { filter: '', uid: '' }
      , graphMode: 0
    };

    this.search = this.search.bind(this);
    this.searchAdvanced = this.searchAdvanced.bind(this);
    this.searchAdvancedByGraph = this.searchAdvancedByGraph.bind(this);
    this.handleOnChangeFilter = this.handleOnChangeFilter.bind(this);
    this.setSlider = this.setSlider.bind(this);
  }

  componentDidMount() {
    if (!this.props.data) {
      this.props.searchClient({ uid: this.props.uid, filter: '' });
    }
  }

  componentWillReceiveProps(next: any) {
    this.setState({
      searchParms: next.data && (next.data.parms || { filter: '', uid: '' })
    });
  }

  /* search*/
  search = () => {
    this.props.searchClient({ ...this.state.searchParms, uid: this.props.uid });
  }
  searchAdvanced = (prop: string, value: string, remove?: boolean) => {
    if (prop) {
      let propFilterValues: any[] = this.state.searchParms[prop] || [];

      if (remove) {
        propFilterValues = propFilterValues.filter(d => d !== value);
      } else {
        propFilterValues.push(value);
      }

      this.handleOnChangeFilter({ ...this.state.searchParms, [prop]: propFilterValues });
    }
  }
  searchAdvancedByGraph = (prop: string, data: { name: string, value: number, filter: string, percent: number, payload: any, isActive: boolean }) => {
    this.searchAdvanced(prop, data.filter, data.isActive);
  }
  handleOnChangeFilter = (searchParms: SearchParms) => {
    if (searchParms.countries && searchParms.countries.length === 1 && searchParms.countries[0] === 'Italy') { }
    else {
      searchParms[filterMapItems.Regions.searchprop] = undefined;
      searchParms[filterMapItems.Branch.searchprop] = undefined;
      searchParms[filterMapItems.Agents.searchprop] = undefined;
    }

    this.setState({ searchParms }, this.search);
  }

  // render statistic
  renderItem(value: any, label?: string, sublabel?: any, color?: SemanticCOLORS, sublabelcolor?: SemanticCOLORS, valueIcon?: SemanticICONS) {
    return (<Statistic size="mini" color={color || 'blue'} >
      {label && <Statistic.Label>{label}</Statistic.Label>}
      <Statistic.Value style={{ marginTop: '4px', whiteSpace: 'nowrap' }}>
        {valueIcon && <Icon name={valueIcon} color={color} />}
        {value}
      </Statistic.Value>
      {sublabel && <Statistic.Label style={{ marginTop: '10px', whiteSpace: 'nowrap' }} className={getColorCustomClassName(sublabelcolor)}>
        {sublabel}
        {/*<span style={{ color: color ? (color === 'green' ? '#2ecc40' : color) : undefined, whiteSpace: 'nowrap' }}>{sublabel}</span>*/}
      </Statistic.Label>}
    </Statistic>);
  }

  setSlider() {
    this.setState({ graphMode: this.state.graphMode === 2 ? 0 : this.state.graphMode + 1 })
  }
  // render filter
  renderFilterGraphics(data: Client[]) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { lang, layout, filter = { Aua: {} }, isOnlyItaly, isCountryActive, isRegionActive } = this.props;
    const { graphMode } = this.state;

    return <div className='tab-dashboard ui-flex ui-flex-col'>
      <div className='ui-flex ui-flex-row' style={{}}>
        <Segment>
          <EuropaMap
            transform="scale(1.8) translate(-100, -250)"
            lang={lang}
            clients={data}
            layout={layout}
            height={600}
            isOnlyItaly={isOnlyItaly}
            filterMap={filterMapItems.Countries}
            onFilterChange={(map, val) => {
              switch (map.prop) {
                case filterMapItems.Countries.prop: {
                  this.searchAdvanced(map.searchprop, val, isCountryActive(val));
                  break;
                }
                case filterMapItems.Regions.prop: {
                  this.searchAdvanced(map.searchprop, val, isRegionActive(val));
                  break;
                }
              }
            }}
          />
        </Segment>
        <div>
          {graphMode === 0
            ? <Segment>
              <SliderGraphThumb graphs={this.createGraphs()} height={600} lang={lang} defaultIndex={0} slidesToShow={3} />
            </Segment>
            : this.state.graphMode === 1
              ? <Segment>
                <SliderGraph graphs={this.createGraphs()} height={600} lang={lang} defaultIndex={0} slidesToShow={1} bordered={false} />
              </Segment>
              : <div className='ui-flex ui-flex-col'>
                <Segment>
                  <SliderGraph graphs={this.createGraphs()} height={280} lang={lang} defaultIndex={0} slidesToShow={2} />
                </Segment>
                <Segment>
                  <SliderGraph graphs={this.createGraphs()} height={280} lang={lang} defaultIndex={1} slidesToShow={2} />
                </Segment>
              </div>
          }
        </div>
      </div>
      <Segment>
        <TopClient clients={data} lang={lang} />
      </Segment>
    </div >
  }

  Colors = ["#F07D00", "#004F9F", "#E6325E", "#3B7296", "#39B2B6", "#c8c802", "#bd00bf"]

  renderFilterGraphItem(key: number, map: FilterMap, values: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { searchprop, render: { header, label } } = map;

    let valuesSizeGraph: any[] = Object.keys(values).reduce(
      (memo, r, index) => {
        const filter = values[r];
        const color = this.Colors[index % this.Colors.length];

        const residual = filter.current ? filter.init - filter.current : 0;
        const value = residual ? filter.current : filter.init;

        memo.push({
          name: label ? label(r) : r,
          value: value,
          filter: r,
          isActive: filter.isInUse,
          fillColor: color,
          fillColorOpacity: filter.current ? '1' : '0.4'
        })

        if (residual) {
          memo.push({
            name: undefined,
            value: residual,
            isActive: filter.isInUse,
            fillColor: color,
            fillColorOpacity: '0.4'
          });
        }

        return memo;
      }, [] as any);

    return (<CustomPieChart key='pieFilter' width={50} height={50} responsiveHeight="100%" data={valuesSizeGraph} nameKey="name" dataKey="value" filterKey="filter" onClick={(d) => this.searchAdvancedByGraph(searchprop, d)} />);
  }

  // lang
  alertsDetail = (numOfAlerts: string) => sprintf(this.props.lang.DB_ALERTS_DETAIL, numOfAlerts);
  percDetail = (value: number | undefined, from: string, period: 'Y' | 'M' | 'D', info?: string) => sprintf(this.props.lang.DB_PERC_DETAIL, (value ? value + '% ' : ''), (info ? info + ' ' : ''), from, period === 'Y' ? this.props.lang.YEAR : period === 'M' ? this.props.lang.MONTH : this.props.lang.DAY);

  renderTabItem(langProps: string, icon: SemanticICONS, color: SemanticCOLORS) {
    return (<Menu.Item name={this.props.lang[langProps]} key={langProps}>
      <Icon name={icon} color={color} />
      {this.props.lang[langProps]}
    </Menu.Item>);
  }

  createGraphs() {
    const { filter = { Aua: {} } } = this.props;
    let graphs = {
      Performance: {
        title: 'AUA',
        icon: 'pie chart',
        charts: [{
          title: 'AUA',
          chart: this.renderFilterGraphItem(1, filterMapItems.Aua, filter.Aua)
        }]
      },
    }
    const graphType = {
      Region: 'composed',
      Currency: 'composed',
      Rating: 'composed',
      MacroAssetClass: 'composed',
      MicroAssetClass: 'composed'
    }
    const bd = this.props.data!.breakdowns.map((b, i) => {
      return {
        title: b.attributeName,
        icon: 'line chart',
        charts: [{
          chart: <BreakdownView key={i} breakdown={b} width={500} height={500} responsiveHeight="100%" chartView={graphType[b.attributeName]} />
        }]
      }
    });
    return Object.keys(graphs).map((v) => graphs[v]).concat(bd);
  }

  render() {
    const { uid, data, filter, lang } = this.props;
    const style = { padding: '0px 0px' }
    const fmt = formatNumber(lang.NUMBER_FORMAT);

    if (!data) return null;

    const panes = [
      {
        menuItem: this.renderTabItem('DASHBOARD', 'pie graph', 'green'),
        render: () => <Tab.Pane as={"div"} style={style} content={<div style={{ padding: 4 }}>{this.renderFilterGraphics(data.result)} </div>} />
      },
      {
        menuItem: this.renderTabItem('MY_PORTFOLIOS', 'users', 'blue'),
        render: () => <Tab.Pane as={"div"} style={style} content={<div style={{ padding: 10 }}> <ManagerView uid={uid} /></ div>} />
      },
      {
        menuItem: this.renderTabItem('MY_ALERTS', 'alarm', 'red'),
        render: () => <Tab.Pane as={"div"} style={style} content={<div style={{ padding: 10 }}><AlertsView manager uid={uid} hideGraphs /></div>} />
      },
      {
        menuItem: this.renderTabItem('MY_CLIENTS', 'users', 'blue'),
        render: () => <Tab.Pane as={"div"} style={style} content={<div style={{ padding: 10 }}><ClientsView uid={uid} /></div>} />
      }
    ]

    const info = data.result.reduce<
      { length: number, assetUnder: number, clientAlert: number, mifidAlert: number, acceptedProposals: number, totalProposals: number, rejectedProposals: number, totalBudget: number, totRevenues: number, totalTurnover: number }>(
        (ret, v, i) => {
          ret.length += 1;
          ret.totalBudget += v.budget;
          ret.totRevenues += v.ongoingFees + v.upfrontFees;
          ret.acceptedProposals += v.numOfAcceptedProposal / 2;
          ret.totalProposals += v.numOfInterviews / 2;
          ret.assetUnder += v.aua;
          ret.clientAlert += v.radar.numOfAlerts > 0 ? 1 : 0;
          ret.mifidAlert += v.radar.riskAdequacyAlert !== 'green' ? 1 : 0;
          ret.totalTurnover += v.turnover;
          return ret;
        },
        { length: 0, assetUnder: 0, clientAlert: 0, mifidAlert: 0, acceptedProposals: 0, totalProposals: 0, rejectedProposals: 0, totalBudget: 0, totRevenues: 0, totalTurnover: 0 });

    let filterMaps: FilterMapTypes[] = ['Countries', 'Aua', 'Segment', 'RiskProfile'];
    if (this.props.isOnlyItaly) {
      filterMaps.splice(1, 0, 'Regions', 'Branch', 'Agents');
    }

    return (
      <AdvancedGrid className="grid-header-fix" >

        <Segment compact style={{ width: '100%', margin: 0 }} >

          <Grid columns={7}   >
            <Grid.Column textAlign="center" >
              {this.renderItem(fmt(info.length), lang.DB_TOTAL_CLIENTS, this.percDetail(6.9, '1', 'Y'), 'blue', 'green')}
            </Grid.Column>
            <Grid.Column textAlign="center">
              {this.renderItem(formatAua(info.assetUnder, fmt), lang.DB_ASSET_ADVISE, this.percDetail(15, '1', 'Y'), 'blue', 'green')}
            </Grid.Column>
            <Grid.Column textAlign="center">
              {this.renderItem(fmt(info.clientAlert), lang.DB_CLIENTS_ALERTS, this.alertsDetail(fmt(info.mifidAlert)), 'red')}
            </Grid.Column>
            <Grid.Column textAlign="center">
              {this.renderItem(fmt(info.totalTurnover / info.length) + "%", lang.TURNOVER, '', 'blue', 'green')}
            </Grid.Column>
            <Grid.Column textAlign="center">
              {this.renderItem(fmt(info.totalBudget) + "€", lang.BUDGET, Math.round(100 * (info.totRevenues / info.totalBudget)).toString() + '% accomplished YTD', 'blue', 'green')}
            </Grid.Column>
            <Grid.Column textAlign="center" >
              {this.renderItem(fmt(info.acceptedProposals), lang.DB_CLIENT_ACCEPTED_PROPOSALS, `${lang.OUT_OF} ${fmt(info.totalProposals)} (${Math.round(100 * (info.acceptedProposals / info.totalProposals)).toString() + '%)'}`, 'blue')}
            </Grid.Column>
            <Grid.Column className="col-user-menu">
              {this.props.children}
            </Grid.Column>
          </Grid>
        </Segment>

        <AdvancedGrid className="grid-filter-right">
          <div style={{ position: 'relative' }}>
            <Tab menu={{ pointing: true, secondary: true, style: { margin: 0 } }} panes={panes} style={{ height: '95%' }} />
            <Icon link name='th' size='large' style={{ position: 'absolute', top: '8px', right: '8px' }} onClick={this.setSlider} />
          </div>
          <Segment style={{ margin: 0 }}>
            <WidgetTitle size="mini" title={lang.FILTER} />
            <ClientFilter
              searchPlaceholder={lang.ENTER_FILTER_TEXT}
              data={filter}
              filterMaps={filterMaps}
              filterValue={data.parms}
              onChange={this.handleOnChangeFilter}
            />
          </Segment>
        </AdvancedGrid>

      </AdvancedGrid >
    );
  }
}

export const DashboardMgr = conn.connect(DashboardMgrCompo);
