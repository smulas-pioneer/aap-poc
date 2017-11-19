import * as React from 'react';
import { appConnector } from 'app-support';
import { getCurrentClient, getLanguage, getHistory, selectStrategy, selectStrategySuccessCount } from '../../reducers/index';
import { getClient, getSuggestions, getClientSuccess, addSecurity, addHistory } from '../../actions/index';
import { LangDictionary } from '../../reducers/language/interfaces';
import { Client, Breakdown, Radar, StrategyItem, RadarStrategyParm, InterviewResult, TimeHorizonMonths, TimeHorizon } from '../../_db/interfaces';
import * as ce from '../../_db/coreEngine';
import { sumBy } from 'lodash';

import { Grid, Segment, Statistic, Card, Button, Table, SemanticICONS, Icon, Feed, Form, Label, Tab, Accordion, Header, SemanticCOLORS, List, Menu } from 'semantic-ui-react';
import { RadarGraph } from '../RadarGraph';
import { Holdings } from './Holdings';
import { PerformanceChart } from '../securityView/PerformanceChart';
import { RiskReturnGraph } from './RiskReturnGraph';
import { BreakdownView } from './BreakdownView';
import { AdvancedGrid, OverflowColumn, OverflowItem } from '../shared/GridOverflow';
import { ClientAlerts } from '../clientsView/ClientAlerts';
import { HistoryViewTimelineEvent } from './HistoryView';
import { settings } from 'cluster';
import { PerformanceContributionGraph } from './PerformanceContribution';
import { createRadarFromStrategy, suggestedPosition, currentPosition, modelPosition } from '../../_db/common/radarUtils';
import { WidgetTitle } from '../shared/WidgetTitle';
import {radars} from '../../_db/data';

const conn = appConnector<{ id: string }>()(
    (s, p) => ({
        client: getCurrentClient(s),
        lang: getLanguage(s),
        history: getHistory(s),
        strategy: selectStrategy(s),
        strategySuccessCount: selectStrategySuccessCount(s),
    }),
    { getClient, getSuggestions, getClientSuccess, addSecurity, addHistory }
)

interface State {
    breakdown: Breakdown[],
    strategy: StrategyItem[],
    radar?: Radar,
    axes: RadarStrategyParm,
    autoplay: boolean,
    currentTargetReturn?: number
}

class ClientViewCompo extends conn.StatefulCompo<State> {
    state = {
        breakdown: [],
        strategy: [],
        radar: undefined,
        axes: {
            riskAdequacy: false,
            efficency: false,
            consistency: false,
            riskAnalysis: false,
            concentration: false,
            overlap: false
        },
        autoplay: true
    } as State

    componentDidMount() {
        if (!this.props.client || this.props.client.id !== this.props.id) {
            this.search();
            setTimeout(() => {
                this.selectAllAxes();
            }, 500);
        }
    }

    componentWillReceiveProps(next: any) {
        if (next.strategy.length > 0) {
            const sugg = suggestedPosition(next.strategy);
            const suggBreakdown = ce.getBreakdown(sugg);
            const radar = createRadarFromStrategy(next.strategy, next.id,radars);
            this.setState({
                breakdown: suggBreakdown,
                strategy: next.strategy,
                radar
            });
        }
    }

    componentWillUnmount() {
        this.props.getClientSuccess();
    }

    selectAllAxes = () => {
        const axes = {
            concentration: true,
            consistency: true,
            riskAdequacy: true,
            riskAnalysis: true,
            overlap: true,
            efficency: true
        }
        this.setState({ axes }, () => this.props.getSuggestions({ id: this.props.client!.id, position: this.state.strategy, axes, calculateFromAxes: true }));
    }

    search = () => {
        this.props.getClient({
            id: this.props.id
        });
    }

    handleOnChange = (strategy: StrategyItem[]) => {
        this.props.getSuggestions({ id: this.props.client!.id, position: strategy, axes: this.state.axes, calculateFromAxes: false });
    }

    handleAxesChange = (key: string) => {
        const axes = { ...this.state.axes, [key]: !this.state.axes[key] };
        this.setState({ axes }, () => {
            this.props.getSuggestions({ id: this.props.client!.id, position: this.state.strategy, axes: axes, calculateFromAxes: true });
        })
    }

