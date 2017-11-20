import * as React from 'react';



export const OverflowItem = (props: any) => {
    const newprops = {
        ...props,
        style: { overflowX: 'hidden', overflowY: 'auto', height: '100%', ...props.style },
    }
    return <div  {...newprops} />
}

export const OverflowColumn = (props: any) => {
    const newprops = {
        ...props,
        style: { ...props.style, margin: 0, overflow: 'hidden', maxHeight: '100%' },
        className: `column-overflow ${props.className || ''}`
    }
    return <div  {...newprops} />
}

export interface GridOverflowProps {
    gridTemplateColumns?: '1fr fit-content(30%)' | 'fit-content(30%) 1fr' | 'auto' | string,
    gridTemplateRows?: 'fit-content(100%)' | 'min-content auto' | 'auto' | string
}

export const AdvancedGrid = (props: any & GridOverflowProps) => {
    const { gridTemplateColumns = '100%', gridTemplateRows = '100%', ...otherprops } = props;

    const newprops = {
        ...otherprops,
        style: { margin: 0, display: 'grid', height: '100%', gridColumnGap: '0.5em', gridRowGap: '0.5em', gridTemplateColumns, gridTemplateRows, ...props.style }
    }

    return <div {...newprops} />
}
