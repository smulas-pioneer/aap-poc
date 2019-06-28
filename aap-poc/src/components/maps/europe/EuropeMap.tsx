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
const ReactTooltip = require('react-tooltip');

export interface EuropeMapProps {
  lang: LangDictionary,
  layout: ConfigLayout,
  clients: Client[]
  width?: number | string;
  height?: number | string;
}

export interface EuropeMapState {
  mapIndex: number | undefined;
  requestMapIndex: number | undefined;
  values: { type: IndicatorOptionsType, areaValues: AreaValue[], countWithValues: number };
}

export class EuropaMap extends React.Component<EuropeMapProps, EuropeMapState> {
  static AREA_MAP_INDEX = ['Italia', 'Lussemburgo', 'Austria', 'Germania'];
  colors: number[][];
  MAX_COLORS_LEN = 0;

  LAST_COLOR = '';

  constructor(props: EuropeMapProps) {
    super(props);
    this.getAreaByName = this.getAreaByName.bind(this);
    this.calculateAreaValues = this.calculateAreaValues.bind(this);
    this.interpolateColor = this.interpolateColor.bind(this);
    this.interpolateColors = this.interpolateColors.bind(this);
    //this.onMapOptionsChange = this.onMapOptionsChange.bind(this);
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
    this.LAST_COLOR = 'whitesmoke';
    this.state = {
      mapIndex: undefined,
      requestMapIndex: undefined,
      values: this.calculateAreaValues(props.clients)
    };
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

  calculateAreaValues(clients: Client[], type: IndicatorOptionsType = IndicatorOptionsType.clients, nationFilter?: string) {
    // distinct clietns by id
    let ds = uniqBy(clients, c => c.id);
    if (nationFilter) ds = ds.filter(d => d.address.region === nationFilter);

    // reduce to area : count of
    let values: any = {}; EuropaMap.AREA_MAP_INDEX.forEach(v => values[v] = 0);

    switch (type) {
      case IndicatorOptionsType.clients: {
        const countByRegion = countBy(ds, c => c.address.region);
        EuropaMap.AREA_MAP_INDEX.forEach(area => values[area] = countByRegion[area]);
        break;
      }
      case IndicatorOptionsType.aua: {
        EuropaMap.AREA_MAP_INDEX.forEach(area => {
          values[area] = sumBy(ds.filter(c => c.address.region === area), c => c.aua);
        });
        break;
      }
      case IndicatorOptionsType.alerts: {
        EuropaMap.AREA_MAP_INDEX.forEach(area => {
          values[area] = ds.filter(c => c.address.region === area && c.radar.numOfAlerts > 0).length;
        });
        break;
      }
      case IndicatorOptionsType.proposals: {
        EuropaMap.AREA_MAP_INDEX.forEach(area => {
          values[area] = sumBy(ds.filter(c => c.address.region === area), c => c.numOfInterviews);
        });
        break;
      }
      case IndicatorOptionsType.acceptedProposals: {
        EuropaMap.AREA_MAP_INDEX.forEach(area => {
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
        color: color !== undefined ? `rgb(${color[0]}, ${color[1]}, ${color[2]}` : this.LAST_COLOR
      });
      return acc;
    }, [] as AreaValue[]
    );
    return { type, areaValues, countWithValues };
  }
  getAreaByName(name: string, props?: { color?: string, onClick?: () => void, percentage?: number, htmlTooltip?: string }) {
    switch (name) {
      case 'Italia': return <Italy key={name} {...props} />
      case 'Lussemburgo': return <Luxemburg key={name} {...props} />
      case 'Austria': return <Austria key={name} {...props} />
      case 'Germania': return <Germany key={name} {...props} />
      default:
        return null;
    }
  }

  render() {
    const { type, areaValues, countWithValues } = this.state.values;
    const showEurope = this.state.requestMapIndex === undefined && this.state.mapIndex === undefined;
    const showNation = this.state.requestMapIndex !== undefined && this.state.mapIndex !== undefined;
    const { lang } = this.props;

    return (
      <div style={{ width: this.props.width, height: this.props.height }}>
        <Transition visible={showEurope} animation='fade up' duration={350} onComplete={(_, e) => { !showEurope && this.setState(prev => ({ mapIndex: prev.requestMapIndex })) }} >
          <div style={{ width: "100%", height: "100%" }}>
            <Europe className="nations"
              paths={
                EuropaMap.AREA_MAP_INDEX.map((val, idx) => {
                  const aValue = areaValues[idx];
                  return this.getAreaByName(val, {
                    color: aValue.color,
                    onClick: () => this.setState({ requestMapIndex: idx })
                  })
                })
              }
            />
            <ReactTooltip html type='info' delayShow={countWithValues > 1 ? 600 : 100} place="bottom" />
          </div>
        </Transition>

        <Transition visible={showNation} animation="fade" duration={350} onComplete={(_, e) => { !showNation && this.setState(prev => ({ mapIndex: prev.requestMapIndex })) }} >
          <div style={{ width: "100%", height: "100%" }}>
            <ItalyMap clients={this.props.clients} lang={this.props.lang} layout={this.props.layout} height="524px" />
          </div>
        </Transition>
      </div>
    );
  }
}
