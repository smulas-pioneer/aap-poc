import * as React from 'react';
import { AreaMapProps } from '../../shared/AreaMapProps';
import { Marker } from './Marker';

export const Area7 = ({ htmlTooltip, onClick, fill, color, percentage }: AreaMapProps) => (
    <g data-tip={htmlTooltip}>
        <g className={`area area_7 ${onClick ? '' : 'unselectable'}`}
            transform={fill ? "scale(3.9) translate(457 -907) " : "translate(832 -802)"}
            onClick={onClick}
        >
            <path id="Sicilia" fill={color} stroke="#FFFFFF" strokeMiterlimit="10" d="M-579.614502,1137.206543 c-0.7669678-0.3759766-3.0239868-1.3959961-3.8169556-1.2709961c-0.8380127,0.1330566-2.2510376,2.3869629-4.5050049,2.9620361 c-2.25,0.5760498-3.1799927,0.6629639-3.223999,0.1779785c-0.0430298-0.4870605-0.3980103-0.6639404-1.2810059,0.44104 c-0.8840332,1.1070557-1.9000244,3.0510254-3.3540039,3.0930176c-1.460022,0.0469971-1.2820435-0.6600342-2.6520386-0.7509766 c-1.367981-0.0849609-2.5619507-1.8120117-3.2259521-1.5460205c-0.6600342,0.2669678-0.9710083,1.1490479-2.3400269,1.1490479 c-1.3670044,0-2.0750122,0.0450439-2.9569702,0.973999c-0.8850098,0.9279785-1.4570312,2.3859863-3.2250366,2.5629883 c-1.7669678,0.1779785-2.5620117,1.5479736-4.5059814,1.5030518c-1.9429932-0.0429688-2.0750122,0.8399658-3.84198,0.8859863 c-1.7660522,0.0460205-3.5800171,0.1309814-5.3439941,0.0880127c-1.7680054-0.0419922-2.5610352-1.0169678-3.7980347-1.0600586 c-1.2369995-0.0469971-1.5039673,0.618042-4.8599854,1.901001c-3.3560181,1.2810059-3.8850098,0.6619873-6.7130127-0.3540039 c-2.8250122-1.019043-2.3399658-2.5209961-2.914978-3.5389404c-0.5709839-1.0169678-1.3240356-1.0169678-2.2510376-0.4399414 c-0.9289551,0.5749512-2.7819824,1.1030273-2.8709717-0.5760498c-0.0889893-1.6800537,0-2.8280029-1.5910034-3.1810303 c-1.5889893-0.3549805-2.4279785,2.0770264-3.5339966,1.8100586c-1.1030273-0.2629395-2.9580078-1.0159912-4.0170288,0.1340332 c-1.0619507,1.1490479,0.6600342,3.5379639-0.3109741,3.7580566c-0.973999,0.2230225-2.4069824,1.381958-3.7990112,1.5600586 c-1.3909912,0.177002-2.197998-0.6850586-2.8510132-1.6920166c-0.6489868-1.0059814-1.125-0.9060059-1.5549927-2.4759521 c-0.4320068-1.5710449-1.4790039-2.2320557-2.0549927-1.7359619c-0.572998,0.4990234,0.0880127,0.6760254-0.0310059,1.5939941 c-0.1209717,0.9179688-0.8289795,0.9489746-1.5789795,1.4260254c-0.7520142,0.4770508-0.9749756,0.8840332-1.5449829,1.2810059 c-0.5740356,0.3969727-1.9349976-0.2919922-2.4860229,0.6850586c-0.5499878,0.9730225-1.125,2.3630371-1.4559937,3.493042 c-0.3309937,1.125-1.5449829,1.5909424-1.4129639,2.5620117c0.1309814,0.9730225,0.9279785,1.2600098,0.3070068,2.3220215 c-0.618042,1.0620117-0.8590088,1.2159424-0.5720215,2.1870117c0.2860107,0.9749756,0.7479858,0.6199951,0.7039795,1.7020264 c-0.0419922,1.0849609,1.1950073,1.7709961,1.4379883,2.3669434c0.243042,0.5980225,1.8340454-0.0439453,2.4500122,1.0839844 c0.6190186,1.1280518,1.460022,3.6729736,4.1080322,2.7440186c2.6479492-0.9300537,3.8429565-1.1939697,5.8309937-0.4870605 c1.9859619,0.7089844,2.4289551,3.4940186,3.3989868,3.4940186c0.9699707,0,3.6660156-1.2390137,4.6829834,0.131958 c1.0170288,1.3699951,2.5610352,1.769043,2.6480103,3.1400146c0.0910034,1.3719482,1.4129639,1.1040039,2.3430176,1.7700195 c0.9279785,0.6619873,2.1629639,1.8120117,2.8249512,2.3869629c0.6610107,0.5749512,2.6080322-0.30896,4.1530151,0.7509766 c1.5440063,1.0629883,4.2380371,3.980957,5.0319824,4.2010498c0.7960205,0.2209473,2.03302-0.8830566,3.4020386,0.9279785 c1.367981,1.8129883,3.0469971,1.3709717,4.1499634,0.9289551c1.1049805-0.44104,3.1370239-0.7950439,5.1260376,0 c1.9849854,0.7950439,4.1939697,1.769043,5.2550049,3.5379639c1.0609741,1.7709961,2.9599609,2.2540283,3.5319824,4.2900391 c0.5720215,2.0340576-0.2620239,3.4919434,1.6779785,3.8010254c1.9420166,0.3120117,2.2089844-0.3509521,3.6669922,0.7960205 c1.4590454,1.1490479,3.0480347,2.4770508,4.0630493,2.4770508c1.0139771,0,2.1859741,0.0560303,2.5809937-0.4980469 c0.3989868-0.552002,2.572998-0.6619873,3.4450073,0.2449951c0.8709717,0.9060059,1.2579956,0.8170166,1.7799683,0.2530518 c0.5180054-0.5639648,1.6080322,0.4420166,2.1290283,1.0720215c0.5180054,0.6309814,1.8339844-0.05896,2.2319946-0.7220459 c0.3969727-0.6650391-0.6620483-2.1879883-1.1040039-3.0090332c-0.4420166-0.8170166-0.0450439-2.6739502,0.8829956-4.0649414 c0.9289551-1.394043,2.4049683-3.401001,3.776001-4.552002c1.3689575-1.1500244,2.1659546-1.1040039,1.5899658-2.2979736 c-0.572998-1.1929932-0.4869995-2.0799561-1.2810059-2.3430176c-0.7949829-0.2679443-2.5609741-2.3900146-3.0029907-3.4959717 s1.0620117-1.5019531,1.6779785-1.2370605c0.6199951,0.2659912,1.414978-0.0419922,0.4000244-1.2800293 c-1.0170288-1.2390137-5.0370483-2.0360107-5.0370483-3.2290039s-0.2550049-4.3110352,0-5.2629395 s2.3000488-0.7950439,2.4730225-3.1829834c0.1749878-2.3890381,0.9290161-3.980957,0.9290161-5.5269775 c0-1.5469971,1.9879761-3.8029785,2.5180054-5.0400391c0.5310059-1.2380371,3.5130005-5.8599854,4.8569946-7.782959 c1.3460083-1.9260254,2.78302-4.3129883,3.2700195-4.5129395c0.0339966-0.0129395,0.0689697-0.0179443,0.1040039-0.0129395 c0.2449951-0.8740234,0.5050049-1.6800537,0.6439819-2.2139893 C-580.3305054,1138.1115723-580.010498,1137.6566162-579.614502,1137.206543L-579.614502,1137.206543z"></path>
        </g>
        {percentage && <Marker transform="translate(195, 345)" perc={percentage} onClick={onClick} />}
    </g>
);
