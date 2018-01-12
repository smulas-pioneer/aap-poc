export interface Client {
    id: string;
    name: string;
    modelId: string;
    modelName: string;
    agent: string;
    lastInterviewDate: string;
    lastAdvicedate: string;
    email: string;
    phone: string;
    address: Address;
    aua: number;
    radar: Radar;

    mifid: number;
    decision: string;

    deltaAnalysis: string;
    breaks: string[];
    size: Size;

    numOfInterviews: number,
    numOfAcceptedProposal: number;
    numOfRejectedProposal: number;
    timeHorizon: TimeHorizon;
    segment: ClientSegment;

    branch: string;
    sales: number;

}

export type ClientSegment = 'Private' | 'Mass Affluent' | 'Retail';
export type TimeHorizon = '18 Months' | '3 Years' | '4 Years' | '5 Years' | 'More than 5 Years'


const K = 10;
export const TimeHorizonMonths  = {
    '18 Months': 18* K ,
    '3 Years': 36* K,
    '4 Years': 48* K,
    '5 Years': 60* K,
    'More than 5 Years': 100* K
}

export interface Address {
    region: string;
    city: string;
    zipCode: string;
    streetAddress: string;
    latitude: string;
    longitude: string;
}

export interface Portfolio {
    id: string;
    name: string;
    holdings: Holding[];
    history: { date: string, holdings: Holding[] }[]
}

export interface Holding {
    securityId: string;
    security?: Security;
    weight: number;
    amount: number;
    quantity: number;
    suggestion: number;
    suggestionType: 'W' | 'Q';
    accepted: boolean;
    feeImpact: number;
    error?: string;
}

export interface FinalHolding extends Holding {
    finalAmount: number;
    finalQuantity: number;
    finalWeight: number;
}

export interface Security {
    IsinCode: string,
    SecurityName: string,
    AssetId: string,
    IsFund: '0' | '1',
    Kilovar: string | null,
    MacroAssetClass: string,
    MicroAssetClass: string,
    Sector: string | null,
    Currency: string,
    Rating: string | null,
    Country: string | null,
    Region: string | null,
    Maturity: string | null,
    SRRI?: number,
    Price?: number,
    blacklisted?: boolean,
    pushed?: boolean
}

export interface Transaction {
    security: Security;
    type: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    amount: number;
}
export type Alert = 'green' | 'yellow' | 'orange' | 'red';

export interface AlertHistory {
    date: string;
    Green: number;
    Orange: number;
    Red: number;
}

export interface AlertHistory2 {
    date: string;
    breaked: number;
    nonBreaked: number;
    mifidBreaked: number;
    nonMifidBreaked: number;

}

export interface Radar {
    actual: RadarItem;
    guideLines: RadarItem;
    limits: RadarItem;
    proposed: RadarItem;
    riskAdequacyAlert: Alert;
    efficencyAlert: Alert;
    consistencyAlert: Alert;
    riskAnalysisAlert: Alert;
    concentrationAlert: Alert;
    overlapAlert: Alert;
    numOfAlerts: number;
    color: 'green' | 'yellow' | 'orange' | 'red'
}

export interface RadarItem {
    riskAdequacy: number;
    efficency: number;
    consistency: number;
    riskAnalysis: number;
    concentration: number;
    overlap: number;
}
export type PerformancePeriod = '1M' | '3M' | '6M' | 'YTD' | '1Y' | 'All';

export interface RadarStrategyParm {
    riskAdequacy?: boolean;
    efficency?: boolean;
    consistency?: boolean;
    riskAnalysis?: boolean;
    concentration?: boolean;
    overlap?: boolean;
}

export interface Breakdown {
    attributeName: string,
    data: Array<{ value: string, weight: number, bmk: number }>
    weight: number;
}

export interface PerformanceStat {
    data: PerformanceItem[];
    date: string;
    perf: number;
    perfBmk: number;
}

export interface PerformanceItem {
    date: string;
    perf1d: number;
    perfBmk1d: number;

}
export type Size = '<1M' | '1-5M' | '5-10M' | '10-20M' | '>20M';
export interface SearchParms {
    filter: string;
    agents?: string[];
    branch?: string[];
    alerts?: number[];
    alertTypes?: string[];
    onlyWithAlerts?: boolean;
    regions?: string[];
    segments?: string[];
    size?: Size[];
    uid: string;
}

export interface SearchResult {
    parms: SearchParms,
    result: Client[],
    radar?: Radar,
}

export type AgentView = {
    name: string;
    clients: Client[];
}

export interface InterviewResult {
    date: string;
    status: 'ACCEPTED' | 'REJECTED' | 'ONGOING';
    notes: string;
}

export enum SpotlightContext {
    Client = 1 << 0,
    Security = 1 << 1,
    Agent = 1 << 2,
    All = Client | Agent | Security
}

export type SpotlightSearchResultItem = Client | AgentView | Security;

export interface SpotlightSearchResult {
    items: { [key: string]: SpotlightSearchResultItem[] };
}

export interface SpotlightSearchParms {
    context?: 'Client' | 'Agent' | 'Security';
    filter: string;
    agents?: string[];
    onlyPushedSecurity?: boolean;
    limit?: number;
}

export interface StrategyItem {
    security: Security;
    radar: RadarItem;
    currentWeight: number;
    currentQuantity: number;
    currentPrice: number;
    currentAmount: number;
    modelWeight: number;
    suggestedDelta: number;

    editingDelta?: number;
    suggestionAccepted: boolean;
    isCash: boolean;
    warning?: Warning;
    fee: number;

    newSecurity: boolean;

    clientFavorites?: boolean;

};

export interface Warning {

}

export interface PositionItem {
    security: Security;
    radar: RadarItem;
    weight: number;
}
