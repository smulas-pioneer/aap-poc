import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router';
import { Segment } from 'semantic-ui-react';
import { ClientsView } from './clientsView/ClientsView';
import { ClientView } from './clientView/ClientView3';

import MenuFlat from './MenuFlat';
import Dashboard from './Dashboard';
import { AlertsView } from './alertsView/AlertsView';
import { ManagerView } from './managerView/managerView';
import { DashboardMgr } from './DashboardMgr';

interface IAppProps {
    manager?: boolean
}

class App extends React.Component<IAppProps, {}> {
    render() {
        const { manager } = this.props;
        return (
            <div className="app" style={{ backgroundColor: '#f8f5f5', height: '100vh', width: '100%', position: 'absolute', top: 0, bottom: 0 }}>
            <Route exact={false} path="/" component={(p: RouteComponentProps<any>) => <MenuFlat history={p.history}/>}/>
            <Segment basic style={{ marginTop: 0, height: '95%' }}>
                    {/* <Route exact path="/" component={(p: any) => <HomePage />} />
                    <Route exact path="/homepage" component={(p: any) => <HomePage />} /> */}
                    <Route exact path="/" component={(p: any) => manager ? <DashboardMgr uid="dashboard" /> : <Dashboard uid="dashboard" />} />
                    <Route exact path="/clients" component={(p: any) => <ClientsView uid="cli" showFilter showTitle />} />
                    <Route exact path="/alerts" component={(p: any) => <AlertsView uid="alerts" manager={manager} showFilter showTitle />} />
                    <Route exact path="/manager" component={(p: any) => <ManagerView uid="port" showFilter showTitle />} />
                    <Route exact path="/agents/:id/clients" component={(p: RouteComponentProps<any>) => <ClientsView uid="agecli" agent={p.match.params.id} showFilter showTitle />} />
                    <Route exact path="/clients/:id" component={(p: RouteComponentProps<any>) => <ClientView id={p.match.params.id} />} />
                </Segment>
            </div>
        );
    }
}

export default App;
