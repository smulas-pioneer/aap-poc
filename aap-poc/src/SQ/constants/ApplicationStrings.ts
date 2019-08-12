
//@ts-check
import propertyPlanningIcon  from '../images/icons/property-planning.png';
import propertyFinancingIcon from '../images/icons/property-financing.png';
import propertyManagingIcon  from '../images/icons/property-managing.png';
import wealthManagementIcon  from '../images/icons/wealth-management.png';


export const homeConfiguration = [
  {
    title: 'Client Advisory',
    icon: wealthManagementIcon,
    sections: [
      {
        title: 'Portfolio health check',
        url: '/advisor/0',
        embed: false
      },
      {
        title: 'Client constraints',
        url: '/advisor/0',
        embed: false
      },
      {
        title: 'Proposal generation',
        url: '/advisor/0',
        embed: false
      },
      {
        title: 'Reporting',
        url: '/altoshow/reporting',
        embed: false
      },
    ]
  },
  {
    title: 'Investment    Centre',
    icon: propertyPlanningIcon,
    sections: [
      {
        title: 'Portfolio management system',
        url: '/altoshow/alto-web',
        embed: false
      },
      {
        title: 'Model portfolios',
        url: '/altoshow/alto-web',
        embed: false
      },
      {
        title: 'Strategical asset allocation',
        url: '/altoshow/alto-web',
        embed: false
      },
      {
        title: 'Tactical asset allocation',
        url: '/altoshow/alto-web',
        embed: false
      },
    ]
  },
  {
    title: 'Investment Governance',
    icon: propertyFinancingIcon,

    sections: [
      {
        title: 'CIO cockpit',
        url: 'https://ims.swissquant.com:9000',
        embed: true
      },
      {
        title: 'Aggregated risk analysis',
        url: 'http://www.codebox.ch/swissquant/ims/dpm/index.html',
        embed: true
      },
      {
        title: 'Compliance checks',
        url: 'http://www.codebox.ch/swissquant/ims/dpm/index.html',
        embed: true
      },
      {
        title: 'Stress-tests scenarios',
        url: 'http://demo.swissquant.com:9004/',
        embed: true
      },
    ]
  },

  {
    title: 'Commercial Governance',
    icon: propertyManagingIcon,
    sections: [
      {
        title: 'Sales action plan monitoring',
        url: '/manager/0',
        embed: false
      },
      {
        title: 'Budget analysis',
        url: '/manager/0',
        embed: false
      },
      {
        title: 'Massive proposals',
        url: '/manager/0',
        embed: false
      },
      {
        title: 'Alerts management',
        url: '/manager/0',
        embed: false
      },
    ]
  },
];

const ApplicationStrings = {

  //SECTION_4:
  SECTION_TITLE_4: 'Client Advisory',
  SUBSECTION_TITLE_4_1: 'Portfolio health check',
  SUBSECTION_TITLE_4_2: 'Client constraints',
  SUBSECTION_TITLE_4_3: 'Proposal generation',
  SUBSECTION_TITLE_4_4: 'Reporting',
  SECTION_BUTTON_4: 'Handlungsbedarf\numsetzen',

  //SECTION_3:
  SECTION_TITLE_3: 'Commercial Governance',
  SUBSECTION_TITLE_3_1: 'Sales action plan monitoring',
  SUBSECTION_TITLE_3_2: 'Budget analysis',
  SUBSECTION_TITLE_3_3: 'Massive proposals',
  SUBSECTION_TITLE_3_4: 'Alerts management',
  SECTION_BUTTON_3: 'Refinanzierung\nauslösen',

  //SECTION_2:
  SECTION_TITLE_2: 'Investment Governance',
  SUBSECTION_TITLE_2_1: 'CIO cockpit',
  SUBSECTION_TITLE_2_2: 'Aggregated risk analysis',
  SUBSECTION_TITLE_2_3: 'Compliance checks',
  SUBSECTION_TITLE_2_4: 'Stress-tests scenarios',
  SECTION_BUTTON_2: 'Offerte\nbestellen',

  //SECTION_1:
  SECTION_TITLE_1: 'Investment    Centre',
  SUBSECTION_TITLE_1_1: 'Portfolio management system',
  SUBSECTION_TITLE_1_2: 'Model portfolios',
  SUBSECTION_TITLE_1_3: 'Strategical asset allocation',
  SUBSECTION_TITLE_1_4: 'Tactical asset allocation',
  SECTION_BUTTON_1: 'Objekt\nwählen',





};

export default ApplicationStrings;
