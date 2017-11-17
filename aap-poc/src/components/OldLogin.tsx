import * as React from "react";
import { Card, Image, Icon } from "semantic-ui-react";
import { LoginType } from "../actions/index";

const agentImage = require('./agent.png');
const managerImage = require('./manager.png');

export const Login = ({ action }: { action: (lt: LoginType) => void }) => {
    return (
        <Card.Group itemsPerRow={2} textAlign='center' style={{ padding: 30 }} >
            <Card onClick={() => action(LoginType.Manager)}>
                <Image src={managerImage} />
                <Card.Content>
                    <Card.Header>
                        Manager
                </Card.Header>
                    <Card.Meta>
                        Login as manager
                    </Card.Meta>
                    <Card.Description>
                        The manager is the head of a set of agents.
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Icon name='user' />
                    xxx agents
                </Card.Content>
            </Card>

            <Card onClick={() => action(LoginType.Advisor)}>
                <Image src={agentImage} />
                <Card.Content>
                    <Card.Header>
                        Agent
                </Card.Header>
                    <Card.Meta>
                        Login as agent
                    </Card.Meta>
                    <Card.Description>
                        An agent manage a set of clients.
                </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Icon name='user' />
                    xxx clients
                </Card.Content>
            </Card>
        </Card.Group>
    );
}

