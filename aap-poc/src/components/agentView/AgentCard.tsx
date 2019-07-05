import { Client } from "../../_db/interfaces";
import { LangDictionary } from "../../reducers/language/interfaces";
import * as React from "react";
import { Icon, SemanticICONS, Card, Table, Header, Label, Statistic } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { sumBy } from "lodash";
import { getRegionsByClients } from "../../_db/utils";

const fmt = (num: number) => {
  if (num >= 1000000) return (Math.ceil(num / 100000) / 10).toString() + "M";
  if (num >= 100000) return (Math.ceil(num / 10000) / 10).toString() + "K";
  return (Math.ceil(num / 1000) / 10).toString() + "H";
}

interface AgentCardProps {
  agent: string;
  clients: Client[];
  onBrowse?: (agent: string) => void;
  lang: LangDictionary;
}

const numberOfAlerts = (clients: Client[]) => {
  var numOfAlerts = sumBy(clients, (v) => v.radar.numOfAlerts);

  return (
    <Label corner color={numOfAlerts ? 'red' : "green"}>
      <div style={{ marginLeft: 20, marginTop: 10 }}>{numOfAlerts || ''}
      </div>
    </Label>
  )
}

const stats = (clients: Client[]) => {
  const aua = sumBy(clients, c => c.aua);
  return (
    <Statistic.Group size="mini" style={{ fontSize: '8px' }}>
      <Statistic>
        <Statistic.Value><Icon name='euro' /> {fmt(aua)}</Statistic.Value>
        <Statistic.Label>AUA</Statistic.Label>
      </Statistic>
    </Statistic.Group>
  )
}

export const AgentCard = ({ agent, clients, onBrowse, lang }: AgentCardProps) => {

  const sgmt = (icon: SemanticICONS, value: string) => (
    <div key={value} style={{ padding: '4px' }}>
      <Icon name={icon} />{value}
    </div>
  );
  const regions = getRegionsByClients(clients);
  return (
    <Card fluid>
      <Card.Content>
        <Table basic='very' fixed celled columns={2}>
          <Table.Body>
            <Table.Row >
              <Table.Cell width="7" >
                {numberOfAlerts(clients)}
                {onBrowse && <Header as="h3" style={{ margin: 0 }} content={agent} onClick={() => onBrowse(agent)}></Header>}

                {!onBrowse && <Link to={`/agents/${agent}/clients`}>
                  <Header as="h3" style={{ margin: 0 }} content={agent}></Header>
                </Link>
                }
                {stats(clients)}
              </Table.Cell>

              <Table.Cell>
                {regions.map(r => sgmt('globe', `${r.region}: ${r.clients}`))}
                {sgmt('user', `${lang.TOT_CLIENTS}: ${clients.length}`)}
              </Table.Cell>

            </Table.Row>
          </Table.Body>
        </Table>
      </Card.Content>
    </Card>
  )
}
