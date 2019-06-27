import * as React from 'react';

import { Input, InputOnChangeData, } from 'semantic-ui-react';
import { SearchParms, } from '../../_db/interfaces';
import { LangDictionary } from '../../reducers/language/interfaces';
import { debounce } from 'lodash';

interface ClientsViewFilterTextProps {
    filter: string,
    searchPlaceholder?: string;
    onChange: (filter: string) => void,
    label?: 'left' | 'right' | 'left corner' | 'right corner';
}

export interface ClientsViewFilterTextState {
    filter: string
}

export class ClientsViewFilterText extends React.Component<ClientsViewFilterTextProps, ClientsViewFilterTextState> {
    constructor(props: ClientsViewFilterTextProps) {
        super(props);
        this.state = { filter: props.filter };
    }

    onSearch = debounce(() => {
        this.props.onChange(this.state.filter);
    }, 400);

    componentWillReceiveProps(next: any) {
        if (next.filter !== this.state.filter) {
            this.setState(next);
        }
    }

    onChange = (e: React.SyntheticEvent<HTMLInputElement>, d: InputOnChangeData) => {
        this.setState(prev => (
            {
                filter: d.value
            })
            ,
            this.onSearch);
    }

    render() {
        const { searchPlaceholder, label } = this.props;
        const { filter } = this.state;

        return (
            <Input
                fluid
                value={filter}
                onChange={this.onChange}
                placeholder={searchPlaceholder}
                label={label || null}
                labelPosition={label && 'right'}
            />
        );
    }
}
