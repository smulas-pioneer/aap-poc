import * as React from "react";
import { LangDictionary } from "../../reducers/language/interfaces";
import { Segment, Table } from "semantic-ui-react";
import { formatAua, formatNumber } from "../../_db/utils";
import { CSSProperties } from "react";
import { IndicatorOptionsType } from "../../actions/model";
import { TopClientItem, GroupTypes } from "./index";

export interface TopClientListProps {
    clients: TopClientItem[];
    group: GroupTypes;
    indicator: IndicatorOptionsType;
    lang: LangDictionary;
}

export const TopClientList = ({ clients, group, indicator, lang }: TopClientListProps) => {

    /*
    const renderBreaks = (client: Client) => {
        return client.breaks.reduce((p, c) => p ? `${p}, ${startCase(c)}` : startCase(c), '');
    };
    const rowStyle = (rowNumber: number) => {
        let ret: CSSProperties = {};
        if (rowNumber === 0) {
            ret.background = '#E0FFE0';
        } else if (rowNumber < 3) {
            ret.background = '#F0FBF0';
        }
        return ret;
    }
*/
    const fmt = formatNumber(lang.NUMBER_FORMAT);

    const cellStyle = (rowNumber: number, type: GroupTypes | IndicatorOptionsType, isGroup?: boolean) => {
        let ret: CSSProperties = {};
        if (rowNumber === 0) {
            if ((isGroup && type === group) || (!isGroup && type === indicator)) {
                ret.color = 'rgb(46, 204, 64)';
                ret.fontWeight = 'bolder';
                ret.fontSize = '1.1em';
            }
        }
        return ret;
    }

    return (
        <Segment.Group>
            {/*</Segment.Group><Segment basic style={{ height: '54vh' }} >*/}
            <Segment basic  >
                <Table compact fixed singleLine >
                    <Table.Header fullWidth >
                        <Table.Row>
                            {group >= GroupTypes.Country &&
                                <Table.HeaderCell width={1}>COUNTRY</Table.HeaderCell>
                            }

                            {group >= GroupTypes.Region &&
                                <Table.HeaderCell width={1}>{lang.REGION}</Table.HeaderCell>
                            }

                            {group >= GroupTypes.Branch &&
                                <Table.HeaderCell width={1}>{lang.BRANCH}</Table.HeaderCell>
                            }
                            {group >= GroupTypes.Advisor &&
                                <Table.HeaderCell width={2} >{lang.ADVISOR}</Table.HeaderCell>
                            }
                            <Table.HeaderCell textAlign="right" width={1}>{lang.MAP_OPTS_CLIENTS}</Table.HeaderCell>
                            <Table.HeaderCell textAlign="right" width={1}>{lang.MAP_OPTS_AUA}</Table.HeaderCell>
                            <Table.HeaderCell textAlign="right" width={1}>{lang.MAP_OPTS_PROPOSALS}</Table.HeaderCell>
                            <Table.HeaderCell textAlign="right" width={1}>{lang.MAP_OPTS_ACC_PROPOSAL}</Table.HeaderCell>
                            <Table.HeaderCell textAlign="right" width={1}>{lang.MAP_OPTS_ALERTS}</Table.HeaderCell>

                            <Table.HeaderCell textAlign="right" width={1}>{lang.UPFRONT_FEES}</Table.HeaderCell>
                            <Table.HeaderCell textAlign="right" width={1}>{lang.ONGOING_FEES}</Table.HeaderCell>
                            <Table.HeaderCell textAlign="right" width={1}>{lang.BUDGET} YTD</Table.HeaderCell>
                            <Table.HeaderCell textAlign="right" width={1}>{lang.BUDGET} Accomplished YTD %</Table.HeaderCell>
                            <Table.HeaderCell textAlign="right" width={1}>{lang.TURNOVER} %</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            clients.map((client, clIndex) =>
                                <Table.Row key={clIndex}>
                                    {group >= GroupTypes.Country &&
                                        <Table.Cell style={cellStyle(clIndex, GroupTypes.Country, true)}>{client.country}</Table.Cell>
                                    }
                                    {group >= GroupTypes.Region &&
                                        <Table.Cell style={cellStyle(clIndex, GroupTypes.Region, true)}>{client.region}</Table.Cell>
                                    }

                                    {group >= GroupTypes.Branch &&
                                        <Table.Cell style={cellStyle(clIndex, GroupTypes.Branch, true)}>{client.branch}</Table.Cell>
                                    }
                                    {group >= GroupTypes.Advisor &&
                                        <Table.Cell style={cellStyle(clIndex, GroupTypes.Advisor, true)}>{client.advisor}</Table.Cell>
                                    }
                                    <Table.Cell textAlign="right" style={cellStyle(clIndex, IndicatorOptionsType.clients)}>{fmt(client.totals.clients)}</Table.Cell>
                                    <Table.Cell textAlign="right" style={cellStyle(clIndex, IndicatorOptionsType.aua)}>{formatAua(client.totals.aua, fmt)}</Table.Cell>
                                    <Table.Cell textAlign="right" style={cellStyle(clIndex, IndicatorOptionsType.proposals)}>{fmt(client.totals.proposals)}</Table.Cell>
                                    <Table.Cell textAlign="right" style={cellStyle(clIndex, IndicatorOptionsType.acceptedProposals)}>{fmt(client.totals.acceptedProposals)}</Table.Cell>
                                    <Table.Cell textAlign="right" style={cellStyle(clIndex, IndicatorOptionsType.alerts)}>{fmt(client.totals.alerts)}</Table.Cell>

                                    <Table.Cell textAlign="right" style={cellStyle(clIndex, IndicatorOptionsType.upfrontFees)}>{fmt(client.totals.upfrontFees)}</Table.Cell>
                                    <Table.Cell textAlign="right" style={cellStyle(clIndex, IndicatorOptionsType.ongoingFees)}>{fmt(client.totals.ongoingFees)}</Table.Cell>
                                    <Table.Cell textAlign="right" style={cellStyle(clIndex, IndicatorOptionsType.budget)}>{fmt(client.totals.budget)}</Table.Cell>
                                    <Table.Cell textAlign="right" style={cellStyle(clIndex, IndicatorOptionsType.budgetAccomplishedYTD)}>{fmt(client.totals.budgetAccomplishedYTD)}</Table.Cell>
                                    <Table.Cell textAlign="right" style={cellStyle(clIndex, IndicatorOptionsType.turnover)}>{fmt(client.totals.turnover)}</Table.Cell>
                                </Table.Row>
                            )
                        }
                    </Table.Body>
                </Table>
            </Segment>
        </Segment.Group>
    );
}