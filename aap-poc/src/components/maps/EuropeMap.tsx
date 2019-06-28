import React from "react";
import { LangDictionary } from "../../reducers/language/interfaces";
import { ConfigLayout } from "../../reducers/config";
import { Client } from "../../_db/common/interfaces";

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

  render() {
    const showEurope = this.state.requestMapIndex === undefined && this.state.mapIndex === undefined;
    const showNation = this.state.requestMapIndex !== undefined && this.state.mapIndex !== undefined;
    const { lang } = this.props;

    return (
      <div style={{ width: this.props.width, height: this.props.height }}>
        <div style={{ width: "100%", height: "100%" }}>
          
        </div>
      </div>
    );
  }
}
