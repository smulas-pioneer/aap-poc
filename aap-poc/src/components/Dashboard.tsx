import * as React from 'react';
import { appConnector } from 'app-support';
import { getSearchResult, getSearchFilter, getLanguage } from '../reducers/index';
import { searchClient } from '../actions/index';

import { SearchParms, Client } from "../_db/interfaces";
import { LangDictionary } from '../reducers/language/interfaces';

import { Card, Grid, Icon, SemanticICONS, SemanticCOLORS, Statistic, Segment, Menu, Label, Tab, Button, Container } from 'semantic-ui-react';
import { groupBy, sumBy } from 'lodash';
import { CustomPieChart } from './chart/CustomCharts';

import { ClientFilters, SearchFilter, FilterMap, MemuItemModel, memuItems, filterMapItems } from '../actions/model';
import { ClientsView } from './clientsView/ClientsView';
import { AlertsView } from './alertsView/AlertsView';
import { ClientFilter } from './shared/ClientFilter';

import { AdvancedGrid, OverflowColumn, OverflowItem } from './shared/GridOverflow';
import { WidgetTitle } from './shared/WidgetTitle';
import { formatAua, formatNumber } from '../_db/utils';
import { ClientListBudget } from './clientsView/ClientListBudget';

const sprintf = require("sprintf-js").sprintf;

export interface DashboardProps {
    uid: string
}
export interface DashboardState {
    searchParms: SearchParms
}

const conn = appConnector<DashboardProps>()(
    (s, p) => ({
        data: getSearchResult(s, p.uid),
        filter: getSearchFilter(s, p.uid),
        lang: getLanguage(s)
    }),
    { searchClient }
)

