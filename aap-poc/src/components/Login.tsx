import * as React from 'react';
import { Grid, Header, Form, Segment, Input, Button, Message } from 'semantic-ui-react';
import { LoginType } from '../actions/index';

export interface LoginProps {
    action: (lt: LoginType) => void;
}

interface LoginState {
    user: string;
    password: string;
    error: boolean;
}

export class Login extends React.Component<LoginProps, LoginState>{

    constructor(props: LoginProps) {
        super(props);
        this.state = {
            user: 'manager',
            password: '',
            error: false
        }
        this.onLogin = this.onLogin.bind(this);
    }

    onLogin() {
        if (this.state.user.toLowerCase().trim() === 'advisor') this.props.action(LoginType.Advisor);
        if (this.state.user.toLowerCase().trim() === 'manager') this.props.action(LoginType.Manager);
        this.setState(prev => ({ error: true }));
    }

    checkError(user: string): boolean {
        if (!user.length) return false;
        return !'advisor'.startsWith(user.trim().toLowerCase()) && !'manager'.startsWith(user.trim().toLowerCase());
    }

    render() {
        return (
            <Grid style={{ height: '100vh' }} textAlign="center" verticalAlign="middle" >
                <Grid.Column width={5}>
                    <Header as="h2" style={{ color: '#005483', fontFamily: 'HelveticaNeue' }} content="Advisory Platform" />
                    <Form size='large'>
                        <Segment stacked secondary>
                            <Form.Input autoFocus icon="user" defaultValue={this.state.user} iconPosition="left" placeholder='User' onChange={(e, d) => this.setState(prev => ({ error: this.checkError(d.value), user: d.value }))} />
                            <Form.Input icon="lock" type="Password" iconPosition="left" placeholder='Password' onChange={(e, d) => this.setState(prev => ({ error: this.checkError(d.value), password: d.value }))} />
                            <Button fluid color="blue" size="large" content="Login" onClick={this.onLogin} />
                            <Message visible={this.state.error} error>
                                <Header content="Wrong Credentials" size="tiny" />
                                You can only sign up for an account <br />
                                between "advisor" and "manager"
                            </Message>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        );
    }
}