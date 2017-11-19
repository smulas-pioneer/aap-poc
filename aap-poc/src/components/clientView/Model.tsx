import * as React from 'react';
import { StrategyItem, Security } from '../../_db/interfaces';
import { Table, Button, Segment, Menu, Icon, Dropdown } from 'semantic-ui-react';
import { LangDictionary } from '../../reducers/language/interfaces';
import { HoldingWeigthControl } from './HoldingWeightControl';
import { sumBy } from 'lodash';
import { numArray } from '../../_db/utils';
import { Spotlight } from '../spotlight';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { suggestedPosition } from '../../_db/common/radarUtils';
import { OverflowItem } from '../shared/GridOverflow';

interface Props {
    holdings: StrategyItem[],
    lang: LangDictionary,
    clientId: string,
    onShowHoldings: () => void;
}
interface State {
    mode: 'Weight' | 'Quantity' | 'Amount'
}

export class Model extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { mode: 'Weight' }
    }


    render() {
        const { holdings, lang } = this.props;
        const fmt = new Intl.NumberFormat(lang.NUMBER_FORMAT, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        const tot = sumBy(holdings, t => t.modelWeight);
        return (
            <div >
                <Menu size='mini'>
                    <Menu.Item onClick={this.props.onShowHoldings}  ><Icon name="table"/>Model</Menu.Item>
                    <Menu.Item ><Icon name="print" />Print</Menu.Item>
                    <Menu.Item ><Icon name="file pdf outline" />Export to Pdf</Menu.Item>
                </Menu>
                <Table compact size="small">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1} style={{width:'10px'}} ></Table.HeaderCell>
                            <Table.HeaderCell width={6}>{lang.SECURITY_NAME}</Table.HeaderCell>
                            <Table.HeaderCell width={6}>{lang.ASSET_CLASS}</Table.HeaderCell>
                            <Table.HeaderCell width={5} textAlign="right">{lang.WEIGHT}</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body style={{overflow:'visible'}}>
                        {
                            holdings.map((t, i) => {
                                return ( t.modelWeight == 0 ) ? null :
                                       <Table.Row key={i}>
                                        <Table.Cell>
                                            {t.security.blacklisted && <Icon size="large" color="black" name='thumbs down' />}
                                            {t.security.pushed && <Icon size="large"  color="green" name='thumbs up' />}
                                            {t.clientFavorites && <Icon size="large"  color="red" name='heart' />}
                                        </Table.Cell>
                                        <Table.Cell>{t.security.SecurityName}</Table.Cell>
                                        <Table.Cell>{t.security.MacroAssetClass}</Table.Cell>
                                        <Table.Cell textAlign="right">{ fmt.format(t.modelWeight * 100)} </Table.Cell>
                                    </Table.Row>
                            })
                        }
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell></Table.HeaderCell>
                            <Table.HeaderCell>{lang.TOTAL}</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                            <Table.HeaderCell textAlign="right">{fmt.format(tot)}</Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </div>
        )
    }
}
