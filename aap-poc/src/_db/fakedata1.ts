import { strategies } from './data';

const case1 = { "CASH": { "riskAdequacy": 9.99999933836686, "efficency": 124, "consistency": 47, "riskAnalysis": 10, "concentration": 10, "overlap": 10, }, "LU0568620560": { "riskAdequacy": 215.358976361307, "efficency": 0, "consistency": 0, "riskAnalysis": 301.954810356676, "concentration": 219.903529921881, "overlap": 260.929168999443, }, "LU0281579598": { "riskAdequacy": 108.179488033112, "efficency": 0, "consistency": 0, "riskAnalysis": 318.478791527405, "concentration": 277.453151310007, "overlap": 297.965970848788, }, "LU0201576401": { "riskAdequacy": 108.179488033112, "efficency": 0, "consistency": 0, "riskAnalysis": 318.478791527405, "concentration": 277.453151310007, "overlap": 297.965970848788, }, "LU0281578517": { "riskAdequacy": 268.948716564135, "efficency": 0, "consistency": 0, "riskAnalysis": 356.50587426188, "concentration": 253.941770566236, "overlap": 305.223823211943, }, "LU0119099819": { "riskAdequacy": 268.948716564135, "efficency": 0, "consistency": 0, "riskAnalysis": 356.50587426188, "concentration": 253.941770566236, "overlap": 305.223823211943, }, "FR0010314401": { "riskAdequacy": 108.179488033112, "efficency": 1.4210854715202E-14, "consistency": 1.4210854715202E-14, "riskAnalysis": 276.603424922439, "concentration": 235.577784705042, "overlap": 256.090604243823, }, }
const case2 = {
    "CASH": { "concentration": 47.1999999998039, "efficency": 47.1999999998039, "consistency": 47.1999999998039, "overlap": 47.1999999998039, "riskAdequacy": 47.1999999998039, "riskAnalysis": 47.1999999998039, },
    "IE0007472990": { "concentration": 197.103180155668, "efficency": 214.24603736462, "consistency": 141.331750885864, "overlap": 69.1031805331146, "riskAdequacy": 299.617462576167, "riskAnalysis": 198.246037275221, },
    "LU0145482039": { "concentration": 112.628183585249, "efficency": 122.424101870191, "consistency": 80.7587968632115, "overlap": 39.4853261551669, "riskAdequacy": 171.207776598463, "riskAnalysis": 113.281244835546, },
    "LU1191877379": { "concentration": 84.4711396470721, "efficency": 91.81807843088, "consistency": 60.5690987701315, "overlap": 29.6139968580587, "riskAdequacy": 128.405836855748, "riskAnalysis": 84.9609355847954, },
    "LU0201576401": { "concentration": 119.668003152403, "efficency": 151.15488359435, "consistency": 90.3735423939543, "overlap": 67.423104660511, "riskAdequacy": 183.959551206469, "riskAnalysis": 116.052842796618, },
    "XS1327539976": { "concentration": 56.3140917844317, "efficency": 61.2120509269027, "consistency": 40.3793984234131, "overlap": 19.7426630693909, "riskAdequacy": 85.6038882910391, "riskAnalysis": 56.6406224095805, },
    "NL0011585146": { "concentration": 44.7193926020446, "efficency": 59.2383430374004, "consistency": 34.0558360070207, "overlap": 27.7398009530389, "riskAdequacy": 69.5427148042479, "riskAnalysis": 42.8301797678648, },
    "LU0518421895": { "concentration": 143.59598858673, "efficency": 240.15575535949, "consistency": 122.026309059919, "overlap": 154.044967968189, "riskAdequacy": 225.023393109529, "riskAnalysis": 127.176163515397, },
    //"FR0010816819": { "concentration": 2, "efficency": 2, "consistency": 2, "overlap": 2, "riskAdequacy": 2, "riskAnalysis": 2, },
    "FR0010816819": { "concentration": 44.7193926020446, "efficency": 59.2383430374004, "consistency": 34.0558360070207, "overlap": 27.7398009530389, "riskAdequacy": 69.5427148042479, "riskAnalysis": 42.8301797678648, },
    //"LU0399031052": { "concentration": 3.0009663785738, "efficency": 3.0009663785738, "consistency": 3.0009663785738, "overlap": 3.0009663785738, "riskAdequacy": 3.0009663785738, "riskAnalysis": 3.0009663785738, },
    "LU0399031052": { "concentration": 143.59598858673, "efficency": 240.15575535949, "consistency": 122.026309059919, "overlap": 154.044967968189, "riskAdequacy": 225.023393109529, "riskAnalysis": 127.176163515397, },
    "FR0010930446": { "concentration": 5.23919282060766, "efficency": 5.23919282060766, "consistency": 5.23919282060766, "overlap": 5.23919282060766, "riskAdequacy": 5.23919282060766, "riskAnalysis": 5.23919282060766, },
    "LU0627756538": { "concentration": 6.64570357321329, "efficency": 6.64570357321329, "consistency": 6.64570357321329, "overlap": 6.64570357321329, "riskAdequacy": 6.64570357321329, "riskAnalysis": 6.64570357321329, },
    "FR0010314401": { "concentration": 57.5062968949693, "efficency": 93.7162094172287, "consistency": 49.4176679427813, "overlap": 61.4246652707932, "riskAdequacy": 88.0415749617297, "riskAnalysis": 51.3488624932193, },
    "LU0119099819": { "concentration": 76.5163753148518, "efficency": 124.796258701231, "consistency": 65.7315355514463, "overlap": 81.7408650055812, "riskAdequacy": 117.230077576251, "riskAnalysis": 68.3064627791851, },
    "IE00B4ND3602": { "concentration": 11.2876895074214, "efficency": 11.2876895074214, "consistency": 11.2876895074214, "overlap": 11.2876895074214, "riskAdequacy": 11.2876895074214, "riskAnalysis": 11.2876895074214, },
    "LU0281579598": { "concentration": 44.2961502274961, "efficency": 68.4360919206859, "consistency": 38.9037303457934, "overlap": 46.9083950728608, "riskAdequacy": 64.6530013581957, "riskAnalysis": 40.1911939596628, },
}