    calculateGraphs = () => {
        const { breakdown, radar, strategy } = this.state;
        const { client, strategySuccessCount, lang } = this.props;

        let graphs = {
            Performance: {
                title: 'PERFORMANCE',
                icon: 'line graph',
                charts: radar && [
                    {
                        title: 'PERFORMANCE',
                        chart: <PerformanceChart key={0}
                            data={ce.getPositionPerformance(suggestedPosition(strategy))}
                            actualData={ce.getPositionPerformance(currentPosition(strategy))}
                            width={700}
                            height={413}
                            clientTimeHorizon={client!.timeHorizon}
                            advancedView={true}
                            version={strategySuccessCount}
                            onCalculate95TargetRetForClientTimeHorizon={currentTargetReturn => this.setState({ currentTargetReturn })}
                            lang={lang} />
                    }]
            },
            RiskReturn: {
                title: 'RISK RETURN',
                icon: 'area graph',
                charts: radar && [
                    {
                        title: 'RISK RETURN',
                        chart: <RiskReturnGraph key={1}
                            data={ce.getRiskReturn(suggestedPosition(strategy), modelPosition(strategy), 'All')}
                            width={700}
                            height={413}
                            lang={lang} />
                    }]
            },
            PerfContr: {
                title: 'PERF. CONTR.',
                icon: 'bar graph',
                charts: radar && [
                    {
                        title: 'PERF. CONTR.',
                        chart: <PerformanceContributionGraph key={2}
                            data={ce.getPerfContribution(suggestedPosition(strategy))}
                            width={700}
                            height={413}
                            lang={lang} />
                    }]
            }
        };

        graphs = breakdown && breakdown.reduce((memo, val, i) => {
            let prop = val.attributeName;
            let title = val.attributeName.toUpperCase();

            if (prop === 'MacroAssetClass') {
                title = "MACRO";
                prop = "AssetClass";
            } else if (prop === 'MicroAssetClass') {
                title = "MICRO";
                prop = "AssetClass";
            } else if (prop === 'Rating' || prop === 'Maturity') {
                prop = "Bond Indicators";
            }

            const chartView = (prop === "AssetClass" ? 'pie' : prop === 'Bond Indicators' ? 'pie' : 'composed');

            const element = (memo[prop] || {
                title: prop.toUpperCase(),
                icon: chartView === "pie" ? 'pie graph' : 'bar graph',
                charts: []
            });

            if (val.data && val.data.length) {
                element.charts.push({
                    title,
                    chart: <BreakdownView key={`breakdown${i}`}
                        breakdown={val}
                        width={700}
                        height={413}
                        chartView={chartView} />
                })
            }
            return { ...memo, [prop]: element }

        }, graphs || {});

        return Object.keys(graphs).map((v) => graphs[v]);
    }

    render() {
        const { client, lang, history } = this.props;
        const { radar, strategy, breakdown, axes } = this.state;

        if (!client || history.length === 0) return <div />

        const graphs = this.calculateGraphs();

        return (
            <AdvancedGrid gridTemplateRows="min-content min-content 200px fit-content()" style={{ marginBottom: '10px' }}>
                <Segment style={{ margin: 0 }} >
                    <WidgetTitle title={lang.PERSONAL_INFORMATION} />
                    <ClientCard client={client} lang={lang} color={'blue'} />
                </Segment>
                {client.radar.numOfAlerts
                    ?
                    <Segment style={{ margin: 0 }}>
                        <ClientAlert radar={client.radar} lang={lang} />
                    </Segment>
                    : <div />}
                <AdvancedGrid gridTemplateColumns="auto 40%">
                    <Segment style={{ margin: 0 }}>
                        <WidgetTitle title={lang.PORTFOLIO_HOLDINGS} />
                        <Holdings
                            clientId={client.id} lang={lang} holdings={strategy}
                            onChange={this.handleOnChange}
                            onAddSecurity={this.props.addSecurity}
                            onAddHistory={this.props.addHistory}
                        />
                        <Fees strategy={strategy} lang={lang} targetReturn={this.state.currentTargetReturn} timeHorizon={client.timeHorizon} />
                    </Segment>
                    <Segment style={{ margin: 0 }}>
                        <WidgetTitle title={lang.PORTFOLIO_MONITORING} />
                        {radar && <RadarGraph data={radar} lang={lang} axes={axes} onClickShape={this.handleAxesChange} width={700} height={413} />}
                    </Segment>
                </AdvancedGrid>
                <AdvancedGrid gridTemplateColumns="60% auto">
                    <Segment style={{ margin: 0 }}>
                        <ClientViews graphs={graphs} lang={lang} mode='tab' />
                    </Segment>
                    <Segment style={{ margin: 0 }} as={OverflowColumn}>
                        <WidgetTitle title={lang.CLIENT_EVENT_HISTORY} />
                        <ClientHistory lang={lang} history={history} />
                    </Segment>
                </AdvancedGrid>
            </AdvancedGrid>
        )
    }
}

export const ClientView = conn.connect(ClientViewCompo);

