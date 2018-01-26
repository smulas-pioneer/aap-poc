export interface LanguageState {
    id: 'it' | 'gb' | 'de',
    name: string,
    dictionary: LangDictionary
}

export interface LangDictionary {
    AMUNDI_ADVISORY_PLATFORM: string,
    // homepage
    MY_CLIENTS: string,
    MY_ALERTS: string,
    MY_PORTFOLIOS: string,
    MY_BUSINNESS: string,
    NEWS_INSIGHTS: string,
    DASHBOARD: string,
    // dashboard
    DB_TOTAL_CLIENTS: string,
    DB_ASSET_ADVISE: string,
    DB_CLIENTS_ALERTS: string,
    DB_PROPOSALS: string,
    DB_PENDING_PROPOSALS: string,
    DB_PROPOSAL_ACCEPTED_NOT_EXECUTED: string,
    DB_CLIENT_FEEDBACK: string,
    DB_CLIENT_ACCEPTED_PROPOSALS: string,
    DB_PERC_DETAIL: string,
    DB_ALERTS_DETAIL: string,
    // other
    YEAR: string,
    MONTH: string,
    DAY: string,
    FILTER: string,
    ENTER_FILTER_TEXT: string,
    MANAGED_BY: string,
    LAST_INTERVIEW_DATE: string,
    LAST_ADVICE_DATE: string,
    ISIN: string,
    SECURITY_NAME: string,
    QUANTITY: string,
    TRADE_TYPE: string,
    ASSET_CLASS: string,
    NUMBER_FORMAT: string,
    SUGGESTED_TRANSACTIONS: string,
    HOLDINGS: string,
    AMOUNT: string,
    WEIGHT: string,
    TOT_CLIENTS: string,
    DATE: string,
    STATUS: string,
    LAST_STATUS: string,
    NOTES: string
    DATE_FORMAT: string
    AGENTS: string,
    OUT_OF: string,
    ACCEPTED: string
    REJECTED: string
    ONGOING: string,
    ONHOLD: string,
    PROPOSE: string,
    MODEL: string,
    SHOW_ALL: string,
    SEARCH: string,
    FINAL_WEIGHT: string,
    FEES: string,
    UPFRONT_FEES:string,

    MENU_SPOTLIGHT: string,
    TOTAL: string,
    SIGN_OUT: string,
    WELCOME: string,
    CLIENT_NAME: string,
    AUA: string,
    DECISION: string,
    MIFID: string,
    DELTA_ANALYSIS: string,
    NORTH: string,
    CENTER: string,
    SOUTH: string,
    MAP_OPTS_CLIENTS: string,
    MAP_OPTS_AUA: string,
    MAP_OPTS_PROPOSALS: string,
    MAP_OPTS_ACC_PROPOSAL: string,
    MAP_OPTS_ALERTS: string,
    ONGOING_FEES: string,
    BUDGET: string,
    ALLOCATION: string,
    TURNOVER:string,

    TIME_HORIZON: string,
    REGION: string,
    CITY: string,
    BRANCH: string,
    ADVISOR: string,

    RESULTS: string,
    TARGET_RESULT: string,


    NO_ALERTS: string,

    //client view
    PERSONAL_INFORMATION: string,
    PORTFOLIO_HOLDINGS: string,
    PORTFOLIO_MONITORING: string,
    PORTFOLIO_VIEWS: string,
    CLIENT_EVENT_HISTORY: string,

    PROPOSAL_VALIDATION: {
        title: string, message: string
    },
    ORDER_LIST: string,
    HISTORY: {
        clientEventHistory: string,
        transactions: string,
        proposals: string,
        interviews: string
    },
    ALERT: {
        name: string, sentence: string
    },
    ALERTS: {
        riskAdequacyAlert: { name: string, sentence: string },
        efficencyAlert: { name: string, sentence: string },
        consistencyAlert: { name: string, sentence: string },
        riskAnalysisAlert: { name: string, sentence: string },
        concentrationAlert: { name: string, sentence: string },
        overlapAlert: { name: string, sentence: string }
    },
    'NO ALERT': string,
    'REGULATOR ALERT': string,
    'GUIDELINE ALERT': string,
    'ON HOLD': string,
    'PENDING PROPOSAL': string,
    'PENDING EXECUTION': string,

    RISKPROFILE: string,
    REGULATORY_INDICATOR: string,

    ABOVE_GUIDELINES: string,
    BELOW_GUIDELINES: string,
    STATUS_DATE: string
}

export interface WithLang { lang: LangDictionary };

