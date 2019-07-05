import * as React from 'react';
import { Card, Responsive } from 'semantic-ui-react';
import { Client, } from "../../_db/interfaces";
import { WithLang, } from '../../reducers/language/interfaces';
import { ClientCard } from './ClientCard';

export interface ClientListProps {
  data: Client[] | undefined
}

export const ClientList = (props: ClientListProps & WithLang) => {
  if (!props.data) return null;
  const data = props.data.slice(0, 100);
  const cards = data.map(client => <ClientCard key={client.id} client={client} {...props} />);

  return <div className="clients-list">
    <Responsive {...Responsive.onlyMobile}>
      <Card.Group className="ui-grid"  itemsPerRow={1}>{cards}</Card.Group>
    </Responsive>
    <Responsive {...Responsive.onlyTablet}>
      <Card.Group className="ui-grid" itemsPerRow={2}> {cards}</Card.Group>
    </Responsive>
    <Responsive {...Responsive.onlyComputer}>
      <Card.Group className="ui-grid" itemsPerRow={3}> {cards}</Card.Group>
    </Responsive>
  </div>
};
