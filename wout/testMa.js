const data = require('../aap-poc/public/strategy.json');
const keys = Object.keys(data);

let isins = [];

keys.forEach(k=>{
    isins = [...isins,...data[k].map(s=>s.security.IsinCode)];
});

console.log(isins);

