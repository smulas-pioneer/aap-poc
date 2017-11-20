import * as React from 'react';
import { appConnectorWithRouter } from 'app-support';
import { getLanguage, getCurrentUser } from '../reducers/index';
import { Menu, MenuItemProps, Dropdown, Image, Header } from 'semantic-ui-react';
import * as Model from '../actions/model';
import { Link } from "react-router-dom";
import { LangBar } from './LangBar';
import { Spotlight } from './spotlight'
import { logout } from '../actions/index';
import { UserInfo } from '../actions/model';
import { LangDictionary } from '../reducers/language/interfaces';
import { SpotlightSearchResultItem } from '../_db/interfaces';
import { isClient, isAgent } from '../_db/utils';
const userImage = require('./user.png');
const logo2 = require('./logo2.png');

export interface MenuFlatProps {
}
export interface MenuFlatState {
    spotlightVisible: boolean,
    activeMenuItem: string
}

const conn = appConnectorWithRouter<{}, MenuFlatProps>()(
    (s, p) => ({
        lang: getLanguage(s),
        user: getCurrentUser(s)
    }),
    {
        logout
    }
)

class MenuFlat extends conn.StatefulCompo<MenuFlatState> {
    constructor(props: any) {
        super(props);
        this.state = {
            spotlightVisible: false,
            activeMenuItem: ''
        }
        this.toggleSpotlight = this.toggleSpotlight.bind(this);
        this.spotlightMenuItem = this.spotlightMenuItem.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    toggleSpotlight(toggle: boolean) { this.setState(prevState => ({ spotlightVisible: toggle })); }

    spotlightMenuItem() {
        return (
            <Menu.Item
                position="right"
                as="a"
                icon='search'
                content={this.props.lang.SEARCH}
                key='spotlight'
                onClick={() => this.toggleSpotlight(true)}
                name={this.props.lang.MENU_SPOTLIGHT}>
            </Menu.Item>);
    }

    handleItemClick(event: React.MouseEvent<HTMLAnchorElement>, data: MenuItemProps) {
        this.setState({ activeMenuItem: data.name! });
    }

    renderItem(item: Model.MemuItemModel, i: number, activeMenuItem: string) {
        const itemText = this.props.lang[item.langProps] || item.langProps;
        return (<Menu.Item
            active={activeMenuItem === itemText}
            to={item.linkTo || ''}
            as={Link}
            key={i}
            onClick={this.handleItemClick}
            name={itemText}>
            {itemText}
        </Menu.Item>);
    }

    userOptionsTrigger = (user: UserInfo, lang: LangDictionary) => (
        <span>
            <Image avatar src={userImage} />{lang.WELCOME}, {user.firstName}
        </span>
    );

    onItemNavigate = (item: SpotlightSearchResultItem) => {
        if (isClient(item)) {
            const clientRoute = `/clients/${item.id}`;
            this.toggleSpotlight(false);
            if (this.props.history.location.pathname !== clientRoute) {
                this.props.history.push(clientRoute);
            }
        } else if (isAgent(item)) {
            const agentRoute = `/agents/${item.name}/clients`;
            this.toggleSpotlight(false);
            if (this.props.history.location.pathname !== agentRoute) {
                this.props.history.push(agentRoute);
            }
        }
    }

    render() {
        const { spotlightVisible, activeMenuItem } = this.state;
        const { logout, lang, user } = this.props;

        const trigger = this.userOptionsTrigger(user!, lang);

        return (
            <div style={{ backgroundColor: 'white', borderBottom: 'solid #db2828 thick' }}>

                <Spotlight
                    onCancel={() => this.toggleSpotlight(false)}
                    onItemNavigate={this.onItemNavigate}
                    visible={spotlightVisible}
                />

                <Menu attached secondary >

                    <img style={{ width: '50px', height: '50px', padding: '4px' }} src={logo2} />

                    <Menu.Item color="blue" as={Link} to="/" replace>
                        <h2 style={{ color: '#005483', fontFamily: 'Helvetica' }} >Advisory Platform</h2>
                    </Menu.Item>

                    {/*Model.memuItems.map((v: any, i: any) => this.renderItem(v, i, activeMenuItem))*/}

                    <Menu secondary compact floated='right' >
                        {this.spotlightMenuItem()}
                        <Dropdown fluid item trigger={trigger} >
                            <Dropdown.Menu>
                                <Dropdown.Divider />
                                <LangBar />
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={() => logout()}>{lang.SIGN_OUT}</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item><span style={{ marginRight: 5 }}>v {process.env.REACT_APP_VERSION} </span></Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu>

                    {/* <Menu.Item>
                        <span style={{ marginRight: 5 }}>v {process.env.REACT_APP_VERSION} </span>
                        <LangBar />
                    </Menu.Item>
                    {this.renderSpotlightItem()} */}
                </Menu>
            </div>
        );
    }
}

export default conn.connect(MenuFlat);