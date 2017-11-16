import * as React from 'react';
import { appConnector } from 'app-support';
import { getCurrentClient, getLanguage, getHistory, selectStrategy } from '../../reducers/index';
import { getClient, getSuggestions, getClientSuccess, addSecurity, addHistory } from '../../actions/index';
import { LangDictionary } from '../../reducers/language/interfaces';
import { Client, Breakdown, Radar, StrategyItem, RadarStrategyParm, InterviewResult } from '../../_db/interfaces';
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
import { HistoryView, HistoryViewTimeline, HistoryViewTimelineEvent } from './HistoryView';
import { settings } from 'cluster';
import { PerformanceContributionGraph } from './PerformanceContribution';
import { createRadarFromStrategy, suggestedPosition,currentPosition ,modelPosition} from '../../_db/common/radarUtils';

const conn = appConnector<{ id: string }>()(
    (s, p) => ({
        client: getCurrentClient(s),
        lang: getLanguage(s),
        history: getHistory(s),
        strategy: selectStrategy(s)
    }),
    { getClient, getSuggestions, getClientSuccess, addSecurity, addHistory }
)

interface State {
    renderAllGraphs: boolean,
    currentGraphIndex: number,
    breakdown: Breakdown[],
    radar?: Radar,
    strategy: StrategyItem[],
    axes: RadarStrategyParm,
    autoplay: boolean
}

class ClientViewCompo extends conn.StatefulCompo<State> {
    state = {
        renderAllGraphs: false,
        currentGraphIndex: 0,
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
            const radar = createRadarFromStrategy(next.strategy);
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
        this.setState({ axes }, () => this.props.getSuggestions({ position: this.state.strategy, axes, calculateFromAxes: true }));

    }

    search = () => {
        this.props.getClient({
            id: this.props.id
        });
    }

    handleOnViewAllGraph = (open: boolean) => {
        this.setState({ renderAllGraphs: open });
    }

    handleOnChange = (strategy: StrategyItem[]) => {
        this.props.getSuggestions({ position: strategy, axes: this.state.axes, calculateFromAxes: false });
    }

    handleAxesChange = (key: string) => {
        const axes = { ...this.state.axes, [key]: !this.state.axes[key] };
        this.setState({ axes }, () => {
            this.props.getSuggestions({ position: this.state.strategy, axes: axes, calculateFromAxes: true });
        })
    }

    graphs = () => {
        const { currentGraphIndex, breakdown, radar, strategy } = this.state;
        return [
            {
                title: 'PERFORMANCE',
                icon: 'line graph',
                chart: radar && <PerformanceChart key={0}
                    data={ce.getPositionPerformance(suggestedPosition(strategy))}
                    actualData={ce.getPositionPerformance(currentPosition(strategy))}
                    width={700}
                    height={413}
                    clientTimeHorizon={this.props.client!.timeHorizon}
                    advancedView={0 == currentGraphIndex}
                    lang={this.props.lang} />
            },
            {
                title: 'RISK RETURN',
                icon: 'area graph',
                chart: radar && <RiskReturnGraph key={1}
                    data={ce.getRiskReturn(suggestedPosition(strategy), modelPosition(strategy), 'All')}
                    width={700}
                    height={413}
                    lang={this.props.lang} />
            },
            {
                title: 'Performance Contribution',
                icon: 'bar graph',
                chart: radar && <PerformanceContributionGraph key={2}
                    data={[]}
                    width={700}
                    height={413}
                    lang={this.props.lang} />
            },
        ].concat(
            breakdown
                .map((p, i) => {
                    return {
                        title: p.attributeName.toUpperCase(),
                        icon: p.attributeName === "MacroAssetClass" ? 'pie graph' : p.attributeName == 'Rating' ? 'pie graph' : 'bar graph',
                        chart: <BreakdownView key={3 + i}
                            breakdown={p}
                            width={700}
                            height={413}
                            onClick={() => this.setState({ currentGraphIndex: i + 4 })}
                            chartView={p.attributeName === "MacroAssetClass" ? 'pie' : p.attributeName == 'Rating' ? 'pie' : 'composed'} />

                    }
                })
            )
    }

