import * as React from 'react';
import { appConnector } from 'app-support';
import { getCurrentClient, getLanguage, getHistory, selectStrategy } from '../../reducers/index';
import { getClient, getSuggestions, getClientSuccess } from '../../actions/index';
import { Grid, Segment, Statistic, Card, Button, } from 'semantic-ui-react';
import { RadarGraph } from '../RadarGraph';
import { Breakdown, Radar, StrategyItem, RadarStrategyParm } from '../../_db/interfaces';
import { Holdings } from './Holdings';
import { HistoryView, HistoryViewTimeline, HistoryViewTimelineEvent  } from './HistoryView';
import { ClientCard } from '../clientsView/ClientCard';
import { BreakdownView } from './BreakdownView';
import Slider, { Settings } from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as ce from '../../_db/coreEngine';
import { AxesSelection } from './AxesSelection';
import { sumBy } from 'lodash';
import { LangDictionary } from '../../reducers/language/interfaces';
import IconButton from '../shared/IconButton/index';
import { PerformanceChart } from '../securityView/PerformanceChart';
import { RiskReturnGraph } from './RiskReturnGraph';
import { AdvancedGrid } from '../shared/GridOverflow';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { createRadarFromStrategy, suggestedPosition, currentPosition, modelPosition } from '../../_db/common/radarUtils';

