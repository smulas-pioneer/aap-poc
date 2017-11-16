import * as React from 'react';
import { AgentView } from "../../_db/interfaces";
import { WithLang } from '../../reducers/language/interfaces';
import { AgentCard } from './AgentCard';
import { Card } from 'semantic-ui-react';

export interface AgentListProps {
    data: AgentView[] | undefined
}

export const AgentList = (props: AgentListProps & WithLang) => {
    if (!props.data) return null;

    return (
        <Card.Group itemsPerRow={3}>
            {
                props.data.map((agent, i) => <AgentCard key={i} agent={agent.name} clients={agent.clients} {...props} />)
            }
        </Card.Group>
    );
}