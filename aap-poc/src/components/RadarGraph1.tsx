import * as React from 'react';
import { Radar as RadarModel } from '../_db/interfaces';
import { Segment } from 'semantic-ui-react';

var { Radar, Legend, ResponsiveContainer, RadarChart, PolarAngleAxis, PolarGrid } = require('recharts');

export const RadarGraph = (props: { data: RadarModel, width: number, height: number, onClick?: () => void }) => {
  const d = props.data;
  const data = [
    {
      subject: 'Consistency',
      actual: d.actual.consistency,
      limits: d.limits.consistency,
      guideLines: d.guideLines.consistency,
      proposed: d.proposed.consistency,
      fullMark: 6
    },
    {
      subject: 'Concentration',
      actual: d.actual.concentration,
      limits: d.limits.concentration,
      guideLines: d.guideLines.concentration,
      proposed: d.proposed.concentration,
      fullMark: 6
    },
    {
      subject: 'Efficency',
      actual: d.actual.efficency,
      limits: d.limits.efficency,
      guideLines: d.guideLines.efficency,
      proposed: d.proposed.efficency,
      fullMark: 6
    },
    {
      subject: 'Overlap',
      actual: d.actual.overlap,
      limits: d.limits.overlap,
      guideLines: d.guideLines.overlap,
      proposed: d.proposed.overlap,
      fullMark: 6
    },
    {
      subject: 'Risk Adequacy',
      actual: d.actual.riskAdequacy,
      limits: d.limits.riskAdequacy,
      guideLines: d.guideLines.riskAdequacy,
      proposed: d.proposed.riskAdequacy,
      fullMark: 6
    },
    {
      subject: 'Risk Analysis',
      actual: d.actual.riskAnalysis,
      limits: d.limits.riskAnalysis,
      guideLines: d.guideLines.riskAnalysis,
      proposed: d.proposed.riskAnalysis,
      fullMark: 6
    },
  ];

  const radius = '70%';//props.width / 4.5;
  return (

    <Segment basic textAlign="center">

      {props.onClick ?
        < h5 style={{ cursor: 'pointer' }} onClick={props.onClick && props.onClick}> Radar</h5>
        : null
      }
      <ResponsiveContainer width="100%" height={props.height}>
        <RadarChart cx='50%' cy='50%'
          width={props.width} height={props.height}
          data={data} outerRadius={radius}
        >
          <Legend height={1} verticalAlign="bottom" />
          {/*<Radar name="Limits" dataKey="limits" stroke="blue" fill="#D10505" fillOpacity={0} />*/}
          <Radar name="Actuals" dataKey="actual" stroke="orange" fill="#ff8c00" fillOpacity={0.4} dot />
          <Radar name="Guidelines" dataKey="guideLines" stroke="red" strokeWidth={2} fill="# 00f" fillOpacity={0} />
          <Radar name="Proposed" dataKey="proposed" stroke="green" fill="#32cd32" fillOpacity={0.2} dot />
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          {/* <PolarRadiusAxis angle={30} domain={[0, 6]} /> */}
        </RadarChart>
      </ResponsiveContainer>
    </Segment>

    // <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={data}>
    //     <Radar name="Actuals" dataKey="actual" stroke="red" fill="#8884d8" fillOpacity={0} />
    //     <Radar name="Limits" dataKey="limits" stroke="yellow" fill="#8884d8" fillOpacity={0} />
    //     <Radar name="Guidelines" dataKey="guideLines" stroke="blue" fill="#8884d8" fillOpacity={0.2} />
    //     <Radar name="Proposed" dataKey="proposed" stroke="green" fill="#8884d8" fillOpacity={0} />
    //     <PolarGrid />
    //     <Legend />
    //     <PolarAngleAxis dataKey="subject" />
    //     <PolarRadiusAxis angle={30} domain={[0, 6]} />
    // </RadarChart>

  );
}
