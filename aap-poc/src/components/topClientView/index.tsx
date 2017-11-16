import * as React from "react";
import { LangDictionary } from "../../reducers/language/interfaces";
import { Client } from "../../_db/interfaces";
import { IndicatorType, IndicatorOptionsType } from "../../actions/model";
import { Dictionary, groupBy, sumBy } from "lodash";
import { TopClientOptionSelection, TopClientOptionSelector } from "./TopTenOptionSelector";
import { TopClientList } from "./TopClientList";


export interface TopClientProps {
    lang: LangDictionary,
    clients: Client[],
    max?: number
}

export interface TopClientItem {
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

export enum GroupTypes { Region = 0, City, Branch, Advisor };
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
        var cl = this.calculateData(next.clients);
        this.setState(prev => ({
            currentData: cl
        }));
    }

    calculateData(data: Client[], group?: GroupTypes, indicator?: IndicatorOptionsType) {
        let groupCheck = group !== undefined ? group : this.state.currentGroup;
        let indiCheck = indicator !== undefined ? indicator : this.state.currentIndicator;

        let recs: TopClientItem[] = [];
        let grouped: Dictionary<Client[]> = {};

        switch (groupCheck) {
            case GroupTypes.Region: {
                grouped = groupBy(data, d => d.address.region);
                break;
            }
            case GroupTypes.City: {
                grouped = groupBy(data, d => d.address.city);
            }
            case GroupTypes.Branch: {
                grouped = groupBy(data, d => d.branch);
            }
            case GroupTypes.Advisor: {
                grouped = groupBy(data, d => d.agent);
            }
        }

        for (let key in grouped) {
            const sumAum = sumBy(grouped[key], c => c.aum);
            const countClients = grouped[key].length;
            const sumInterviews = sumBy(grouped[key], c => c.numOfInterviews);
            const sumAcceptedProposals = sumBy(grouped[key], c => c.numOfAcceptedProposal);
            const countWithAlerts = grouped[key].filter(c => c.radar.numOfAlerts > 0).length;
            let first = grouped[key][0];
            recs.push({
                region: first.address.region,
                city: first.address.city,
                branch: first.branch,
                advisor: first.agent,
                totals: {
                    alerts: countWithAlerts,
                    aum: sumAum,
                    clients: countClients,
                    interviews: sumInterviews,
                    acceptedProposals: sumAcceptedProposals
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
        let ret: Partial<TopClientState> = {};
        if (e.Group !== undefined) ret.currentGroup = e.Group;
        if (e.Indicator !== undefined) ret.currentIndicator = e.Indicator;
        const newData = this.calculateData(this.props.clients, ret.currentGroup, ret.currentIndicator);
        this.setState(prev => {
            ret.currentData = newData;
            return ret;
        });
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