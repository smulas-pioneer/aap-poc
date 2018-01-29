import * as React from 'react';
import { Card, Responsive, Segment, Table, Menu, Icon } from 'semantic-ui-react';
import { Client, } from "../../_db/interfaces";
import { WithLang, LangDictionary, } from '../../reducers/language/interfaces';
import { formatAua, formatNumber } from "../../_db/utils";
import client from '../../reducers/client';
import { numArray } from '../../_db/common/radarUtils';
import { WidgetTitle } from '../shared/WidgetTitle';

export interface ClientListBudgetProps {
    clients: Client[];
    lang: LangDictionary;
}

export interface ClientListBudgetState {
    activePage: number,
    pageSize: number
}


export class ClientListBudget extends React.Component<ClientListBudgetProps, ClientListBudgetState> {
    constructor(props: ClientListBudgetProps) {
        super(props);
        this.state = { activePage: 0, pageSize: 9 };
    }

    componentWillReceiveProps(props: ClientListBudgetProps) {
        this.setState({ activePage: 0 });
    }

    render() {
        const { lang, clients } = this.props;
        const { activePage, pageSize } = this.state;

        if (!client || client.length === 0) return null;

        const fmt = formatNumber(lang.NUMBER_FORMAT);
        const maxPage = Math.floor(clients.length / pageSize) + 1;
        const renderClients = clients.slice(activePage * pageSize, (activePage + 1) * pageSize);

        return (
            <Segment>
                <WidgetTitle title="Fees"/>
                <Table compact fixed singleLine style={{ height: '30vh', padding: '0' }}>
                    <Table.Header fullWidth >
                        <Table.Row>
                            <Table.HeaderCell width={1}>{lang.MAP_OPTS_CLIENTS}</Table.HeaderCell>
                            <Table.HeaderCell textAlign="right" width={1}>{lang.BUDGET_YTD_UPFRONT_FEES}</Table.HeaderCell>
                            <Table.HeaderCell textAlign="right" width={1}>{lang.BUDGET_YTD_ONGOING_FEES} %</Table.HeaderCell>
                            <Table.HeaderCell textAlign="right" width={1}>{lang.BUDGET_MTD_UPFRONT_FEES}</Table.HeaderCell>
                            <Table.HeaderCell textAlign="right" width={1}>{lang.BUDGET_MTD_ONGOING_FEES} %</Table.HeaderCell>
                            <Table.HeaderCell textAlign="right" width={1}>{lang.BUDGET_1Y_UPFRONT_FEES}</Table.HeaderCell>
                            <Table.HeaderCell textAlign="right" width={1}>{lang.BUDGET_1Y_ONGOING_FEES} %</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            renderClients.map((client, clIndex) =>
                                <Table.Row key={clIndex} >
                                    <Table.Cell>{client.name}</Table.Cell>
                                    <Table.Cell textAlign="right" >{fmt(client.YTD_Upfront_FEES)}</Table.Cell>
                                    <Table.Cell textAlign="right" style={{ color: client.YTD_Ongoing_FEES < 0 ? 'red' : 'black' }}>{fmt(client.YTD_Ongoing_FEES,1)}</Table.Cell>
                                    <Table.Cell textAlign="right" >{fmt(client.MTD_Upfront_FEES)}</Table.Cell>
                                    <Table.Cell textAlign="right" style={{ color: client.MTD_Ongoing_FEES < 0 ? 'red' : 'black' }}>{fmt(client.MTD_Ongoing_FEES,1)}</Table.Cell>
                                    <Table.Cell textAlign="right" >{fmt(client.Y1_Upfront_FEES)}</Table.Cell>
                                    <Table.Cell textAlign="right" style={{ color: client.Y1_Ongoing_FEES < 0 ? 'red' : 'black' }} >{fmt(client.Y1_Ongoing_FEES,1)}</Table.Cell>
                                </Table.Row>
                            )
                        }
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan='7' style={{ padding: '5px 11px' }}>
                                <Menu floated='right' size="mini" pagination>
                                    {numArray(maxPage).map((v, i) => {
                                        return <Menu.Item active={activePage === i} key={i} onClick={() => this.setState({ activePage: i })} as='a' >{v + 1}</Menu.Item>
                                    })}
                                </Menu>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>

                </Table>
            </Segment>
        );
    }
}

