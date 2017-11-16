import * as React from 'react';
import { Grid, Header, Form, Segment, Input, Button } from 'semantic-ui-react';
import { LoginType } from '../actions/index';

export const Login2 = ({ action }: { action: (lt: LoginType) => void }) => {
    return (
        <Grid textAlign="center" verticalAlign="middle" >
            <Grid.Column width={5}>
                <Header as="h2" content="Amundi Digital Advisory" />
                <Form size='large'>
                    <Segment stacked secondary>
                        <Form.Input focus icon="user" iconPosition="left" placeholder='Account'  />
                        <Form.Input icon="lock" type="Password" iconPosition="left" placeholder='Password'  />
                        <Button fluid color="blue" size="large" content="Login"/>                          
                    </Segment>
                </Form>

            </Grid.Column>
        </Grid>
    );
}