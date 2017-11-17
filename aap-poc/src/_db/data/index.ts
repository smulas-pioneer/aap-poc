import { securities as securityList } from '../common/securities';
import { Security, StrategyItem, Client, AlertHistory, InterviewResult } from '../common/interfaces';

export const group = <T>(data: T[], key: keyof (T)) => data.reduce(
    (p, c) => {
        p[key] = c;
        return p;
    },
    {} as { [id: string]: T }
);

//PERFORMANCES
let performances: { [isin: string]: { date: string, perf: number }[] };
fetch('/performances.json').then(r => r.json()).then(p => performances = p);

let perfSummary: { [isin: string]: { date: string, perf: number }[] };
fetch('/perfSummary.json').then(r => r.json()).then(p => perfSummary = p);

//SECURITIES
let securities2: Security[];
fetch('/securities2.json').then(r => r.json()).then(p => {
    securities2 = securityList.concat(p);
});

//SECURITIES
let clients: Client[];
fetch('/clients.json').then(r => r.json()).then(p => {
    clients = p
});

//STRATEGIES
let strategies: { [isin: string]: StrategyItem[] };
fetch('/strategy.json').then(r => r.json()).then(p => strategies = p);

//ALERT HISTORY
let alertHistory: AlertHistory[] ;
fetch('/alertHistory.json').then(r => r.json()).then(p => alertHistory = p);

//History
let history: { [isin: string]: InterviewResult[] };
fetch('/history.json').then(r => r.json()).then(p => history = p);

//ALERT HISTORY
let agents: string[] ;
fetch('/agents.json').then(r => r.json()).then(p => agents = p);


export { securities2 as securityList, clients as clientList,  history, agents, strategies, performances, alertHistory, perfSummary };
