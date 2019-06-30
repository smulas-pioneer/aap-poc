import { Client, ClientStateColors } from "../../_db/interfaces";
import { LangDictionary } from "../../reducers/language/interfaces";
import * as React from "react";
import { Icon, SemanticICONS, Card, Table, Header, Label, Statistic } from "semantic-ui-react";
import { Link } from "react-router-dom";

const fmt = (num: number) => {
    if (num >= 1000000) return (Math.ceil(num / 100000) / 10).toString() + "M";
    if (num >= 100000) return (Math.ceil(num / 10000) / 10).toString() + "K";
    return (Math.ceil(num / 1000) / 10).toString() + "H";
}

const stats = (aua: number, region: string) => (
    <Statistic.Group size="mini">
        <Statistic>
            <Statistic.Value><Icon name='euro' /> {fmt(aua)}</Statistic.Value>
            <Statistic.Label>AUA</Statistic.Label>
        </Statistic>
        <Statistic>
            <Statistic.Value> <Icon name='globe' /> {region}</Statistic.Value>
            <Statistic.Label>Region</Statistic.Label>
        </Statistic>
    </Statistic.Group>
)

const numberOfAlerts = (client: Client) => {
    const color = ClientStateColors[client.clientStatus];
    return (
        <Label corner color={color === "#2185d0" ? "blue" : color as any}>
            <div style={{ marginLeft: 20, marginTop: 10 }}>{client.radar.numOfAlerts || ''}
            </div>
        </Label>
    )
}

export const ClientCard = ({ client, onBrowse = () => { }, lang }: { client: Client, onBrowse?: (client: Client) => void, lang: LangDictionary }) => {
    const sgmt = (icon: SemanticICONS, value: string) => (
        <div style={{ padding: '4px' }}>
            <Icon name={icon} />{value}
        </div>
    );
    return (
        <Card key={client.id} fluid className="client-card" >
            <Card.Content>
                <Table basic='very' fixed celled columns={2}>
                    <Table.Body>
                        <Table.Row >
                            <Table.Cell className="client-card-left" width="7" >
                                {numberOfAlerts(client)}
                                <Header as="h3" style={{ margin: 0 }}>
                                    <Link to={`/clients/${client.id}`}>
                                        {client.name}
                                    </Link>
                                </Header>
                                {stats(client.aua, client.address.region)}
                            </Table.Cell>
                            <Table.Cell className="client-card-right" singleLine>
                                {sgmt("id badge", client.clientStatus)}
                                {sgmt("phone", client.phone)}
                                {sgmt("mail outline", client.email)}
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Card.Content >
        </Card >
    )
}
