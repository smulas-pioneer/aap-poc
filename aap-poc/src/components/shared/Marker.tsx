import * as React from 'react';
import { MouseEventHandler } from 'react';

export interface MarkerProps {
    width?: number,
    height?: number,
    perc: number;
    color?: string,
    border?: string,
    transform?: string,
    onClick?: MouseEventHandler<SVGElement>;
    className?: string
}

interface MarkerState {
}

export class Marker extends React.Component<MarkerProps, MarkerState> {


    render() {
        const { border = 'gray', transform, width = 38, height = 38, perc = 0, color = 'lightgreen', onClick } = this.props;

        const cx = width / 2;
        const cy = height / 2;
        const r = Math.floor(((cy - 2) * perc) / 100);
        return (
            <g>
                <circle
                    onClick={onClick}
                    cursor="pointer"
                    transform={transform}
                    cx={cx}
                    cy={cy}
                    r={r}
                    stroke={border}
                    strokeWidth={1}
                    fill={color}
                />

            </g>
        )
    }
};