import { appConnector } from "app-support";
import { isLogged, isManager, getIsReady, getTheme } from "../reducers/index";
import * as React from "react";
import { login, LoginType } from "../actions/index";
import App from './App';
import { Login } from "./Login";

const conn = appConnector()(
  (s, p) => ({
    logged: isLogged(s),
    manager: isManager(s),
    ready: getIsReady(s),
    theme: getTheme(s)
  }),
  {
    login
  }
)
const autologin = process.env.REACT_APP_AUTO_LOGIN === "true";
export const Root = conn.PureCompo(props => {
  React.useEffect(() => {
    if (autologin) {
      props.login(LoginType.Manager);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { logged, manager, login, theme } = props;

  const themeLink = (theme === 'dark')
    ? <link href="bigone.css" rel="stylesheet" />
    : null;

  return (
    <div>
      {themeLink}
      {
        logged
          ? <App manager={manager} />
          : autologin
            ? <p style={{ color: 'red' }}>Autologin as manager...</p>
            : <Login action={login} />
      }
    </div >
  )
});

