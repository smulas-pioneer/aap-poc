import { securities as securityList, wrapSecurities } from '../common/securities';
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

export const loadDatabase = (appName: string) => {
    const baseUrl = appName === "" ? "" : "/" + appName;


    fetch(baseUrl + '/radars.json').then(r => r.json()).then(p => radars = p);

    //PERFORMANCES
    fetch(baseUrl + '/performances.json').then(r => r.json()).then(p => performances = p);

    fetch(baseUrl + '/perfSummary.json').then(r => r.json()).then(p => perfSummary = p);

    //SECURITIES
    fetch(baseUrl + '/securities2.json').then(r => r.json()).then(p => {
        securities2 =
            (securityList).map((p: any) => ({ ...p, blacklisted: p.Rating == "BBB" && p.Sector == "Utilities" }))
                .concat(p)
                .map((r: any) => ({
                    ...r, pushed:
                        r.SecurityName.toLowerCase().indexOf("amundi") > -1 ||
                        r.SecurityName.toLowerCase().indexOf("pioneer") > -1
                }))
    });

    //SECURITIES
    fetch(baseUrl + '/clients.json').then(r => r.json()).then(p => {
        clients = p
    });

    //STRATEGIES
    fetch(baseUrl + '/strategy.json').then(r => r.json()).then(p => {
        strategies = p
        updateStrategies();
    });

    //ALERT HISTORY
    fetch(baseUrl + '/alertHistory.json').then(r => r.json()).then(p => alertHistory = p);

    //History
    fetch(baseUrl + '/history.json').then(r => r.json()).then(p => history = p);

    //ALERT HISTORY
    fetch(baseUrl + '/agents.json').then(r => r.json()).then(p => agents = p);
}

export { radars, securities2 as securityList, clients as clientList, history, agents, strategies, performances, alertHistory, perfSummary };
