import { StrategyItem } from '../../_db/interfaces';
import { Table, Segment } from 'semantic-ui-react';
import { LangDictionary } from '../../reducers/language/interfaces';
import { sumBy } from 'lodash';
import * as React from 'react';
export const OrderList = (props: {
  data: StrategyItem[];
  lang: LangDictionary;
}) => {
  const { data, lang } = props;
  const tot = sumBy(data, t => t.currentAmount);
  const fmt = new Intl.NumberFormat(lang.NUMBER_FORMAT, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return <Segment attached>
    <Table compact size="small">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>{lang.ISIN}</Table.HeaderCell>
          <Table.HeaderCell>{lang.SECURITY_NAME}</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Operation</Table.HeaderCell>
          <Table.HeaderCell width={2} textAlign="right">{lang.QUANTITY}</Table.HeaderCell>
          <Table.HeaderCell width={2} textAlign="right">{lang.AMOUNT}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.filter(i => i.suggestedDelta !== 0 && !i.isCash).map((item, ix) => {
          return <Table.Row key={ix}>
            <Table.Cell>{item.security.IsinCode} </Table.Cell>
            <Table.Cell>{item.security.SecurityName} </Table.Cell>
            <Table.Cell textAlign="center">{item.suggestedDelta > 0 ? 'BUY' : 'SELL'} </Table.Cell>
            <Table.Cell textAlign="right">{fmt.format(item.suggestedDelta * tot / item.currentPrice)} </Table.Cell>
            <Table.Cell textAlign="right">{fmt.format(item.suggestedDelta * tot)} </Table.Cell>
          </Table.Row>;
        })}
      </Table.Body>
    </Table>
  </Segment>;
};
