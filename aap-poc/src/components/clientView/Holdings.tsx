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
    onChange: (items: StrategyItem[]) => void;
    onAddSecurity: (props: { securityId: string, clientId: string }) => void;
    onAddHistory?: (props: { clientId: string, notes: string }) => void;
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

        const accepted = holdings.slice(1).filter(a => a.suggestionAccepted).length;
        const proposed = holdings.slice(1).filter(a => a.suggestedDelta != 0).length;
        const proposeAllColor = accepted == 0 ? 'grey' : accepted == proposed ? 'green' : 'orange';
        const acceptAll = !(accepted == proposed);
        const isValid = holdings.filter(h => (h.currentWeight + h.suggestedDelta) < 0 || (h.currentWeight + h.suggestedDelta) > 1).length == 0;
        return (
            <div>
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
                                    <h4>{lang.PROPOSAL_VALIDATION.message}</h4>
                                </ConfirmDialog>
                            ) : <Menu.Item position="right" disabled={!isValid}><Icon name="send" />Send</Menu.Item>
                        }
                    </Menu.Menu>
                </Menu>
                <Table compact size="small" as={OverflowItem}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell style={{width:'10px'}} ></Table.HeaderCell>
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
                    <Table.Body style={{overflow:'visible'}}>
                        {
                            holdings.map((t, i) => {
                                const show = t.currentQuantity != 0;
                                const suggWeight = finalWeight[i].weight;
                                const factor = this.state.mode == 'Weight' ? 1
                                    : this.state.mode == 'Quantity' ? t.currentQuantity / t.currentWeight / 100
                                        : t.currentAmount / t.currentWeight / 100;
                                //return (!t.newSecurity && t.currentQuantity == 0 && t.suggestedDelta == 0) ? null :
                                return    <Table.Row key={i}>
                                        <Table.Cell>
                                            {t.security.blacklisted && <Icon size="large" color="black" name='thumbs down' />}
                                            {t.security.pushed && <Icon size="large"  color="green" name='thumbs up' />}
                                            {t.clientFavorites && <Icon size="large"  color="red" name='heart' />}
                                        </Table.Cell>
                                        <Table.Cell>{t.security.SecurityName}</Table.Cell>
                                        <Table.Cell>{t.security.MacroAssetClass}</Table.Cell>
                                        <Table.Cell textAlign="right">{show && fmt.format(t.currentQuantity)}</Table.Cell>
                                        <Table.Cell textAlign="right">{show && fmt.format(t.currentAmount)}</Table.Cell>
                                        <Table.Cell textAlign="right">{show && fmt.format(t.currentWeight * 100)} </Table.Cell>
                                        <Table.Cell textAlign="left">
                                            <HoldingWeigthControl factor={factor} data={t} onChange={(item) => this.handleItemChanged(item, i)} />
                                        </Table.Cell>
                                        <Table.Cell error={suggWeight < 0 || suggWeight > 1} textAlign="right">{suggWeight !== 0 && fmt.format(suggWeight * 100)}</Table.Cell>
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
                            <Table.HeaderCell textAlign="right">{fmt.format(sumBy(holdings, t => t.currentAmount))}</Table.HeaderCell>
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