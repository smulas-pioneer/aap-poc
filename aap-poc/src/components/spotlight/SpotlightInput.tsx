import * as React from "react";
import { Input, InputOnChangeData, Table, SemanticCOLORS, Segment } from "semantic-ui-react";
import { SpotlightResultList } from "./SpotlightResultList";
import { appConnector } from "app-support";
import { spotlightSearch } from "../../actions/index";
import { getSpotlightData, getLanguage } from "../../reducers/index";
import { SpotlightSearchResultItem } from "../../_db/interfaces";
import { SpotlightResultListItem } from "./SpotlightResultListItem";
import { capitalize } from "lodash";

export interface SpotlightInputProps {
    searchText?: string;
    onCancel?: () => void;
    onItemNavigate?: (item: SpotlightSearchResultItem) => void;
}

export interface SpotlightInputState {
    activePosition: number;
    searchText?: string;
    resultVisible: boolean;
}

const conn = appConnector<SpotlightInputProps>()(
    (s, p) => ({
        data: getSpotlightData(s),
        lang: getLanguage(s)
    }),
    {
        spotlightSearch
    }
)

class SpotlightInputCompo extends conn.StatefulCompo<SpotlightInputState> {
    searchInputText: Input;
    static COLORS: SemanticCOLORS[] = ['blue', 'pink', 'yellow', 'teal'];
    itemsCount = 0;

    constructor(props: any) {
        super(props);
        this.state = {
            searchText: props.searchText,
            activePosition: 0,
            resultVisible: false
        }
        this.renderItem = this.renderItem.bind(this);
        this.renderItems = this.renderItems.bind(this);
    }

    componentDidMount() {
        this.props.spotlightSearch({ filter: '' });
    }

    handleSearchChange = (e: React.SyntheticEvent<HTMLInputElement>, v: InputOnChangeData) =>
        this.setState(prevState => ({ activePosition: 0, searchText: v.value, resultVisible: v.value.length > 0 }), () => this.onSearch());

    onSearch = () => this.props.spotlightSearch({ filter: this.state.searchText || '' });

    onCancel = () => {
        this.setState((prevState: SpotlightInputState) => ({ resultVisible: false }), () => {
            this.props.onCancel && this.props.onCancel();
        });
    }

    onItemNavigate = (item: SpotlightSearchResultItem) => {
        this.setState((prevState: SpotlightInputState) => ({ resultVisible: false }), () => {
            this.props.onItemNavigate && this.props.onItemNavigate(item);
        });
    }

    dataLen = () => {
        let ret = 0;
        Object.keys(this.props.data.items)
            .forEach(v => ret += this.props.data.items[v]!.length);
        return ret;
    }

    currentItem = () => {
        const keys = Object.keys(this.props.data.items);
        let items: SpotlightSearchResultItem[] = [];
        keys.forEach(key => items.push(...(this.props.data.items[key] || [])));
        return items[this.state.activePosition];
    }

    onKeyDown = (event: React.KeyboardEvent<any>) => {
        if (event.keyCode === 13) {
            const current = this.currentItem();
            if (current) this.onItemNavigate(current);
        } else if (event.keyCode === 27) {
            this.onCancel();
        } else if (event.keyCode === 38) {
            event.preventDefault();
            this.setActivePosition(this.state.activePosition - 1);
        } else if (event.keyCode === 40) {
            event.preventDefault();
            this.setActivePosition(this.state.activePosition + 1);
        }
    }

    setActivePosition = (pos: number) => {
        if (pos >= 0 && pos < this.dataLen()) {
            this.setState(prevState => ({
                activePosition: pos
            }));
        }
    }

    renderItem(item: SpotlightSearchResultItem, index: number) {
        return (
            <SpotlightResultListItem
                key={index}
                active={this.state.activePosition == index}
                item={item}
                onClick={() => this.setActivePosition(index)}
                onNavigate={() => this.onItemNavigate(item)}
            />
        )
    }

    renderItems(items: SpotlightSearchResultItem[]) {
        return items.map((item, i) =>
            this.renderItem(item, this.itemsCount++));
    }

    render() {
        const { searchText, resultVisible } = this.state;
        const { data, lang } = this.props;
        const emptyData = !data || !data.items || !Object.keys(data.items).length;

        let currentItem = undefined;
        if (!emptyData) currentItem = data.items;

        this.itemsCount = 0;

        return (
            <div>
                <Input
                    icon="search"
                    ref={e => this.searchInputText = e!}
                    fluid
                    placeholder={lang.ENTER_FILTER_TEXT}
                    value={searchText || ''}
                    autoFocus
                    onChange={this.handleSearchChange}
                    onKeyDown={this.onKeyDown}
                    onBlur={this.onCancel}
                >
                </Input>
                {resultVisible && <Segment style={{ zIndex: 1000, position: 'absolute', width: '60%' }}>
                    {!emptyData && Object.keys(data.items).map((key, ikey) =>
                        (
                            <Table color={SpotlightResultList.COLORS[ikey]} key={ikey}  >
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>{capitalize(key)}</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {this.renderItems(data.items[key]!)}
                                </Table.Body>
                            </Table>
                        )
                    )
                    }
                </Segment>
                }
            </div>
        );
    }
}

export const SpotlightInput = conn.connect(SpotlightInputCompo);