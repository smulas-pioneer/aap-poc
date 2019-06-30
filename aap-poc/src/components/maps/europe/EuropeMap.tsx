import React from "react";
import { LangDictionary } from "../../../reducers/language/interfaces";
import { ConfigLayout } from "../../../reducers/config";
import { Client } from "../../../_db/common/interfaces";
import Europe from "./Europe";
import Italy from "./Italy";
import Luxemburg from "./Luxemburg";
import Austria from "./Austria";
import Germany from "./Germany";
import { IndicatorOptionsType } from "../../../actions/model";
import { isArray } from "util";
import { AreaValue } from "../../shared/AreaMapProps";
import { uniqBy, countBy, sumBy } from "lodash";
import { Transition, Segment } from "semantic-ui-react";
import { ItalyMap } from "../italy/ItalyMap";
import { ColorsLegend } from './../../shared/ColorsLegend';
import { formatAua } from "../../../_db/utils";
import { getMapOptionTypeCaption } from "../../../commonUtils";
import { MapOptions } from "../../shared/MapOptions";
import { WidgetTitle } from "../../shared/WidgetTitle";
const ReactTooltip = require('react-tooltip');
export interface EuropeMapProps {
  lang: LangDictionary,
  layout: ConfigLayout,
  clients: Client[]
  width?: number;
  height?: number;
  isOnlyItaly?: boolean;
}

export interface EuropeMapState {
  mapIndex: number | undefined;
  requestMapIndex: number | undefined;
  values: { type: IndicatorOptionsType, areaValues: AreaValue[], countWithValues: number };
}

type MANAGED_COUNTRIES = 'Italy' | 'Luxemburg' | 'Austria' | 'Germany';

export class EuropaMap extends React.Component<EuropeMapProps, EuropeMapState> {

  static AREA_MAP_INDEX: MANAGED_COUNTRIES[] = ['Italy', 'Luxemburg', 'Austria', 'Germany'];
  colors: number[][];
  MAX_COLORS_LEN = 0;

  LAST_COLOR = '';

  constructor(props: EuropeMapProps) {
    super(props);
    this.getAreaByName = this.getAreaByName.bind(this);
    this.calculateAreaValues = this.calculateAreaValues.bind(this);
    this.interpolateColor = this.interpolateColor.bind(this);
    this.interpolateColors = this.interpolateColors.bind(this);
    this.onMapOptionsChange = this.onMapOptionsChange.bind(this);
    this.getTooltipText = this.getTooltipText.bind(this);
    this.colors = this.interpolateColors('rgb(255, 192, 77)', 'rgb(2, 2, 234)', 10);

    const { layout: { interpolateColors } } = props;

    if (interpolateColors) {
      if (isArray(interpolateColors)) {
        this.colors = interpolateColors;
      } else {
        this.colors = this.interpolateColors(interpolateColors.from, interpolateColors.to, 10);
      }
    }
    this.MAX_COLORS_LEN = this.colors.length - 1;
    this.LAST_COLOR = 'dimgray';
    this.state = {
      mapIndex: undefined,
      requestMapIndex: undefined,
      values: this.calculateAreaValues(props.clients)
    };
  }

