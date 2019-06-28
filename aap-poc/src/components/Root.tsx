import { appConnector } from "app-support";
import { getLanguage, isLogged, isManager, getIsReady } from "../reducers/index";
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

interface RootCompoState {
  logged: boolean
}

export const Root = conn.PureCompo(props => {
  React.useEffect(()=>{
    props.login(LoginType.Manager);
  },[])

  const { logged, manager, login } = props;
  return (
    <div>
      {logged && <App manager={manager} />}
      {!logged && <Login action={login} />}
    </div >
  )
});
/*
class RootCompo extends conn.StatefulCompo<RootCompoState> {

  render() {
    const { logged, manager, login } = this.props;
    return (
      <div>
        {logged && <App manager={manager} />}
        {!logged && <Login action={login} />}
      </div >
    )
  }
}
export const Root = conn.connect(RootCompo);
*/

