import * as React from 'react';
import * as ReactTooltip from 'react-tooltip';
const { Legend, ResponsiveContainer } = require('recharts');

import { Transition, Popup, Header, Label } from 'semantic-ui-react';
import { Area1 } from './Area1';
import { Area2 } from './Area2';
import { Area3 } from './Area3';
import { Area4 } from './Area4';
import { Area5 } from './Area5';
import { Area6 } from './Area6';
import { Area7 } from './Area7';
import { Boundaries } from './Boundaries';
import { Marker } from './Marker';
import { ColorsLegend } from './ColorsLegend';
import { SearchFilter, IndicatorOptionsType, MapLegend } from '../../actions/model';

import { groupBy, Dictionary, countBy, sumBy, uniqBy } from 'lodash';
import { LangDictionary } from '../../reducers/language/interfaces';
import { MapOptions } from './MapOptions';
import { Client } from '../../_db/interfaces';
import { rnd, formatAum } from '../../_db/utils';
import { SingleAreaLegend } from './SingleAreaLegend';
import { ClientCard } from '../clientsView/ClientCard';
import { getMapOptionTypeCaption } from '../../commonUtils';
import { FillAreaLegend } from './FillAreaLegend';

export interface ItalyMapProps {
    lang: LangDictionary,
    clients: Client[]

    width?: number | string;
    height?: number | string;
}

export interface ItalyMapState {
    mapIndex: number | undefined;
    requestMapIndex: number | undefined;
    values: { type: IndicatorOptionsType, areaValues: AreaValue[], countWithValues: number };
}

export interface AreaValue {
    key: string,
    value: number,
    perc: number,
    color: string
}

export class ItalyMap extends React.Component<ItalyMapProps, ItalyMapState> {

    static AREA_MAP_INDEX = ['Nord Ovest', 'Lombardia', 'Nord Est', 'Centro Nord', 'Centro', 'Sud', 'Sicilia'];

    colors: number[][];

    constructor(props: ItalyMapProps) {
        super(props);

        this.calculateAreaValues = this.calculateAreaValues.bind(this);
        this.interpolateColor = this.interpolateColor.bind(this);
        this.interpolateColors = this.interpolateColors.bind(this);
        this.onMapOptionsChange = this.onMapOptionsChange.bind(this);
        this.getAreaById = this.getAreaById.bind(this);
        this.colors = this.interpolateColors('rgb(255, 192, 77)', 'rgb(2, 2, 234)', 10);

        this.state = {
            mapIndex: undefined,
            requestMapIndex: undefined,
            values: this.calculateAreaValues(props.clients)
        };
    }

    componentWillReceiveProps(props: ItalyMapProps) {
        const values = this.calculateAreaValues(props.clients, this.state.values.type);
        this.setState(prev => ({ values }));
    }

    interpolateColor(color1: number[], color2: number[], factor: number) {
        if (factor === undefined) factor = 0.5;
        var result = color1.slice();
        for (var i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        }
        return result;
    };

    interpolateColors(color1: string, color2: string, steps: number) {
        var stepFactor = 1 / (steps - 1),
            interpolatedColorArray = [];

        const col1 = color1.match(/\d+/g)!.map(Number);
        const col2 = color2.match(/\d+/g)!.map(Number);

        for (var i = 0; i < steps; i++) {
            interpolatedColorArray.push(this.interpolateColor(col1, col2, stepFactor * i));
        }

        return interpolatedColorArray;
    }

