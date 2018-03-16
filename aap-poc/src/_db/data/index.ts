import { securities as securityList, wrapSecurities, wrapSecurity } from '../common/securities';
import { Security, StrategyItem, Client, AlertHistory, InterviewResult } from '../common/interfaces';
import { Radar } from '../interfaces';
import { updateStrategies } from '../fakedata1';

export const group = <T>(data: T[], key: keyof (T)) => data.reduce(
    (p, c) => {
        p[key] = c;
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
import * as moment from 'moment';

export const loadDatabase = (appName: string) => {
    const baseUrl = appName === "" ? "" : "/" + appName;
    const tag = "?ts="+ moment().format('YYMMDDhhmmss');

    fetch(baseUrl + '/radars.json'+tag).then(r => r.json()).then(p => radars = p);

    //PERFORMANCES
    fetch(baseUrl + '/performances.json'+tag).then(r => r.json()).then(p => performances = p);

    fetch(baseUrl + '/perfSummary.json'+tag).then(r => r.json()).then(p => perfSummary = p);

    //SECURITIES
    fetch(baseUrl + '/securities2.json'+tag).then(r => r.json()).then(p => {
        securities2 =
            (securityList).map((p: any) => ({ ...p, blacklisted: p.Rating == "BBB" && p.Sector == "Utilities" }))
                .concat(p)
                .map((r: any) => ({
                    ...r, pushed:
                        r.SecurityName.toLowerCase().indexOf("amundi") > -1 ||
                        r.SecurityName.toLowerCase().indexOf("pioneer") > -1
                })).map((s:any)=>wrapSecurity(s))
    });

    //SECURITIES
    fetch(baseUrl + '/clients.json'+tag).then(r => r.json()).then(p => {
        clients = p
    });

    //STRATEGIES
    fetch(baseUrl + '/strategy.json'+tag).then(r => r.json()).then(p => {
        strategies = p
        updateStrategies();
    });

    //ALERT HISTORY
    fetch(baseUrl + '/alertHistory.json'+tag).then(r => r.json()).then(p => alertHistory = p);

    //History
    fetch(baseUrl + '/history.json'+tag).then(r => r.json()).then(p => history = p);

    //ALERT HISTORY
    fetch(baseUrl + '/agents.json'+tag).then(r => r.json()).then(p => agents = p);
}

export { radars, securities2 as securityList, clients as clientList, history, agents, strategies, performances, alertHistory, perfSummary };
