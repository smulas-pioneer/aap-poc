const data = require('../aap-poc/public/strategy.json')
const keys = Object.keys(data);

keys.forEach(k=>{
    data[k]
        .filter(s=>s.security.MacroAssetClass=='Money Market' && s.security.IsinCode !== 'CASH')
        .forEach(s=>console.log(s.security.IsinCode, s.security.MacroAssetClass, s.security.MicroAssetClass));
});

