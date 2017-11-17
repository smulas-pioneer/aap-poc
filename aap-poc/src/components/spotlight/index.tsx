import * as React from "react";
import { Modal, Input, InputOnChangeData } from "semantic-ui-react";
import { SpotlightResultList } from "./SpotlightResultList";
import { SpotlightResultItemPreview } from "./SpotlightResultItemPreview";
import { appConnector } from "app-support";
import { spotlightSearch } from "../../actions/index";
import { getSpotlightData, getLanguage } from "../../reducers/index";
import { SpotlightSearchResultItem } from "../../_db/interfaces";
import { isClient } from "../../_db/utils";

export interface SpotlightProps {
    visible: boolean;
    searchText?: string;

    context?: 'Client' | 'Agent' | 'Security';

    limit?: number;
    onCancel?: () => void;
    onItemNavigate?: (item: SpotlightSearchResultItem) => void;
}

export interface SpotlightState {
    searchText?: string;
    activePosition: number;
}

const conn = appConnector<SpotlightProps>()(
    (s, p) => ({
        data: getSpotlightData(s),
        lang: getLanguage(s)
    }),
    {
        spotlightSearch
    }
)

class SpotlightCompo extends conn.StatefulCompo<SpotlightState> {
    searchInputText: Input;

    constructor(props: any) {
        super(props);
        this.state = {
            searchText: props.searchText,
            activePosition: 0
        }
    }

    componentDidMount() {
        if (this.props.visible) this.props.spotlightSearch({ filter: '' });
    }

    componentWillReceiveProps(next: SpotlightProps) {
        if (this.props.visible != next.visible) {
            this.setState(prevState => ({
                visible: next.visible
            }));
        }
    }

    handleSearchChange = (e: React.SyntheticEvent<HTMLInputElement>, v: InputOnChangeData) =>
        this.setState(prevState => ({ activePosition: 0, searchText: v.value }), () => this.onSearch());

    onSearch = () => this.props.spotlightSearch({ filter: this.state.searchText || '', context: this.props.context, limit: this.props.limit });

    onCancel = () => this.props.onCancel && this.props.onCancel();

    onItemNavigate = (item: SpotlightSearchResultItem) => this.props.onItemNavigate && this.props.onItemNavigate(item);

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
            this.onItemNavigate(current);
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

    onFocus = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const tempValue = e.currentTarget.value;
        if (tempValue) {
            e.currentTarget.value = '';
            e.currentTarget.value = tempValue;
        }
    }

    render() {
        const { activePosition, searchText } = this.state;
        const { data, lang, visible } = this.props;
        const emptyData = !data || !data.items || !Object.keys(data.items).length;

        let currentItem = undefined;
        if (!emptyData) currentItem = data.items

        const searchBox = (
            <Input
                icon="search"
                ref={e => this.searchInputText = e!}
                fluid
                placeholder={`${lang.SEARCH}...`}
                value={searchText || ''}
                autoFocus
                onChange={this.handleSearchChange}
                onKeyDown={this.onKeyDown}
                onFocus={this.onFocus}
                onBlur={() => this.searchInputText.focus()}
            >
            </Input>
        );

        var dialog = (
            <Modal
                open={visible}
                onClose={this.onCancel}
                size='large'
                style={!emptyData ? { height: 600 } : {}}
            >
                <Modal.Header content={searchBox}></Modal.Header>
                {
                    emptyData
                        ? null
                        : <Modal.Content>
                            <div style={{ float: 'left', overflowY: 'scroll', paddingRight: 8, height: 530 }} >
                                <SpotlightResultList
                                    data={data.items}
                                    active={activePosition}
                                    onItemSelect={(index, item) => this.setActivePosition(index)}
                                    onItemNavigate={(index, item) => this.onItemNavigate(item)}
                                    lang={lang}
                                />
                            </div>
                            <div style={{ overflowY: 'scroll', padding: 0, height: 530 }}>
                                <SpotlightResultItemPreview
                                    item={this.currentItem()}
                                    lang={lang}
                                />
                            </div>
                        </Modal.Content>
                }
            </Modal>
        );

        return dialog;
    }
}

export const Spotlight = conn.connect(SpotlightCompo);