import * as React from 'react';
import * as ce from '../../_db/coreEngine';
import { appConnector } from 'app-support';
import { getCurrentClient, getLanguage, getHistory, selectStrategy, selectStrategySuccessCount } from '../../reducers/index';
import { getClient, getSuggestions, getClientSuccess, addSecurity, addHistory } from '../../actions/index';
import { Breakdown, Radar, StrategyItem, RadarStrategyParm } from '../../_db/interfaces';
import { Segment, Button, Modal, Loader } from 'semantic-ui-react';
import { RadarGraph } from '../RadarGraph';
import { Holdings } from './Holdings';
import { PerformanceChart } from '../securityView/PerformanceChart';
import { RiskReturnGraph } from './RiskReturnGraph';
import { BreakdownView } from './BreakdownView';
import { AdvancedGrid } from '../shared/GridOverflow';
import { PerformanceContributionGraph } from './PerformanceContribution';
import { createRadarFromStrategy, suggestedPosition, currentPosition, modelPosition } from '../../_db/common/radarUtils';
import { WidgetTitle } from '../shared/WidgetTitle';
import { radars } from '../../_db/data';
import { Model } from './Model';
import { ClientAlert } from './ClientAlert';
import { ClientCard } from './ClientCard';
import { ClientHistory } from './ClientHistory';
import { Fees } from './Fees';
import { ClientViews } from './ClientViews';

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
  stateStrategy: StrategyItem[],
  radar?: Radar,
  axes: RadarStrategyParm,
  autoplay: boolean,
  currentTargetReturn?: number,
  showModel: boolean,
  somethingIsChanged: boolean,
  viewHistory: boolean,
  processing: string | undefined,
  firstSimulation: boolean,
}

const defaultState: State = {
  breakdown: [],
  stateStrategy: [],
  radar: undefined,
  axes: {
    riskAdequacy: false,
    efficency: false,
    consistency: false,
    riskAnalysis: false,
    concentration: false,
    overlap: false
  },
  autoplay: true,
  showModel: false,
  somethingIsChanged: false,
  validationMode: false,
  viewHistory: false,
  processing: undefined,
  firstSimulation: true,
} as State

const reducer = (state: State, action: Partial<State>): State => {
  return { ...state, ...action }
}

