import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { ClientsView } from './clientsView/ClientsView';
import { ClientView } from './clientView/ClientView3';
import { AlertsView } from './alertsView/AlertsView';
import { ManagerView } from './managerView/managerView';
import { DashboardMgr } from './DashboardMgr';
import { DashboardAdv } from './DashboardAdv';
import { AltoShow } from './AltoShow';

import MenuFlat from './MenuFlat';

interface IAppProps {
  manager?: boolean
}

const ScrollToTop = () => {
  window.scrollTo(0, 0);
  return null;
};

/**
 * Main App
 */
class App extends React.Component<IAppProps, {}> {
  render() {
    const { manager } = this.props;

    return (
      <div className="app" style={{ height: '100vh', width: '100%', position: 'absolute', top: 0, bottom: 0 }}>
        <Route component={ScrollToTop} />
        {/* <Route exact={false} path="/" component={(p: RouteComponentProps<any>) => <MenuFlat history={p.history} />} /> */}
        <div style={{ padding: '0 0.5rem', height: '95%' }}>
          {/* <Route exact path="/" component={(p: any) => <HomePage />} />
              <Route exact path="/homepage" component={(p: any) => <HomePage />} /> */}
          <Switch>

            <Route exact path="/" component={(p: any) => manager
              ? <DashboardMgr uid="dashboard" page={'0'} history={p.history} ><MenuFlat history={p.history} orientation='vertical' /> </DashboardMgr>
              : <DashboardAdv uid="dashboard" page={'0'} history={p.history} ><MenuFlat history={p.history} orientation='vertical' /> </DashboardAdv>}
            />

            <Route exact path="/dsh/:page" component={(p: any) => manager
              ? <DashboardMgr uid="dashboard" page={p.match.params.page} history={p.history}><MenuFlat history={p.history} orientation='vertical' /> </DashboardMgr>
              : <DashboardAdv uid="dashboard" page={p.match.params.page} history={p.history}><MenuFlat history={p.history} orientation='vertical' /> </DashboardAdv>}
            />

              {/*}: <Dashboard uid="dashboard" />} />*/}


            <Route exact path="/clients" component={(p: any) => <ClientsView uid="cli" showFilter showTitle />} />
            <Route exact path="/alerts" component={(p: any) => <AlertsView uid="alerts" manager={manager} showFilter showTitle />} />
            <Route exact path="/manager" component={(p: any) => <ManagerView uid="port" showFilter showTitle />} />
            <Route exact path="/agents/:id/clients" component={(p: RouteComponentProps<any>) => <ClientsView uid="agecli" agent={p.match.params.id} showFilter showTitle />} />
            <Route exact path="/clients/:id" component={(p: RouteComponentProps<any>) => <ClientView id={p.match.params.id}><MenuFlat history={p.history} orientation='vertical' /></ClientView>} />

            <Route exact path="/AltoShow" component={(p: RouteComponentProps<any>) => <AltoShow />} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
