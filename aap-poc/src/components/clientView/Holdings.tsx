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
import { strategies } from '../../_db/data/index';

interface Props {
    holdings: StrategyItem[],
    lang: LangDictionary,
    clientId: string,
    onChange: (items: StrategyItem[]) => void;
    onAddSecurity: (props: { securityId: string, clientId: string }) => void;
    onAddHistory?: (props: { clientId: string, notes: string }) => void;
    onShowModel: () => void;
}
interface State {
    addingSecurity: boolean,
    mode: 'Weight' | 'Quantity' | 'Amount'
}

export class Holdings extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { addingSecurity: false, mode: 'Weight' }
    }

    handleItemChanged = (item: StrategyItem, ix: number) => {
        let s = [...this.props.holdings];
        s[ix] = item;
        this.props.onChange(s);
    }

    handleAcceptAll = (accept: boolean) => {
        let s = this.props.holdings.map(h => (
            {
                ...h,
                suggestionAccepted: h.suggestedDelta != 0 ? accept : false
            }));
        this.props.onChange(s);
    }

    render() {
        const { holdings, lang } = this.props;
        const finalWeight = suggestedPosition(holdings);
        const fmt = new Intl.NumberFormat(lang.NUMBER_FORMAT, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        const tot = sumBy(holdings, t => t.currentAmount);
        const accepted = holdings.slice(1).filter(a => a.suggestionAccepted).length;
        const proposed = holdings.slice(1).filter(a => a.suggestedDelta != 0).length;
        const proposeAllColor = accepted == 0 ? 'grey' : accepted == proposed ? 'green' : 'orange';
        const acceptAll = !(accepted == proposed);
        const isValid = finalWeight.filter(h => h.weight < -0.001 || h.weight > 1).length == 0;
        return (
            <div >
                {
                    this.state.addingSecurity && <Spotlight
                        onCancel={() => { this.setState({ addingSecurity: false }) }}
                        onItemNavigate={i => this.setState({ addingSecurity: false }, () => this.props.onAddSecurity({ securityId: (i as Security).IsinCode, clientId: this.props.clientId }))}
                        searchText=""
                        context="Security"
                        limit={12}
                        visible
                    />
                }
                <Menu size='mini'>
                    <Menu.Item onClick={this.props.onShowModel}  ><Icon name="table" />Model</Menu.Item>
                    <Menu.Item ><Icon name="print" />Print</Menu.Item>
                    <Menu.Item ><Icon name="file pdf outline" />Export to Pdf</Menu.Item>
                    <Menu.Item onClick={() => this.setState({ addingSecurity: true })} >
                        <Icon name="add" />
                        Add Security
                    </Menu.Item>
                    <Menu.Menu position="right">
                        <Menu.Item position="right" style={{ color: proposeAllColor }} onClick={() => this.handleAcceptAll(acceptAll)}>
                            <Icon name="check" />
                            Simulate
                        </Menu.Item>
                        {this.props.onAddHistory
                            ? (
                                <ConfirmDialog
                                    title={lang.PROPOSAL_VALIDATION.title}
                                    trigger={<Menu.Item position="right" disabled={!isValid}><Icon name="send" />Send</Menu.Item>}
                                    style={{ border: '2px solid green' }}
                                    onConfirm={() => this.props.onAddHistory!({ clientId: this.props.clientId, notes: lang.PROPOSAL_VALIDATION.title })} >
                                    <OrderList data={holdings} lang={lang} />
                                </ConfirmDialog>
                            ) : <Menu.Item position="right" disabled={!isValid}><Icon name="send" />Send</Menu.Item>
                        }
                    </Menu.Menu>
                </Menu>
                <Table compact size="small">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell style={{ width: '10px' }} ></Table.HeaderCell>
                            <Table.HeaderCell >{lang.SECURITY_NAME}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{lang.ASSET_CLASS}</Table.HeaderCell>
                            <Table.HeaderCell width={2} textAlign="right">{lang.QUANTITY}</Table.HeaderCell>
                            <Table.HeaderCell width={2} textAlign="right">{lang.AMOUNT}</Table.HeaderCell>
                            <Table.HeaderCell width={1} textAlign="right">{lang.WEIGHT}</Table.HeaderCell>
                            <Table.HeaderCell width={1} textAlign="center">
                                <Dropdown text={`${lang.PROPOSE}: ${this.state.mode}`} pointing='left' className='link item'>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => this.setState({ mode: 'Weight' })} >Weight</Dropdown.Item>
                                        <Dropdown.Item onClick={() => this.setState({ mode: 'Quantity' })} >Quantity</Dropdown.Item>
                                        <Dropdown.Item onClick={() => this.setState({ mode: 'Amount' })} >Amount</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                            </Table.HeaderCell>
                            <Table.HeaderCell width={2} textAlign="right">{lang.FINAL_WEIGHT}</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body style={{ overflow: 'visible' }}>
                        {
                            holdings.map((t, i) => {
                                const show = t.currentQuantity != 0;
                                const suggWeight = finalWeight[i].weight;
                                const factor = this.state.mode == 'Weight' ? 1
                                    : this.state.mode == 'Quantity' ? tot / t.currentPrice / 100
                                        : tot / 100;
                                return (!t.newSecurity && t.currentQuantity == 0 && t.suggestedDelta == 0) ? null :
                                    <Table.Row key={i}>
                                        <Table.Cell>
                                            {t.security.blacklisted && <Icon size="large" color="black" name='thumbs down' />}
                                            {t.security.pushed && <Icon size="large" color="green" name='thumbs up' />}
                                            {t.clientFavorites && <Icon size="large" color="red" name='heart' />}
                                        </Table.Cell>
                                        <Table.Cell>{t.security.SecurityName}</Table.Cell>
                                        <Table.Cell>{t.security.MacroAssetClass}</Table.Cell>
                                        <Table.Cell textAlign="right">{show && fmt.format(t.currentQuantity)}</Table.Cell>
                                        <Table.Cell textAlign="right">{show && fmt.format(t.currentAmount)}</Table.Cell>
                                        <Table.Cell textAlign="right">{show && fmt.format(t.currentWeight * 100)} </Table.Cell>
                                        <Table.Cell textAlign="left">
                                            <HoldingWeigthControl factor={factor} data={t} onChange={(item) => this.handleItemChanged(item, i)} />
                                        </Table.Cell>
                                        <Table.Cell error={suggWeight < -0.001 || suggWeight > 1} textAlign="right">{suggWeight !== 0 && fmt.format(suggWeight * 100)}</Table.Cell>
                                    </Table.Row>
                            })
                        }
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell></Table.HeaderCell>
                            <Table.HeaderCell>{lang.TOTAL}</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                            <Table.HeaderCell textAlign="right"></Table.HeaderCell>
                            <Table.HeaderCell textAlign="right">{fmt.format(tot)}</Table.HeaderCell>
                            <Table.HeaderCell textAlign="right">{fmt.format(sumBy(holdings, t => t.currentWeight) * 100)}</Table.HeaderCell>
                            <Table.HeaderCell textAlign="right"></Table.HeaderCell>
                            <Table.HeaderCell textAlign="right">{fmt.format(sumBy(finalWeight, t => t.weight) * 100)}</Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </div>
        )
    }
}

