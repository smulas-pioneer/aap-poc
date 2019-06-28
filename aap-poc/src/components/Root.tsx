import { appConnector } from "app-support";
import { isLogged, isManager, getIsReady } from "../reducers/index";
import * as React from "react";
import { login, LoginType } from "../actions/index";
import App from './App';
import { Login } from "./Login";

const conn = appConnector()(
  (s, p) => ({
    logged: isLogged(s),
    manager: isManager(s),
    ready: getIsReady(s)
  }),
  {
    login
  }
)
const autologin = process.env.REACT_APP_LOGIN === "true";
export const Root = conn.PureCompo(props => {
  React.useEffect(() => {
    if (autologin) {
      props.login(LoginType.Manager);
    }
  }, [])

  const { logged, manager, login } = props;
  return (
    <div>
      {
        logged
          ? <App manager={manager} />
          : autologin
            ? <p style={{color:'red'}}>Autologin as manager...</p>
            : <Login action={login} />
      }
    </div >
  )
});

