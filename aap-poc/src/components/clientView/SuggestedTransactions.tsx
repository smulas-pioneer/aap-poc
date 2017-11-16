import * as React from 'react';
import { Transaction } from '../../_db/common/interfaces';
import { Table, Label, Input } from 'semantic-ui-react';
import { LangDictionary } from '../../reducers/language/interfaces';

interface Props {
    transactions: Transaction[],
    lang: LangDictionary
}
interface State { }


export class SuggestedTransactions extends React.Component<Props, State> {

    render() {
        const { transactions, lang } = this.props;
        const fmt = new Intl.NumberFormat(lang.NUMBER_FORMAT, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
        return (
            <Table compact >
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>#</Table.HeaderCell>
                        <Table.HeaderCell>{lang.ISIN}</Table.HeaderCell>
                        <Table.HeaderCell>{lang.SECURITY_NAME}</Table.HeaderCell>
                        <Table.HeaderCell>{lang.ASSET_CLASS}</Table.HeaderCell>
                        <Table.HeaderCell>{lang.QUANTITY}</Table.HeaderCell>
                        <Table.HeaderCell>{lang.TRADE_TYPE}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        transactions.map((t, i) => {
                            return <Table.Row key={i}>
                                <Table.Cell><Input defaultChecked={true} type="checkbox" /> </Table.Cell>
                                <Table.Cell>{t.security.IsinCode}</Table.Cell>
                                <Table.Cell>{t.security.SecurityName}</Table.Cell>
                                <Table.Cell>{t.security.MacroAssetClass}</Table.Cell>
                                <Table.Cell textAlign="right">{fmt.format(t.quantity)}</Table.Cell>
                                <Table.Cell><Label color={t.type == "BUY" ? 'green' : 'orange'}>{t.type}</Label></Table.Cell>
                            </Table.Row>
                        })
                    }
                </Table.Body>
            </Table>
        )
    }
}