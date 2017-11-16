import * as React from 'react';
import { Holding } from '../../_db/interfaces';
import { Table } from 'semantic-ui-react';
import { LangDictionary } from '../../reducers/language/interfaces';

interface Props {
    holdings: Holding[],
    lang: LangDictionary,

}
interface State { }


export class Holdings extends React.Component<Props, State> {

    render() {
        const { holdings, lang } = this.props;
        const fmt = new Intl.NumberFormat(lang.NUMBER_FORMAT, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return (
            <Table compact >
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>{lang.ISIN}</Table.HeaderCell>
                        <Table.HeaderCell>{lang.SECURITY_NAME}</Table.HeaderCell>
                        <Table.HeaderCell>{lang.ASSET_CLASS}</Table.HeaderCell>
                        <Table.HeaderCell>{lang.QUANTITY}</Table.HeaderCell>
                        <Table.HeaderCell>{lang.AMOUNT}</Table.HeaderCell>
                        <Table.HeaderCell>{lang.WEIGHT}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        holdings.map((t, i) => {
                            return <Table.Row key={i}>
                                <Table.Cell>{t.securityId}</Table.Cell>
                                <Table.Cell>{t.security!.SecurityName}</Table.Cell>
                                <Table.Cell>{t.security!.MacroAssetClass}</Table.Cell>
                                <Table.Cell textAlign="right">{fmt.format(t.quantity)}</Table.Cell>
                                <Table.Cell textAlign="right">{fmt.format(t.amount)}</Table.Cell>
                                <Table.Cell textAlign="right">{fmt.format(t.weight * 100)}%</Table.Cell>
                            </Table.Row>
                        })
                    }
                </Table.Body>
            </Table>
        )
    }
}