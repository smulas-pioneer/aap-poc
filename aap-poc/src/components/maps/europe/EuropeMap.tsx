import React from "react";
import { LangDictionary } from "../../../reducers/language/interfaces";
import { ConfigLayout } from "../../../reducers/config";
import { Client } from "../../../_db/common/interfaces";
import Europe from "./Europe";
import Italy from "./Italy";
import Luxemburg from "./Luxemburg";
import Austria from "./Austria";
import Germany from "./Germany";

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
  // values: { type: IndicatorOptionsType, areaValues: AreaValue[], countWithValues: number };
}

export class EuropaMap extends React.Component<EuropeMapProps, EuropeMapState> {
  static AREA_MAP_INDEX = ['Italia', 'Lussemburgo', 'Austria', 'Germania'];

  constructor(props: EuropeMapProps) {
    super(props);
    this.getAreaByName = this.getAreaByName.bind(this);

    this.state = {
      mapIndex: undefined,
      requestMapIndex: undefined
    };
  }

  getAreaByName(name: string, props?: { color?: string, fill?: boolean, onClick?: () => void, percentage?: number, htmlTooltip?: string }) {
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
    // const showEurope = this.state.requestMapIndex === undefined && this.state.mapIndex === undefined;
    // const showNation = this.state.requestMapIndex !== undefined && this.state.mapIndex !== undefined;
    // const { lang } = this.props;

    return (
      <div style={{ width: this.props.width, height: this.props.height }}>
        <div style={{ width: "100%", height: "100%" }}>
          <Europe className="nations"
            paths={
              EuropaMap.AREA_MAP_INDEX.map((val, idx) => {
                return this.getAreaByName(val, {
                  onClick: () => this.setState({ requestMapIndex: idx })
                })
              })
            }
          />
        </div>
      </div>
    );
  }
}
