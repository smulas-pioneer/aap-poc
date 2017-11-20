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
        style: { ...props.style, margin: 0, overflow: 'hidden', maxHeight: '100%' }
    }
    return <div  {...newprops} />
}

export const AdvancedGrid = (props: any) => {
    const newprops = {
        ...props,
        className: `grid-advanced ${props.className || ''}`
    }

    return <div {...newprops} />
}