//class ClientViewCompo extends conn.StatefulCompo<State> {
export const ClientView = conn.PureCompo(props => {
  const { client, lang, history,id, getClient,getSuggestions,strategySuccessCount,strategy} = props;
  const [state, dispatch] = React.useReducer(reducer, defaultState);
  const { radar, axes, somethingIsChanged, viewHistory, processing, stateStrategy, breakdown} = state;

  React.useEffect(() => {
    getClient({ id});
    setTimeout(() => {
      selectAllAxes();      
    }, 2000);
  }, [id, getClient]);

  React.useEffect(() => {
    if (strategy.length > 0) {
      const sugg = suggestedPosition(strategy);
      const suggBreakdown = ce.getBreakdown(sugg);
      const radar = createRadarFromStrategy(strategy, id, radars);
      dispatch({
        breakdown: suggBreakdown,
        stateStrategy: strategy,
        radar
      });
    }
  }, [strategy]);

  React.useEffect(() => {
    getSuggestions({ id, position: stateStrategy, axes, calculateFromAxes: true });
  }, [axes]);

  /*
  componentWillUnmount() {
    this.props.getClientSuccess();
  }
  */

  const selectAllAxes = () => {
    const axes = {
      concentration: true,
      consistency: true,
      riskAdequacy: true,
      riskAnalysis: true,
      overlap: true,
      efficency: true
    }
    dispatch({ axes });
  }


  const handleOnChange = (strategy: StrategyItem[]) => {
    /*
    const cb = () => this.setState({ firstSimulation: false, processing: undefined, somethingIsChanged: false }, () => {
      this.props.getSuggestions({ id: this.props.client!.id, position: strategy, axes: this.state.axes, calculateFromAxes: false });
    })
    cb();
    */
  }


  const handleAxesChange = (key: string) => {
    /*
    const axes = { ...this.state.axes, [key]: !this.state.axes[key] };

    this.setState({ processing: 'Requesting new Proposal' },
      () => {
        setTimeout(() => {
          this.setState({ axes, somethingIsChanged: true, processing: undefined }, () => {
            this.props.getSuggestions({ id: this.props.client!.id, position: this.state.strategy, axes: axes, calculateFromAxes: true });
          })
        }, 800);
      }
    )
    */
  }

  const handleSomethingIsChanged = (value: boolean) => {
    dispatch({ somethingIsChanged: value });
  }

  const calculateGraphs = () => {
    let graphs = {
      Performance: {
        title: 'Performance',
        icon: 'line graph',
        charts: radar && [
          {
            title: 'Performance',
            chart: <PerformanceChart key={0}
              data={ce.getPositionPerformance(suggestedPosition(stateStrategy))}
              actualData={ce.getPositionPerformance(currentPosition(stateStrategy))}
              width={700}
              height={413}
              clientTimeHorizon={client!.timeHorizon}
              advancedView={true}
              version={strategySuccessCount}
              onCalculate95TargetRetForClientTimeHorizon={currentTargetReturn => dispatch({ currentTargetReturn })}
              lang={lang} />
          }]
      },
      RiskReturn: {
        title: 'Risk Return',
        icon: 'area graph',
        charts: radar && [
          {
            title: 'Risk Return',
            chart: <RiskReturnGraph key={1}
              data={ce.getRiskReturn(suggestedPosition(stateStrategy), modelPosition(stateStrategy), 'All')}
              width={700}
              height={413}
              lang={lang} />
          }]
      },
      PerfContr: {
        title: 'Perf. Contr.',
        icon: 'area graph',
        charts: radar && [
          {
            title: 'Perf. Contr.',
            chart: <PerformanceContributionGraph key={2}
              data={ce.getPerfContribution(suggestedPosition(stateStrategy))}
              width={700}
              height={413}
              lang={lang} />
          }]
      }
    };

    graphs = breakdown && breakdown.reduce((memo, val, i) => {
      let prop = val.attributeName;
      let title = val.attributeName;

      if (prop === 'MacroAssetClass') {
        title = "MACRO";
        prop = "AssetClass";
      } else if (prop === 'MicroAssetClass') {
        title = "MICRO";
        prop = "AssetClass";
      } else if (prop === 'Rating' || prop === 'Maturity') {
        prop = "Rating";
      }

      const chartView = (prop === "AssetClass" ? 'pie' : prop === 'Rating' ? 'pie' : 'composed');

      const element = (memo[prop] || {
        title: prop,
        icon: chartView === "pie" ? 'pie graph' : 'chart bar',
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


  if (!client || history.length === 0) return <div />
  const graphs = calculateGraphs();
  return (
    <div>

      <AdvancedGrid className="grid-client-view-main" style={{ marginBottom: '10px' }}>
        <Segment style={{ margin: 0 }} >
          <WidgetTitle title={lang.PERSONAL_INFORMATION} />
          <ClientCard client={client} lang={lang} color={'blue'} />
        </Segment>
        <Segment style={{ margin: 0 }}>
          <ClientAlert radar={client.radar} client={client} lang={lang} onOpenHistory={() => dispatch({ viewHistory: true })} />
        </Segment>
        <AdvancedGrid className="grid-client-view-sub">
          <Segment style={{ margin: 0 }}>
            <WidgetTitle title={state.showModel ? lang.MODEL : lang.PORTFOLIO_HOLDINGS} shareButtons={['Excel', 'Pdf', 'Copy']} />
            {state.showModel && <Model
              clientId={client.id} lang={lang} holdings={stateStrategy}
              onShowHoldings={() => dispatch({ showModel: false })}
            />}
            {!state.showModel && <Holdings
              clientId={client.id}
              clientState={client.clientStatus}
              lang={lang}
              holdings={stateStrategy}
              onChange={handleOnChange}
              onAddSecurity={props.addSecurity}
              onAddHistory={props.addHistory}
              onShowModel={() => dispatch({ showModel: true })}
              onSomethingChanged={handleSomethingIsChanged}
              radar={state.radar}
              axes={state.axes}
            />}
            <Fees strategy={stateStrategy} lang={lang} targetReturn={state.currentTargetReturn} timeHorizon={client.timeHorizon} isInSimulationMode={!somethingIsChanged} />
          </Segment>

          <Segment style={{ margin: 0 }}>
            <WidgetTitle title={lang.PORTFOLIO_MONITORING} shareButtons={['Image', 'Pdf', 'Copy']} />
            {radar &&
              <RadarGraph data={radar} lang={lang} axes={axes} onClickShape={handleAxesChange} width={700} height={413} alertsAbout={'actual'} />
            }
            <br />
            <p style={{ textAlign: 'center' }}>Alerts are about: <b>{'proposed'}</b> </p>
          </Segment>
        </AdvancedGrid>

        <AdvancedGrid className="grid-client-view-sub2">
          <Segment style={{ margin: 0 }}>
            <ClientViews graphs={graphs} lang={lang} mode='tab' defaultIndex={3} />
          </Segment>
          {/*}
                    <Segment style={{ margin: 0 }} as={OverflowColumn}>
                        <WidgetTitle title={lang.CLIENT_EVENT_HISTORY} />
                        <ClientHistory lang={lang} history={history} />
                    </Segment>
                        */}
        </AdvancedGrid>
        {viewHistory && <Modal open closeOnDimmerClick={false} closeOnEscape onClose={() => dispatch({ viewHistory: false })}>
          <Modal.Header>
            <Button floated="right" size="tiny" basic negative circular icon="remove" onClick={() => dispatch({ viewHistory: false })} />
            <WidgetTitle title={lang.CLIENT_EVENT_HISTORY} />
          </Modal.Header>
          <Modal.Content>
            <ClientHistory lang={lang} history={history} />
          </Modal.Content>
        </Modal>}

        }
            </AdvancedGrid>
      {processing &&
        <div style={{ opacity: 0.9, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'whitesmoke' }}>
          <Loader style={{ opacity: 1 }} active size="huge">{processing}</Loader>
        </div>}
        <pre>          
          {JSON.stringify(stateStrategy,null,2)}
        </pre>
    </div>
  )
});
//export const ClientView = conn.connect(ClientViewCompo);
