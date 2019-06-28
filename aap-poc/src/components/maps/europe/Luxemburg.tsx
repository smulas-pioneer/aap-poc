import React from "react";
import { AreaMapProps } from "../../shared/AreaMapProps";

const Luxemburg = ({ htmlTooltip, color, onClick, percentage }: AreaMapProps) => (
  <g data-tip={htmlTooltip}>
    <g className={`area area_luxemburg ${onClick ? '' : 'unselectable'}`} onClick={onClick} >
      <path
        id="lu"
        className="eu europe"
        d="M 217.69202,381.76376 C 217.10576,381.52924 216.40225,381.17749 215.69872,381.17749 C 215.11246,381.17749 214.5262,381.76376 213.8227,381.76376 C 213.70544,381.881 213.8227,381.41199 213.70544,381.29473 C 213.23643,381.06023 212.76742,380.82573 212.18115,380.59123 L 212.29841,380.12221 C 214.87797,380.35672 211.3604,375.78387 211.71214,374.7286 C 212.18115,373.43883 214.5262,369.10048 215.81598,371.32828 C 215.69872,371.91454 215.58148,372.5008 215.81598,373.43883 C 216.40225,375.90112 219.21629,376.13563 219.45082,376.48738 C 221.09235,378.48067 216.40225,379.41869 217.69202,381.76376 z"
        style={
          {
            opacity: 1,
            fillOpacity: 1,
            stroke: '#0e57f0',
            strokeWidth: 0.65450865,
            display: 'inline'
          }}
      />
    </g>
  </g>
);

export default Luxemburg;
