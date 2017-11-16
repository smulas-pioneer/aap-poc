import * as React from 'react';
import { appConnector } from 'app-support';
import { getCurrentClient, getLanguage, getSuggestedTransactions, getBreakdowns, getHistory } from '../../reducers/index';
import { getClient } from '../../actions/index';
import { Grid, Button, Transition, Image } from 'semantic-ui-react';
import { RadarGraph } from '../RadarGraph';
import { ClientCard } from '../clientsView/ClientCard';
import { BreakdownView } from './BreakdownView';
import Slider, { Settings } from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const conn = appConnector<{ id: string }>()(
    (s, p) => ({
        client: getCurrentClient(s),
        transactions: getSuggestedTransactions(s),
        breakdowns: getBreakdowns(s),
        lang: getLanguage(s),
        history: getHistory(s)
    }),
    { getClient }
)

interface State {
    showHoldings: boolean,
    currentGraphIndex: number,
}

class ClientViewCompo extends conn.StatefulCompo<State> {

    state = {
        showHoldings: true,
        currentGraphIndex: 0,
    }
    componentDidMount() {
        if (!this.props.client || this.props.client.id !== this.props.id) {
            this.search();
        }
    }

    search = () => {
        this.props.getClient({
            id: this.props.id
        });
    }

    toggleSecurityView = () => {
        this.setState({ showHoldings: !this.state.showHoldings });
    }

    graphs = () => {
        const { currentGraphIndex } = this.state;

        return [
            <div key={0}>
                <RadarGraph
                    data={this.props.client!.radar}
                    lang={this.props.lang}
                    width={0 == currentGraphIndex ? 700 : 300}
                    height={0 == currentGraphIndex ? 400 : 240}
                    onClick={() => this.setState({ currentGraphIndex: 0 })}
                />
            </div>
        ].concat(
            this.props.breakdowns
                .map((p, i) => <div key={i + 1}>
                    <BreakdownView
                        breakdown={p}
                        width={(i + 1) == currentGraphIndex ? 700 : 300}
                        height={(i + 1) == currentGraphIndex ? 400 : 240}
                        onClick={() => this.setState({ currentGraphIndex: i + 1 })} />
                </div>)
            )
    }

    render() {
        const { client, lang, history } = this.props;
        const { showHoldings, currentGraphIndex } = this.state;
        const securityView = !showHoldings ? lang.SUGGESTED_TRANSACTIONS : lang.HOLDINGS;
        const altView = showHoldings ? lang.SUGGESTED_TRANSACTIONS : lang.HOLDINGS

        const settings: Settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: true,
            pauseOnHover: true,
            arrows:true,
            initialSlide:0
        };

        if (!client) return <div />

        const graphs = this.graphs();
        return <div>
            <Grid columns={2} padded='horizontally' >
                <Grid.Column width={8} textAlign="center">
                  <ClientCard lang={lang} client={client} />
                    {graphs.find((item, ix) => ix == currentGraphIndex)}
                    <br />
                    <div>
                        <Slider {...settings}>
                            {graphs.filter((item, i) => i != currentGraphIndex)}
                        </Slider>
                    </div>
                </Grid.Column>
                <Grid.Column width={8}>
                    <HistoryView lang={lang} history={history}/>
                    <h3>{securityView}
                        <Button size="mini" floated="right" color="olive" onClick={this.toggleSecurityView}>
                            {altView}
                        </Button>
                    </h3>
                    {/*
                    <Transition.Group animation='vertical flip' duration={500}>
                        {showHoldings && <div><Holdings lang={lang} holdings={client.holdings} /></div>}
                        {!showHoldings && <div><SuggestedTransactions lang={lang} transactions={transactions} /></div>}
                    </Transition.Group>
                    */}

                </Grid.Column>
            </Grid>

        </div>
    }
}
export const ClientView = conn.connect(ClientViewCompo);

import { Divider } from 'semantic-ui-react'
import { HistoryView } from './HistoryView';

export default class TransitionExampleTransition extends React.Component {
    state = { visible: true }

    toggleVisibility = () => this.setState({ visible: !this.state.visible })

    render() {
        const { visible } = this.state

        return (
            <div>
                <Button content={visible ? 'Hide' : 'Show'} onClick={this.toggleVisibility} />
                <Divider hidden />
                <Transition visible={visible} animation='scale' duration={500}>
                    <Image size='small' src='/logo.png' />
                </Transition>
            </div>
        )
    }
}
