import * as React from "react";
import { appConnector } from 'app-support';
import { getLanguage, getCurrentUser, getConfigLayout, getTheme } from '../reducers/index';
import { Menu, MenuItemProps, Dropdown, Image, Icon, Button } from 'semantic-ui-react';
import * as Model from '../actions/model';
import { Link } from "react-router-dom";
import { LangBar } from './LangBar';
import { Spotlight } from './spotlight'
import { logout, setAppTheme, searchClient } from '../actions/index';
import { UserInfo } from '../actions/model';
import { LangDictionary } from '../reducers/language/interfaces';
import { SpotlightSearchResultItem } from '../_db/interfaces';
import { isClient, isAgent } from '../_db/utils';
import { Share } from './Share';

const advisorAvatar = require('./advisorAvatar.png');
const managerAvatar = require('./managerAvatar.png');
// const logo2 = require('./logo2.png');
// const logoBper = require('./logo-bper.svg');
// const logoAmundi = require('./logo-amundi.png');

export interface MenuFlatProps {
  history: any;
  orientation?: 'horizontal' | 'vertical';
}
export interface MenuFlatState {
  spotlightVisible: boolean,
  activeMenuItem: string
}

const conn = appConnector<MenuFlatProps>()(
  (s, p) => ({
    lang: getLanguage(s),
    user: getCurrentUser(s),
    layout: getConfigLayout(s),
    theme: getTheme(s)
  }),
  {
    logout,
    setAppTheme,
    searchClient
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
    this.goHome = this.goHome.bind(this);
    this.handleSetTheme = this.handleSetTheme.bind(this);
  }

  toggleSpotlight(toggle: boolean) { this.setState(prevState => ({ spotlightVisible: toggle })); }

  spotlightMenuItem(showText?: boolean) {
    if (showText)
      return (<Menu.Item
        position="right"
        as="a"
        icon='search'
        content={this.props.lang.SEARCH}
        key='spotlight'
        onClick={() => this.toggleSpotlight(true)}
        name={this.props.lang.MENU_SPOTLIGHT}>
      </Menu.Item>);
    return (
      <Menu.Item
        position="right"
        as="a"
        key='spotlight'
        onClick={() => this.toggleSpotlight(true)}
        name={this.props.lang.MENU_SPOTLIGHT}>
        <Icon size='large' name='search'></Icon>
      </Menu.Item>);
  }

  handleItemClick(event: React.MouseEvent<HTMLAnchorElement>, data: MenuItemProps) {
    this.setState({ activeMenuItem: data.name! });
  }

  goHome() {
    this.props.history.push('/');
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

  handleSetTheme = () => {
    this.props.setAppTheme(this.props.theme === 'dark' ? 'white' : 'dark');
  }

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
    const { logout, lang, user, orientation = 'horizontal' /*, layout */ } = this.props;
    const trigger = this.userOptionsTrigger(user!, lang);


    const userMenuDropDown = <Dropdown fluid item trigger={trigger} >
      <Dropdown.Menu>
        <Dropdown.Divider />
        <LangBar />
        <Dropdown.Divider />
        <Dropdown.Item onClick={() => logout()}>{lang.SIGN_OUT}</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item><span style={{ marginRight: 5 }}>v {process.env.REACT_APP_VERSION} </span></Dropdown.Item>

        {/* //TODO: Remove it!
        <Dropdown.Divider />
        <DropdownItem selected text=" -------- DEBUG -------- " ></DropdownItem>
        <DropdownItem onClick={() => {
          this.props.searchClient({
            filter: '',
            uid: 'dashboard',
            dynamicFilters: [{ context: 'Currency', key: 'EUR', value: 0.5, operation: DynamicFilterOperation.GraterEqualThan }]
          });
        }}>Add Custom filter...</DropdownItem> */}
        {/* <DropdownItem onClick={() => {
          this.props.searchClient({
            filter: '',
            uid: 'dashboard',
            dynamicFilters: undefined
          });
        }}>Remove Custom filter...</DropdownItem> */}

      </Dropdown.Menu>
    </Dropdown>;

    // let srcLogo = logo2;
    // switch (layout.client) {
    //   case 'BPER':
    //     srcLogo = logoBper;
    //     break;
    //   case 'AMUNDI':
    //     srcLogo = logoAmundi;
    //     break;
    //   default:
    //     break;
    // }

    if (orientation === 'horizontal') return (
      <div style={{ borderLeft: 'solid thin black' }}>
        <Menu >
          {/* <img alt="" style={{ width: '50px', height: '50px', padding: '4px', ...layout.logoStyle }} src={srcLogo} />
          <Menu.Item replace="true" ><Link to="/" style={{ color: '#FFFFFF', fontFamily: 'Lato', ...layout.titleStyle }} ><h2>Advisory Platform</h2></Link></Menu.Item> */}
          <Menu secondary compact floated='right' color='blue' >
            <Menu.Item as="a" >
              <Share text='Share' buttons={['Print', 'Pdf', 'Email']} /*pointing="top right"*/ />
            </Menu.Item>
            {this.spotlightMenuItem(true)}
            {userMenuDropDown}
          </Menu>
        </Menu>
        <Spotlight onCancel={() => this.toggleSpotlight(false)} onItemNavigate={this.onItemNavigate} visible={spotlightVisible} />
      </div>
    );

    else if (orientation === 'vertical') return (
      <div className={`menu-flat ${orientation}`}>
        <Menu secondary borderless compact fluid className='menu-user' size='large' >
          {userMenuDropDown}
        </Menu>
        <Menu secondary borderless compact fluid className='menu-options'>
          <Menu.Item as="a" onClick={() => this.goHome()} >
            <Icon size='large' name='home' />
          </Menu.Item>
          <Menu.Item as="a" position='right' >
            <Share iconSize='large' buttons={['Print', 'Pdf', 'Email']} />
          </Menu.Item>
          {this.spotlightMenuItem()}
          <Menu.Item as="a" onClick={this.handleSetTheme}>
            <svg width='20' height='20' viewBox="0 0 50 50" >
              <circle cx="25" cy="25" r="25" fill={this.props.theme === 'dark' ? 'white' : 'black'}/>
            </svg>
          </Menu.Item>
        </Menu>

        <Spotlight onCancel={() => this.toggleSpotlight(false)} onItemNavigate={this.onItemNavigate} visible={spotlightVisible} />
      </div>
    );
    return null;
  }
}

export default conn.connect(MenuFlat);
