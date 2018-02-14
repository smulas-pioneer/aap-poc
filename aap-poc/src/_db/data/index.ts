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

    fetch(appName + '/radars.json').then(r => r.json()).then(p => radars = p);

    //PERFORMANCES
    fetch(appName + '/performances.json').then(r => r.json()).then(p => performances = p);

    fetch(appName + '/perfSummary.json').then(r => r.json()).then(p => perfSummary = p);

    //SECURITIES
    fetch(appName + '/securities2.json').then(r => r.json()).then(p => {
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
    fetch(appName + '/clients.json').then(r => r.json()).then(p => {
        clients = p
    });

    //STRATEGIES
    fetch(appName + '/strategy.json').then(r => r.json()).then(p => {
        strategies = p
        updateStrategies();
    });

    //ALERT HISTORY
    fetch(appName + '/alertHistory.json').then(r => r.json()).then(p => alertHistory = p);

    //History
    fetch(appName + '/history.json').then(r => r.json()).then(p => history = p);

    //ALERT HISTORY
    fetch(appName + '/agents.json').then(r => r.json()).then(p => agents = p);
}

export { radars, securities2 as securityList, clients as clientList, history, agents, strategies, performances, alertHistory, perfSummary };
