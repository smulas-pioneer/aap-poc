import { LangDictionary } from '../../reducers/language/interfaces';
import * as React from 'react';
import { Client } from '../../_db/interfaces';
import { Grid, Statistic, SemanticCOLORS } from 'semantic-ui-react';
export const ClientCard = (props: {
  client: Client;
  lang: LangDictionary;
  color?: SemanticCOLORS;
}) => {
  const { client, lang, color } = props;
  const fmt1 = new Intl.NumberFormat(lang.NUMBER_FORMAT, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const renderColumns = (data: {
    [label: string]: string | number;
  }, right?: boolean) => {
    return <Grid.Column textAlign={right ? "right" : "left"} style={{ fontSize: 'small', paddingTop: 0 }}>
      {Object.keys(data).map((d, i) => {
        return <div key={i}>
         {/*
          <b>{d}:</b> &nbsp; {data[d]}
         */}
         <b>{d}</b><p>{data[d]}</p>
        </div>;
      })}
    </Grid.Column>;
  };

  const otherBanks = client.aua * 0.22;
  const realEstate = client.aua * 0.83;
  const totalWealth = client.aua + otherBanks + realEstate;

  return (<Grid basic='very' verticalAlign="top" >
    <Grid.Row>
      <Grid.Column width="12">
        <Statistic size="mini" color={color}>
          <Statistic.Value>
            {/*<Icon size="small" name={'user'} inverted circular color={color} />&nbsp;*/}
          {client.name}</Statistic.Value>
        </Statistic>
      </Grid.Column>
      <Grid.Column width="4" textAlign="right">
        <Statistic size="mini" color={color}>
          <Statistic.Value>{`${fmt1.format(client.aua)} €`}</Statistic.Value>
        </Statistic>
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column width={16} style={{ margin: 0 }}>
        <Grid columns="equal">
          {renderColumns({ [lang.TIME_HORIZON]: client.timeHorizon })}
          {renderColumns({ [lang.RISKPROFILE]: client.clientRiskProfile })}
          {renderColumns({ [lang.MODEL]: client.modelName })}
          {renderColumns({ "Other Banks": fmt1.format(otherBanks) + "€" },true)}
          {renderColumns({ "Real Estate": fmt1.format(realEstate) + "€" },true)}
          {renderColumns({ "Tot. Wealth": fmt1.format(totalWealth) + "€" },true)}
          {/*
          {renderColumns({ 'Birth Date': client.bornDate || '1972-12-21', 'Entry Date': client.lastAdvicedate, 'Segment': client.segment, 'Branch': client.branch })}
          {renderColumns({ 'Address': client.address.streetAddress, 'City': client.address.city, 'Tel': client.phone, 'Email': client.email })}
          {renderColumns({ 'Risk Profile': client.clientRiskProfile, 'Model': client.modelName, [lang.TIME_HORIZON]: client.timeHorizon, 'Product Appropriateness': client.productAppropriateness })}
          {renderColumns({ 'Project': client.project, '% of Project Accomplishment': `${client.projectAccomplishment}%`, '% of Discount Fees': `${client.percentageOfDiscountFees}%` }, true)}
           */}
        </Grid>
      </Grid.Column>
    </Grid.Row>
  </Grid>);
};
