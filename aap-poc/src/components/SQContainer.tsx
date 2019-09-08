import * as React from 'react';
import { Grid, Segment, Statistic, SemanticCOLORS, SemanticICONS, Icon } from 'semantic-ui-react';
import { AdvancedGrid } from './shared/GridOverflow';
import MenuFlat from './MenuFlat';
import { getColorCustomClassName, formatNumber, formatAua } from '../_db/utils';
import { appConnector } from 'app-support';
import { getSearchResult, getLanguage } from '../reducers';
import { searchClient } from '../actions/index';
import { FilterMapTypes } from '../actions/model';
import { Children } from 'react';
import { homeConfiguration } from '../SQ/constants/ApplicationStrings';
import { flatten } from 'lodash';
const sprintf = require("sprintf-js").sprintf;
const conn = appConnector<{ uid: string, children: any, urlId: string }>()(
  (s, p) => ({
    data: getSearchResult(s, p.uid),
    // filter: getSearchFilter(s, p.uid),
    lang: getLanguage(s),
    // layout: getConfigLayout(s),
    // isOnlyItaly: getIsOnlyItaly(s, p.uid),
    // isCountryActive: getIsCountryActive(s, p.uid),
    // isRegionActive: getIsRegionActive(s, p.uid)
  }),
  {
    searchClient,
  }
)


const renderItem = (value: any, label?: string, sublabel?: any, color?: SemanticCOLORS, sublabelcolor?: SemanticCOLORS, valueIcon?: SemanticICONS) => {
  return (<Statistic size="mini" color={color || 'blue'} >
    {label && <Statistic.Label>{label}</Statistic.Label>}
    <Statistic.Value style={{ marginTop: '5px', whiteSpace: 'nowrap' }}>
      {valueIcon && <Icon name={valueIcon} color={color} />}
      {value}
    </Statistic.Value>
    {sublabel && <Statistic.Label style={{ marginTop: '10px', whiteSpace: 'nowrap' }} className={getColorCustomClassName(sublabelcolor)}>
      {sublabel}
    </Statistic.Label>}
  </Statistic>);
}

export const SQContainer = conn.PureCompo(props => {
  React.useEffect(() => {
    props.searchClient({ uid: props.uid, filter: '', reset: true });
    //props.login(LoginType.Manager);
  }, []);
  const { lang } = props;
  const alertsDetail = (numOfAlerts: string) => sprintf(lang.DB_ALERTS_DETAIL, numOfAlerts);
  const percDetail = (value: number | undefined, from: string, period: 'Y' | 'M' | 'D', info?: string) => sprintf(props.lang.DB_PERC_DETAIL, (value ? value + '% ' : ''), (info ? info + ' ' : ''), from, period === 'Y' ? props.lang.YEAR : period === 'M' ? props.lang.MONTH : props.lang.DAY);
  const fmt = formatNumber(props.lang.NUMBER_FORMAT);
  const info = props.data && props.data.result.reduce<
    { length: number, assetUnder: number, clientAlert: number, mifidAlert: number, acceptedProposals: number, totalProposals: number, rejectedProposals: number, totalBudget: number, totRevenues: number, totalTurnover: number }>(
      (ret, v, i) => {
        ret.length += 1;
        ret.totalBudget += v.budget;
        ret.totRevenues += v.ongoingFees + v.upfrontFees;
        ret.acceptedProposals += v.numOfAcceptedProposal / 2;
        ret.totalProposals += v.numOfInterviews / 2;
        ret.assetUnder += v.aua;
        ret.clientAlert += v.radar.numOfAlerts > 0 ? 1 : 0;
        ret.mifidAlert += v.radar.riskAdequacyAlert !== 'green' ? 1 : 0;
        ret.totalTurnover += v.turnover;
        return ret;
      },
      { length: 0, assetUnder: 0, clientAlert: 0, mifidAlert: 0, acceptedProposals: 0, totalProposals: 0, rejectedProposals: 0, totalBudget: 0, totRevenues: 0, totalTurnover: 0 });
  if (!info) return null;

  const urlToOpen =  flatten(homeConfiguration.map(i=>i.sections)).find(i=>i.title=== props.urlId)!.url;
    console.log('url to open',urlToOpen);


return (
    <AdvancedGrid className="grid-header-fix ui-col" >
      <Segment compact style={{ width: '100%' }} >
        <Grid columns={7}   >
          <Grid.Column textAlign="center" >
            {renderItem(fmt(info.length), lang.DB_TOTAL_CLIENTS, percDetail(6.9, '1', 'Y'), 'blue', 'green')}
          </Grid.Column>
          <Grid.Column textAlign="center">
            {renderItem(formatAua(info.assetUnder, fmt), lang.DB_ASSET_ADVISE, percDetail(15, '1', 'Y'), 'blue', 'green')}
          </Grid.Column>
          <Grid.Column textAlign="center">
            {renderItem(fmt(info.clientAlert), lang.DB_CLIENTS_ALERTS, alertsDetail(fmt(info.mifidAlert)), 'red')}
          </Grid.Column>
          <Grid.Column textAlign="center">
            {renderItem(fmt(info.totalTurnover / info.length) + "%", lang.TURNOVER, '', 'blue', 'green')}
          </Grid.Column>
          <Grid.Column textAlign="center">
            {renderItem(fmt(info.totalBudget) + "€", lang.BUDGET, Math.round(100 * (info.totRevenues / info.totalBudget)).toString() + '% accomplished YTD', 'blue', 'green')}
          </Grid.Column>
          <Grid.Column textAlign="center" >
            {renderItem(fmt(info.acceptedProposals), lang.DB_CLIENT_ACCEPTED_PROPOSALS, `${lang.OUT_OF} ${fmt(info.totalProposals)} (${Math.round(100 * (info.acceptedProposals / info.totalProposals)).toString() + '%)'}`, 'blue')}
          </Grid.Column>
          <Grid.Column className="col-user-menu">
            {props.children}
          </Grid.Column>
        </Grid>
      </Segment>
      <iframe src={urlToOpen} width="100%" height="100%"></iframe>
    </AdvancedGrid >

  );
});

