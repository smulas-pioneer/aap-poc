import moment from 'moment';
import { securities as securityList, wrapSecurity } from '../common/securities';
import { Security, StrategyItem, Client, AlertHistory, InterviewResult } from '../common/interfaces';
import { Radar } from '../interfaces';
import { updateStrategies } from '../fakedata1';

export const group = <T>(data: T[], key: keyof (T)) => data.reduce(
  (p, c) => {
    p[key as string] = c;
    return p;
  },
  {} as { [id: string]: T }
);

let radars: { [id: string]: Radar };
let performances: { [isin: string]: { date: string, perf: number }[] };
let perfSummary: { [isin: string]: { date: string, perf: number }[] };
let securities2: Security[];
let clients: Client[];
let strategies: { [isin: string]: StrategyItem[] };
let alertHistory: AlertHistory[];
let history: { [isin: string]: InterviewResult[] };
let agents: string[];

export const loadDatabase = (appName: string) => {
  const baseUrl = appName === "" ? "" : "/" + appName;
  const tag = process.env.REACT_APP_ENABLE_DATA_CACHE === 'true' ? '' : "?ts=" + moment().format('YYMMDDhhmmss');

  let procs = [];

  procs.push(fetch(baseUrl + '/radars.json' + tag).then(r => r.json()).then(p => radars = p));

  //PERFORMANCES
  procs.push(fetch(baseUrl + '/performances.json' + tag).then(r => r.json()).then(p => {
    performances = p
    performances['NL0011585146'] = performances['NL0011585146'].map(i => {
      return { ...i, perf: i.perf / 5 };
    });
  }));

  procs.push(fetch(baseUrl + '/perfSummary.json' + tag).then(r => r.json()).then(p => perfSummary = p));

  //SECURITIES
  procs.push(fetch(baseUrl + '/securities2.json' + tag).then(r => r.json()).then(p => {
    securities2 =
      (securityList).map((p: any) => ({ ...p, blacklisted: p.Rating === "BBB" && p.Sector === "Utilities" }))
        .concat(p)
        .map((r: any) => ({
          ...r, pushed:
            r.SecurityName.toLowerCase().indexOf("amundi") > -1 ||
            r.SecurityName.toLowerCase().indexOf("pioneer") > -1
        })).map((s: any) => wrapSecurity(s))
  }));

  //SECURITIES
  procs.push(fetch(baseUrl + '/clients.json' + tag).then(r => r.json()).then(p => {
    clients = p
    clients[1].modelName = "Balanced";
    clients[1].clientRiskProfile = "Dynamic";
    clients[1].name = "Costanzo Bianchi";
    clients[1].email = "costanzo.bianchi@gmail.com";
    clients[1].bornDate = "1968-12-21";
    clients[1].timeHorizon = "10 Years";
    clients[1].projectAccomplishment = 60;
    clients[1].project = "Retirement";
  }));

  //STRATEGIES
  procs.push(fetch(baseUrl + '/strategy.json' + tag).then(r => r.json()).then(p => {
    strategies = p
    updateStrategies();
  }));

  //ALERT HISTORY
  procs.push(fetch(baseUrl + '/alertHistory.json' + tag).then(r => r.json()).then(p => alertHistory = p));

  //History
  procs.push(fetch(baseUrl + '/history.json' + tag).then(r => r.json()).then(p => history = p));

  //ALERT HISTORY
  procs.push(fetch(baseUrl + '/agents.json' + tag).then(r => r.json()).then(p => agents = p));

  return Promise.all(procs);
}

export { radars, securities2 as securityList, clients as clientList, history, agents, strategies, performances, alertHistory, perfSummary };