  onMapOptionsChange(option: IndicatorOptionsType) {
    const newValues = this.calculateAreaValues(this.props.clients, option);
    this.setState(prev => ({ values: newValues }));
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

  componentWillReceiveProps(props: EuropeMapProps) {
    const values = this.calculateAreaValues(props.clients, this.state.values.type);
    this.setState(prev => ({ values }));
  }

  calculateAreaValues(clients: Client[], type: IndicatorOptionsType = IndicatorOptionsType.clients, countryFilter?: string) {
    // distinct clietns by id
    let ds = uniqBy(clients, c => c.id);
    if (countryFilter) ds = ds.filter(d => d.country === countryFilter);

    // reduce to area : count of
    let values: any = {}; EuropaMap.AREA_MAP_INDEX.forEach(v => values[v] = 0);

    switch (type) {
      case IndicatorOptionsType.clients: {
        const countByCountry = countBy(ds, c => c.country);
        EuropaMap.AREA_MAP_INDEX.forEach(area => values[area] = countByCountry[area]);
        break;
      }
      case IndicatorOptionsType.aua: {
        EuropaMap.AREA_MAP_INDEX.forEach(area => {
          values[area] = sumBy(ds.filter(c => c.country === area), c => c.aua);
        });
        break;
      }
      case IndicatorOptionsType.alerts: {
        EuropaMap.AREA_MAP_INDEX.forEach(area => {
          values[area] = ds.filter(c => c.country === area && c.radar.numOfAlerts > 0).length;
        });
        break;
      }
      case IndicatorOptionsType.proposals: {
        EuropaMap.AREA_MAP_INDEX.forEach(area => {
          values[area] = sumBy(ds.filter(c => c.country === area), c => c.numOfInterviews);
        });
        break;
      }
      case IndicatorOptionsType.acceptedProposals: {
        EuropaMap.AREA_MAP_INDEX.forEach(area => {
          values[area] = sumBy(ds.filter(c => c.country === area), c => c.numOfAcceptedProposal);
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

    const areaValues = EuropaMap.AREA_MAP_INDEX.reduce((acc, key, idx) => {
      const value = values[key] ? values[key] : 0;
      const perc = (value * 100) / maxValue;
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
  getAreaByName(name: MANAGED_COUNTRIES, props?: { color?: string, onClick?: () => void, percentage?: number, htmlTooltip?: string }) {
    switch (name) {
      case 'Italy': return <Italy key={name} {...props} />
      case 'Luxemburg': return <Luxemburg key={name} {...props} />
      case 'Austria': return <Austria key={name} {...props} />
      case 'Germany': return <Germany key={name} {...props} />
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

  render() {
    const { type, areaValues, countWithValues } = this.state.values;

    const showEurope = !this.props.isOnlyItaly;
    const showItaly = this.props.isOnlyItaly;

    //this.state.requestMapIndex !== undefined && this.state.mapIndex !== undefined;
    const { lang, height } = this.props;

    return (
      <div style={{ height: `${height}px` }}>
        <Transition visible={showEurope} animation='fade up' duration={350} onComplete={(_, e) => { !showEurope && this.setState(prev => ({ mapIndex: prev.requestMapIndex })) }} >
          <div style={{ height: "100%" }}>
            <div style={{ height: "100%", display: 'flex', flexDirection: 'column' }}>
              <WidgetTitle size='small' title={'Key Figures Map'} shareButtons={['Image', 'Copy']} />
              <ColorsLegend type={type} values={areaValues} lang={lang} />
              <div style={{ flex: 1 }}>
                <Europe
                  className="nations"
                  width={'100%'}
                  height={`100%`}
                  paths={
                    EuropaMap.AREA_MAP_INDEX.map((val, idx) => {
                      const aValue = areaValues[idx];
                      const htmlTooltip = aValue.value !== 0 ? this.getTooltipText(aValue.key, type, aValue.value) : undefined;
                      return this.getAreaByName(val, {
                        color: aValue.color,
                        onClick: () => this.setState({ requestMapIndex: idx }),
                        htmlTooltip
                      })
                    })
                  }
                />
              </div>
              <MapOptions onChange={e => this.onMapOptionsChange(e)} lang={lang} />
              <ReactTooltip html type='info' delayShow={600} place="bottom" />
            </div>
          </div>
        </Transition>

        <Transition visible={showItaly} animation="fade" duration={350} onComplete={(_, e) => { !showItaly && this.setState(prev => ({ mapIndex: prev.requestMapIndex })) }} >
          <div style={{ width: "100%", height: "100%" }}>
            <ItalyMap clients={this.props.clients} lang={this.props.lang} layout={this.props.layout} height="524px" />
          </div>
        </Transition>
      </div>
    );
  }
}
