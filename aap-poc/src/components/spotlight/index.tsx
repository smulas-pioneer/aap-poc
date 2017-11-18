import * as React from "react";
import { Modal, Input, InputOnChangeData, Button, ButtonProps, Icon, SemanticCOLORS } from "semantic-ui-react";
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
    onlyPushedSecurity: boolean;
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
            activePosition: 0,
            onlyPushedSecurity: false
        }
    }

    componentDidMount() {
        if (this.props.visible) this.props.spotlightSearch({ filter: '' });
    }

    handleSearchChange = (e: React.SyntheticEvent<HTMLInputElement>, v: InputOnChangeData) =>
        this.setState(prevState => ({ activePosition: 0, searchText: v.value }), () => this.onSearch());

    onSearch = () => this.props.spotlightSearch(
        {
            filter: this.state.searchText || '',
            onlyPushedSecurity: this.state.onlyPushedSecurity,
            context: this.props.context,
            limit: this.props.limit
        });

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

        return keys.length ? items[this.state.activePosition] : undefined;
    }

    onKeyDown = (event: React.KeyboardEvent<any>) => {
        if (event.keyCode === 13) {
            const current = this.currentItem();
            if (current !== undefined) this.onItemNavigate(current);
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

    onSecurityPushedClick = (index: number) => {
        this.setState(prev => (
            {
                onlyPushedSecurity: !prev.onlyPushedSecurity,
                activePosition: index
            }
        ), () => this.onSearch());
    }

    renderCustomHeader = (key: string, index: number) => {
        switch (key.toLowerCase()) {
            case "security":
                const colIcon: SemanticCOLORS = this.state.onlyPushedSecurity ? "green" : "black";
                return (
                    <Button floated="right" basic toggle animated='vertical' onClick={() => this.onSecurityPushedClick(index)}>
                        <Button.Content hidden>{this.state.onlyPushedSecurity ? "All" : "Advise"}</Button.Content>
                        <Button.Content visible>
                            <Icon color={colIcon} name='thumbs up' />
                        </Button.Content>
                    </Button>
                );
        }
        return null;
    }

    render() {
        const { activePosition, searchText, onlyPushedSecurity } = this.state;
        const { data, lang, visible } = this.props;
        const emptyData = !data || !data.items || !Object.keys(data.items).length;

        let currentItem = undefined;

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
                                    customHeader={this.renderCustomHeader}
                                    lang={lang}
                                />
                            </div>
                            {!emptyData &&
                                <div style={{ overflowY: 'scroll', padding: 0, height: 530 }}>
                                    <SpotlightResultItemPreview
                                        item={this.currentItem()!}
                                        lang={lang}
                                    />
                                </div>
                            }
                        </Modal.Content>
                }
            </Modal>
        );

        return dialog;
    }
}

export const Spotlight = conn.connect(SpotlightCompo);