    render() {
        const { client, lang, history } = this.props;
        const { strategy, currentGraphIndex, axes, renderAllGraphs, radar } = this.state;

        if (!client || history.length === 0) return <div />

        const graphs = this.graphs();

        return (
            <AdvancedGrid gridTemplateRows="min-content min-content 600px auto" style={{ marginBottom: '10px' }}>
                <Segment style={{ margin: 0 }} >
                    <ClientCard client={client} lang={lang} color={'blue'} />
                </Segment>
                <Segment style={{ margin: 0 }}>
                    <ClientAlert radar={client.radar} lang={lang} />
                </Segment>
                <AdvancedGrid gridTemplateColumns="auto 39%">
                    <Segment style={{ margin: 0 }} as={OverflowColumn}>
                        <h5>HOLDINGS</h5>
                        <Holdings clientId={client.id} lang={lang} holdings={strategy} onChange={this.handleOnChange} onAddSecurity={this.props.addSecurity} onAddHistory={this.props.addHistory} />
                        <Fees strategy={strategy} lang={lang} />
                    </Segment>
                    <Segment style={{ margin: 0 }}>
                        <h5>RADAR</h5>
                        {radar && <RadarGraph data={radar} lang={lang} axes={axes} onClickShape={this.handleAxesChange} width={700} height={413} />}
                    </Segment>
                </AdvancedGrid>
                <AdvancedGrid gridTemplateColumns="60% auto">
                    <Segment style={{ margin: 0 }}>
                        {graphs.reduce((memo, item, ix) => {
                            if (ix === currentGraphIndex) {
                                memo.push(
                                    <Segment key={ix} basic >
                                        <h5>{item.title}</h5>
                                        {item.chart}
                                    </Segment>
                                );
                            }
                            return memo;
                        }, [] = [] as any)}
                        <Button.Group basic fluid size="mini">
                            {graphs.reduce((memo, item, ix) => {
                                memo.push(
                                    <Button key={ix} size="mini" active={ix === currentGraphIndex} onClick={() => this.setState({ currentGraphIndex: ix })} >
                                        <Icon name={item.icon as any} />
                                        <br /> <br />{item.title}
                                    </Button>
                                );
                                return memo;
                            }, [] = [] as any)}
                        </Button.Group>
                    </Segment>
                    <Segment style={{ margin: 0 }} as={OverflowColumn}>
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
            <Grid.Column width="12" >
                <Form size="large">
                    <Form.Group inline widths={3} style={{ marginBottom: 0 }}>
                        <Form.Field>
                            <label>Client Id :</label> {client.id}
                        </Form.Field>
                        <Form.Field>
                            <label>Tel :</label> {client.phone}
                        </Form.Field>
                        <Form.Field>
                            <label>Address :</label> {client.address.streetAddress} {client.address.city}
                        </Form.Field>
                    </Form.Group>
                    <Form.Group inline widths={3} style={{ marginBottom: 0 }}>
                        <Form.Field>
                            <label>Entry Date :</label> {client.lastAdvicedate}
                        </Form.Field>
                        <Form.Field>
                            <label>Email :</label> {client.email}
                        </Form.Field>
                        <Form.Field>
                            <label>Time Horizion:</label> {client.timeHorizon}
                        </Form.Field>
                    </Form.Group>
                </Form>
            </Grid.Column>
            <Grid.Column width="4" textAlign="right">
                <Form size="large">
                    <Form.Group inline widths={1} style={{ marginBottom: 0, display: 'block' }}>
                        <Form.Field>
                            <label>Mifid :</label> {client.id}
                        </Form.Field>
                    </Form.Group>
                    <Form.Group inline widths={1} style={{ marginBottom: 0, display: 'block' }}>
                        <Form.Field>
                            <label>Model :</label> {client.modelName}
                        </Form.Field>
                    </Form.Group>
                </Form>
            </Grid.Column>
        </Grid.Row>
    </Grid>
    )
}

const ClientAlert = (props: { radar: Radar, lang: LangDictionary }) => {
    const ICONS = {
        concentrationAlert: 'random',
        consistencyAlert: 'save',
        efficencyAlert: 'lab',
        riskAdequacyAlert: 'eur',
        overlapAlert: 'sitemap',
        riskAnalysisAlert: 'payment',
    }

    const { radar, lang } = props;

    const alertsListItem = (prop: string, key: any) => {
        const alert = lang.ALERTS[prop];
        const value = radar[prop];

        return value !== 'green'
            ? (<List.Item key={key} >
                <List.Content style={{ marginBottom: '6px' }}>
                    <Statistic size="mini" color={value}>
                        <Statistic.Value>
                            <Icon name={ICONS[prop]} color={value} />{` ${alert.name} : ${alert.sentence}`}
                        </Statistic.Value>
                    </Statistic>

                </List.Content>
            </List.Item>)
            : null;
    }

    const title = (
        <Segment basic as="span">
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
                title: { content: title },
                content: {
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
                menuItem: <Menu.Item name={lang.HISTORY[key]} key={i}>{lang.HISTORY[key]}</Menu.Item>,
                render: () => <Tab.Pane as={OverflowItem} style={{ padding: '5px 15px' }} content={<HistoryViewTimelineEvent lang={lang} history={history} />} />
            });
        }
        return memo;
    }, [] = [] as any);

    return <Tab menu={{ pointing: true, secondary: true }} panes={panes} style={{ height: '95%' }} />
}

const Fees = (props: { strategy: StrategyItem[], lang: LangDictionary }) => {
    const { lang, strategy } = props;
    const fmt = new Intl.NumberFormat(lang.NUMBER_FORMAT, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
    const fees = Math.round(sumBy(strategy.filter(s => s.suggestionAccepted), s => s.fee * Math.abs(s.suggestedDelta * s.currentAmount) * .05));
    const perc = 100 * fees / sumBy(strategy, v => v.currentAmount);

    return fees != 0 ? <Segment textAlign="center" floated="right">
        <Segment basic compact style={{padding:0}} >
                <Statistic size="mini" color="blue">
                    <Statistic.Value>{lang.FEES.toUpperCase()}:</Statistic.Value>
                </Statistic>
                <Statistic size="mini">
                    <Statistic.Value>{fmt.format(fees)}</Statistic.Value>
                    <Statistic.Label>Euro</Statistic.Label>
                </Statistic>
                <Statistic size="mini">
                    <Statistic.Value>{fmt.format(perc)}</Statistic.Value>
                    <Statistic.Label>%</Statistic.Label>
                </Statistic>
                <Statistic size="mini">
                    <Statistic.Value>{fmt.format(perc)}</Statistic.Value>
                    <Statistic.Label>Target</Statistic.Label>
                </Statistic>
        </Segment>
    </Segment> : null
}



