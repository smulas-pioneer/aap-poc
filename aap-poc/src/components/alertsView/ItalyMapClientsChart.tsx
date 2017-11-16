import * as React from 'react';
import { render } from 'react-dom';
import { minBy } from 'lodash';
import { ClientFilters, SearchFilter } from '../../actions/model';
import { ItalyMap } from '../italymaps/ItalyMap';
import { LangDictionary } from '../../reducers/language/interfaces';
import { ItalyMapFixed } from '../italymaps/ItalyMapFixed';
import { Client } from '../../_db/interfaces';

const { ResponsiveContainer } = require('recharts');

export interface ItalyMapClientsChartProps {
    lang: LangDictionary,
    width?: string | number;
    height?: string | number;
    clients: Client[];
    captions?: {
        clients: string
    }
}

export const ItalyMapClientsChart = (props: ItalyMapClientsChartProps) => {

    return (
        <ResponsiveContainer width="100%" height={props.height} >
            <ItalyMap clients={props.clients} lang={props.lang} />
        </ResponsiveContainer>
    )
}