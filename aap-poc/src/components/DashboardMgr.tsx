import * as React from 'react';
import { SearchParms, Client } from '../_db/interfaces';
import { appConnector } from 'app-support';
import { searchClient } from '../actions/index';
import { getSearchResult, getSearchFilter, getLanguage } from '../reducers/index';
import { SemanticICONS, Statistic, Grid, Segment, SemanticCOLORS, Icon, Menu, Tab, Card } from 'semantic-ui-react';
import { filterMapItems, FilterMap } from '../actions/model';
import { TopClient } from './topClientView/index';
import { CustomPieChart } from './chart/CustomCharts';
import { OverflowItem, AdvancedGrid, OverflowColumn } from './shared/GridOverflow';
import { ManagerView } from './managerView/managerView';
import { AlertsView } from './alertsView/AlertsView';
import { formatAua, formatNumber } from '../_db/utils';
import { ClientFilter } from './shared/ClientFilter';
import { ItalyMap } from './italymaps/ItalyMap';
import { WidgetTitle } from './shared/WidgetTitle';

const sprintf = require("sprintf-js").sprintf;

export interface DashboardMgrProps {
    uid: string
}
export interface DashboardMgrState {
    searchParms: SearchParms
}

const conn = appConnector<DashboardMgrProps>()(
    (s, p) => ({
        data: getSearchResult(s, p.uid),
        filter: getSearchFilter(s, p.uid),
        lang: getLanguage(s)
    }),
    { searchClient }
)

class DashboardMgrCompo extends conn.StatefulCompo<DashboardMgrState> {
    constructor(props: any) {
        super(props);
        this.state = { searchParms: this.props.data && this.props.data.parms || { filter: '', uid: '' } };

        this.search = this.search.bind(this);
        this.searchAdvanced = this.searchAdvanced.bind(this);
        this.searchAdvancedByGraph = this.searchAdvancedByGraph.bind(this);
        this.handleOnChangeFilter = this.handleOnChangeFilter.bind(this);
    }

    componentDidMount() {
        if (!this.props.data) {
            this.props.searchClient({ uid: this.props.uid, filter: '' });
        }
    }

    componentWillReceiveProps(next: any) {
        this.setState({
            searchParms: next.data && next.data.parms || { filter: '', uid: '' }
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
        this.setState({ searchParms }, this.search);
    }

    // render statistic
    renderItem(value: any, label?: string, sublabel?: any, valueIcon?: SemanticICONS, color?: SemanticCOLORS) {
        return (<Statistic size="small" color='blue' >
            {label && <Statistic.Label>{label}</Statistic.Label>}
            <Statistic.Value>
                {valueIcon && <Icon name={valueIcon} color={color} />}
                {value}
            </Statistic.Value>
            <br />
            {sublabel && <Statistic.Label><span style={color && { color: color }}>{sublabel}</span></Statistic.Label>}
        </Statistic>);
    }

    // render filter
    renderFilterGraphics(data: Client[]) {
        const { lang, filter = { Aua: {} } } = this.props;
        return (
            <Grid columns={2}>
                <Grid.Column>
                    <Segment>
                        <WidgetTitle title={'Key Figures Map'} shareButtons={['Image', 'Copy']} />
                        <ItalyMap lang={lang} clients={data} height="500px" />
                    </Segment>
                </Grid.Column>
                <Grid.Column>
                    {this.renderFilterGraphItem(1, filterMapItems.Aua, filter.Aua)}
                </Grid.Column>
                <Grid.Column width={16}>
                    <TopClient clients={data} lang={lang} />
                </Grid.Column>
            </Grid>
        )
    }

    Colors = ["#F07D00", "#004F9F", "#E6325E", "#3B7296", "#39B2B6", "#c8c802", "#bd00bf"]

    renderFilterGraphItem(key: number, map: FilterMap, values: any) {
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
            }, [] = [] as any);

        var arrayValues = this.state.searchParms[searchprop];

        return (
            <Segment>
                <WidgetTitle title={header} shareButtons={['Image', 'Copy']} />
                <CustomPieChart width={500} height={500} data={valuesSizeGraph} nameKey="name" dataKey="value" filterKey="filter" onClick={(d) => this.searchAdvancedByGraph(searchprop, d)} />
            </Segment>
        );
    }

    // lang
    alertsDetail = (numOfAlerts: string) => sprintf(this.props.lang.DB_ALERTS_DETAIL, numOfAlerts);
    percDetail = (value: number | undefined, from: string, period: 'Y' | 'M' | 'D', info?: string) => sprintf(this.props.lang.DB_PERC_DETAIL, (value ? value + '% ' : ''), (info ? info + ' ' : ''), from, period == 'Y' ? this.props.lang.YEAR : period == 'M' ? this.props.lang.MONTH : this.props.lang.DAY);

