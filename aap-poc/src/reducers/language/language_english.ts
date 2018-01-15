import { LanguageState } from './interfaces';


export const English: LanguageState = {
    id: 'gb',
    name: 'English',
    dictionary: {
        AMUNDI_ADVISORY_PLATFORM: 'Amundi Digital Platform',
        // homepage
        MY_CLIENTS: 'My Clients',
        MY_ALERTS: 'My Alerts',
        MY_PORTFOLIOS: 'My Salesforce',
        MY_BUSINNESS: 'My Businness',
        NEWS_INSIGHTS: 'News & Insights',
        DASHBOARD: 'Dashboard',
        MENU_SPOTLIGHT: 'Search',
        // dashboard
        DB_TOTAL_CLIENTS: 'Total of Clients',
        DB_ASSET_ADVISE: 'Asset Under Advise',
        DB_CLIENTS_ALERTS: 'Clients Alerts',
        DB_PROPOSALS: 'Proposals',
        DB_PENDING_PROPOSALS: 'Pending Proposals',
        DB_PROPOSAL_ACCEPTED_NOT_EXECUTED: 'Accepted Proposals Not Executed',
        DB_CLIENT_FEEDBACK: 'Client Feedback',
        DB_PERC_DETAIL: "%s(%s from %s%s)",
        DB_ALERTS_DETAIL: "Including %s MIFID Alerts",
        DB_CLIENT_ACCEPTED_PROPOSALS: "Accepted Proposals",
        //other
        OUT_OF: 'out of',
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
        DATE: "Date",
        STATUS: "Status",
        NOTES: 'Notes',
        DATE_FORMAT: 'MMM, DD YYYY',
        ACCEPTED: 'Accepted',
        ONGOING: 'Ongoing',
        REJECTED: 'Rejected',
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
        SOUTH: 'South',
        MAP_OPTS_CLIENTS: "Clients",
        MAP_OPTS_AUA: "AUA",
        MAP_OPTS_PROPOSALS: "Proposals",
        MAP_OPTS_PROPOSAL: "Accept. proposals",
        MAP_OPTS_ALERTS: "Alerts",
        TIME_HORIZON: "Horizon",
        REGION: "Region",
        CITY: "City",
        BRANCH: "Branch",
        ADVISOR: "Advisor",
        RESULTS: "Results",
        TARGET_RESULT: "Target Result",

        //client view
        PERSONAL_INFORMATION: 'Personal Information',
        PORTFOLIO_HOLDINGS: 'Portfolio Holdings',
        PORTFOLIO_MONITORING: 'Portfolio Monitoring',
        PORTFOLIO_VIEWS: 'Portfolio Views',
        CLIENT_EVENT_HISTORY: 'Client Event History',
        ORDER_LIST: 'Order List',
        PROPOSAL_VALIDATION: { title: 'Proposal validation', message: 'Please validate the proposal for generating the document' },
        HISTORY: {
            clientEventHistory: 'All events',
            transactions: 'Transactions',
            proposals: 'Proposals',
            interviews: 'Interviews'
        },
        NO_ALERTS: 'No Alerts',
        ALERT: { name: 'Alerts', sentence: 'monitoring indicators breached' },
        ALERTS: {
            riskAdequacyAlert: { name: 'Risk Adequacy', sentence: 'The risk level of the client’s portfolio exceed the risk level of the model portfolio linked to the MiFID profile of the client' },
            efficencyAlert: { name: 'Efficency', sentence: 'The level of efficiency of the client’s portfolio in terms of expected risk / return is below the relevant model portfolio' },
            consistencyAlert: { name: 'Consistency', sentence: 'The  level of alignment of the client’s portfolio asset allocation compared to the relevant model portfolio is not sufficient' },
            riskAnalysisAlert: { name: 'Risk Analysis', sentence: 'Client’s  portfolio risk analytics about credit exposure, currency, geographic area and / or economic sector are higher than the model portfolio recommendation' },
            concentrationAlert: { name: 'Concentration', sentence: 'Client’s portfolio instrument type is more concentrated than the relevant model portfolio' },
            overlapAlert: { name: 'Overlap', sentence: 'Client’s portfolio consistency with the banks monitored instrument lists is too low' }
        }
    }
}