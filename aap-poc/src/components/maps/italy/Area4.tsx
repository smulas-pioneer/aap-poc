import * as React from 'react';
import { AreaMapProps } from '../../shared/AreaMapProps';
import { Marker } from './Marker';

export const Area4 = ({ htmlTooltip, onClick, fill, color, percentage }: AreaMapProps) => (
    <g data-tip={htmlTooltip}>
        <g className={`area area_4 ${onClick ? '' : 'unselectable'}`}
            transform={fill ? "scale(2.9) translate(470 -590) " : "translate(832 -802)"}
            onClick={onClick}
        >
            <path id="Emilia_Romagna" fill={color} stroke="#FFFFFF" strokeMiterlimit="10" d="M-671.8204956,924.194519 c0,0,1.3510132,0.8079834,1.7530518,1.1300049c0.7059937,0.565979,1.5529785,1.6259766,2.4019775,1.4160156 c0.8480225-0.2119751,2.2630005-1.5560303,2.3330078-3.6079712c0.006958-0.2199707,0.0529785-0.4500122,0.1269531-0.6859741 c0.0740356,0.0159912,0.1490479,0.0319824,0.2250366,0.0510254c-0.0750122-0.0189819-0.1500244-0.0349731-0.2250366-0.0510254 c-0.2459717-0.052002-0.4889526-0.0910034-0.7279663-0.1209717c-1.8110352-0.2199707-7.5100098-6.5440063-9.1879883-8.6669922 c-1-2.1220093-2.2520142-4.7750244-2.5620117-7.4279785c-0.3110352-2.6539917-0.7520142-4.90802-0.6190186-6.4550171 c0.1329956-1.5479736,0.3519897-2.4760132-0.2659912-4.5999756c-0.6160278-2.1220093-0.2640381-5.7050171,0.7949829-5.3499756 c0.6699829,0.2260132,1.4130249,0.65802,1.9000244,0.7260132c-0.5120239-1.0180054-0.9310303-1.8959961-1.0500488-2.2280273 c-0.3540039-0.9920044-0.2139893-1.9099731-0.3540039-2.7579956c-0.1409912-0.8499756-1.414978-1.132019-1.9069824-0.3549805 c-0.4949951,0.7780151-1.4129639,1.0620117-2.6170044,0.2139893c-1.2000122-0.848999-2.684021-2.0529785-3.6719971-1.9819946 c-0.9920044,0.0709839-2.3309937,0.1420288-3.3930054,0.1420288c-1.0609741,0-3.53302-0.848999-4.0269775,0.2130127 c-0.4960327,1.0599976-2.2639771,3.4660034-3.2529907,2.9689941c-0.9860229-0.4940186-1.9780273-2.2630005-3.0369873-2.473999 c-1.0599976-0.2139893-2.8259888,0.28302-3.2529907-0.4260254c-0.4230347-0.7080078-2.7550049,0.2839966-3.3900146,0.7780151 c-0.6359863,0.4940186-1.0580444,1.6270142-2.6870117,0.5650024c-1.6240234-1.0599976-1.4830322-1.4860229-3.4609985-1.1309814 c-1.9810181,0.3549805-2.6879883,2.4769897-4.4530029,1.4869995c-1.7659912-0.9899902-2.8270264,0.0700073-3.1099854-1.2730103 c-0.2820435-1.3449707-1.4819946-1.8410034-2.3300171-1.2039795c-0.8479614,0.6350098-0.8479614,1.7680054-2.5440063,1.9819946 c-1.6959839,0.2119751-3.1090088,1.4840088-3.815979-0.2139893c-0.7040405-1.697998-1.4119873-2.052002-2.1210327-2.0499878 c-0.7039795,0-1.4129639-0.7069702-2.7559814-1.6270142s-2.2600098-1.0609741-3.81604-0.848999 c-1.552002,0.2119751-2.3289795-1.2750244-2.3289795-1.2750244s0.2109985-3.2180176-1.6270142-1.9790039 c-1.8359985,1.2360229-2.2260132,1.026001-2.8610229,0.8129883c-0.6369629-0.2119751-0.3889771,1.6259766-1.3079834,1.2719727 s-1.2709961-2.335022-1.802002-1.4849854c-0.5310059,0.848999-1.1310425,1.4849854-1.9070435,0.7769775 c-0.7780151-0.7069702-1.2369995-1.8380127-1.59198-1.6630249c-0.3530273,0.177002-0.6350098,0.7080078-1.7290039,0.7080078 c-1.0980225,0-2.6170044,0.0369873-3.2520142,0.0739746c-0.6359863,0.0339966-4.0280151,6.4370117-4.0280151,6.4370117 s0.8839722,0.1420288,1.2019653,2.1569824c0.3170166,2.0150146-1.1300049,2.2990112-1.3429565,3.007019 c-0.2130127,0.7069702,1.1329956,1.6270142,0.3179932,2.5469971c-0.8129883,0.9190063-1.3430176,0.2119751-2.2969971,0.7769775 c-0.9540405,0.565979-1.1650391,2.052002-1.1650391,2.052002s0.4570312,0.7769775,1.1310425,0.9890137 c0.6709595,0.2139893,2.0469971-0.5650024,2.473999,0.742981c0.4249878,1.309021,1.8709717,0.2849731,2.2609863-0.0689697 c0.3869629-0.3540039,1.4469604,0.6710205,1.625,1.6959839c0.1749878,1.026001,1.164978,0.7789917,0.2109985,2.1929932 c-0.9550171,1.414978-1.8699951,2.4069824-1.5549927,3.2550049c0.3179932,0.8499756,1.3779907-1.3439941,2.6499634-0.9559937 c1.2709961,0.3900146,4.2399902,3.1849976,4.2399902,3.1849976s1.3410034-0.8850098,1.9400024-1.7329712 c0.6040039-0.8499756,1.7349854-3.6079712,3.2180176-3.007019c1.4849854,0.6030273,3.3209839,1.7700195,3.3569946,2.2639771 c0.0339966,0.4970093,0.177002,1.0609741,0.7049561,1.7329712c0.5300293,0.6729736,0.9190063,1.7000122,1.8380127,1.9450073 c0.9180298,0.2490234,1.6950073,0,2.651001,1.026001c0.9550171,1.026001,1.1300049,2.0859985,1.9070435,1.9459839 c0.7780151-0.1430054,1.2709961-0.9199829,2.2609863-0.0700073c0.9909668,0.8480225,1.3079834,1.6270142,2.1539917,1.6970215 c0.8499756,0.0720215,1.2730103-0.0700073,1.5209961,0.6710205c0.2489624,0.7440186,1.0599976,2.1229858,1.8029785,2.9370117 c0.7420044,0.8150024,1.94104-0.0339966,2.1890259-0.4240112c0.2459717-0.3889771,1.6610107-0.6710205,2.8269653-0.4249878 c1.1660156,0.25,1.132019,0.6359863,2.0159912,1.4860229c0.8840332,0.8500366,2.8080444,1.9639893,3.1060181,2.1589966 c0.302002,0.1959839,0.742981-0.2639771,0.9909668-0.8480225c0.2479858-0.5839844,1.3770142-2.3699951,1.5380249-1.5200195 c0.1549683,0.8469849,0.492981,1.5390015,1.8009644,1.5390015c1.3070068,0,1.5-1.2399902,2.4550171-0.8129883 c0.9539795,0.4229736,2.8439941,1.2550049,2.2959595,0.3880005c-0.5459595-0.8660278-2.1530151-2.2280273-0.6729736-2.2810059 c1.4849854-0.0540161,1.9469604,0.1049805,2.4569702-0.5490112c0.5130005-0.6560059,2.1760254-0.973999,2.4570312-1.6820068 s1.4119873,0.5289917,1.9439697,1.2030029c0.5289917,0.6719971-0.0390015,1.8029785,1.4470215,1.4140015 c1.4829712-0.3870239,2.4029541-0.4240112,2.2630005,0.4249878c-0.1430054,0.848999-0.072998,1.2719727,1.05896,1.2039795 c1.1310425-0.0720215,2.5450439-1.0980225,2.5800171-0.0720215c0.0350342,1.0250244-1.2719727,3.1129761-1.697998,3.4310303 c-0.4229736,0.3179932-1.5529785,0.9190063-0.3880005,1.9810181c1.1660156,1.0599976,1.2000122,1.6259766,1.2000122,2.5469971 c0,0.9190063,0.2139893,1.2709961,1.5930176,2.2269897c1.3759766,0.9559937,2.9309692,0.3900146,4.30896,1.8400269 c1.3790283,1.4509888,3.394043,1.6270142,3.394043,1.6290283c0,0,0.5429688-0.0150146,1.3119507-0.1040039 c-0.3239746-0.4550171,0.2820435-1.7329712,1.2680054-3.0100098c1.2010498-1.5560303,0.2120361-3.184021,1.342041-3.2540283 c1.1309814-0.0709839,2.401001,0.4949951,3.3189697-0.6380005c0.6380005-0.7839966,1.4790039-0.8549805,2.5209961-0.4940186 l-0.0009766,0.0009766L-671.8204956,924.194519z"></path>
            <path id="Marche" fill={color} stroke="#FFFFFF" strokeMiterlimit="10" d="M-675.3225098,922.3545532 c-1.0409546-0.3610229-1.8829956-0.289978-2.5209961,0.4940186c-0.9179688,1.1329956-2.1879883,0.5670166-3.3189697,0.6380005 c-1.1300049,0.0700073-0.1409912,1.697998-1.34198,3.2540283s-1.8400269,3.1140137-0.9200439,3.1829834 c0.9200439,0.0700073,3.6760254-0.2119751,5.0870361-0.0689697c1.4160156,0.1389771,2.9689941,1.2719727,0.4940186,2.473999 c-1.9380493,0.9450073-3.2270508,1.1469727-2.973999,3.4470215c0.1040039-0.0079956,0.2229614-0.0029907,0.3609619,0.0200195 c1.2720337,0.2119751,1.8029785,0.6719971,2.5809937-0.3540039c0.776001-1.0239868,1.6240234,0.8129883,1.2340088,1.309021 c-0.3890381,0.4949951-0.4580078,1.5230103,0.0360107,1.8049927c0.4949951,0.2839966,1.7299805-1.414978,2.8269653-0.2819824 c1.0939941,1.1309814,3.3920288,3.6779785,3.7449951,4.1019897c0.3530273,0.4240112,1.2360229-1.1660156,1.8359985-0.8839722 c0.6000366,0.2819824,1.3779907,0.6370239,1.9060059,0.0349731c0.53302-0.6010132,1.0620117-0.9180298,0.8510132,1.0250244 c-0.2130127,1.947998-0.6030273,2.1220093-0.0350342,3.0430298c0.56604,0.9199829,1.0950317,1.4869995,1.1300049,2.4060059 c0.0350342,0.9199829,0.8120117,2.6519775,1.1670532,3.2890015c0.3540039,0.6359863,0.1399536,1.8389893,0.1049805,2.4780273 c-0.0360107,0.6350098,1.9439697,1.4500122,1.5549927,2.6879883c-0.3890381,1.2390137,0.3529663,4.0670166,1.3079834,4.7739868 c0.9530029,0.7080078,0.848999,0.2490234,2.6489868,0.9559937c1.8010254,0.7080078,2.5780029,3.4660034,3.0390015,3.572998 c0.4609985,0.1060181,1.3770142-1.5549927,2.3309937-0.8129883c0.6459961,0.5040283,0.5160522,2.5239868,0.3619995,3.7689819 c0.2440186,0.0579834,0.5240479,0.1359863,0.8380127,0.2280273c1.4500122,0.4240112,1.4500122,1.2399902,1.4500122,1.2399902 s2.1549683-0.0360107,3.1439819-0.4589844c0.9910278-0.4260254,1.7680054-1.6270142,2.1560059-2.4769897 c0.3880005-0.848999,1.7680054-0.9910278,3.3220215-0.9559937c1.5540161,0.0349731,1.8009644-0.7769775,2.3999634-2.3709717 c0.6020508-1.5910034,2.7590332-1.1300049,3.8170166-1.3779907c0.2420044-0.0579834,0.8779907-0.2949829,1.7139893-0.6259766 c-0.1989746-1.8969727-0.3209839-3.684021-1.5889893-6.4660034 c-2.2990112-5.0419922-6.1870117-14.0599976-6.1870117-15.7399902c0-1.6810303-2.9140015-3.4069824-3.7979736-4.2459717 c-0.882019-0.8400269-2.1170044,1.1480103-4.9000244-1.7700195c-2.782959-2.9180298-7.3309937-5.3499756-10.0689697-7.8709717 c-2.375-2.1849976-4.0830078-3.039978-5.677002-3.3720093c-0.0740356,0.2349854-0.1199951,0.4660034-0.1270142,0.6859741 c-0.0700073,2.052002-1.4849854,3.3959961-2.3330078,3.6079712c-0.8499756,0.210022-1.6959839-0.8499756-2.4019775-1.4160156 c-0.4019775-0.322998-0.9920044-0.6920166-1.7520142-1.1329956L-675.3225098,922.3545532z"></path>
            <path id="Toscana" fill={color} stroke="#FFFFFF" strokeMiterlimit="10" d="M-740.9864502,918.2715454 c1.1029663,0.1799927,2.68396,2.072998,3.8999634,3.9660034c1.2800293,1.9920044,2.4290161,5.0869751,2.4290161,7.8720093 c0,2.7860107-1.5880127,6.5,1.4129639,10.0369873c3.0060425,3.5369873,2.78302,4.5540161,4.1090088,6.1459961 c1.3240356,1.5900269,1.368042,2.7410278,1.368042,5.6599731c0,2.9180298,0.1779785,3.447998-0.6630249,4.8189697 c-0.8369751,1.3699951-1.5459595,2.5209961-0.8809814,3.315979c0.6610107,0.7960205,1.3219604-0.4860229,2.6929932-0.617981 c1.3689575-0.1350098,2.8239746,0.7509766,4.151001,1.7670288c1.3239746,1.0170288,1.8989868,1.7249756,0.6610107,2.875 c-1.2349854,1.151001-0.4830322,2.6519775,0.617981,2.6519775c1.1050415,0,2.9580078,0,4.3740234,1.2399902 c1.4119873,1.2379761,1.2810059,1.6359863,1.5029907,2.5620117c0.2199707,0.9299927,0.7279663,1.5960083,1.6099854,1.684021 c0.8829956,0.0880127,1.2369995,0.5739746,1.3689575,1.7459717c0.1310425,1.1710205,1.0140381,1.3259888,1.7659912,2.0339966 c0.7520142,0.7069702,1.875,2.3439941,0.5530396,3.0269775c-1.3240356,0.6870117-3.2479858,0.7080078-2.3859863,2.4089966 c0.8640137,1.7039795,2.8510132,0.8870239,2.8959961,0.0449829c0.0449829-0.8400269,0.9469604-1.2360229,3.4209595-0.2420044 c0.7000122,0.2810059,1.6640015,0.5319824,2.7230225,0.8540039c0.6040039-1.257019,1.2349854-2.2280273,1.7719727-2.3209839 c1.6279907-0.2849731,4.0310059,0,3.1820068-1.5579834c-0.8479614-1.5579834-0.5650024-2.190979,0.5650024-2.9710083 c1.1300049-0.7789917,3.3209839-1.7680054,3.6749878-3.3259888c0.3540039-1.5560303,1.2720337-1.6970215,1.2010498-2.6879883 c-0.0690308-0.9920044-2.6880493-2.5469971-0.7080078-3.184021c1.9799805-0.6370239,3.039978-0.3540039,3.3939819-1.2020264 c0.0950317-0.2329712,0.2860107-0.210022,0.5130005-0.0460205l-0.0050049-0.0040283 c0,0,2.0350342-1.6489868,1.2600098-2.9240112c-0.7800293-1.2719727,0.4219971-2.6160278,1.0599976-3.6760254 c0.6350098-1.0620117-1.4830322-1.4860229-1.4830322-3.2540283c0-1.7689819-0.072998-1.3449707,1.835022-2.6890259 c1.9069824-1.3439941,0.8500366-3.6060181,1.9790039-3.1119995c1.1309814,0.4949951,3.8880005-0.0709839,3.8170166-1.0620117 c-0.072998-0.9910278-1.3430176-0.0700073-1.4840088-0.9910278c-0.1419678-0.9190063,0.6370239-2.0499878-0.5639648-2.1920166 c-1.2030029-0.1430054-0.3540039-0.9199829-1.0620117-1.5570068c-0.7059937-0.6359863-1.0579834-1.697998,0.1430054-1.9110107 c1.2019653-0.2109985,2.4019775-1.0599976,1.2709961-1.9799805c-1.1300049-0.9190063-0.1390381,0,0.7080078-1.3430176 c0.756958-1.2000122,0.6129761-2.2849731,1.4759521-2.3560181c-0.2529907-2.2990112,1.0350342-2.5020142,2.973999-3.4470215 c2.4750366-1.2009888,0.9219971-2.3339844-0.4939575-2.473999c-1.4110107-0.1430054-4.1669922,0.1389771-5.0870361,0.0689697 c-0.1640015-0.0120239-0.2780151-0.072998-0.3480225-0.1719971c-0.7689819,0.0880127-1.3119507,0.1040039-1.3119507,0.1040039 c0-0.0020142-2.0150146-0.1779785-3.394043-1.6290283c-1.3779907-1.4500122-2.9329834-0.8839722-4.30896-1.8400269 c-1.3790283-0.9559937-1.5930176-1.3079834-1.5930176-2.2269897c0-0.9199829-0.0339966-1.4869995-1.2000122-2.5469971 c-1.164978-1.0620117-0.0349731-1.6630249,0.3880005-1.9810181c0.4260254-0.3179932,1.7330322-2.4060059,1.697998-3.4310303 c-0.0349731-1.026001-1.4489746,0-2.5800171,0.0720215c-1.131958,0.0689697-1.2009888-0.3549805-1.05896-1.2039795 c0.1409912-0.848999-0.7790527-0.8120117-2.2630005-0.4249878c-1.4860229,0.3889771-0.9180298-0.7420044-1.4470215-1.4140015 c-0.5319824-0.6740112-1.6629639-1.9099731-1.9439697-1.2030029c-0.2810059,0.7080078-1.9440308,1.026001-2.4570312,1.6820068 c-0.5100098,0.6539917-0.9719849,0.4949951-2.4569702,0.5490112c-1.4800415,0.0529785,0.1270142,1.414978,0.6729736,2.2810059 c0.5480347,0.8670044-1.34198,0.0349731-2.2959595-0.3880005c-0.9550171-0.427002-1.1480103,0.8129883-2.4550171,0.8129883 c-1.3079834,0-1.6459961-0.690979-1.8009644-1.5390015c-0.1610107-0.8499756-1.2900391,0.9359741-1.5380249,1.5200195 c-0.2479858,0.5830078-0.6889648,1.0430298-0.9909668,0.8480225c-0.2990112-0.1950073-2.2230225-1.309021-3.1060181-2.1589966 s-0.8499756-1.2360229-2.0159912-1.4860229c-1.1659546-0.2470093-2.5809937,0.0360107-2.8269653,0.4249878 c-0.2479858,0.3900146-1.4470215,1.2390137-2.1890259,0.4240112c-0.742981-0.8140259-1.5539551-2.1929932-1.8029785-2.9370117 c-0.2470093-0.7410278-0.6710205-0.598999-1.5209961-0.6710205c-0.8469849-0.0700073-1.1630249-0.8499756-2.1539917-1.6970215 c-0.9890137-0.8499756-1.4819946-0.072998-2.2609863,0.0700073c-0.7770386,0.1400146-0.9520264-0.9199829-1.9070435-1.9459839 c-0.9559937-1.026001-1.7329712-0.7769775-2.651001-1.026001c-0.9190063-0.2459717-1.3079834-1.2719727-1.8380127-1.9450073 c-0.5280151-0.6719971-0.6709595-1.2360229-0.7049561-1.7329712c-0.0360107-0.4940186-1.8720093-1.6619873-3.3569946-2.2639771 c-1.4819946-0.6010132-2.6130371,2.1569824-3.2180176,3.007019c-0.5999756,0.8480225-1.9400024,1.7329712-1.9400024,1.7329712 s1.5889893,1.9799805,2.7919922,3.2910156c1.2000122,1.3070068,1.1650391,1.5900269,1.6240234,2.5100098 c0.4599609,0.9190063,0.8839722,1.4509888,2.4030151,2.6530151c1.5189819,1.2020264,2.190979,2.3359985,2.190979,2.7589722 C-740.5914917,916.9525146-740.7624512,917.5585327-740.9864502,918.2715454L-740.9864502,918.2715454z"></path>
            <path id="Umbria" fill={color} stroke="#FFFFFF" strokeMiterlimit="10" d="M-689.7694702,964.8235474 L-689.7694702,964.8235474c0,0,2.0349731-1.6489868,1.2600098-2.9240112 c-0.7800293-1.2719727,0.4219971-2.6160278,1.0599976-3.6760254c0.6349487-1.0620117-1.4830322-1.4860229-1.4830322-3.2540283 c0-1.7689819-0.072998-1.3449707,1.835022-2.6890259c1.9069824-1.3439941,0.8499756-3.6060181,1.9790039-3.1119995 c1.1309814,0.4949951,3.8880005-0.0709839,3.8170166-1.0620117c-0.072998-0.9910278-1.3430176-0.0700073-1.4840088-0.9910278 c-0.1420288-0.9190063,0.6369629-2.0499878-0.5640259-2.1920166c-1.2030029-0.1430054-0.3540039-0.9199829-1.0619507-1.5570068 c-0.7059937-0.6359863-1.0580444-1.697998,0.1430054-1.9110107c1.2019653-0.2109985,2.4019775-1.0599976,1.2709961-1.9799805 c-1.1300049-0.9190063-0.1390381,0,0.7079468-1.3430176c0.8480225-1.3449707,0.5650024-2.5469971,1.8370361-2.3359985 c1.2719727,0.2119751,1.8029785,0.6719971,2.5809937-0.3540039c0.776001-1.0239868,1.6239624,0.8129883,1.2340088,1.309021 c-0.3890381,0.4949951-0.4580078,1.5230103,0.0359497,1.8049927c0.4949951,0.2839966,1.7300415-1.414978,2.8270264-0.2819824 c1.0939941,1.1309814,3.3919678,3.6779785,3.7449951,4.1019897c0.3529663,0.4240112,1.2359619-1.1660156,1.8359985-0.8839722 c0.5999756,0.2820435,1.3779907,0.6370239,1.9060059,0.0349731c0.53302-0.6010132,1.0620117-0.9180298,0.8510132,1.0250244 c-0.2130127,1.947998-0.6030273,2.1220093-0.0350342,3.0430298c0.565979,0.9199829,1.0950317,1.4869995,1.1300049,2.4060059 c0.0350342,0.9199829,0.8120117,2.6519775,1.1669922,3.2890015c0.3540039,0.6359863,0.1400146,1.8389893,0.1050415,2.4780273 c-0.0360107,0.6350098,1.9439697,1.4500122,1.5549927,2.6879883c-0.3890381,1.2390137,0.3529663,4.0670166,1.3079834,4.7739868 c0.9530029,0.7080078,0.848999,0.2490234,2.6489868,0.9559937c1.8010254,0.7080078,2.5780029,3.4660034,3.0390015,3.572998 c0.4609985,0.1060181,1.3770142-1.5549927,2.3309937-0.8129883c0.6459961,0.5040283,0.5159912,2.5239868,0.3619995,3.7689819 c-0.8859863-0.2030029-1.3259888-0.1140137-1.3519897,0.6879883c-0.0339966,1.0269775-0.4940186,1.7340088-1.0939941,2.7940063 c-0.6019897,1.0599976-1.059021-0.2470093-1.3450317,0.3549805c-0.282959,0.598999-1.0969849,0.9190063-1.8339844,0.3179932 c-0.7440186-0.6019897-0.992981,0.2490234-1.5209961,0.7080078c-0.5289917,0.460022-1.1660156,0.0349731-2.5079956,0.0349731 c-1.3430176,0-0.7609863,1.7700195-0.8330078,1.9110107c-0.0679932,0.1409912-1.6679688,0.8220215-1.802002,0.9730225 c-0.1289673,0.1489868-2.1609497,1.3259888-2.3569946,1.6890259c-0.1929932,0.3629761-0.1929932,1.2550049-0.5749512,1.5819702 c-0.3800049,0.3270264-1.6500244,0.0620117-2.0650024-0.2919922c-0.4170532-0.3530273-0.6719971-0.026001-0.8140259,1.2470093 c-0.1400146,1.2730103-1.2009888,2.3339844-1.9049683,1.5570068c-0.710022-0.7789917-2.2630005,0.4240112-2.4030151-0.4260254 c-0.1420288-0.848999-0.3530273-3.1119995-0.7780151-3.8179932c-0.4240112-0.7080078-1.9779663,1.0599976-2.401001,0.2109985 c-0.427002-0.8480225-1.6259766-0.2109985-1.5559692-1.4160156c0.0709839-1.2020264-0.493042-1.3439941-1.2709961-2.2630005 c-0.7770386-0.9210205,0-1.697998-1.0610352-3.1129761c-1.0599976-1.4140015-1.7669678,0.8499756-2.1900024,0.2119751 c-0.4249878-0.6370239-1.3449707,0.28302-2.3319702,0.4219971c-0.9900513,0.1439819-1.5540161-0.7750244-2.6150513-1.6259766 c-1.0609741-0.8480225-0.9879761-1.1309814,0.2820435-1.6959839c1.2709961-0.5670166,0.4939575-1.3449707,0.1430054-1.7700195 C-688.2744751,966.6855469-689.1665039,965.2555542-689.7694702,964.8235474z"></path>
        </g>
        {percentage && <Marker transform="translate(110, 105)" perc={percentage} onClick={onClick} />}
    </g>
);
