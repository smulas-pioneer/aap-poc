import * as React from 'react';
import { appConnectorWithRouter } from 'app-support';
import { getLanguage } from '../reducers/index';
import { Table, Icon, Menu, Image } from 'semantic-ui-react';
import * as Model from '../actions/model';
import { Link } from "react-router-dom";
import { LangBar } from './LangBar';
import { Spotlight } from './spotlight'
import { SpotlightInput } from './spotlight/SpotlightInput';

export interface MenuFlatProps {
}
export interface MenuFlatState {
    spotlightVisible: boolean
}

const conn = appConnectorWithRouter<{}, MenuFlatProps>()(
    (s, p) => ({
        lang: getLanguage(s)
    }),
    {}
)

class MenuFlat extends conn.StatefulCompo<MenuFlatState> {
    constructor(props: any) {
        super(props);
        this.state = {
            spotlightVisible: false
        }
        this.toggleSpotlight = this.toggleSpotlight.bind(this);
        this.renderSpotlightItem = this.renderSpotlightItem.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    toggleSpotlight(toggle: boolean) { this.setState(prevState => ({ spotlightVisible: toggle })); }

    renderSpotlightItem() {
        return (
            <Menu.Item
                as="a"
                icon='search'
                content={this.props.lang.SEARCH}
                key='spotlight'
                onClick={() => this.toggleSpotlight(true)}
                name={this.props.lang.MENU_SPOTLIGHT}>
            </Menu.Item>);
    }

    renderItem(item: Model.MemuItemModel, i: number) {
        return (<Menu.Item key={i} name={this.props.lang[item.langProps]}>
            <Link to={item.linkTo || ''}>
                <Icon name={item.icon} color={item.color} />
                {this.props.lang[item.langProps]}
            </Link>
        </Menu.Item>);
    }

    render() {
        // const { lang } = this.props;
        const { spotlightVisible } = this.state;

        return (
            <div style={{ backgroundColor: 'white', borderBottom: 'solid red thick' }}>
                <Spotlight
                    onCancel={() => this.toggleSpotlight(false)}
                    onItemNavigate={(item: any) => { this.toggleSpotlight(false); this.props.history.push(`/clients/${item.id}`); }}
                    visible={spotlightVisible}
                />
                <Table attached compact basic='very' style={{ paddingTop: 20 }} >
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell width={2} >
                                <Link to={'/homepage'}>
                                    <Image size="mini" src='/logo.png' style={{ marginLeft: 5 }} />
                                </Link>
                            </Table.Cell>
                            <Table.Cell>
                                <SpotlightInput
                                    onItemNavigate={(item: any) => { this.toggleSpotlight(false); this.props.history.push(`/clients/${item.id}`); }}
                                />
                            </Table.Cell>
                            <Table.Cell width={2} textAlign="center">
                                <span>v {process.env.REACT_APP_VERSION}</span>
                                {' '}
                                <LangBar />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table >
                <Menu borderless pointing attached style={{ borderBottom: 0 }} >
                    <Menu.Menu position='left'>
                    </Menu.Menu>
                    {
                        Model.memuItems
                            .map((v: any, i: any) => this.renderItem(v, i)).concat(this.renderSpotlightItem())
                    }
                    <Menu.Menu position='right'>
                    </Menu.Menu>
                </Menu>
            </div>
        );
    }
}

export default conn.connect(MenuFlat);