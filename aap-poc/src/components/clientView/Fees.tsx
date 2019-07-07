import { LangDictionary } from '../../reducers/language/interfaces';
import { StrategyItem, TimeHorizon, TimeHorizonMonths } from '../../_db/interfaces';
import * as React from 'react';
import { sumBy } from 'lodash';
import { Segment, Statistic } from 'semantic-ui-react';
export const Fees = (props: {
  strategy: StrategyItem[];
  lang: LangDictionary;
  targetReturn?: number;
  timeHorizon: TimeHorizon;
  isInSimulationMode: boolean;
}) => {
  const { lang, strategy } = props;
  const months = TimeHorizonMonths[props.timeHorizon];
  const fmt = new Intl.NumberFormat(lang.NUMBER_FORMAT, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const fmt2 = new Intl.NumberFormat(lang.NUMBER_FORMAT, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const fees = Math.round(sumBy(strategy.filter(s => s.suggestionAccepted), s => s.fee * Math.abs(s.suggestedDelta * s.currentAmount) * .05));
  const perc = 100 * fees / sumBy(strategy, v => v.currentAmount);
  const amount = sumBy(strategy, s => s.currentAmount);
  return <Segment basic clearing>
    {props.isInSimulationMode
      ? <Segment floated="right" basic compact style={{ padding: 0 }}>
        <Statistic size="mini" color="blue">
          <Statistic.Value>{lang.RESULTS}:</Statistic.Value>
        </Statistic>
        <Statistic size="mini">
          <Statistic.Value>{fmt.format(fees)} €</Statistic.Value>
          <Statistic.Label>{lang.UPFRONT_FEES}</Statistic.Label>
        </Statistic>
        <Statistic size="mini">
          <Statistic.Value> {perc > 0 ? '-' : ''} {fmt.format(perc)} %</Statistic.Value>
          <Statistic.Label>{lang.ONGOING_FEES}</Statistic.Label>
        </Statistic>
        {props.targetReturn && <Statistic size="mini">
          <Statistic.Value>{fmt.format(amount * (props.targetReturn / 100))} €</Statistic.Value>
          <Statistic.Label>{lang.TARGET_RESULT} </Statistic.Label>
          <Statistic.Label style={{ fontSize: 10 }}>(prob. 95%)</Statistic.Label>
        </Statistic>}
        {props.targetReturn && <Statistic size="mini">
          <Statistic.Value>{fmt2.format(props.targetReturn * 120 / months)}%</Statistic.Value>
          <Statistic.Label>{"EXPECTED RETURN"} </Statistic.Label>
          <Statistic.Label style={{ fontSize: 10 }}>(Yearly Based, prob. 95%)</Statistic.Label>
        </Statistic>}
        {props.targetReturn && <Statistic size="mini">
          <Statistic.Value>{props.timeHorizon}</Statistic.Value>
          <Statistic.Label>{lang.TIME_HORIZON}</Statistic.Label>
        </Statistic>}
      </Segment>
      : <Segment basic compact style={{ padding: 0 }}>
        <Statistic size="mini" color="blue">
          <Statistic.Value>{lang.RESULTS}:</Statistic.Value>
        </Statistic>
        <Statistic size="mini">
          <Statistic.Label>Press <b>Simulate</b></Statistic.Label>
          <Statistic.Label>to calculate Fees</Statistic.Label>sm
        </Statistic>
      </Segment>
    }
  </Segment>;
};
