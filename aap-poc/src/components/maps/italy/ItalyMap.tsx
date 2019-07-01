import * as React from 'react';

import { Area1 } from './Area1';
import { Area2 } from './Area2';
import { Area3 } from './Area3';
import { Area4 } from './Area4';
import { Area5 } from './Area5';
import { Area6 } from './Area6';
import { Area7 } from './Area7';
import { Boundaries } from './Boundaries';
import { ColorsLegend } from './../../shared/ColorsLegend';
import { IndicatorOptionsType, MapLegend, FilterMap } from '../../../actions/model';

import { countBy, sumBy, uniqBy } from 'lodash';
import { LangDictionary } from '../../../reducers/language/interfaces';
import { MapOptions } from '../../shared/MapOptions';
import { Client } from '../../../_db/interfaces';
import { formatAua } from '../../../_db/utils';
import { SingleAreaLegend } from './SingleAreaLegend';
import { getMapOptionTypeCaption } from '../../../commonUtils';

import { ConfigLayout } from '../../../reducers/config';
import { isArray } from 'util';
import { AreaValue } from '../../shared/AreaMapProps';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Legend, ResponsiveContainer } = require('recharts');
const ReactTooltip = require('react-tooltip');

export interface ItalyMapProps {
  lang: LangDictionary,
  layout: ConfigLayout,
  clients: Client[]
  width?: number | string;
  height?: number | string;
  filterMap?: FilterMap;
  onFilterChange?: (map: FilterMap, value: string) => void;
}

export interface ItalyMapState {
  mapIndex: number | undefined;
  requestMapIndex: number | undefined;
  values: { type: IndicatorOptionsType, areaValues: AreaValue[], countWithValues: number };
}

export class ItalyMap extends React.Component<ItalyMapProps, ItalyMapState> {

  static AREA_MAP_INDEX = ['Nord Ovest', 'Lombardia', 'Nord Est', 'Centro Nord', 'Centro', 'Sud', 'Sicilia'];

  colors: number[][];
  MAX_COLORS_LEN = 0;

  LAST_COLOR = '';

  constructor(props: ItalyMapProps) {
    super(props);

    this.calculateAreaValues = this.calculateAreaValues.bind(this);
    this.interpolateColor = this.interpolateColor.bind(this);
    this.interpolateColors = this.interpolateColors.bind(this);
    this.onMapOptionsChange = this.onMapOptionsChange.bind(this);
    this.getAreaById = this.getAreaById.bind(this);
    this.onRegionClick = this.onRegionClick.bind(this);
    this.colors = this.interpolateColors('rgb(255, 192, 77)', 'rgb(2, 2, 234)', 10);

    const { layout: { interpolateColors } } = props;

    if (interpolateColors) {
      if (isArray(interpolateColors)) {
        this.colors = interpolateColors;
      } else {
        this.colors = this.interpolateColors(interpolateColors.from, interpolateColors.to, 10);
      }
    }

    /*
    this.colors = [
        [255, 210, 205],
        [255, 134, 121],
        [255, 67, 47],
        [226, 22, 0],
        [176, 18, 0],
        [92, 9, 0],
        [50, 5, 0]
    ];

    this.colors = this.interpolateColors('rgb(0, 230, 158)', 'rgb(0, 99, 105)', 10);

    */

    this.MAX_COLORS_LEN = this.colors.length - 1;
    this.LAST_COLOR = 'dimgray';// 'whitesmoke';

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
    this.MAX_COLORS_LEN = interpolatedColorArray.length - 1;
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
      case IndicatorOptionsType.aua: {
        ItalyMap.AREA_MAP_INDEX.forEach(area => {
          values[area] = sumBy(ds.filter(c => c.address.region === area), c => c.aua);
        });
        break;
      }
      case IndicatorOptionsType.alerts: {
        ItalyMap.AREA_MAP_INDEX.forEach(area => {
          values[area] = ds.filter(c => c.address.region === area && c.radar.numOfAlerts > 0).length;
        });
        break;
      }
      case IndicatorOptionsType.proposals: {
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

    let minValue: number | undefined = undefined;
    let maxValue = 0;
    let countWithValues = 0;

    Object.keys(values).forEach(key => {
      const v = values[key];
      if (v > maxValue) maxValue = v;
      if (minValue === undefined || v < minValue) minValue = v;
    });

    const areaValues = ItalyMap.AREA_MAP_INDEX.reduce((acc, key, idx) => {
      const value = values[key] ? values[key] : 0;
      const perc = (value * 100) / maxValue;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const area = `area_${idx}`;

      if (minValue === undefined) minValue = 0;

      let color: number[] | undefined = undefined;

      if (value > 0 && (maxValue - minValue) === 0) {
        color = this.colors[this.MAX_COLORS_LEN];
      } else if (value !== 0) {
        color = this.colors[Math.ceil((value - minValue) / (maxValue - minValue) * (this.MAX_COLORS_LEN - 1))];
        countWithValues++;
      };
      acc.push({
        key,
        value,
        perc,
        color: color !== undefined ? `rgb(${color[0]}, ${color[1]}, ${color[2]})` : this.LAST_COLOR
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
    if (option === IndicatorOptionsType.aua) formattedValue = formatAua(value);
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
          label: lang.MAP_OPTS_AUA,
          value: formatAua(this.calculateAreaValues(clients, IndicatorOptionsType.aua, region.key).areaValues.filter(a => a.key === region.key)[0].value)
        },
        c: {
          label: lang.MAP_OPTS_PROPOSALS,
          value: this.calculateAreaValues(clients, IndicatorOptionsType.proposals, region.key).areaValues.filter(a => a.key === region.key)[0].value
        },
        d: {
          label: lang.MAP_OPTS_ACC_PROPOSAL,
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

  onRegionClick(val: string, idx: number) {
    if (this.props.filterMap && this.props.onFilterChange) {
      this.props.onFilterChange(this.props.filterMap, val);
    }
    this.setState({ requestMapIndex: idx });
  }

  render() {
    const { type, areaValues, countWithValues } = this.state.values;
    // const showItaly = this.state.requestMapIndex === undefined && this.state.mapIndex === undefined;
    // const showRegion = this.state.requestMapIndex !== undefined && this.state.mapIndex !== undefined;
    const { lang } = this.props;

    // let regionLegend: MapLegend<string | number> | undefined = undefined;

    // if (showRegion) regionLegend = this.createRegionLegendData();

    return (
      <div style={{ width: this.props.width, height: this.props.height }}>

        {/* <Transition visible={showItaly} animation='fade up' duration={350} onComplete={(_, e) => { !showItaly && this.setState(prev => ({ mapIndex: prev.requestMapIndex })) }} > */}
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
                      onClick: aValue.value !== 0 ? () => this.onRegionClick(val, idx) : undefined,
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
        {/* </Transition> */}

        {/* <Transition visible={showRegion} animation="fade" duration={350} onComplete={(_, e) => { !showRegion && this.setState(prev => ({ mapIndex: prev.requestMapIndex })) }} >
          <div style={{ margin: 0, width: "100%", height: "100%" }}>
            <Label size="medium" color="blue" ribbon >{regionLegend && regionLegend.title}</Label>
            <FillAreaLegend legend={regionLegend} />
            <svg version="1.2" id="aap-italy" baseProfile="tiny" x="0px" y="0px" width="100%" height="98%" viewBox="-832 802.4417725 340 400" onClick={() => this.setState({ requestMapIndex: undefined })}>
              {this.getAreaById(this.state.mapIndex!, { fill: true, color: this.LAST_COLOR })}
            </svg>
          </div>
        </Transition> */}
      </div >
    )
  }
}
