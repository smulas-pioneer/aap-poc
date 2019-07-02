import * as React from "react";
import { appConnector } from 'app-support';
import { getLanguage, getCurrentUser, getConfigLayout } from '../reducers/index';
import { Menu, MenuItemProps, Dropdown, Image } from 'semantic-ui-react';
import * as Model from '../actions/model';
import { Link } from "react-router-dom";
import { LangBar } from './LangBar';
import { Spotlight } from './spotlight'
import { logout } from '../actions/index';
import { UserInfo } from '../actions/model';
import { LangDictionary } from '../reducers/language/interfaces';
import { SpotlightSearchResultItem } from '../_db/interfaces';
import { isClient, isAgent } from '../_db/utils';
import { Share } from './Share';

const advisorAvatar = require('./advisorAvatar.png');
const managerAvatar = require('./managerAvatar.png');
const logo2 = require('./logo2.png');
const logoBper = require('./logo-bper.svg');
const logoAmundi = require('./logo-amundi.png');

export interface MenuFlatProps {
  history: any;
}
export interface MenuFlatState {
  spotlightVisible: boolean,
  activeMenuItem: string
}

const conn = appConnector<MenuFlatProps>()(
  (s, p) => ({
    lang: getLanguage(s),
    user: getCurrentUser(s),
    layout: getConfigLayout(s)
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
      <Image avatar src={user.isManager ? managerAvatar : advisorAvatar} />{lang.WELCOME}, {user.firstName}
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
    const { spotlightVisible } = this.state;
    const { logout, lang, user, layout } = this.props;

    const trigger = this.userOptionsTrigger(user!, lang);

    let srcLogo = logo2;
    switch (layout.client) {
      case 'BPER':
        srcLogo = logoBper;
        break;
      case 'AMUNDI':
        srcLogo = logoAmundi;
        break;
      default:
        break;
    }

    return (
      <div>
        <Spotlight
          onCancel={() => this.toggleSpotlight(false)}
          onItemNavigate={this.onItemNavigate}
          visible={spotlightVisible}
        />

        <Menu >
          {/* <img alt="" style={{ width: '50px', height: '50px', padding: '4px', ...layout.logoStyle }} src={srcLogo} />
          <Menu.Item replace="true" ><Link to="/" style={{ color: '#FFFFFF', fontFamily: 'Lato', ...layout.titleStyle }} ><h2>Advisory Platform</h2></Link></Menu.Item> */}
          <Menu secondary compact floated='right' color='blue' >

            <Menu.Item as="a" >
              <Share text='Share' buttons={['Print', 'Pdf', 'Email']} pointing="top right" />
            </Menu.Item>

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
      </div >
    );
  }
}

export default conn.connect(MenuFlat);
