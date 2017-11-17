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
}

export class ClientFilter extends React.Component<ClientFilterProps, ClientFilterState> {
    constructor(props: any) {
        super(props);

        this.renderFilter = this.renderFilter.bind(this);
        this.renderFilterMenu = this.renderFilterMenu.bind(this);
        this.searchAdvanced = this.searchAdvanced.bind(this);
        this.hasMoreThenOneFilter = this.hasMoreThenOneFilter.bind(this);
        this.clearAllFilters = this.clearAllFilters.bind(this);
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

    renderFilterMenuNew(key: number, map: FilterMap, values: SearchFilter) {
        const { searchprop, render: { icon, header, label, max }, enableClearAll = true } = map;

        let menu = values && Object.keys(values).sort((a, b) => {
            if (b.startsWith('<1')) return 1;
            if (b.startsWith('>20')) return -1;
            if (a.startsWith('10-')) return 1;
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        }).map((prop, j) => {
            return (
                <Menu.Item key={j} name='prop' link onClick={() => searchprop && this.searchAdvanced(searchprop, prop, values[prop].isInUse)}>
                    {values[prop].current > 0 && <Label size="tiny" content={values[prop].current} />}
                    {values[prop].isInUse && <Icon name="checkmark" color="green" style={{ float: 'none', margin: '0 .5em 0 0' }} />}
                    {prop !== '0' ? (label ? label(prop) : prop) : 'none'}
                </Menu.Item>
            );
        });

        let others = max !== undefined && menu.splice(max);
        

        return (menu &&
            <Menu.Item key={key}>
                <Menu.Header>
                    <Icon name={icon} />{header}
                    {enableClearAll && this.hasMoreThenOneFilter(values) && <IconButton color="red" name="remove" floated="right" onClick={() => this.clearAllFilters(searchprop)} />}
                </Menu.Header>
                <Menu.Menu>
                    {menu}
                    {others && others.length ?
                        (
                            <Dropdown item text='More'>
                                <Dropdown.Menu className='left'>
                                    {others}
                                </Dropdown.Menu>
                            </Dropdown>
                      
                        ) : null}
                </Menu.Menu>

            </Menu.Item>

        );
    }

    renderFilterMenu(key: number, map: FilterMap, values: SearchFilter) {
        const { searchprop, render: { icon, header, label, max }, enableClearAll = true } = map;

        const keys = values && Object.keys(values).sort((a, b) => {
            if (b.startsWith('<1')) return 1;
            if (b.startsWith('>20')) return -1;
            if (a.startsWith('10-')) return 1;
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        }).reduce((memo, prop, j) => {
            const item = (
                <Menu.Item key={j} name='prop' link onClick={() => searchprop && this.searchAdvanced(searchprop, prop, values[prop].isInUse)}>
                    {values[prop].current > 0 && <Label size="tiny" content={values[prop].current} />}
                    {values[prop].isInUse && <Icon name="checkmark" color="green" style={{ float: 'none', margin: '0 .5em 0 0' }} />}
                    {prop !== '0' ? (label ? label(prop) : prop) : 'none'}
                </Menu.Item>
            );

            if (max && j > max) {
                memo.others.push(item);
            } else {
                memo.menu.push(item);
            }

            return memo;
        }, { menu: [], others: [] } = { menu: [] as any, others: [] as any });

        return (keys &&
            <Menu.Item key={key}>
                <Menu.Header>
                    <Icon name={icon} />{header}
                    {enableClearAll && this.hasMoreThenOneFilter(values) && <IconButton color="red" name="remove" floated="right" onClick={() => this.clearAllFilters(searchprop)} />}
                </Menu.Header>
                <Menu.Menu>
                    {keys.menu}
                    {keys.others.length ?
                        (
                            <Accordion defaultActiveIndex={undefined} panels={[
                                {
                                    key: 'others',
                                    title: { as: Menu.Item, content: <Segment as="span" style={{ paddingLeft: 0 }} basic><label>...others</label></Segment> },
                                    content: {
                                        content: (
                                            <Menu.Menu>
                                                {keys.others}
                                            </Menu.Menu>
                                        )
                                    }
                                }
                            ]} />
                        ) : null}
                </Menu.Menu>

            </Menu.Item>
        );
    }

    renderFilter() {
        let ret: JSX.Element[] = [];

        if (isArray(this.props.filterMaps)) {
            this.props.filterMaps.forEach((filter, i) =>
                ret.push(this.renderFilterMenuNew(i, filterMapItems[filter], this.props.data![filter]))
            );
        } else {
            Object.keys(this.props.filterMaps).forEach((filter, i) => {
                const fieldMap: FilterMap = {
                    ...filterMapItems[filter], enableClearAll: this.props.filterMaps[filter].clearAll
                };
                ret.push(this.renderFilterMenuNew(i, fieldMap, this.props.data![filter]));
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