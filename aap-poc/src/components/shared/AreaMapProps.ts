import { MouseEventHandler } from "react";
import { Dictionary } from "lodash";
import { MapLegend } from "../../actions/model";

export interface AreaMapProps {
  onClick?: MouseEventHandler<SVGElement>;
  percentage?: number;
  fill?: boolean;
  transform?: string;
  color?: string,
  htmlTooltip?: string
  legend?: MapLegend<string>;
}

export interface AreaValue {
  key: string,
  value: number,
  perc: number,
  color: string
}
