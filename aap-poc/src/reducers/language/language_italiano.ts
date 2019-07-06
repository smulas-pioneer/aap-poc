import { LanguageState } from '.';

export const Italiano: LanguageState = {
  id: 'it',
  name: 'Italiano',
  dictionary: {
    AMUNDI_ADVISORY_PLATFORM: 'Amundi Digital Platform',
    // homepage
    MY_CLIENTS: 'I miei Clienti',
    MY_ALERTS: 'I miei Allarmi',
    MY_PORTFOLIOS: 'I miei Portafogli',
    NEWS_INSIGHTS: 'Notizie & Approfondimenti',
    MENU_SPOTLIGHT: 'Cerca',
    // dashboard
    DB_PROPOSALS: 'Proposte',
    DB_PENDING_PROPOSALS: 'Proposte In Attesa',
    DB_PROPOSAL_ACCEPTED_NOT_EXECUTED: 'Proposte accettate non eseguite',
    DB_PERC_DETAIL: "%s(%s da %s%s)",
    DB_ALERTS_DETAIL: "Inclusi %s allarmi Mifid",
    DB_CLIENT_ACCEPTED_PROPOSALS: "Proposte accettate",
    //other
    OUT_OF: 'di',
    YEAR: 'A',
    MONTH: 'M',
    DAY: 'G',
    FILTER: 'Filtra',
    ENTER_FILTER_TEXT: 'Inserire il testo da ricercare',
    MANAGED_BY: 'Gestito da',
    SECURITY_NAME: 'Titolo',
    QUANTITY: 'Quantità',
    ISIN: 'Codice Isin',
    TRADE_TYPE: 'Tipo',
    ASSET_CLASS: 'Asset Class',
    NUMBER_FORMAT: 'it-IT',
    SUGGESTED_TRANSACTIONS: 'Operazioni Consigliate',
    HOLDINGS: 'Posizione Portafoglio',
    AMOUNT: 'Controvalore',
    WEIGHT: 'Peso',
    TOT_CLIENTS: 'Clienti: ',
    AGENTS: 'Agenti',
    DATE: 'Data',
    STATUS: 'Stato',
    LAST_STATUS: "Stato Cliente",
    NOTES: 'Note',
    DATE_FORMAT: 'DD/MM/YYYY',
    ACCEPTED: 'Accettata',
    ONGOING: 'In corso',
    REJECTED: 'Rifiutata',
    ONHOLD: 'In Attesa',
    PROPOSE: 'Proposta',
    MODEL: 'Modello',
    SHOW_ALL: 'Mostra tutto',
    SEARCH: 'Cerca',
    FINAL_WEIGHT: 'Peso finale',
    FEES: 'Commissioni',
    TOTAL: 'Totale',
    SIGN_OUT: 'Esci',
    AUA: 'AuA',
    MIFID: 'MIFID',
    NORTH: 'Nord',
    CENTER: 'Centro',
    SOUTH: 'Sud',
    MAP_OPTS_CLIENTS: "Clienti",
    MAP_OPTS_AUA: "AUA",
    MAP_OPTS_PROPOSALS: "Proposte",
    MAP_OPTS_ACC_PROPOSAL: "Proposte acc.",
    MAP_OPTS_ALERTS: "Avvisi",
    UPFRONT_FEES: "Comm. di ingresso",
    ONGOING_FEES: "Comm. di gestione",
    BUDGET: 'Budget',
    ALLOCATION: 'Allocazione',
    TURNOVER: 'Rotazione',
    TIME_HORIZON: "Orizzonte Temporale",
    COUNTRY: "Paese",
    REGION: "Regione",
    CITY: "Città",
    BRANCH: "Agenzia",
    ADVISOR: "Advisor",
    RESULTS: "Risultato",
    TARGET_RESULT: "Perf. Attesa",



    //client view
    PERSONAL_INFORMATION: 'Informazioni Personali',
    PORTFOLIO_HOLDINGS: 'Portafoglio',
    PORTFOLIO_MONITORING: 'Monitor del portafoglio',
    PORTFOLIO_VIEWS: 'Viste del portafoglio',
    CLIENT_EVENT_HISTORY: 'Eventi del cliente',
    ORDER_LIST: 'Lista ordini',
    PROPOSAL_VALIDATION: { title: 'Validazione della proposta', message: 'Prego validare la proposta per generare il documento' },
    HISTORY: {
      clientEventHistory: 'Tutti',
      transactions: 'Transazioni',
      proposals: 'Proposte',
      interviews: 'Interviste'
    },
    ALERT: { name: 'Avvisi', sentence: 'monitoring indicators breached' },
    NO_ALERTS: 'Nessun allarme',

    ALERTS: {
      riskAdequacyAlert: {
        name: 'Rischio Adeguatezza',
        sentence: 'Il livello del rischio del portafoglio non è adeguato al profilo MIFID del cliente',
        positiveSentence: 'Il livello del rischio del portafoglio non è adeguato al profilo MIFID del cliente'
      },
      efficencyAlert: {
        name: 'Efficienza',
        sentence: `L'efficienza del portafoglio non è allineata al suo modello`,
        positiveSentence: `L'efficienza del portafoglio non è allineata al suo modello`
      },
      consistencyAlert: {
        name: 'Consistenza',
        sentence: 'La consistenza del portafoglio non è allineata al suo modello',
        positiveSentence: 'La consistenza del portafoglio non è allineata al suo modello'
      },
      riskAnalysisAlert: {
        name: 'Analisi del rischio',
        sentence: 'Il livello di rischio del portafoglio non è adeguato al profilo MIFID del cliente',
        positiveSentence: 'Il livello di rischio del portafoglio non è adeguato al profilo MIFID del cliente'
      },
      concentrationAlert: {
        name: 'Concentrazione',
        sentence: 'La concentrazione del portafoglio non è allineata al suo modello',
        positiveSentence: 'La concentrazione del portafoglio non è allineata al suo modello'
      },
      overlapAlert: {
        name: 'Sovrapposizione',
        sentence: 'La sovrapposizione del portafoglio non è allineata al suo modello',
        positiveSentence: 'La sovrapposizione del portafoglio non è allineata al suo modello'
      }
    },

    DASHBOARD: 'Cruscotto',
    DB_ASSET_ADVISE: 'Totale Patrimonio',
    DB_CLIENTS_ALERTS: 'Allarmi',
    DB_CLIENT_FEEDBACK: 'Feedback Dei Clienti',
    DB_TOTAL_CLIENTS: 'Numero Clienti',
    CLIENT_NAME: 'Nome Cliente',
    DECISION: 'Decisione',
    DELTA_ANALYSIS: 'Analisi Delta',
    LAST_ADVICE_DATE: 'Ultima Proposta',
    LAST_INTERVIEW_DATE: 'Ultima Intervista',
    MY_BUSINNESS: 'Le mie Attività',
    WELCOME: 'Ciao',
    'NO ALERT': 'No Alert',
    'REGULATOR ALERT': 'Regulator Alert',
    'GUIDELINE ALERT': 'Guideline Alert',
    'ON HOLD': 'On Hold',
    'PENDING PROPOSAL': 'Pending Proposal',
    'PENDING EXECUTION': 'Pending Execution',
    RISKPROFILE: 'Profilo di rischio',
    REGULATORY_INDICATOR: 'MIFID Indicator',
    GUIDELINE_INDICATOR: 'Guideline Indicator',
    ABOVE_GUIDELINES: 'Sopra le linee guida',
    BELOW_GUIDELINES: 'Sotto le linee guidas',
    STATUS_DATE: 'Status Date',

    BUDGET_YTD_UPFRONT_FEES: 'YTD UPFRONT',
    BUDGET_YTD_ONGOING_FEES: 'YTD ONGOING',
    BUDGET_MTD_UPFRONT_FEES: 'MTD UPFRONT',
    BUDGET_MTD_ONGOING_FEES: 'MTD ONGOING',
    BUDGET_1Y_UPFRONT_FEES: '1Y UPFRONT',
    BUDGET_1Y_ONGOING_FEES: '1Y ONGOING',

  }
};