    renderTabItem(langProps: string, icon: SemanticICONS, color: SemanticCOLORS) {
        return (<Menu.Item name={this.props.lang[langProps]} key={langProps}>
            <Icon name={icon} color={color} />
            {this.props.lang[langProps]}
        </Menu.Item>);
    }

    render() {
        const { uid, data, filter, lang } = this.props;
        const style = { padding: '5px 15px' }
        const fmt = formatNumber(lang.NUMBER_FORMAT);

        if (!data) return null;

        const panes = [
            {
                menuItem: this.renderTabItem('DASHBOARD', 'pie graph', 'green'),
                render: () => <Tab.Pane as={OverflowItem} style={style} content={this.renderFilterGraphics(data.result)} />
            },
            {
                menuItem: this.renderTabItem('MY_PORTFOLIOS', 'users', 'blue'),
                render: () => <Tab.Pane as={OverflowItem} style={style} content={<ManagerView uid={uid} />} />
            },
            {
                menuItem: this.renderTabItem('MY_ALERTS', 'alarm', 'red'),
                render: () => <Tab.Pane as={OverflowItem} style={style} content={<AlertsView manager uid={uid} hideGraphs />} />
            }
        ]

        const info = data.result.reduce<
        { length: number, assetUnder: number, clientAlert: number, mifidAlert: number, acceptedProposals: number, totalProposals: number, rejectedProposals: number, totalBudget:number, totRevenues:number }>(
            (ret, v, i) => {
                ret.length += 1;
                ret.totalBudget += v.budget;
                ret.totRevenues += v.ongoingFees + v.upfrontFees;
                ret.acceptedProposals += v.numOfAcceptedProposal;
                ret.totalProposals += v.numOfInterviews;
                ret.assetUnder += v.aua;
                ret.clientAlert += v.radar.numOfAlerts > 0 ? 1 : 0;
                ret.mifidAlert += v.radar.riskAdequacyAlert != 'green' ? 1 : 0;
                return ret;
            },
            { length: 0, assetUnder: 0, clientAlert: 0, mifidAlert: 0, acceptedProposals: 0, totalProposals: 0, rejectedProposals: 0, totalBudget: 0, totRevenues: 0 });


        return (
            <AdvancedGrid className="grid-header-fix" >
                <Segment style={{ margin: 0 }}>
                    <Grid columns={5} >
                        <Grid.Column textAlign="center" >
                            {this.renderItem(fmt(info.length), lang.DB_TOTAL_CLIENTS, this.percDetail(6.9, '1', 'Y'), undefined, 'green')}
                        </Grid.Column>
                        <Grid.Column textAlign="center">
                            {this.renderItem(formatAua(info.assetUnder, fmt), lang.DB_ASSET_ADVISE, this.percDetail(15, ' 1', 'Y', 'NET CASHFLOWS'), undefined, 'green')}
                        </Grid.Column>
                        <Grid.Column textAlign="center">
                            {this.renderItem(<span style={{ color: 'red' }}>{fmt(info.clientAlert)}</span>, lang.DB_CLIENTS_ALERTS, this.alertsDetail(fmt(info.mifidAlert)))}
                        </Grid.Column>
                        {/* <Grid.Column textAlign="center">
                            {this.renderItem(info.interviews, lang.DB_INTERVIEWS, this.percDetail(undefined, '1', 'M'))}
                        </Grid.Column> */}
                        <Grid.Column textAlign="center">
                            {this.renderItem(fmt(info.totalBudget) + "€", lang.BUDGET, Math.round(100 * (info.totRevenues / info.totalBudget)).toString() + '% accomplished', undefined, 'green')}
                        </Grid.Column>

                        <Grid.Column textAlign="center">
                            {this.renderItem(fmt(info.acceptedProposals), lang.DB_CLIENT_ACCEPTED_PROPOSALS, `${lang.OUT_OF} ${fmt(info.totalProposals)}`)}
                        </Grid.Column>
                    </Grid>
                </Segment>
                <AdvancedGrid className="grid-filter-right">
                    <Card as={OverflowColumn} fluid>
                        <Tab menu={{ pointing: true, secondary: true }} panes={panes} style={{ height: '95%' }} />
                    </Card>
                    <Segment style={{ margin: 0 }}>
                        <WidgetTitle title={lang.FILTER} />
                        <ClientFilter
                            searchPlaceholder={lang.ENTER_FILTER_TEXT}
                            data={filter}
                            filterMaps={['Regions', 'Branch', 'Agents', 'Aua', 'Segment']}
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