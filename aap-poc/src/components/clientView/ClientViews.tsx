import { LangDictionary } from '../../reducers/language/interfaces';
import * as React from 'react';
import { TabProps, Menu, Grid, Tab, Button, Icon } from 'semantic-ui-react';
import { WidgetTitle } from '../shared/WidgetTitle';
export interface ClientViewProps {
  graphs: any[];
  lang: LangDictionary;
  mode: 'tab' | 'buttons';
  defaultIndex: number;
  hideTitle?: boolean;
}


export class ClientViews extends React.Component<ClientViewProps, { activeIndex?: number }> {
  constructor(props: ClientViewProps) {
    super(props);
    this.state = { activeIndex: 0 };
    this.handleBtnChange = this.handleBtnChange.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);

    setTimeout(() => {
      this.setState({ activeIndex: props.defaultIndex });
    }, 1000);
  }
  componentDidMount() {
  }
  handleTabChange(e: any, data: TabProps) {
    if (typeof (data.activeIndex) === "string") return;
    this.setState({ activeIndex: data.activeIndex });
  }
  handleBtnChange(activeIndex: number) {
    this.setState({ activeIndex });
  }

  renderTab(graphs: any[], activeIndex: number, lang: LangDictionary) {
    const panes = graphs.reduce((memo, item, ix) => {
      memo.push({
        menuItem: item.charts && item.charts.length ? <Menu.Item key={ix} name={item.title} icon={item.icon} /> : undefined,
        render: () => <Tab.Pane as="div" style={{ padding: '5px 8px' }}
          content={
            <Grid columns="equal" >
              {item.charts && item.charts.map((v: any, j: number) => <Grid.Column key={j} textAlign="center">{v.title !== item.title ? v.title : ''}{v.chart}</Grid.Column>)}
            </Grid>
          } />
      });

      return memo;
    },  [] as any[]);

    return (
      <div>
        {!this.props.hideTitle && <WidgetTitle title={lang.PORTFOLIO_VIEWS} shareButtons={['Image', 'Copy']} />}
        <Tab menu={{ pointing: true, secondary: true }} panes={panes} activeIndex={activeIndex} onTabChange={this.handleTabChange} style={{ height: '95%' }} />
      </div>
    );
  }

  renderButtons(graphs: any[], activeIndex: number, lang: LangDictionary) {
    const item = graphs[activeIndex]

    const panes = graphs.reduce((memo, item, ix) => {
      if (item.charts && item.charts.length) {
     
        memo.push(

          <Button key={ix} size="mini" active={ix === activeIndex} onClick={() => this.handleBtnChange(ix)} >
            <Icon name={item.icon as any} />
            <br /> <br />{item.title}
          </Button>
        );
      }
      return memo;
    },  [] as any);

    return (
      <div>
        <WidgetTitle title={lang.PORTFOLIO_VIEWS} subtitle={item.title} />
        <Grid columns="equal" >
          {item.charts && item.charts.map((v: any, j: number) => <Grid.Column key={j} textAlign="center">{v.title !== item.title ? v.title : ''}{v.chart}</Grid.Column>)}
        </Grid>
        <Button.Group basic fluid size="mini" >
          {panes}
        </Button.Group >
      </div>
    );
  }

  render() {
    const { mode, graphs, lang } = this.props;
    const { activeIndex } = this.state;

    if (mode === 'tab') {
      return this.renderTab(graphs, activeIndex!, lang);
    } else {
      return this.renderButtons(graphs, activeIndex!, lang);
    }
  }
}