    calculateAreaValues(clients: Client[], type: IndicatorOptionsType = IndicatorOptionsType.clients, regionFilter?: string) {
        // distinct clietns by id
        let ds = uniqBy(clients, c => c.id);
        if (regionFilter) ds = ds.filter(d => d.address.region === regionFilter);

        // reduce to area : count of
        let values: any = {}; ItalyMap.AREA_MAP_INDEX.forEach(v => values[v] = 0);

        switch (type) {
            case IndicatorOptionsType.clients: {
                const countByRegion = countBy(ds, c => c.address.region);
                ItalyMap.AREA_MAP_INDEX.forEach(area => values[area] = countByRegion[area]);
                break;
            }
            case IndicatorOptionsType.aum: {
                ItalyMap.AREA_MAP_INDEX.forEach(area => {
                    values[area] = sumBy(ds.filter(c => c.address.region === area), c => c.aum);
                });
                break;
            }
            case IndicatorOptionsType.alerts: {
                ItalyMap.AREA_MAP_INDEX.forEach(area => {
                    values[area] = ds.filter(c => c.address.region === area && c.radar.numOfAlerts > 0).length;
                });
                break;
            }
            case IndicatorOptionsType.interviews: {
                ItalyMap.AREA_MAP_INDEX.forEach(area => {
                    values[area] = sumBy(ds.filter(c => c.address.region === area), c => c.numOfInterviews);
                });
                break;
            }
            case IndicatorOptionsType.acceptedProposals: {
                ItalyMap.AREA_MAP_INDEX.forEach(area => {
                    values[area] = sumBy(ds.filter(c => c.address.region === area), c => c.numOfAcceptedProposal);
                });
                break;
            }
            default: { }
        }

        let tot = 0;
        let countWithValues = 0;
        let min: number | undefined = undefined;

        Object.keys(values).forEach(key => {
            const v = values[key];
            if (v > tot) tot = v;
            if (!min || v < min) min = v;
        });

        const areaValues = ItalyMap.AREA_MAP_INDEX.reduce((acc, key, idx) => {
            const value = values[key] ? values[key] : 0;
            const perc = (value * 100) / tot;
            const area = `area_${idx}`;
            const lenCol = this.colors.length - 1;
            if (!min) min = 0;

            const color = (tot - min) === 0 ? this.colors[lenCol] : value !== 0 ? this.colors[Math.ceil((value - min) / (tot - min) * lenCol)] : undefined;

            // if (!color) throw Error("Color not defined!!!");
            if (value) countWithValues++;
            acc.push({
                key,
                value,
                perc,
                color: color !== undefined ? `rgb(${color[0]}, ${color[1]}, ${color[2]}` : '#CECCCC'
            });
            return acc;
        }, [] as AreaValue[]
        );

        return { type, areaValues, countWithValues };
    }

    getAreaById(index: number, props?: { color?: string, fill?: boolean, onClick?: () => void, percentage?: number, htmlTooltip?: string }) {
        switch (index) {
            case 0: return <Area1 key={index} {...props} />
            case 1: return <Area2 key={index} {...props} />
            case 2: return <Area3 key={index} {...props} />
            case 3: return <Area4 key={index} {...props} />
            case 4: return <Area5 key={index} {...props} />
            case 5: return <Area6 key={index} {...props} />
            case 6: return <Area7 key={index} {...props} />
            default:
                return null;
        }
    }

    getTooltipText(area: string, option: IndicatorOptionsType, value: number) {
        let formattedValue = value.toString();
        if (option === IndicatorOptionsType.aum) formattedValue = formatAum(value);
        let ret = `<h4>${area}</h4><hr/><p>${getMapOptionTypeCaption(option, this.props.lang)}: ${formattedValue}</p>`;
        return ret;
    }

    onMapOptionsChange(option: IndicatorOptionsType) {
        const newValues = this.calculateAreaValues(this.props.clients, option);
        this.setState(prev => ({ values: newValues }));
    }