const createEmptyRow = (i: number) => {
    return <Table.Row key={i}>
        {numArray(8).map(j => <Table.Cell key={j} style={{ color: 'white' }}>...</Table.Cell>)}
    </Table.Row>
}

const OrderList = (props: { data: StrategyItem[], lang: LangDictionary }) => {
    const { data, lang } = props;
    const tot = sumBy(data, t => t.currentAmount);

    const fmt = new Intl.NumberFormat(lang.NUMBER_FORMAT, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return <Segment>
        <h4>Orders.</h4>
        <Table compact size="small">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell >{lang.ISIN}</Table.HeaderCell>
                    <Table.HeaderCell >{lang.SECURITY_NAME}</Table.HeaderCell>
                    <Table.HeaderCell >Operation</Table.HeaderCell>
                    <Table.HeaderCell width={2} textAlign="right">{lang.QUANTITY}</Table.HeaderCell>
                    <Table.HeaderCell width={2} textAlign="right">{lang.AMOUNT}</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            {data.filter(i => i.suggestedDelta != 0 && !i.isCash).map((item, ix) => {
                return <Table.Row key={ix}>
                    <Table.Cell >{item.security.IsinCode} </Table.Cell>
                    <Table.Cell >{item.security.SecurityName} </Table.Cell>
                    <Table.Cell >{item.suggestedDelta > 0 ? 'BUY' : 'SELL'} </Table.Cell>
                    <Table.Cell >{fmt.format(item.suggestedDelta * tot/ item.currentPrice)} </Table.Cell>
                    <Table.Cell >{fmt.format(item.suggestedDelta * tot)} </Table.Cell>
                </Table.Row>
            })}

        </Table>
    </Segment>
}
