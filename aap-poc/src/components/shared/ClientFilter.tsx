import * as React from "react";
import { Menu, Icon, Label, Accordion, Segment, Dropdown } from "semantic-ui-react";
import { ClientFilters, SearchFilter, filterMapItems, FilterMap, FilterMapTypes, createFilterAdv } from "../../actions/model";
import { SearchParms, Client } from "../../_db/interfaces";
import { ClientsViewFilterText } from "../clientsView/ClientsViewParms";
import { LangDictionary } from "../../reducers/language/interfaces";
import IconButton from "./IconButton/index";
import { isArray } from "util";
import { PeerCertificate } from "tls";
import { WidgetTitle } from "./WidgetTitle";
import { startsWith } from "lodash";

export type FilterMapDefinition = {[k in FilterMapTypes]?: { clearAll?: boolean } | undefined };

export interface ClientFilterProps {
    data: ClientFilters | undefined;
    onChange(filter: SearchParms): void;
    filterValue: SearchParms;
    filterMaps: FilterMapTypes[] | FilterMapDefinition;
    searchPlaceholder?: string;
    freeFilterText?: boolean;
}

export interface ClientFilterState {
    renderAllFilters: any;
}

export class ClientFilter extends React.Component<ClientFilterProps, ClientFilterState> {
    constructor(props: any) {
        super(props);

        this.state = { renderAllFilters: {} };

        this.renderFilter = this.renderFilter.bind(this);
        this.renderFilterMenu = this.renderFilterMenu.bind(this);
        this.searchAdvanced = this.searchAdvanced.bind(this);
        this.hasMoreThenOneFilter = this.hasMoreThenOneFilter.bind(this);
        this.clearAllFilters = this.clearAllFilters.bind(this);
        this.renderAllFiltersHandler = this.renderAllFiltersHandler.bind(this);
    }

    renderAllFiltersHandler(name: string, value: boolean) {
        this.setState({ renderAllFilters: { ...this.state.renderAllFilters, [name]: value } })
    }

    searchAdvanced(name: string, value: string, remove: boolean) {
        let propFilterValues: any[] = this.props.filterValue[name] || [];

        if (remove) {
            propFilterValues = propFilterValues.filter(d => d !== value);
        } else {
            propFilterValues.push(value);
        }

        this.props.onChange({ ...this.props.filterValue, [name]: propFilterValues });
    }

    clearAllFilters(name: string) {
        this.props.onChange({ ...this.props.filterValue, [name]: undefined });
    }

    hasMoreThenOneFilter(values: SearchFilter) { return Object.keys(values).filter(e => values[e].isInUse).length > 1; }

    renderFilterMenu(key: number, map: FilterMap, values: SearchFilter) {
        const { searchprop, render: { icon, header, label, max }, enableClearAll = true } = map;

        const { renderAllFilters } = this.state;

        const currentRenderAllFilters = renderAllFilters[searchprop] || false;

        let current = values && Object.keys(values).sort((a, b) => {

            //'<1M' | '1-5M' | '5-10M' | '10-20M' | '>20M'
            if (startsWith(a, '<1M')) return -1;
            if (startsWith(a, '1-5M')) return -1;
 
            if (startsWith(a, '>20M')) return 1;
            if (startsWith(a, '10-20M')) return 1;
            if (startsWith(a, '5-10M')) return 1;

            //'<1W' | '1W-1M' | '1M-6M' | '>6M'
            if (startsWith(a, '<1W')) return -1;
            if (startsWith(a, '1W-1M')) return -1;
            if (startsWith(a, '1M-6M')) return -1;
            if (startsWith(a,'>6M')) return 1;

            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        }).reduce((memo, prop, j) => {
            const { current, isInUse } = values[prop];

            const item = (
                <Menu.Item key={j} name='prop' link onClick={() => searchprop && this.searchAdvanced(searchprop, prop, isInUse)}>
                    {current > 0 && <Label size="tiny" content={current} />}
                    {isInUse && <Icon name="checkmark" color="green" style={{ float: 'none', margin: '0 .5em 0 0' }} />}
                    {prop !== '0' ? (label ? label(prop) : prop) : 'none'}
                </Menu.Item>
            );

            if (!currentRenderAllFilters && !isInUse && max !== undefined && j >= max) {
                memo.others.push(item);
            } else {
                memo.menu.push(item);
            }

            return memo;
        }, { menu: [], others: [] } = { menu: [] as any, others: [] as any });

        const hasUs = current.menu && current.menu.length;
        const hasOthers = current.others && current.others.length;

        return (
            <Menu.Item key={key}>
                <Menu.Header>
                    <Icon name={icon} />{header}
                    {enableClearAll && this.hasMoreThenOneFilter(values) && <IconButton color="grey" name="remove" floated="right" onClick={() => this.clearAllFilters(searchprop)} />}
                    {!currentRenderAllFilters && hasOthers ? <IconButton color="grey" name="expand" floated="right" onClick={() => this.renderAllFiltersHandler(searchprop, true)} /> : null}
                    {currentRenderAllFilters ? <IconButton color="grey" name="compress" floated="right" onClick={() => this.renderAllFiltersHandler(searchprop, false)} /> : null}
                </Menu.Header>
                <Menu.Menu>
                    {current.menu}
                    {hasOthers && max ?
                        (
                            <Dropdown item text={`More..`}>
                                <Dropdown.Menu className='left'>
                                    {current.others}
                                </Dropdown.Menu>
                            </Dropdown>

                        ) : null}
                </Menu.Menu>
            </Menu.Item>

        );
    }



    renderFilter() {
        let ret: JSX.Element[] = [];

        if (isArray(this.props.filterMaps)) {
            this.props.filterMaps.forEach((filter, i) =>
                ret.push(this.renderFilterMenu(i, filterMapItems[filter], this.props.data![filter]))
            );
        } else {
            Object.keys(this.props.filterMaps).forEach((filter, i) => {
                const fieldMap: FilterMap = {
                    ...filterMapItems[filter], enableClearAll: this.props.filterMaps[filter].clearAll
                };
                ret.push(this.renderFilterMenu(i, fieldMap, this.props.data![filter]));
            });
        }

        return ret;
    }

    render() {
        const { filterValue, searchPlaceholder, onChange, freeFilterText } = this.props;

        return (
            <Menu vertical fluid style={{ margin: 0, border: 0, boxShadow: 'none' }} className="custom-filter">
                {freeFilterText &&
                    <Menu.Item>
                        <Menu.Header>
                            <Icon name="search" />Filter
                    </Menu.Header>
                        <ClientsViewFilterText
                            filter={filterValue.filter}
                            searchPlaceholder={searchPlaceholder}
                            onChange={(filter) => onChange({ ...filterValue, filter })}
                        />
                    </Menu.Item>
                }
                {this.renderFilter()}
            </Menu>
        )
    }
}