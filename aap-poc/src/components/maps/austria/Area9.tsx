import * as React from 'react';
import { AreaMapProps } from '../../shared/AreaMapProps';
import { Marker } from '../../shared/Marker';

export const Area9 = ({ htmlTooltip, color, onClick, fill, percentage }: AreaMapProps) => {
  return (
    <g data-tip={htmlTooltip}>
      <g className={`area area_9 ${onClick ? '' : 'unselectable'}`}
        onClick={onClick}
      >
        <path id="AT-9" fill={color} stroke="#FFFFFF" strokeMiterlimit="10" d="M550.84,84.85L551.18,84.93L551.18,84.93L551.24,84.74L551.24,84.74L553.13,84.46L553.13,84.46L554.28,86.01L554.28,86.01L554.41,86.46L554.41,86.46L554.55,87.92L557.14,89.89L557.58,87.83L558.77,87.91L560.11,88.61L559.72,90.15L560.84,91.36L562.81,91.53L561.98,101.14L563.03,101.53L563.26,103.45L565.04,103.68L565.32,105.77L565.32,105.77L564.65,106.48L564.65,106.48L560.19,103.85L553.72,106.47L553.97,108.53L545.36,106.43L544.1,108.53L540.76,106.87L536.85,108.01L538.09,106.6L536.79,106.67L535.86,105.13L536.57,104.42L535,104.28L533.75,102.39L535.26,98.75L534.96,96.26L533.71,96.06L534.81,95.39L535.53,91.49L536.19,91.86L536.19,91.86L538.17,94.06L538.17,94.06L539.58,93.98L542.22,90.47L545.7,88.94L545.7,88.94L546.89,88.2L547.42,88.95L547.42,88.95L549.17,88.44L549.4,86.68L549.4,86.68L548.97,85.27L548.97,85.27L550.58,84.72L550.58,84.72z"/>
      </g>
      {percentage && <Marker transform="translate(15, 50)" perc={percentage} onClick={onClick} />}
    </g>
  )
};