    createRegionLegendData() {
        const { clients, lang } = this.props;
        const { values, mapIndex } = this.state;

        let regionLegend: MapLegend<string | number> | undefined = undefined;
        if (mapIndex === undefined) return regionLegend;

        const region = values.areaValues[mapIndex];
        regionLegend = {
            title: region.key,
            dic: {
                a: {
                    label: lang.MAP_OPTS_CLIENTS,
                    value: this.calculateAreaValues(clients, IndicatorOptionsType.clients, region.key).areaValues.filter(a => a.key === region.key)[0].value
                },
                b: {
                    label: lang.MAP_OPTS_AUM,
                    value: formatAum(this.calculateAreaValues(clients, IndicatorOptionsType.aum, region.key).areaValues.filter(a => a.key === region.key)[0].value)
                },
                c: {
                    label: lang.MAP_OPTS_PROPOSALS,
                    value: this.calculateAreaValues(clients, IndicatorOptionsType.interviews, region.key).areaValues.filter(a => a.key === region.key)[0].value
                },
                d: {
                    label: lang.MAP_OPTS_PROPOSAL,
                    value: this.calculateAreaValues(clients, IndicatorOptionsType.acceptedProposals, region.key).areaValues.filter(a => a.key === region.key)[0].value
                },
                e: {
                    label: lang.MAP_OPTS_ALERTS,
                    value: this.calculateAreaValues(clients, IndicatorOptionsType.alerts, region.key).areaValues.filter(a => a.key === region.key)[0].value
                }
            }
        }
        return regionLegend;
    }

    render() {
        const { type, areaValues, countWithValues } = this.state.values;
        const showItaly = this.state.requestMapIndex === undefined && this.state.mapIndex === undefined;
        const showRegion = this.state.requestMapIndex !== undefined && this.state.mapIndex !== undefined;
        const { lang } = this.props;

        let regionLegend: MapLegend<string | number> | undefined = undefined;

        if (showRegion) regionLegend = this.createRegionLegendData();


        return (
            <div style={{ width: this.props.width, height: this.props.height }}>

                <Transition visible={showItaly} animation='fade up' duration={350} onComplete={(_, e) => { !showItaly && this.setState(prev => ({ mapIndex: prev.requestMapIndex })) }} >
                    <div style={{ width: "100%", height: "100%" }}>
                        {countWithValues > 1 ? <ColorsLegend type={type} values={areaValues} lang={lang} /> : <SingleAreaLegend type={type} value={areaValues.find(e => e.value !== 0)!} lang={lang} />}
                        <svg version="1.2" id="aap-italy" baseProfile="tiny" x="0px" y="0px" width="100%" height="87%" viewBox="0 0 340 400">
                            <g className="regions" >
                                {
                                    ItalyMap.AREA_MAP_INDEX.map((val, idx) => {
                                        const aValue = areaValues[idx];
                                        const htmlTooltip = aValue.value !== 0 ? this.getTooltipText(aValue.key, type, aValue.value) : undefined;
                                        return this.getAreaById(idx,
                                            {
                                                fill: false,
                                                color: aValue.color,
                                                onClick: aValue.value !== 0 ? () => this.setState({ requestMapIndex: idx }) : undefined,
                                                // percentage: countWithValues > 1 ? aValue.perc : undefined,
                                                htmlTooltip
                                            })
                                    })
                                }
                            </g>
                            <Boundaries />
                        </svg>

                        <MapOptions onChange={e => this.onMapOptionsChange(e)} lang={lang} />
                        <ReactTooltip html type='info' delayShow={countWithValues > 1 ? 600 : 100} place="bottom" />
                    </div>
                </Transition>

                <Transition visible={showRegion} animation="fade" duration={350} onComplete={(_, e) => { !showRegion && this.setState(prev => ({ mapIndex: prev.requestMapIndex })) }} >
                    <div style={{ margin: 0, width: "100%", height: "100%" }}>
                        <Label size="medium" color="blue" ribbon >{regionLegend && regionLegend.title}</Label>
                        <FillAreaLegend legend={regionLegend} />
                        <svg version="1.2" id="aap-italy" baseProfile="tiny" x="0px" y="0px" width="100%" height="98%" viewBox="-832 802.4417725 340 400" onClick={() => this.setState({ requestMapIndex: undefined })}>
                            {this.getAreaById(this.state.mapIndex!, { fill: true, color: '#CECCCC' })}
                        </svg>
                    </div>
                </Transition>
            </div >
        )
    }
}