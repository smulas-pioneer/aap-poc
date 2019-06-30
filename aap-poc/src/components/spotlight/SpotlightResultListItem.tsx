/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import { SpotlightSearchResultItem } from "../../_db/interfaces";
import { isClient, isSecurity, isAgent } from "../../_db/utils";
import { Table } from "semantic-ui-react";

export interface SpotlightSearchResultItemProps {
  item: SpotlightSearchResultItem;
  active: boolean;
  onClick: () => void;
  onNavigate: () => void;
  scrollIntoView?: (node: React.ReactInstance) => void;
}

export class SpotlightResultListItem extends React.Component<SpotlightSearchResultItemProps> {

  cellNode: React.ReactInstance | null = null;

  constructor(props: any) {
    super(props);
    this.ensureVisible = this.ensureVisible.bind(this);
  }

  itemText = (item: SpotlightSearchResultItem) => {
    if (isClient(item)) {
      return item.name;
    } else if (isSecurity(item)) {
      return item.SecurityName;
    } else if (isAgent(item)) {
      return item.name;
    }
    return '';
  }

  item = (item: SpotlightSearchResultItem, active: boolean, onClick: () => void, onNavigate: () => void) => {
    let itemNavigate = false;
    if (active) itemNavigate = isClient(item) || isAgent(item) || isSecurity(item);
    return <Table.Cell selectable={!itemNavigate}>
      <a  ref={(n) => this.cellNode = n}
        style={{ cursor: 'pointer' }}
        onClick={itemNavigate ? onNavigate : onClick}>{this.itemText(item)}
      </a> </Table.Cell>
  }

  render() {
    const { item, active, onClick, onNavigate } = this.props;
    return (
      <Table.Row active={active}>
        {this.item(item, active, onClick, onNavigate)}
      </Table.Row>
    );
  }

  componentDidMount() {
    this.ensureVisible();
  }

  componentDidUpdate() {
    this.ensureVisible();
  }

  ensureVisible() {
    if (this.cellNode && this.props.active && this.props.scrollIntoView) {
      this.props.scrollIntoView(this.cellNode);
    }
  }
}
