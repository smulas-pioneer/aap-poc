import * as React from 'react';
import { render } from 'react-dom';

import App from './components/App';
import { Provider } from 'react-redux';
import * as reducers from './reducers';
import { configureStore, HashRouter as Router } from 'app-support';

import './styles/index.css';
import 'semantic-ui-css/semantic.min.css';
import './styles/hovereffect.css';
import { Root } from './components/Root';
import { AppState } from './reducers';

const startingState: any =
    {
        context: {
            user: {
                firstName: 'Walter',
                lastName: 'White',
                isAgent: false,
                isManager: true,
                agents: [
                    'Giobbe Santoro',
                    'Ludovico Rossetti',
                    'Loretta Sanna',
                    'Leone Ferri',
                    'Gianriccardo Colombo',
                    'Dr. Manfredi Benedetti',
                    'Anastasio Colombo',
                    'Loris Morelli',
                    'Thea Damico',
                    'Nadir Grassi',
                    'Maruska Romano',
                    'Bacchisio Amato',
                    'Maristella Conte',
                    'Rosita Ferrara',
                    'Nadir Mancini'
                ]
            }
        },
        search: {
            result: {},
            filter: {},
            agentView: {},
            alertHistory: {}
        },
        client: {
            clientData: undefined,
            suggestedTransactions: [],
            breakdowns: [],
            history: [],
            strategy: []
        },
        language: {
            id: 'gb',
            name: 'English',
            dictionary: {
                AMUNDI_ADVISORY_PLATFORM: 'Amundi Digital Platform',
                MY_CLIENTS: 'My Clients',
                MY_ALERTS: 'My Alerts',
                MY_PORTFOLIOS: 'My Salesforce',
                MY_BUSINNESS: 'My Businness',
                NEWS_INSIGHTS: 'News & Insights',
                DASHBOARD: 'Dashboard',
                MENU_SPOTLIGHT: 'Search',
                DB_TOTAL_CLIENTS: 'Total of Clients',
                DB_ASSET_ADVISE: 'Asset Under Advise',
                DB_CLIENTS_ALERTS: 'Clients Alerts',
                DB_INTERVIEWS: 'Interviews',
                DB_INTERVIEWS_PENDING: 'Interviews Pending',
                DB_REBALANCING: 'Rebalancing Not Executed',
                DB_CLIENT_FEEDBACK: 'Client Feedback',
                DB_PERC_DETAIL: '%s(%s from %s%s)',
                DB_ALERTS_DETAIL: 'Including %s MIFID Alerts',
                YEAR: 'Y',
                MONTH: 'M',
                DAY: 'D',
                FILTER: 'Filter',
                ENTER_FILTER_TEXT: 'Enter filter text',
                MANAGED_BY: 'Managed by',
                LAST_INTERVIEW_DATE: 'Interview',
                LAST_ADVICE_DATE: 'Advice',
                SECURITY_NAME: 'Security Name',
                QUANTITY: 'Quantity',
                ISIN: 'Isin Code',
                TRADE_TYPE: 'Type',
                ASSET_CLASS: 'Asset Class',
                NUMBER_FORMAT: 'en-US',
                SUGGESTED_TRANSACTIONS: 'Suggested Transactions',
                HOLDINGS: 'Holdings',
                AMOUNT: 'Amount',
                WEIGHT: 'Weight',
                TOT_CLIENTS: 'Clients',
                AGENTS: 'Agents',
                DATE: 'Date',
                STATUS: 'Status',
                NOTES: 'Notes',
                DATE_FORMAT: 'MMM, DD YYYY',
                ACCEPTED: 'Accepted',
                ONGOING: 'Ongoing',
                REJECTED: 'Rejected',
                HISTORY: 'History',
                PROPOSE: 'Proposal',
                MODEL: 'Model',
                SHOW_ALL: 'Show All',
                SEARCH: 'Search',
                FINAL_WEIGHT: 'Final Weight',
                FEES: 'Fees',
                TOTAL: 'Total',
                SIGN_OUT: 'Sign out',
                WELCOME: 'Hello',
                CLIENT_NAME: 'Client name',
                AUA: 'AuA',
                DECISION: 'Decision',
                MIFID: 'MIFID',
                DELTA_ANALYSIS: 'Delta Analysis',
                NORTH: 'North',
                CENTER: 'Center',
                SOUTH: 'South'
            }
        },
        spl: {
            items: {}
        },
        alerts: {
            alertHistory: []
        }
    };

const store = configureStore(reducers.default, /*startingState,*/ true);
render(
    <Provider store={store}>
        <Router >
            <Root />
        </Router>
    </Provider>,
    document.getElementById('root')
);