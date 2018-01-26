const sec = require('./sec');
const _ = require('lodash');

currencies = _.uniq(sec.map(s=>s.MicroAssetClass));
console.log(currencies.map(s=>`${s}:${s}`));


const dictCur = {
  'Euro': 'EUR',
  'Asia Ex Yen': 'HKD',
  'America ex Dollar': 'CAD',
  'Europe ex Euro': 'GBP',
  'Dollar': 'USD',
  'Other':'Other',
  'Yen':'YEN'
}

const dictMA ={
    'Equity': 'Equity',
    'Fixed Income':'Fixed Income',
    'Absolute Return': 'Absolute Return', 
    'Alternative':'Alternative',
    'Balanced': 'Balanced',
    'Cash & Cash Equivalents':'Cash',
    'Units':'Units'
}

const dictMI = {'Equity Emerging Markets':'Equity Emerging Markets',
'Equity Europe':'Equity Europe',
'Equity North America':'Equity North America',
'Equity Pacific':'Equity Pacific',
'Emerging Market Bond':'Emerging Market Bond',
'Euro Corporate Bond':'Euro Corporate Bond',
'Euro Government Bond':'Euro Government Bond',
'Global Corporate High Yield Bond':'Global Corporate High Yield Bond',
'International Bond':'International Bond',
'Other':'Other',
'Money Market Euro':'Money Market Euro' }