const ClientCard = (props: { client: Client, lang: LangDictionary, color?: SemanticCOLORS }) => {
    const { client, lang, color } = props;

    const fmt1 = new Intl.NumberFormat(lang.NUMBER_FORMAT, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const renderColumns = (data: { [label: string]: string | number }, right?: boolean) => {
        return <Grid.Column textAlign={right ? "right" : "left"} style={{ fontSize: 'medium', paddingTop: 0 }}>
            {Object.keys(data).map((d, i) => {
                return <div key={i} >
                    <b>{d}:</b> &nbsp; {data[d]}
                </div>
            })}
        </Grid.Column>
    }

    return (<Grid basic='very' verticalAlign="top">
        <Grid.Row>
            <Grid.Column width="12" >
                <Statistic size="small" color={color}>
                    <Statistic.Value><Icon size="small" name={'user'} inverted circular color={color} />&nbsp;{client.name}</Statistic.Value>
                </Statistic>
            </Grid.Column>
            <Grid.Column width="4" textAlign="right">
                <Statistic size="small" color={color}>
                    <Statistic.Value>{`${fmt1.format(client.aum)} €`}</Statistic.Value>
                </Statistic>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column width={16} style={{ margin: 0 }}>
                <Grid columns="equal">
                    {renderColumns({ 'Client Id': client.id, 'Entry Date': client.lastAdvicedate, 'Segment': client.segment })}
                    {renderColumns({ 'Tel': client.phone, 'Email': client.email, 'Branch': client.branch })}
                    {renderColumns({ 'Address': client.address.streetAddress, 'City': client.address.city, 'Region': client.address.region })}
                    {renderColumns({ 'Mifid': client.mifid, 'Model': client.modelName, [lang.TIME_HORIZON]: client.timeHorizon }, true)}
                </Grid>
            </Grid.Column>
        </Grid.Row>
    </Grid>
    )
}

const ClientAlert = (props: { radar: Radar, lang: LangDictionary }) => {
    const { radar, lang } = props;

    const alertsListItem = (prop: string, key: any) => {
        const alert = lang.ALERTS[prop];
        const value = radar[prop];

        return value !== 'green'
            ? (<List.Item key={key} >
                <List.Content style={{ marginBottom: '6px' }}>
                    <Statistic size="mini" color={value}>
                        <Statistic.Value>
                            {` ${alert.name} : ${alert.sentence}`}
                        </Statistic.Value>
                    </Statistic>

                </List.Content>
            </List.Item>)
            : null;
    }

    const title = (
        <Segment basic as="span" >
            <Icon name='alarm' circular inverted color={radar.numOfAlerts ? 'red' : 'green'} />
            &nbsp;
            <Header key="0" as='h2' style={{ display: 'initial' }} color="red">
                <Header.Content style={{ marginTop: '4px' }}>{`${lang.ALERT.name}${radar.numOfAlerts ? ` : ${radar.numOfAlerts} ${lang.ALERT.sentence}` : ''}`}</Header.Content>
            </Header>
        </Segment>
    )

    if (radar.numOfAlerts) {
        const accordion = [
            {
                key: 'Alert',
                title: { key: 'alertTitle', content: title },
                content: {
                    key: 'alertContent',
                    content: (
                        <Segment basic>
                            {Object.keys(lang.ALERTS).map((v, i) => alertsListItem(v, i))}
                        </Segment>
                    )
                }
            }
        ]
        return <Accordion defaultActiveIndex={undefined} panels={accordion} />;
    } else {
        return title;
    }
}

const ClientHistory = (props: { history: InterviewResult[], lang: LangDictionary }) => {
    const { history, lang } = props;

    const listOfHistory = {
        clientEventHistory: true,
        transactions: true,
        proposals: true,
        interviews: true
    }

    const panes = Object.keys(listOfHistory).reduce((memo, key, i) => {
        const allow = listOfHistory[key];
        if (allow) {
            memo.push({
                menuItem: <Menu.Item key={i}>{lang.HISTORY[key]}</Menu.Item>,
                render: () => <Tab.Pane as={OverflowItem} style={{ padding: '5px 15px' }} content={<HistoryViewTimelineEvent lang={lang} history={history} />} />
            });
        }
        return memo;
    }, [] = [] as any);

    return <Tab menu={{ pointing: true, secondary: true }} panes={panes} style={{ height: '95%' }} />
}

const Fees = (props: { strategy: StrategyItem[], lang: LangDictionary, targetReturn?: number, timeHorizon: TimeHorizon }) => {
    const { lang, strategy } = props;
    const fmt = new Intl.NumberFormat(lang.NUMBER_FORMAT, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
    const fees = Math.round(sumBy(strategy.filter(s => s.suggestionAccepted), s => s.fee * Math.abs(s.suggestedDelta * s.currentAmount) * .05));
    const perc = 100 * fees / sumBy(strategy, v => v.currentAmount);
    const amount = sumBy(strategy, s => s.currentAmount);


    return fees != 0 ? <Segment textAlign="center" floated="right">
        <Segment basic compact style={{ padding: 0 }} >
            <Statistic size="mini" color="blue">
                <Statistic.Value>{lang.RESULTS}:</Statistic.Value>
            </Statistic>
            <Statistic size="mini">
                <Statistic.Value>{fmt.format(fees)} €</Statistic.Value>
                <Statistic.Label>{lang.FEES}</Statistic.Label>
            </Statistic>
            <Statistic size="mini">
                <Statistic.Value>{fmt.format(perc)} %</Statistic.Value>
                <Statistic.Label>{lang.FEES}</Statistic.Label>
            </Statistic>
            {props.targetReturn && <Statistic size="mini">
                <Statistic.Value>{fmt.format(amount * (props.targetReturn / 100))} €</Statistic.Value>
                <Statistic.Label>{lang.TARGET_RESULT} </Statistic.Label>
                <Statistic.Label style={{ fontSize: 10 }}>(prob. 95%)</Statistic.Label>
            </Statistic>}
            {props.targetReturn && <Statistic size="mini">
                <Statistic.Value>{fmt.format(props.targetReturn)}%</Statistic.Value>
                <Statistic.Label>{lang.TARGET_RESULT} </Statistic.Label>
                <Statistic.Label style={{ fontSize: 10 }}>(prob. 95%)</Statistic.Label>
            </Statistic>}
            {props.targetReturn && <Statistic size="mini">
                <Statistic.Value>{props.timeHorizon}</Statistic.Value>
                <Statistic.Label>{lang.TIME_HORIZON}</Statistic.Label>
            </Statistic>}
        </Segment>
    </Segment> : null
}

interface ClientViewProps {
    graphs: any[],
    lang: LangDictionary,
    mode: 'tab' | 'buttons',
}

class ClientViews extends React.Component<ClientViewProps, { activeIndex?: number }> {
    constructor(props: ClientViewProps) {
        super(props);
        this.state = { activeIndex: 0 };
        this.handleBtnChange = this.handleBtnChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    handleTabChange(e:any, { activeIndex }:{activeIndex:number}) {
        this.setState({ activeIndex });
    }
    handleBtnChange(activeIndex: number) {
        this.setState({ activeIndex });
    }

    renderTab(graphs: any[], activeIndex: number, lang: LangDictionary) {
        const panes = graphs.reduce((memo, item, ix) => {
            memo.push({
                menuItem: item.charts && item.charts.length ? <Menu.Item key={ix} name={item.title} icon={item.icon} /> : undefined,
                render: () => <Tab.Pane style={{ padding: '5px 15px' }}
                    content={
                        <Grid columns="equal" >
                            {item.charts && item.charts.map((v: any, j: number) => <Grid.Column key={j} textAlign="center">{v.title !== item.title ? v.title : ''}{v.chart}</Grid.Column>)}
                        </Grid>
                    } />
            });

            return memo;
        }, [] = [] as any[]);

        return (
            <div>
                <WidgetTitle title={lang.PORTFOLIO_VIEWS} />
                <Tab menu={{ pointing: true, secondary: true }} panes={panes} activeIndex={activeIndex} onTabChange={this.handleTabChange} style={{ height: '95%' }} />
            </div>
        );
    }

    renderButtons(graphs: any[], activeIndex: number, lang: LangDictionary) {
        const item = graphs[activeIndex]

        const panes = graphs.reduce((memo, item, ix) => {
            if (item.charts && item.charts.length) {
                memo.push(
                    <Button key={ix} size="mini" active={ix === activeIndex} onClick={() => this.handleBtnChange(ix)} >
                        <Icon name={item.icon as any} />
                        <br /> <br />{item.title}
                    </Button>
                );
            }
            return memo;
        }, [] = [] as any);

        return (
            <div>
                <WidgetTitle title={lang.PORTFOLIO_VIEWS} subtitle={item.title} />
                <Grid columns="equal" >
                    {item.charts && item.charts.map((v: any, j: number) => <Grid.Column key={j} textAlign="center">{v.title !== item.title ? v.title : ''}{v.chart}</Grid.Column>)}
                </Grid>
                <Button.Group basic fluid size="mini" >
                    {panes}
                </Button.Group >
            </div>
        );
    }

    render() {
        const { mode, graphs, lang } = this.props;
        const { activeIndex } = this.state;

        if (mode === 'tab') {
            return this.renderTab(graphs, activeIndex!, lang);
        } else {
            return this.renderButtons(graphs, activeIndex!, lang);
        }
    }
}

