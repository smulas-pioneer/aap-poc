import { appConnector, appConnectorWithRouter } from "app-support";
import { getLanguage, isLogged, isManager } from "../reducers/index";
import * as React from "react";
import { login, LoginType } from "../actions/index";
import App from './App';
import { Button, Card, Icon, Image } from "semantic-ui-react";
import { Login } from "./Login";

const conn = appConnectorWithRouter()(
    (s, p) => ({
        logged: isLogged(s),
        manager: isManager(s)
    }),
    {
        login
    }
)

interface RootCompoState {
    logged: boolean
}

class RootCompo extends conn.StatefulCompo<RootCompoState> {

    render() {
        const { logged, manager, login } = this.props;
        return (
            <div>
                {logged && <App manager={manager} />}
                {!logged && <Login action={login} />}
            </div>
        )
    }
}

export const Root = conn.connect(RootCompo);