const conn = appConnector<{ id: string }>()(
    (s, p) => ({
        client: getCurrentClient(s),
        lang: getLanguage(s),
        history: getHistory(s),
        strategy: selectStrategy(s)
    }),
    { getClient, getSuggestions, getClientSuccess }
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

    handleAxesChange = (axes: RadarStrategyParm) => {
        this.setState({ axes }, () => {
            this.props.getSuggestions({ position: this.state.strategy, axes: axes, calculateFromAxes: true });
        })
    }

    graphs = () => {
        const { currentGraphIndex, breakdown, radar, strategy } = this.state;

        return [
            <div key={0}>
                {radar && <RadarGraph
                    data={radar}
                    lang={this.props.lang}
                    width={0 == currentGraphIndex ? 600 : 250}
                    height={0 == currentGraphIndex ? 413 : 300}
                    onClick={() => this.setState({ currentGraphIndex: 0 })}
                />}
            </div>,
            <div key={1}>
                {radar && <Segment basic>
                    <h5 onClick={() => this.setState({ currentGraphIndex: 1 })} style={{ textAlign: 'center', cursor: 'pointer' }}>Performance</h5>
                    <PerformanceChart
                        data={ce.getPositionPerformance(suggestedPosition(strategy))}
                        width={1 == currentGraphIndex ? 700 : 350}
                        height={1 == currentGraphIndex ? 413 : 300}
                        advancedView={1 == currentGraphIndex}
                        lang={this.props.lang}
                        actualData={ce.getPositionPerformance(currentPosition(strategy))}
                        
                    />
                </Segment>}
            </div>,
            <div key={2}>
                {radar && <Segment basic>
                    <h5 onClick={() => this.setState({ currentGraphIndex: 2 })} style={{ textAlign: 'center', cursor: 'pointer' }}>Risk Return</h5>
                    <RiskReturnGraph
                        data={ce.getRiskReturn(suggestedPosition(strategy), modelPosition(strategy), 'All')}
                        width={2 == currentGraphIndex ? 700 : 350}
                        height={2 == currentGraphIndex ? 413 : 300}
                        lang={this.props.lang}
                    />
                </Segment>}
            </div>,
        ].concat(
            breakdown
                .map((p, i) => <div key={i + 3} style={{ height: '100%' }}>
                    <BreakdownView
                        breakdown={p}
                        width={(i + 3) == currentGraphIndex ? 700 : 350}
                        height={(i + 3) == currentGraphIndex ? 413 : 300}
                        onClick={() => this.setState({ currentGraphIndex: i + 3 })}
                        chartView={p.attributeName === "MacroAssetClass" ? 'pie' : p.attributeName == 'Rating' ? 'pie' : 'composed'}
                    />
                </div>)
            )
    }

    renderAllGraphs(graphs: JSX.Element[]) {
        const gridProps = {
            gridTemplateColumns: "repeat(3, fit-content(33%))"
        }

        return (
            <div>
                <AdvancedGrid {...gridProps}>
                    {graphs.map( (v,i) => <Segment key={i} style={{ margin: 0 }} content={v} />)}
                </AdvancedGrid>
                <Button icon='grid layout' onClick={()=>this.handleOnViewAllGraph(false)} color='yellow' circular style={{ position: 'fixed', top: '85px', zOrder: 9999, left: '25px' }} />
            </div>
        );
    }

    render() {
        const { client, lang, history } = this.props;
        const { strategy, currentGraphIndex, axes, renderAllGraphs } = this.state;

        const settings: Settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: this.state.autoplay,
            pauseOnHover: true,
            arrows: false,
            initialSlide: 0
        };

        if (!client || history.length === 0) return <div />

        const graphs = this.graphs();

        if (renderAllGraphs) {
            return this.renderAllGraphs(graphs)
        }

        return <div >
            <Grid columns={2} padded='horizontally' >
                <Grid.Row>
                    <Grid.Column width={8} textAlign="center">
                        <ClientCard lang={lang} client={client} />
                        <Segment>
                            {graphs.find((item, ix) => ix == currentGraphIndex)}
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <HistoryViewTimelineEvent lang={lang} history={history} />
                        <Card fluid style={{ paddingBottom: '30px' }}>
                            <Slider {...settings} >
                                {graphs.filter((item, i) => i != currentGraphIndex)}
                            </Slider>
                            <Segment basic floated="right" style={{ position: 'absolute', zOrder: 99 }}>
                                <IconButton
                                    size="small"
                                    name={'grid layout'}
                                    color={'blue'}
                                    onClick={() => this.handleOnViewAllGraph(true)} />
                                <IconButton
                                    size="small"
                                    name={this.state.autoplay ? 'play' : 'pause'}
                                    color={this.state.autoplay ? 'green' : 'grey'}
                                    onClick={() => this.setState({ autoplay: !this.state.autoplay })} />
                            </Segment>                            
                        </Card>

                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <AxesSelection data={axes} radar={this.state.radar!} onChange={this.handleAxesChange} />
                        <Fees strategy={this.state.strategy} lang={this.props.lang} />
                    </Grid.Column>

                    <Grid.Column width={12}>
                        {/*<Holdings lang={lang} holdings={strategy} onChange={this.handleOnChange} />*/}
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        </div >
    }
}
export const ClientView = conn.connect(ClientViewCompo);



export const Fees = (props: { strategy: StrategyItem[], lang: LangDictionary }) => {
    const { lang, strategy } = props;
    const fmt = new Intl.NumberFormat(lang.NUMBER_FORMAT, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
    const fees = Math.round(sumBy(strategy.filter(s => s.suggestionAccepted), s => s.fee * Math.abs(s.suggestedDelta * s.currentAmount) * .05));
    const perc = 100 * fees / sumBy(strategy, v => v.currentAmount);

    return <Segment>
        <h5>{lang.FEES}</h5>
        {fees != 0 && <Statistic.Group size="small" widths="2">
            <Statistic>
                <Statistic.Value>{fmt.format(fees)}</Statistic.Value>
                <Statistic.Label>Euro</Statistic.Label>
            </Statistic>
            <Statistic>
                <Statistic.Value>{fmt.format(perc)}</Statistic.Value>
                <Statistic.Label>%</Statistic.Label>
            </Statistic>

        </Statistic.Group>}
    </Segment>
}

const WrapperSegment = (props: any) => {
    return <Segment {...props} />
};
const WrapperGrid = (props: any) => {
    return <AdvancedGrid {...props} />
};

const SElement = SortableElement(WrapperSegment);
const SGrid = SortableContainer(WrapperGrid);