class Dashboard extends conn.StatefulCompo<DashboardState> {
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
                {value || 0}
            </Statistic.Value>
            <br />
            {sublabel && <Statistic.Label><span style={color && { color: color }}>{sublabel}</span></Statistic.Label>}
        </Statistic>);
    }

    // render filter
    renderFilterGraphics(data: Client[]) {
        const { lang, filter = { Alerts: {}, Aua: {} } } = this.props;
        return (
            <Grid columns={2}>
                <Grid.Column>
                    {this.renderFilterGraphItem(3, filterMapItems.Aua, filter.Aua)}
                </Grid.Column>
                <Grid.Column>
                    {this.renderFilterGraphItem(2, filterMapItems.Alerts, filter.Alerts)}
                </Grid.Column>
                <Grid.Column width={16} style={{ paddingTop: '0', paddingButtom: '0' }}>
                    <ClientListBudget clients={data} lang={lang} />
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
                    fillColorOpacity: filter.current ? '1' : '0.3'
                })

                if (residual) {
                    memo.push({
                        name: undefined,
                        value: residual,
                        isActive: filter.isInUse,
                        fillColor: color,
                        fillColorOpacity: '0.3'
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
                menuItem: this.renderTabItem('MY_CLIENTS', 'users', 'blue'),
                render: () => <Tab.Pane as={OverflowItem} style={style} content={<ClientsView uid={uid} />} />
            },
            {
                menuItem: this.renderTabItem('MY_ALERTS', 'alarm', 'red'),
                render: () => <Tab.Pane as={OverflowItem} style={style} content={<AlertsView uid={uid} hideGraphs />} />
            }
        ]

        const info = data.result.reduce<
            { length: number, assetUnder: number, clientAlert: number, mifidAlert: number, acceptedProposals: number, totalProposals: number, pendingProposals: number, pendingExecution: number, totalBudget: number, totRevenues: number, totalTurnover: number }>(
                (ret, v, i) => {
                    const isPP = v.clientStatus == 'PENDING PROPOSAL';
                    const isPE = v.clientStatus == 'PENDING EXECUTION';

                    ret.length += 1;
                    ret.totalBudget += v.budget;
                    ret.totRevenues += v.ongoingFees + v.upfrontFees;
                    ret.acceptedProposals += isPE ? 1 : isPP ? 0 : v.numOfAcceptedProposal / 2;
                    ret.totalProposals += isPE || isPP ? 1 : v.numOfInterviews / 2;
                    ret.pendingProposals += isPP ? 1 : 0;
                    ret.pendingExecution += isPE ? 1 : 0;
                    ret.assetUnder += v.aua;
                    ret.clientAlert += v.radar.numOfAlerts > 0 ? 1 : 0;
                    ret.mifidAlert += v.radar.riskAdequacyAlert != 'green' ? 1 : 0;
                    ret.totalTurnover += v.turnover;
                    return ret;
                },
                { length: 0, assetUnder: 0, clientAlert: 0, mifidAlert: 0, acceptedProposals: 0, totalProposals: 0, pendingExecution: 0, pendingProposals: 0, totalBudget: 0, totRevenues: 0, totalTurnover: 0 });

        return (
            <AdvancedGrid className="grid-header-fix">
                <Segment style={{ margin: 0 }}>
                    <Grid columns={6} >
                        <Grid.Column textAlign="center">
                            {this.renderItem(fmt(info.length), lang.DB_TOTAL_CLIENTS, this.percDetail(6.9, '1', 'Y'), undefined, 'green')}
                        </Grid.Column>
                        <Grid.Column textAlign="center">
                            {this.renderItem(formatAua(info.assetUnder), lang.DB_ASSET_ADVISE, this.percDetail(15, '1', 'Y'), undefined, 'green')}
                        </Grid.Column>
                        <Grid.Column textAlign="center">
                            {this.renderItem(<span style={{ color: 'red' }}>{fmt(info.clientAlert)}</span>, lang.DB_CLIENTS_ALERTS, this.alertsDetail(fmt(info.mifidAlert)))}
                        </Grid.Column>
                        {/* <Grid.Column textAlign="center">
                            {this.renderItem(info.interviews, lang.DB_INTERVIEWS, this.percDetail(undefined, '1', 'M'))}
                        </Grid.Column> */}
                        <Grid.Column textAlign="center">
                            {this.renderItem(fmt(info.totalBudget) + "€", lang.BUDGET, Math.round(100 * (info.totRevenues / info.totalBudget)).toString() + '% accomplished YTD', undefined, 'green')}
                        </Grid.Column>
                        <Grid.Column textAlign="center">
                            {this.renderItem(fmt(info.totalTurnover / info.length) + "%", lang.TURNOVER, '', undefined, 'green')}
                        </Grid.Column>
                        <Grid.Column textAlign="center">
                            {this.renderItem(fmt(info.acceptedProposals), lang.DB_CLIENT_ACCEPTED_PROPOSALS, `${lang.OUT_OF} ${fmt(info.totalProposals)} (${Math.round(100 * (info.acceptedProposals / info.totalProposals)).toString() + '%)'}`)}
                        </Grid.Column>
                    </Grid>
                </Segment>
                <AdvancedGrid className="grid-filter-right">
                    <Card as={OverflowColumn} fluid>
                        <Tab menu={{ pointing: true, secondary: true }} panes={panes} style={{ height: '95%' }} />
                    </Card>
                    <Segment style={{ margin: 0 }}>
                        <Card fluid>
                            {this.renderItem(fmt(info.pendingProposals), lang.DB_PENDING_PROPOSALS)}
                        </Card>
                        <Card fluid>
                            {this.renderItem(fmt(info.pendingExecution), lang.DB_PROPOSAL_ACCEPTED_NOT_EXECUTED)}
                        </Card>
                        <Segment>
                            <WidgetTitle title={lang.FILTER} />
                            <ClientFilter
                                searchPlaceholder={lang.ENTER_FILTER_TEXT}
                                data={filter}
                                filterMaps={['AlertType', 'ClientStatus', 'ClientStatusDuration', 'Aua', 'RiskProfile']}
                                filterValue={data.parms}
                                onChange={this.handleOnChangeFilter}
                            />
                        </Segment>
                    </Segment>
                </AdvancedGrid>
            </AdvancedGrid >
        );
    }
}

export default conn.connect(Dashboard);