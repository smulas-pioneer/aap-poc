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
            user: 'advisor',
            password: '',
            error: false
        }
        this.onLogin = this.onLogin.bind(this);
    }

    onLogin() {
        const { user } = this.state;
        const { action } = this.props;
        if (user.toLowerCase().trim() === 'advisor') {
            action(LoginType.Advisor);
        }
        else if (user.toLowerCase().trim() === 'manager') {
            action(LoginType.Manager);
        } else {
            this.setState(prev => ({ error: true }));
        }
    }

    checkError(): void {
        const { user } = this.state;
        let error = false;
        if (user.length) {
            error = !'advisor'.startsWith(user.trim().toLowerCase()) && !'manager'.startsWith(user.trim().toLowerCase());
        }
        this.setState(prev => ({ error }));
    }

    render() {
        return (
            <Grid style={{ height: '100vh' }} textAlign="center" verticalAlign="middle" >
                <Grid.Column width={5}>
                    <Header as="h2" style={{ color: '#005483', fontFamily: 'Helvetica' }} content="Advisory Platform" />
                    <Form size='large' onSubmit={this.onLogin}>
                        <Segment stacked secondary>
                            <Form.Input autoFocus icon="user" defaultValue={this.state.user} iconPosition="left" placeholder='User' onChange={(e, d) => this.setState(prev => ({ user: d.value }), this.checkError)} />
                            <Form.Input icon="lock" type="Password" iconPosition="left" placeholder='Password' onChange={(e, d) => this.setState(prev => ({ password: d.value }), this.checkError)} />
                            <Button fluid color="blue" size="large" content="Login" />
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