const case3 ={"CASH":{"concentration":2.13183377361838,"efficency":7.66530417435192E-08,"consistency":21.3046645642487,"overlap":69.7607215700679,"riskAdequacy":15.6039519655386,"riskAnalysis":69.76072157029,},"FR0010314401":{"concentration":286.404966056425,"efficency":193.023343344057,"consistency":106.904412384506,"overlap":185.764269870696,"riskAdequacy":121.156193924616,"riskAnalysis":185.76426987014,},"LU0119099819":{"concentration":148.65857666559,"efficency":71.9482638166751,"consistency":72.259911109995,"overlap":96.4879396129046,"riskAdequacy":69.40955481064,"riskAnalysis":96.4879396130157,},"LU0281578517":{"concentration":105.868850285854,"efficency":29.1585374369399,"consistency":30.8555270986938,"overlap":55.0835556016033,"riskAdequacy":28.0051707993387,"riskAnalysis":55.0835556017144,},"LU0568620560":{"concentration":168.938965581884,"efficency":117.798755688537,"consistency":119.391862971596,"overlap":135.543881973535,"riskAdequacy":117.491625379323,"riskAnalysis":135.543881973609,},"LU0201576401":{"concentration":78.0874887979699,"efficency":52.5173838512963,"consistency":52.6212663047094,"overlap":60.6972758056793,"riskAdequacy":51.6711475085734,"riskAnalysis":60.6972758057163,},"LU0281579598":{"concentration":62.0414322899203,"efficency":36.4713273432467,"consistency":43.8030561995662,"overlap":51.8790657005361,"riskAdequacy":42.8529374034302,"riskAnalysis":51.8790657005731,},"FR0011006360":{"concentration":233.445289666245,"efficency":237.894686710078,"consistency":186.191175229909,"overlap":209.469084982331,"riskAdequacy":195.217303558976,"riskAnalysis":209.469084981979,},"LU0257968619":{"concentration":6.21167418265498,"efficency":8.43637270880728,"consistency":3.08503250020773E-09,"overlap":3.08503250020773E-09,"riskAdequacy":1.08768054977534E-08,"riskAnalysis":1.08768054977534E-08,},"FR0000989501":{"concentration":7.21989960419825,"efficency":9.44459812611498,"consistency":3.08503250020773E-09,"overlap":3.08503250020773E-09,"riskAdequacy":1.08768054977534E-08,"riskAnalysis":1.08768054977534E-08,},"LU0518421895":{"concentration":30.5092386787353,"efficency":43.8574303080123,"consistency":0,"overlap":69.8337292121988,"riskAdequacy":27.0783847640294,"riskAnalysis":69.8337292111439,},"LU0533595319":{"concentration":31.8337584190156,"efficency":45.1819500482925,"consistency":0,"overlap":69.8337292121988,"riskAdequacy":27.0783847640294,"riskAnalysis":69.8337292111439,},}


export const updateStrategies = () => {
    updateStrategy("0");
    updateStrategy("1");
//    updateStrategy("2");
}

const updateStrategy = (id: string) => {
    const c = id === "0" ? case1 :
        id === "1" ? case2 :
            id === "2" ? case3 :
                null;
    if (c) {
        strategies[id].forEach(p => {
            p.radar.concentration = c[p.security.IsinCode].concentration;
            p.radar.consistency = c[p.security.IsinCode].consistency;
            p.radar.riskAnalysis = c[p.security.IsinCode].riskAnalysis;
            p.radar.overlap = c[p.security.IsinCode].overlap;
            p.radar.efficency = c[p.security.IsinCode].efficency;
            p.radar.riskAdequacy = c[p.security.IsinCode].riskAdequacy;
        });
    }
}
