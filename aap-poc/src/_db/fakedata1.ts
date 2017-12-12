import { strategies } from './data';

const case1 = {"CASH":{"Risk Adequacy":9.99999933836686,"Efficency":124,"consistency":47,"riskAnalysis":10,"concentration":10,"overlap":10,},"LU0568620560":{"Risk Adequacy":215.358976361307,"Efficency":0,"consistency":0,"riskAnalysis":301.954810356676,"concentration":219.903529921881,"overlap":260.929168999443,},"LU0281579598":{"Risk Adequacy":108.179488033112,"Efficency":0,"consistency":0,"riskAnalysis":318.478791527405,"concentration":277.453151310007,"overlap":297.965970848788,},"LU0201576401":{"Risk Adequacy":108.179488033112,"Efficency":0,"consistency":0,"riskAnalysis":318.478791527405,"concentration":277.453151310007,"overlap":297.965970848788,},"LU0281578517":{"Risk Adequacy":268.948716564135,"Efficency":0,"consistency":0,"riskAnalysis":356.50587426188,"concentration":253.941770566236,"overlap":305.223823211943,},"LU0119099819":{"Risk Adequacy":268.948716564135,"Efficency":0,"consistency":0,"riskAnalysis":356.50587426188,"concentration":253.941770566236,"overlap":305.223823211943,},"FR0010314401":{"Risk Adequacy":108.179488033112,"Efficency":1.4210854715202E-14,"consistency":1.4210854715202E-14,"riskAnalysis":276.603424922439,"concentration":235.577784705042,"overlap":256.090604243823,},}

export const updateStrategies = ()=> {
    updateStrategy("0");
}

 const updateStrategy = (id: string) => {
    const c = id == "0" ? case1 :
        id == "1" ? case1 :
            id == "2" ? case1 :
                null;
    if (c) {
        strategies[id].forEach(p => {
            p.radar.concentration = c[p.security.IsinCode].concentration ;
            p.radar.consistency = c[p.security.IsinCode].consistency ;
            p.radar.riskAnalysis = c[p.security.IsinCode].riskAnalysis ;
            p.radar.overlap = c[p.security.IsinCode].overlap ;
            p.radar.efficency = c[p.security.IsinCode].Efficency ;
            p.radar.riskAdequacy = c[p.security.IsinCode].RiskAdequacy ;
        });
    }
}
