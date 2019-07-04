import * as React from 'react';

import { Radar as RadarModel, RadarStrategyParm } from '../../_db/interfaces';
import { LangDictionary } from '../../reducers/language/interfaces';
import { getRAG } from '../../_db/common/radarUtils';
import { ChartBaseProps } from './ChartInterface';

var { Radar, Legend, ResponsiveContainer, RadarChart, PolarAngleAxis, PolarRadiusAxis, PolarGrid, Text } = require('recharts');

interface RadarGraphProps extends ChartBaseProps {
  data: RadarModel,
  hideProposal?: boolean,
  lang: LangDictionary,
  axes?: RadarStrategyParm,
  onClick?: () => void,
  onClickShape?: (subject: string) => void
  alertsAbout: 'actual' | 'proposed'
}

export const RadarGraph = (props: RadarGraphProps) => {
  const { lang } = props;
  const { legend = true, caption = true, actions = true } = props;

  const d = props.data;

  const alertColors = props.alertsAbout === 'actual' ? {
    consistency: getRAG(d.actual.consistency, d.limits.consistency, false),
    overlap: getRAG(d.actual.overlap, d.limits.overlap, false),
    efficency: getRAG(d.actual.efficency, d.limits.efficency, false),
    concentration: getRAG(d.actual.concentration, d.limits.concentration, false),
    riskAnalysis: getRAG(d.actual.riskAnalysis, d.limits.riskAnalysis, false),
    riskAdequacy: getRAG(d.actual.riskAdequacy, d.limits.riskAdequacy, true)
  } : {
      consistency: getRAG(d.proposed.consistency, d.limits.consistency, false),
      overlap: getRAG(d.proposed.overlap, d.limits.overlap, false),
      efficency: getRAG(d.proposed.efficency, d.limits.efficency, false),
      concentration: getRAG(d.proposed.concentration, d.limits.concentration, false),
      riskAnalysis: getRAG(d.proposed.riskAnalysis, d.limits.riskAnalysis, false),
      riskAdequacy: getRAG(d.proposed.riskAdequacy, d.limits.riskAdequacy, true)
    };

  const alertNames = {
    consistency: lang.ALERTS.consistencyAlert,
    overlap: lang.ALERTS.overlapAlert,
    efficency: lang.ALERTS.efficencyAlert,
    concentration: lang.ALERTS.concentrationAlert,
    riskAnalysis: lang.ALERTS.riskAnalysisAlert,
    riskAdequacy: lang.ALERTS.riskAdequacyAlert
  }

  const KKK = 1 / 25;

  const data = [

    {
      subject: 'consistency',
      filter: 'consistency',
      actual: d.actual.consistency * KKK,
      limits: d.limits.consistency * KKK,
      guideLines: d.guideLines.consistency * KKK,
      proposed: d.proposed.consistency * KKK,
      fullMark: 6
    },

    {
      subject: 'efficency',
      filter: 'efficency',
      actual: d.actual.efficency * KKK,
      limits: d.limits.efficency * KKK,
      guideLines: d.guideLines.efficency * KKK,
      proposed: d.proposed.efficency * KKK,
      fullMark: 6
    },
    {
      subject: 'riskAdequacy',
      filter: 'riskAdequacy',
      actual: d.actual.riskAdequacy * KKK,
      limits: d.limits.riskAdequacy * KKK,
      guideLines: d.guideLines.riskAdequacy * KKK,
      proposed: d.proposed.riskAdequacy * KKK,
      fullMark: 6
    },
    {
      subject: 'overlap',
      filter: 'overlap',
      actual: d.actual.overlap * KKK,
      limits: d.limits.overlap * KKK,
      guideLines: d.guideLines.overlap * KKK,
      proposed: d.proposed.overlap * KKK,
      fullMark: 6
    },
    {
      subject: 'concentration',
      filter: 'concentration',
      actual: d.actual.concentration * KKK,
      limits: d.limits.concentration * KKK,
      guideLines: d.guideLines.concentration * KKK,
      proposed: d.proposed.concentration * KKK,
      fullMark: 6
    },
    {
      subject: 'riskAnalysis',
      filter: 'riskAnalysis',
      actual: d.actual.riskAnalysis * KKK,
      limits: d.limits.riskAnalysis * KKK,
      guideLines: d.guideLines.riskAnalysis * KKK,
      proposed: d.proposed.riskAnalysis * KKK,
      fullMark: 6
    },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%" >
      <RadarChart cx='50%' cy='50%' startAngle={60} endAngle={420} width={100} height={100} data={data} outerRadius={'80%'} isAnimationActive startWithAnimation  >
        {legend && <Legend verticalAlign="bottom" />}
        <Radar name="Actuals" dataKey="actual" stroke="#54C8FF" fill="#54C8FF" fillOpacity={1} dot />
        {props.hideProposal !== true && <Radar name="Proposed" dataKey="proposed" stroke="green" fill="green" fillOpacity={0.8} dot />}
        <Radar name="Guidelines" dataKey="guideLines" stroke="red" strokeWidth={3} fill="#00f" fillOpacity={0} />
        <PolarGrid stroke="grey" />
        <PolarRadiusAxis angle={30} />
        <PolarAngleAxis dataKey="subject" tick={caption && <CustomizedShape axes={props.axes} names={alertNames} colors={alertColors} onClickShape={props.onClickShape} />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

const CustomizedShape = (props: any) => {
  let { x, y, axes, onClickShape, textAnchor, names, colors } = props;

  const value = props.payload.value;
  const KK = 5;
  x = (value === 'efficency' || value === 'consistency' || value === 'riskAnalysis') ? x + KK : x - KK;
  if (value === 'concentration' || value === 'riskAnalysis') y = y + KK;
  if (value === 'efficency' || value === 'riskAdequacy') y = y - KK;

  const color = colors[value];
  const selected = axes[value];
  const alarmed = color !== "green";

  const actualX = selected || alarmed ? (textAnchor === "start" ? x + 15 : x - 15) : x;
  const actualY = y + 5;
  const selectable = onClickShape && value !== 'riskAdequacy';
  const selectableClass = selectable ? "selectable" : undefined;
  return (
    <g style={{ cursor: selectable ? 'pointer' : 'not-allowed' }} onClick={() => selectable && onClickShape(value)} className={selectableClass} >
      {
        alarmed ?
          (
            <path fill={color} transform={`translate(${x - 12},${y - 12})`} d="M17.8 14.7l1.7-4.7c1-2.8-.5-5.5-3.5-6.6s-5.9 0-6.9 2.8l-1.7 4.7c-.7 1.9-1 2.8-2.9 2.1l-.3 1 14.1 5.1.3-.9c-1.9-.7-1.5-1.6-.8-3.5zM12 19.8l-2.8-1c-.3.9.8 2.4 2.1 2.9s3.2.1 3.5-.9l-2.8-1z" />
          ) : null
      }
      <Text {...props} x={actualX} y={actualY} fill={selected ? "grey" : "lightgrey"}>{`${names[value].name}`}</Text>
    </g >
  );
};
