import * as React from 'react';
import { AreaMapProps } from '../../shared/AreaMapProps';
import { Marker } from './Marker';

export const Area5 = ({ htmlTooltip, onClick, fill, color, percentage }: AreaMapProps) => (
    <g data-tip={htmlTooltip}>
        <g className={`area area_5 ${onClick ? '' : 'unselectable'}`}
            transform={fill ? "scale(1.8) translate(335 -485) " : "translate(832 -802)"}
            onClick={onClick}
        >
            <path id="Abruzzo" fill={color} stroke="#FFFFFF" strokeMiterlimit="10" d="M-605.4004517,994.9695435 c-0.0840454-0.0250244-0.1700439-0.0510254-0.2579956-0.0770264 C-605.5704956,994.9185181-605.4844971,994.944519-605.4004517,994.9695435L-605.4004517,994.9695435z M-605.6764526,994.885498c-0.1230469-0.039978-0.2490234-0.0800171-0.3730469-0.1240234 C-605.9264526,994.805542-605.8004761,994.84552-605.6764526,994.885498L-605.6764526,994.885498z M-608.7124634,993.5125122 c-0.6060181-0.3839722-1.0679932-0.7860107-1.2640381-1.1469727c-0.6610107-1.2379761,0.6190186-2.0780029-1.2810059-3.4050293 c-1.8980103-1.3259888-6.0089722-2.3870239-6.934021-4.4650269c-0.9259644-2.0789795-3.664978-3.848999-5.6089478-5.1719971 c-1.9420166-1.3270264-5.8730469-6.8980103-7.9030151-11.9860229 c-0.9110107-2.2739868-1.1210327-3.8859863-1.2819824-5.4249878c-0.8359985,0.3309937-1.4720459,0.5689697-1.7140503,0.6259766 c-1.05896,0.2479858-3.2160034-0.2130127-3.8169556,1.3779907c-0.6000366,1.5939941-0.8470459,2.4060059-2.4000244,2.3709717 c-1.5549927-0.0349731-2.9349976,0.1060181-3.3220215,0.9559937c-0.3889771,0.848999-1.164978,2.0510254-2.1560059,2.4769897 c-0.9879761,0.4219971-3.1439819,0.4589844-3.1439819,0.4589844s-0.3540039,1.5900269,0.9190063,1.7680054 c1.2709961,0.1760254,1.0250244,1.6970215,0.4960327,2.5089722c-0.53302,0.815979-2.0540161,1.0999756-2.9000244,0.4970093 c-0.8480225-0.6010132-2.3659668-1.6619873-2.5429688-0.4240112c-0.177002,1.2369995-1.2360229,0.177002-1.4140015,1.4140015 c-0.177002,1.2390137,0.6739502,0.7800293,0.6739502,1.5930176s-1.0619507,1.7319946-0.8509521,2.4039917 c0.2129517,0.6729736,1.4499512,1.2379761,1.3079834,2.1220093c-0.1420288,0.8859863-0.5629883,1.697998-0.177002,2.1950073 c0.3900146,0.4940186,1.5910034,0.5629883,1.8380127,1.4840088c0.2489624,0.9190063,1.1309814,2.723999,2.5440063,3.1480103 c1.414978,0.4240112,1.0619507,0.6030273,0.0709839,1.5570068c-0.9899902,0.9550171-1.414978,1.5570068-2.3660278,1.309021 c-0.9539795-0.2479858-2.2279663-1.0969849-3.0749512-1.2379761c-0.8470459-0.1409912-1.0230103,0.0360107-1.3770142,0.8499756 c-0.3540039,0.8120117-1.3430176,0.4589844-1.8029785,1.9089966c-0.4590454,1.4509888,0.315979,2.1229858,1.0229492,2.6879883 c0.7059937,0.565979,0.5310059-0.7789917,1.8730469,0c1.3429565,0.7769775,3.2859497,2.052002,3.6399536,2.2630005 c0.3540039,0.2139893,1.2700195,0.5310059,2.0140381,0.9210205c0.7420044,0.3880005,1.3779907,0.5300293,0.9879761,1.7689819 c-0.3859863,1.2369995-0.4580078,1.9459839,0.1069946,1.9799805c0.5650024,0.0360107,2.0130005-0.6710205,2.9329834,0.4249878 c0.9200439,1.0969849,1.2360229,0.6030273,1.4840088,1.2020264c0.2470093,0.6010132,0.6680298,1.7340088,2.0870361,0.8140259 c1.4109497-0.9199829,2.0119629-1.8040161,2.506958-1.3800049c0.4949951,0.4249878,1.5890503,0.5650024,1.6950073,1.0620117 c0.1069946,0.4940186,0.6690063,1.5930176,1.309021,1.4869995c0.6340332-0.1079712,1.3049927-0.4260254,1.7299805-0.0380249 c0.4240112,0.3909912,1.059021,0.1060181,1.5170288,0.6380005c0.1820068,0.2059937,0.9749756,0.8950195,1.8779907,1.6589966 c0.072998-0.2919922,0.2180176-0.4879761,0.4219971-0.5269775c0.7070312-0.1430054,2.6860352-1.3430176,2.8250122-1.7700195 c0.1409912-0.4229736,1.6259766-0.5629883,2.473999-0.7769775c0.8499756-0.2109985-0.7789917-2.1229858-1.2030029-2.5460205 c-0.4219971-0.4260254,0.9899902-0.848999,1.9790039-0.848999c0.9899902,0,1.4849854-0.848999,2.1929932-1.9819946 c0.7059937-1.132019,1.2709961-0.4260254,1.6929932,0.4959717c0.4229736,0.9210205,1.6959839-0.3540039,2.473999,0.7069702 c0.7769775,1.0609741,0.0709839,1.9799805,1.0609741,3.1820068c0.9880371,1.2050171,1.5540161,0.1420288,2.7550049-1.90802 c1.2040405-2.052002,1.9089966-1.9089966,2.4040527-3.6079712c0.4939575-1.6970215,2.4749756-1.6970215,2.6139526-3.0419922 C-609.6604614,995.5825195-609.2144775,994.5435181-608.7124634,993.5125122z"> </path>
            <path id="Molise" fill={color} stroke="#FFFFFF" strokeMiterlimit="10" d="M-597.9295044,998.7015381 c-0.2319946-0.059021-0.4499512-0.1209717-0.651001-0.1900024c-2.4289551-0.8400269-2.9579468-3.2269897-4.9439697-3.2269897 c-1.4069824,0-3.7189941-0.8430176-5.1870117-1.7719727c-0.5020142,1.0310059-0.947998,2.0700073-1.007019,2.6290283 c-0.1389771,1.3449707-2.1199951,1.3449707-2.6139526,3.0419922c-0.4949951,1.697998-1.2040405,1.5570068-2.4040527,3.6079712 c-1.2009888,2.0499878-1.7669678,3.1140137-2.7550049,1.90802c-0.9889526-1.2009888-0.282959-2.1209717-1.0609741-3.1820068 c-0.7769775-1.0620117-2.0510254,0.2139893-2.473999-0.7069702c-0.4230347-0.9219971-0.9869995-1.6279907-1.6929932-0.4959717 c-0.7080078,1.1339722-1.2030029,1.9819946-2.1929932,1.9819946c-0.9890137,0-2.401001,0.4229736-1.9790039,0.848999 c0.4240112,0.4229736,2.0529785,2.335022,1.2030029,2.5460205c-0.8480225,0.2130127-2.3330078,0.3540039-2.473999,0.7769775 c-0.1400146,0.427002-2.117981,1.6270142-2.8250122,1.7700195c-0.7059937,0.1420288-0.7059937,2.1229858,0.5650024,3.7490234 c1.2700195,1.6270142,0.2800293,1.4850464,0.1420288,2.8309937c-0.0510254,0.4620361-0.3140259,1.1650391-0.6420288,1.8890381 c0.1350098,0.1300049,0.21698,0.3449707,0.21698,0.657959c0,1.2709961,1.059021,2.1929932,2.2620239,2.2629395 c1.2019653,0.0699463,2.3999634-1.2030029,1.059021-2.1219482c-1.3410034-0.9189453-0.28302-1.9110107,1.2019653-1.769043 c1.4819946,0.1409912,3.25,0.282959,3.8859863,0c0.6380005-0.2819824,2.8959961,1.4859619,3.9580078,2.1209717 c1.0599976,0.6379395,2.1900024,0.7080078,2.3320312,1.3470459c0.1419678,0.6369629,1.7669678,0.9890137,2.8969727,0.6369629 c1.1309814-0.3540039,1.7659912-0.2139893,2.401001-0.9210205c0.6359863-0.7080078,2.0499878,0.4229736,2.684021-0.4959717 c0.6389771-0.9189453,0.2849731-1.5570068,1.6270142-0.848999c1.3439941,0.7080078,2.2619629-0.0699463,2.8280029-0.9890137 c0.1619873-0.2629395,0.7389526-0.6519775,1.4879761-1.072998c-0.2349854-0.1500244-0.4450073-0.2910156-0.6069946-0.4139404 c-0.7409668-0.56604-0.8809814-2.0150146-1.059021-2.5809937c-0.1789551-0.5670166-0.3169556-2.0150146,0.6719971-2.2280273 c0.9890137-0.2130127,1.8030396,0.2459717,1.8030396,0.2459717l3.9909668-3.6079712 c0,0-0.5289917-0.1749878-0.9890137-0.315979c-0.4609985-0.1439819-0.6349487-1.098999-0.6349487-2.0189819 c0-0.9190063,0-1.6259766,0.1389771-2.335022c0.1450195-0.7069702,0.565979-1.3430176,0.6350098-2.4039917 C-598.102478,999.4545288-598.0224609,999.0505371-597.9295044,998.7015381z"></path>
            <path id="Sardegna" fill={color} stroke="#FFFFFF" strokeMiterlimit="10" d="M-774.3564453,1023.779541 c-0.2640381,0.30896-0.618042,1.4150391-0.3080444,1.5019531c0.3080444,0.0909424,0.8389893,0.0229492,0.8599854,0.6650391 c0.0230103,0.6419678,1.2800293,0.9720459,1.3920288,0.1529541c0.1099854-0.8179932-0.0220337-0.6629639-0.75-1.0169678 c-0.7290039-0.3530273-0.8170166-0.6400146-0.8170166-0.8830566 C-773.9794922,1023.9555664-774.3564453,1023.779541-774.3564453,1023.779541L-774.3564453,1023.779541z  M-806.5534668,1028.3555908c-0.1520386,0.0209961-1.1260376,0.9940186-1.4130249,1.348999 c-0.2860107,0.3540039,0.4429932,0.4639893,0.8179932,0.0649414c0.3760376-0.3969727,0.1110229,0.0209961,0.5740356,0.2659912 c0.4630127,0.243042,1.1459961-0.0889893,1.2149658-0.8179932 C-805.2944946,1028.4906006-805.6694946,1027.5595703-806.5534668,1028.3555908L-806.5534668,1028.3555908z  M-809.5354614,1032.0266113c0,0-0.019043-0.7969971,0.598999-1.3050537 c0.617981-0.5080566,0.7260132,0.2419434,0.6170044,0.8399658c-0.1110229,0.5970459,0.4639893,0.8620605,0.0230103,1.1280518 c-0.4440308,0.2640381-0.6190186,0.3969727-0.9730225,0.2409668 C-809.62146,1032.7775879-809.5354614,1032.0266113-809.5354614,1032.0266113L-809.5354614,1032.0266113z  M-811.6564941,1101.0235596c0,0-1.3909912,0.375-1.4790039,0.9949951 c-0.0869751,0.618042,0.5090332,0.2220459,0.6849976,0.8399658c0.1780396,0.618042,0.44104,1.2590332,0.8400269,1.348999 c0.3989868,0.0880127,1.0830078,0,1.1049805-1.0389404c0.0200195-1.0389404,0.7720337-1.5250244,0.0450439-2.0770264 C-811.1914673,1100.5356445-811.5904541,1100.9345703-811.6564941,1101.0235596L-811.6564941,1101.0235596z  M-809.2474976,1104.5595703c0,0-0.4190063,0.7969971-0.0679932,1.7259521 c0.3550415,0.9279785,0.7520142,1.3699951,0.8619995,2.2530518c0.1099854,0.8850098,0.7950439,2.1009521,1.368042,1.3509521 c0.5739746-0.7509766,0.4209595-2.6960449,0.8179932-3.4470215c0.3969727-0.7550049-0.06604-1.3520508-0.6420288-1.8590088 C-807.4824829,1104.0726318-808.2544556,1103.699585-809.2474976,1104.5595703L-809.2474976,1104.5595703z  M-787.9154663,1102.2415771c-1.2800293,0.8399658-1.5029907,1.9890137-1.4140015,3.0939941 c0.0889893,1.105957,1.0169678,1.4599609,0.1339722,2.9200439c-0.8839722,1.4580078-2.164978,2.6949463-2.914978,3.0939941 c-0.7529907,0.3979492-2.342041,2.1669922-2.8720093,2.1669922c-0.5289917,0-2.6920166-1.8120117-3.0480347-2.1199951 c-0.3529663-0.3120117-1.7659912,0.6169434-2.0739746,1.0159912c-0.3099976,0.3959961-1.7680054,1.3249512-1.8120117,0.6199951 c-0.0450439-0.7089844,0.3079834-2.4780273,0-2.6970215c-0.3080444-0.2230225-1.2820435-1.4160156-1.2360229-2.3010254 c0.0419922-0.8850098-0.1329956-1.1040039-0.9710083-1.7700195c-0.8410034-0.6619873-1.7689819-1.9019775-2.2990112-2.6080322 c-0.5299683-0.7060547-1.6329956-2.7840576-2.0310059-3.3149414c-0.3969727-0.5310059,1.5900269-1.0620117,1.5450439-2.8740234 c-0.0440063-1.81604-0.75-2.3869629-1.1040039-2.9189453c-0.3519897-0.5300293,0.2659912-1.7220459,0.4419556-2.1669922 c0.1780396-0.4439697-0.3079834-2.1879883,0.4190063-3.0739746c0.7290039-0.8869629,1.7020264-1.2159424,1.6560059-2.3189697 c-0.0429688-1.105957,0.0460205-2.5209961,0.0460205-3.2280273c0-0.7080078,0.1329956-4.1120605,0.1329956-4.1120605 s1.5,0.7950439,1.5449829,1.4139404c0.0419922,0.6190186,0.4860229-1.2810059,0.9710083-2.4780273 c0.4860229-1.1899414,1.769043-3.0949707,0.3980103-4.0629883c-1.3689575-0.9749756-2.9599609,1.5460205-2.9599609,1.5460205 l-0.1329956-1.4160156c0,0-0.7940063-0.3540039-0.7940063-1.5019531c0-1.1500244,0.7940063-2.697998,0-3.493042 c-0.7960205-0.7979736,0.9729614-1.151001,1.2810059-1.151001c0.3099976,0,1.3250122-0.1760254,1.190979-1.5909424 c-0.131958-1.4139404-0.3959961-3.9790039,0-5.2180176c0.3989868-1.2380371,0.8400269-2.7409668-0.4849854-3.4040527 c-1.322998-0.6650391-1.3670044-1.105957-1.1929932-2.3000488c0.1790161-1.1929932-0.5299683-2.8730469-0.927002-4.0219727 c-0.3959961-1.1500244-1.0609741-1.2380371-1.0609741-2.2550049c0-1.019043-0.7059937-1.7700195-1.8550415-1.4160156 c-1.1480103,0.3540039-1.3659668-0.3100586-1.4129639-0.8859863c-0.0430298-0.572998-0.5280151,1.0179443-1.4119873,0.6639404 c-0.8840332-0.3540039-0.2650146-1.2370605,0.3540039-1.7679443c0.6189575-0.5310059,1.1480103-2.2559814,0.3529663-3.0510254 c-0.7940063-0.7950439-0.7059937-0.7080078-0.1759644-2.1219482c0.5289917-1.4150391,1.2349854-2.4320068,1.4559937-3.1870117 c0.223999-0.7490234,1.0180054-1.05896,0.3969727-1.855957c-0.617981-0.7939453-1.367981-0.7939453-0.5709839-1.8120117 c0.7949829-1.0159912,1.5880127,0.842041,1.5880127,1.9890137c0,1.1519775,1.3239746,1.0629883,1.8109741,1.6379395 c0.4849854,0.5739746,0.177002,0.3549805,1.9000244,0.6639404c1.7229614,0.3100586,3.4429932,1.0610352,4.9469604,0.618042 c1.5010376-0.4429932,1.0159912-2.2540283,3.1340332-2.6090088c2.1220093-0.3540039,4.3280029-0.4870605,4.6380005-1.1049805 c0.3079834-0.6190186,1.1939697-2.4320068,2.7390137-3.8459473c1.5459595-1.4139404,1.5009766-1.1500244,2.7390137-2.2559814 c1.2340088-1.1049805,2.5609741-0.3110352,3.1350098-0.7070312c0.5750122-0.3979492,2.0310059-0.9730225,2.0310059-2.3439941 c0-1.3699951,0.6199951-1.723999,1.4140015-1.8570557c0.7949829-0.131958,1.8569946,0.6190186,1.8569946,1.5050049 c0,0.8830566,1.4549561,0.6199951,1.9389648,0.1760254c0.4880371-0.44104,0.0469971,0.75,1.0180054,0.75 c0.9689941,0,0.9719849,0.6199951,1.0159912,1.5500488c0.0440063,0.9279785,0.9280396,1.3249512,1.723999,0.3110352 c0.7930298-1.019043,2.8250122,0.6169434,2.2510376,1.5460205c-0.5720215,0.9289551-1.5460205,2.4770508-0.8389893,2.6960449 c0.7069702,0.223999,2.3859863,0,2.7379761,0.7070312c0.3540039,0.7080078-1.5029907,1.2840576-1.6809692,1.9919434 c-0.1749878,0.7080078-0.1749878,2.6070557,0.5319824,1.7249756c0.7040405-0.8869629,1.3690186-0.1340332,1.5460205,0.7939453 c0.177002,0.9300537,1.7229614,1.5050049,1.8969727,1.8129883c0.1790161,0.30896-1.4569702,0.5749512-0.9259644,2.2989502 c0.5289917,1.7249756,0.617981,1.8120117,1.4119873,3.1400146c0.7969971,1.3260498,0.617981,0.6639404,0.6640015,2.8740234 c0.0440063,2.2110596,1.2149658,2.9620361,1.8969727,4.0670166c0.6849976,1.1040039-1.1919556,3.381958-2.1879883,4.8630371 c-0.9920044,1.4820557-3.6430054,1.9899902-4.0830078,4.4229736c-0.440979,2.4310303-0.2219849,4.4659424,1.3699951,6.1899414 c1.5889893,1.7249756,0.6170044,3.4040527,0.309021,4.8199463c-0.309021,1.4150391,0.8809814,1.5489502,0.1309814,3.2290039 c-0.7489624,1.6789551-1.1029663,1.3260498-1.1029663,4.0219727c0,2.6970215-1.0180054,5.0419922-1.0620117,6.4560547 c-0.0419922,1.4129639-0.4379883,2.4329834-0.5720215,3.93396c-0.1329956,1.5059814-0.0449829,3.2290039-0.3549805,4.3790283 c-0.309021,1.1479492-0.8810425,1.2359619-0.6170044,2.8289795c0.2659912,1.5930176,0.6170044,1.6800537,0.6170044,1.6800537 s-1.2780151-0.44104-1.5,0.9289551c-0.2189941,1.3709717-0.1310425,2.4780273-0.2189941,3.1850586 c-0.0910034,0.7080078-1.151001,1.4610596-1.9000244,2.1660156c-0.7509766,0.7070312,0.1760254-0.1779785-0.881958-0.30896 c-1.0610352-0.1330566-1.7709961,0.0439453-2.5209961-0.7080078c-0.75-0.7509766-2.0300293-2.7419434-3.2670288-3.2290039 c-1.2340088-0.4849854-3.0039673-1.0179443-3.4890137,0.0899658c-0.4840088,1.1040039-1.1919556,1.2380371-1.8099976,1.1479492 C-786.9904785,1102.4185791-787.9154663,1102.2415771-787.9154663,1102.2415771z"></path>
            <path id="Lazio" fill={color} stroke="#FFFFFF" strokeMiterlimit="10" d="M-703.3584595,982.121521 c2.6789551,0.809021,6,2.0650024,7.3919678,5.4249878c1.9429932,4.6879883,2.1199951,6.632019,3.6240234,7.6929932 c1.4989624,1.0599976,2.7369995,0.1760254,4.2369995,1.0599976c1.5019531,0.8850098,4.5050049,3.3599854,5.4769897,4.0679932 c0.9730225,0.7089844,1.7689819,5.3070068,1.8549805,6.367981c0.0870361,1.0609741,0.5750122-0.440979,2.7810059,1.1500244 c2.210022,1.5900269,2.8289795,2.03302,4.6380005,4.3319702c1.8120117,2.3000488,2.210022,3.9790039,3.8460083,5.1729736 c1.6329956,1.1939697,1.1459961-0.8389893,2.5609741,0.6629639c1.4120483,1.5050049,2.8270264,1.019043,4.1500244,1.1040039 c1.3250122,0.0909424,2.2080078,1.3709717,3.2700195,3.1850586c1.05896,1.8120728,0.6159668,3.4050903,2.0299683,3.9360962 c1.414978,0.5310059,2.03302-0.4870605,2.9589844-1.4580078c0.9280396-0.973999,3.3120117-1.6810913,5.4320068-1.019043 c2.1199951,0.6639404,6.3179932,3.2709961,6.3179932,3.2709961s-0.7079468-1.9420166,1.6329956-1.9870605 c1.2860107-0.0269775,2.7290039,0.631958,3.9640503,1.5059814c0.9559937-0.8990479,1.9790039-1.9730225,2.3880005-2.7889404 c0.8479614-1.6970825,1.3439941-2.1220093,0.9179688-3.4660034c-0.4240112-1.3449707-0.1430054-1.9110107,0.8480225-2.9000244 c0.7479858-0.7469482,1.6950073-1.131958,2.1159668-0.7290039c0.3280029-0.7249756,0.5910034-1.427002,0.6420288-1.8890381 c0.1389771-1.3459473,1.1279907-1.2039795-0.1420288-2.8309937c-0.9049683-1.1589966-1.1669922-2.4959717-0.9869995-3.2219849 c-0.9029541-0.7650146-1.6959839-1.4530029-1.8779907-1.6589966c-0.4580078-0.5310059-1.0930176-0.2470093-1.5169678-0.6380005 c-0.4260254-0.3880005-1.0970459-0.0700073-1.7300415,0.0380249c-0.6399536,0.1049805-1.2009888-0.992981-1.30896-1.4869995 c-0.1060181-0.4959717-1.2000122-0.6370239-1.6950073-1.0620117c-0.4949951-0.4240112-1.0960083,0.460022-2.507019,1.3800049 c-1.4169922,0.9199829-1.8400269-0.2109985-2.0870361-0.8140259c-0.2479858-0.5999756-0.5639648-0.1049805-1.4839478-1.2020264 c-0.9200439-1.0960083-2.3670044-0.3889771-2.9330444-0.4249878c-0.5650024-0.0339966-0.492981-0.7410278-0.1069946-1.9799805 c0.3900146-1.2379761-0.2459717-1.3809814-0.9879761-1.7689819c-0.7440186-0.3900146-1.6600342-0.7069702-2.0139771-0.9210205 c-0.3540039-0.2109985-2.2969971-1.4849854-3.6400146-2.2630005c-1.34198-0.7789917-1.1669922,0.565979-1.8729858,0 c-0.7070312-0.5650024-1.4819946-1.2369995-1.0230103-2.6879883c0.460022-1.4500122,1.447998-1.0969849,1.8029785-1.9089966 c0.3540039-0.8129883,0.5289917-0.9910278,1.3770142-0.8499756c0.8479614,0.1410522,2.1209717,0.9899902,3.0750122,1.2379761 c0.9509888,0.2479858,1.3759766-0.3540039,2.3659668-1.309021c0.9899902-0.9539795,1.3439941-1.1329956-0.0709839-1.5570068 c-1.4130249-0.4249878-2.2949829-2.2290039-2.5440063-3.1480103c-0.2470093-0.9210205-1.447998-0.9899902-1.8380127-1.4840088 c-0.3869629-0.4970093,0.0350342-1.3099976,0.177002-2.1950073c0.1430054-0.8839722-1.0949707-1.4489746-1.3079834-2.1220093 c-0.2120361-0.6719971,0.8510132-1.59198,0.8510132-2.4039917c0-0.8129883-0.8510132-0.3540039-0.6740112-1.5930176 c0.1779785-1.2369995,1.2369995-0.177002,1.4140015-1.4140015c0.177002-1.2379761,1.6950073-0.177002,2.5429688,0.4240112 c0.8470459,0.6030273,2.3670044,0.3189697,2.9000244-0.4970093c0.5289917-0.8120117,0.7749634-2.3330078-0.4960327-2.5089722 c-1.2719727-0.177002-0.9190063-1.7680054-0.9190063-1.7680054s0-0.8150024-1.4499512-1.2399902 c-1.4470215-0.4229736-2.1540527-0.565979-2.1890259,0.460022c-0.0339966,1.0269775-0.4940186,1.7340088-1.0939941,2.7940063 c-0.6019897,1.0599976-1.059021-0.2470093-1.3449707,0.3549805c-0.28302,0.598999-1.0970459,0.9190063-1.8340454,0.3179932 c-0.7439575-0.6019897-0.992981,0.2490234-1.5209961,0.7080078c-0.5289917,0.460022-1.1659546,0.0349731-2.5079956,0.0349731 c-1.3429565,0-0.7609863,1.7700195-0.8329468,1.9110107c-0.0679932,0.1409912-1.6680298,0.8220215-1.802002,0.9730225 c-0.1290283,0.1489868-2.1610107,1.3259888-2.3569946,1.6890259c-0.1929932,0.3629761-0.1929932,1.2550049-0.5750122,1.5819702 c-0.3800049,0.3270264-1.6500244,0.0620117-2.0650024-0.2919922c-0.4169922-0.3530273-0.6719971-0.026001-0.8140259,1.2470093 c-0.1399536,1.2730103-1.2009888,2.3339844-1.9049683,1.5570068c-0.710022-0.7789917-2.2630005,0.4240112-2.4030151-0.4260254 c-0.1419678-0.848999-0.3529663-3.1119995-0.7780151-3.8179932c-0.4239502-0.7080078-1.9779663,1.0599976-2.401001,0.2109985 c-0.427002-0.8480225-1.6259766-0.2109985-1.5559692-1.4160156c0.0709839-1.2020264-0.492981-1.3439941-1.2709961-2.2630005 c-0.7769775-0.9210205,0-1.697998-1.0610352-3.1129761c-1.0599976-1.4140015-1.7669678,0.8499756-2.1900024,0.2119751 c-0.4249878-0.6370239-1.3449707,0.28302-2.3319702,0.4219971c-0.9899902,0.1439819-1.5540161-0.7750244-2.6149902-1.6259766 c-1.0610352-0.8480225-0.9880371-1.1309814,0.2819824-1.6959839c1.2709961-0.5670166,0.4940186-1.3449707,0.1430054-1.7700195 c-0.3540039-0.4249878-1.9089966-2.9710083-2.2620239-2.1209717c-0.3540039,0.8480225-1.4140015,0.5650024-3.3939819,1.2020264 s0.6390381,2.1920166,0.7080078,3.184021c0.0709839,0.9910278-0.8480225,1.132019-1.2009888,2.6879883 c-0.3540039,1.5579834-2.5450439,2.5469971-3.6750488,3.3259888c-1.1309814,0.7769775-1.4129639,1.4130249-0.5650024,2.9710083 c0.8500366,1.5579834-1.5539551,1.2719727-3.1819458,1.5579834 C-702.1234741,979.8945312-702.7544556,980.8655396-703.3584595,982.121521z"></path>
        </g>
        {percentage && <Marker transform="translate(160, 175)" perc={percentage} onClick={onClick} />}
    </g>
);
