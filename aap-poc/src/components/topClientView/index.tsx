import * as React from "react";
import { LangDictionary } from "../../reducers/language/interfaces";
import { Client } from "../../_db/interfaces";
import { IndicatorType, IndicatorOptionsType } from "../../actions/model";
import { Dictionary, groupBy, sumBy } from "lodash";
import { TopClientOptionSelection, TopClientOptionSelector } from "./TopClientOptionSelector";
import { TopClientList } from "./TopClientList";


export interface TopClientProps {
    lang: LangDictionary,
    clients: Client[],
    max?: number
}

export interface TopClientItem {
    country: string,
    region: string,
    city: string,
    branch: string,
    advisor: string,

    totals: {[K in IndicatorType]: number };
}

interface TopClientState {
    currentGroup: GroupTypes;
    currentIndicator: IndicatorOptionsType;
    currentData: TopClientItem[];
}

export enum GroupTypes { Country= 0,Region ,  Branch, Advisor };
export type GroupType = keyof typeof GroupTypes;

export class TopClient extends React.Component<TopClientProps, TopClientState> {

    constructor(props: TopClientProps) {
        super(props);
        this.state = {
            currentGroup: GroupTypes.Region,
            currentIndicator: IndicatorOptionsType.clients,
            currentData: this.calculateData(props.clients, GroupTypes.Region, IndicatorOptionsType.clients)
        }
        this.onOptionsChange = this.onOptionsChange.bind(this);
        this.calculateData = this.calculateData.bind(this);
    }

    componentWillReceiveProps(next: TopClientProps) {
        const currentData = this.calculateData(next.clients);
        this.setState(prev => ({ currentData }));
    }

    calculateData(clients: Client[], group?: GroupTypes, indicator?: IndicatorOptionsType) {
        let groupCheck = group !== undefined ? group : this.state.currentGroup;
        let indiCheck = indicator !== undefined ? indicator : this.state.currentIndicator;

        let recs: TopClientItem[] = [];
        let grouped: Dictionary<Client[]> = {};

        switch (groupCheck) {
            case GroupTypes.Region: {
                grouped = groupBy(clients, d => d.address.region);
                break;
            }

            case GroupTypes.Branch: {
                grouped = groupBy(clients, d => d.branch);
                break;
            }
            case GroupTypes.Advisor: {
                grouped = groupBy(clients, d => d.agent);
                break;
            }
            case GroupTypes.Country: {
                grouped = groupBy(clients, d => d.country);
                break;
            }
        }

        for (let key in grouped) {
            const sumAua = sumBy(grouped[key], c => c.aua);
            const countClients = grouped[key].length;
            const sumInterviews = sumBy(grouped[key], c => c.numOfInterviews);
            const sumAcceptedProposals = sumBy(grouped[key], c => c.numOfAcceptedProposal);
            const countWithAlerts = grouped[key].filter(c => c.radar.numOfAlerts > 0).length;
            const sumUpfrontFees = sumBy(grouped[key], c => c.upfrontFees);
            const sumOngoingFees = sumBy(grouped[key], c => c.ongoingFees);
            const sumBudget = sumBy(grouped[key], c => c.budget);
            const sumTurnover = sumBy(grouped[key], c => c.turnover) / grouped[key].length;
         //   const sumAllocation = sumBy(grouped[key], c => c.allocationKPI) / grouped[key].length;
            let first = grouped[key][0];
            recs.push({
                country: first.country,
                region: first.address.region,
                city: first.address.city,
                branch: first.branch,
                advisor: first.agent,
                totals: {
                    alerts: countWithAlerts,
                    aua: sumAua,
                    clients: countClients,
                    proposals: sumInterviews,
                    acceptedProposals: sumAcceptedProposals,
                    upfrontFees: sumUpfrontFees,
                    ongoingFees: sumOngoingFees,
                    budget: sumBudget,
                    turnover: sumTurnover,
           //         allocation: sumAllocation,
                    budgetAccomplishedYTD: Math.round(100 * (sumUpfrontFees + sumOngoingFees) / sumBudget)
                }
            });
        }

        return recs.sort((a, b) => {
            let keySort = IndicatorOptionsType[indiCheck];
            const rev = indiCheck === IndicatorOptionsType.alerts ? -1 : 1;
            return a.totals[keySort] <= b.totals[keySort] ? 1 * rev : -1 * rev;
        }).slice(0, this.props.max || 10);
    }

    onOptionsChange(e: TopClientOptionSelection) {
        let newState: Partial<TopClientState> = {};
        if (e.Group !== undefined) newState.currentGroup = e.Group;
        if (e.Indicator !== undefined) newState.currentIndicator = e.Indicator;
        newState.currentData = this.calculateData(this.props.clients, newState.currentGroup, newState.currentIndicator);
        this.setState(prev => newState as any);
    }

    render() {
        const { currentGroup, currentIndicator, currentData } = this.state;
        return (
            <div>
                <TopClientOptionSelector group={currentGroup} indicator={currentIndicator} onChange={this.onOptionsChange} />
                <TopClientList group={currentGroup} indicator={currentIndicator} clients={currentData} lang={this.props.lang} />
            </div>
        )
    }
}
