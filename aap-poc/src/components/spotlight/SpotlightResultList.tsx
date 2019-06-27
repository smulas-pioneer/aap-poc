import * as React from "react";
import { Table, SemanticCOLORS, Segment } from 'semantic-ui-react'
import { SpotlightSearchResultItem } from "../../_db/interfaces";
import * as ReactDOM from "react-dom";
import { SpotlightResultListItem } from "./SpotlightResultListItem";
import { WithLang } from "../../reducers/language/interfaces";
import { capitalize } from "lodash";

export interface SpotlightResultListProps extends WithLang {
  data: { [key: string]: SpotlightSearchResultItem[] | undefined };
  customHeader?: (key: string, firstKeyItemIndex: number) => void;
  active: number;
  onItemSelect: (index: number, item: SpotlightSearchResultItem) => void;
  onItemNavigate: (index: number, item: SpotlightSearchResultItem) => void;
}

export class SpotlightResultList extends React.Component<SpotlightResultListProps>{

  static COLORS: SemanticCOLORS[] = ['blue', 'pink', 'yellow', 'teal'];
  itemsCount = 0;

  renderItem(item: SpotlightSearchResultItem, index: number) {
    return (
      <SpotlightResultListItem
        key={index}
        active={this.props.active === index}
        item={item}
        onClick={() => this.props.onItemSelect(index, item)}
        onNavigate={() => this.props.onItemNavigate(index, item)}
        scrollIntoView={this.scrollElementIntoView}
      />
    )
  }

  renderItems(items: SpotlightSearchResultItem[]) {
    return items.map((item, i) =>
      this.renderItem(item, this.itemsCount++));
  }

  scrollElementIntoView(instance: React.ReactInstance) {
    if (instance) {
      /* for now, do not check when really needed... just scroll smoothly */
      const element = ReactDOM.findDOMNode(instance) as any;
      if (element) {
        try {
          element.scrollIntoView({ block: 'center', behavior: 'auto' });
        }
        catch{
          element.scrollIntoView({ block: 'start', behavior: 'auto' });
        };
      }
    }
  }

  render() {
    let { data, customHeader, lang } = this.props;
    this.itemsCount = 0;
    return <div>
      {
        Object.keys(data).map((key, ikey) => {
          const caption = key === 'agents' ? 'advisors' : key;
          return (
            <Table striped color={SpotlightResultList.COLORS[ikey]} key={ikey}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell style={{ minWidth: 280 }}>{capitalize(caption)}{customHeader && customHeader(key, (this.itemsCount - ikey) + 1)}</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.renderItems(data[key]!)}
              </Table.Body>
            </Table>
          )
        }
        )
      }
      <Segment color="green">{lang.SHOW_ALL}...</Segment>
    </div >
  }
}
