import * as React from 'react';
import { AgentView } from "../../_db/interfaces";
import { WithLang } from '../../reducers/language/interfaces';
import { AgentCard } from './AgentCard';
import { Card, Responsive } from 'semantic-ui-react';

export interface AgentListProps {
  data: AgentView[] | undefined
  onBrowse?: (agent: string) => void;
}

export const AgentList = (props: AgentListProps & WithLang) => {
  if (!props.data) return null;
  const cards = props.data.map((agent, i) => <AgentCard key={i} agent={agent.name} clients={agent.clients} {...props} />);

  return (
    <div className="agent-list">
      <Responsive {...Responsive.onlyMobile}>
        <Card.Group className="ui-grid" itemsPerRow={1}>{cards}</Card.Group>
      </Responsive>
      <Responsive {...Responsive.onlyTablet}>
        <Card.Group className="ui-grid" itemsPerRow={2}> {cards}</Card.Group>
      </Responsive>
      <Responsive {...Responsive.onlyComputer}>
        <Card.Group className="ui-grid" itemsPerRow={3}> {cards}</Card.Group>
      </Responsive>
    </div>
  );
}
