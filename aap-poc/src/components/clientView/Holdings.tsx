import * as React from 'react';
import { StrategyItem, Security, Radar, RadarStrategyParm } from '../../_db/interfaces';
import { Table, Button, Segment, Menu, Icon, Dropdown } from 'semantic-ui-react';
import { LangDictionary } from '../../reducers/language/interfaces';
import { HoldingWeigthControl } from './HoldingWeightControl';
import { sumBy } from 'lodash';
import { numArray, formatNumber } from '../../_db/utils';
import { Spotlight } from '../spotlight';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { suggestedPosition, getRandomRadar } from '../../_db/common/radarUtils';
import { OverflowItem } from '../shared/GridOverflow';
import { strategies } from '../../_db/data/index';
import { WidgetTitle } from '../shared/WidgetTitle';
import Checkbox from 'semantic-ui-react/dist/commonjs/modules/Checkbox/Checkbox';
import { RadarGraph } from '../RadarGraph';
import { securities } from '../../_db/common/securities';
import { currentId } from 'async_hooks';

interface Props {
    holdings: StrategyItem[],
    lang: LangDictionary,
    clientId: string,
    onChange: (items: StrategyItem[]) => void;
    onAddSecurity: (props: { securityId: string, clientId: string }) => void;
    onAddHistory?: (props: { clientId: string, notes: string }) => void;
    onShowModel: () => void;
    onSomethingChanged: (value: boolean) => void;
    radar?: Radar,
    axes: RadarStrategyParm,

}
interface State {
    addingSecurity: boolean,
    mode: 'Weight' | 'Quantity' | 'Amount',

    holdings: StrategyItem[],
    changedIsin: string[],

    changingSecurity: string | undefined;

}

export class Holdings extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { addingSecurity: false, mode: 'Weight', holdings: props.holdings, changedIsin: [], changingSecurity: undefined }
    }

    componentWillReceiveProps(next: Props) {
        if (JSON.stringify(next.holdings) != JSON.stringify(this.props.holdings)) {
            console.log('replacing the holdings state');
            this.setState({ holdings: next.holdings, changedIsin: [] })
        }
    }
    handleItemChanged = (item: StrategyItem, ix: number) => {
        let holdings = [...this.state.holdings];
        holdings[ix] = item;
        const originalValue = this.props.holdings.find(i => i.security.IsinCode == item.security.IsinCode);
        const changed = originalValue == undefined || originalValue.suggestedDelta != item.suggestedDelta || originalValue.suggestionAccepted != item.suggestionAccepted;
        const changedIsin = changed
            ? this.state.changedIsin.filter(p => p != item.security.IsinCode).concat(item.security.IsinCode)
            : this.state.changedIsin.filter(p => p != item.security.IsinCode)

        this.setState({
            holdings,
            changedIsin
        }, () => {
            this.props.onSomethingChanged(changedIsin.filter(i => i != 'CASH').length > 0);
        });

    }

    handleAcceptAll = (accept: boolean) => {
        let holdings = this.state.holdings.map(h => (
            {
                ...h,
                suggestionAccepted: h.suggestedDelta != 0 ? accept : false,
            }));
        const changedIsin = holdings.filter(i => {
            const pr = this.props.holdings.find(h => h.security.IsinCode == i.security.IsinCode);
            return pr == undefined || pr.suggestedDelta != i.suggestedDelta || pr.suggestionAccepted != i.suggestionAccepted;
        }).map(h => h.security.IsinCode);
        this.setState({
            holdings,
            changedIsin
        }, () => {
            this.props.onSomethingChanged(changedIsin.filter(i => i != 'CASH').length > 0);
        })
    }

    handleOnSimulate = () => {
        this.props.onChange(this.state.holdings);
        //this.props.onToggleSimulation(!this.props.isInSimulationMode);
    }

    handleChangeSecurity = (security: Security) => {
        let holdings = this.state.holdings.map(h => {
            return h.security.IsinCode !== this.state.changingSecurity ? h : {
                security,
                currentAmount: 0,
                currentPrice: 1,
                currentQuantity: 0,
                currentWeight: 0,
                isCash: false,
                fee: 0,
                modelWeight: 0,
                radar: getRandomRadar(),
                suggestedDelta: 0,
                suggestionAccepted: false,
                newSecurity: true,
            }
        });

        this.setState({
            changingSecurity: undefined,
            holdings
        })
    }

    handleOnAddSecurity = (security: Security) => {
        const h: StrategyItem = {
            security,
            currentAmount: 0,
            currentPrice: 1,
            currentQuantity: 0,
            currentWeight: 0,
            isCash: false,
            fee: 0,
            modelWeight: 0,
            radar: getRandomRadar(),
            suggestedDelta: 0,
            suggestionAccepted: false,
            newSecurity: true,
        }

        this.setState({
            addingSecurity: false,
            holdings: [...this.state.holdings, h]
        })
    }

    render() {
        const { lang } = this.props;
        const { holdings } = this.state;
        const finalWeight = suggestedPosition(holdings);
        const fmt = formatNumber(lang.NUMBER_FORMAT);
        const tot = sumBy(holdings, t => t.currentAmount);
        const accepted = holdings.slice(1).filter(a => a.suggestionAccepted).length;
        const proposed = holdings.slice(1).filter(a => a.suggestedDelta != 0).length;
        const canSelectAll = accepted != proposed;

        const somethingIsChanged = this.state.changedIsin.filter(i => i != 'CASH').length == 0;
        const acceptAll = !(accepted == proposed);
        const isValid = finalWeight.filter(h => h.weight < -0.001 || h.weight > 1).length == 0;
        return (
            <div >
                {
                    this.state.addingSecurity && <Spotlight
                        onCancel={() => { this.setState({ addingSecurity: false }) }}
                        onItemNavigate={i => this.handleOnAddSecurity(i as Security)}
                        searchText=""
                        context="Security"
                        limit={12}
                        visible
                    />
                }
                {
                    this.state.changingSecurity && <Spotlight
                        onCancel={() => { this.setState({ addingSecurity: false }) }}
                        onItemNavigate={i => this.handleChangeSecurity(i as Security)}
                        searchText=""
                        context="Security"
                        limit={12}
                        macroAssetClass={holdings.find(s => s.security.IsinCode == this.state.changingSecurity)!.security.MacroAssetClass}
                        visible
                    />
                }


                <Menu size='mini'>
                    <Menu.Item onClick={this.props.onShowModel}  ><Icon name="table" />Model</Menu.Item>
                    <Menu.Item onClick={() => this.setState({ addingSecurity: true })} >
                        <Icon name="add" />
                        Add Security
                    </Menu.Item>
                    <Menu.Item>
                        <Icon name="add" />
                        New Cash
                    </Menu.Item>
                    <Menu.Menu position="right">

                        <ConfirmDialog
                            title={lang.ORDER_LIST}
                            shareButtons={['Excel', 'Copy', 'Pdf']}
                            showOnlyCloseButton
                            trigger={<Menu.Item position="right"><Icon name="list layout" />Show Order List</Menu.Item>}
                            style={{ border: '2px solid green' }}>
                            <OrderList data={holdings} lang={lang} />
                        </ConfirmDialog>

                        <Menu.Item position="right" style={{ color: 'black' }} onClick={() => this.handleAcceptAll(acceptAll)}>
                            <Icon name="check" />
                            {canSelectAll ? 'Select All' : 'UnSelect All'}
                        </Menu.Item>

                        <Menu.Item position="right" disabled={somethingIsChanged} onClick={this.handleOnSimulate} >
                            <Icon name="tv" />
                            Simulate
                        </Menu.Item>

                        {this.props.onAddHistory
                            ? (
                                <ConfirmDialog
                                    title={lang.PROPOSAL_VALIDATION.title}
                                    trigger={<Menu.Item position="right" disabled={!isValid || !somethingIsChanged}><Icon name="send" />Validate</Menu.Item>}
                                    style={{ border: '2px solid green' }}
                                    confirmButton="Accept"
                                    cancelButton="Reject"
                                    customButton={{ text: 'Later', icon: 'forward', color: 'blue' }}
                                    onConfirm={() => this.props.onAddHistory!({ clientId: this.props.clientId, notes: lang.PROPOSAL_VALIDATION.title })} >

                                    <div style={{ width: '100%' }}>
                                        <OrderList data={holdings} lang={lang} />
                                        <RadarGraph data={this.props.radar!} lang={lang} axes={this.props.axes} onClickShape={() => { }} width={700} height={413} alertsAbout={'proposed'} />

                                        <br />
                                        <Checkbox defaultChecked label='Open pdf after generation' />
                                    </div>

                                </ConfirmDialog>
                            ) : <Menu.Item position="right" disabled={!isValid || !somethingIsChanged}><Icon name="send" />Validate</Menu.Item>
                        }


                    </Menu.Menu>
                </Menu>
                <Table compact size="small">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell style={{ width: '10px' }} ></Table.HeaderCell>
                            <Table.HeaderCell >{lang.ISIN}</Table.HeaderCell>
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
                                const suggWeight = finalWeight[i].weight
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
                                        <Table.Cell >{t.security.IsinCode} 
                                        {/*
                                        &nbsp;
                                        {!t.isCash && <Icon onClick={
                                                () => this.setState({ changingSecurity: t.security.IsinCode })
                                            } name="exchange" />}
                                        */}
                                        </Table.Cell>
                                        <Table.Cell>{t.security.SecurityName}
                                        </Table.Cell>
                                        <Table.Cell>{t.security.MacroAssetClass}</Table.Cell>
                                        <Table.Cell textAlign="right">{show && fmt(t.currentQuantity)}</Table.Cell>
                                        <Table.Cell textAlign="right">{show && fmt(t.currentAmount)}</Table.Cell>
                                        <Table.Cell textAlign="right">{show && fmt(t.currentWeight * 100, 0)} </Table.Cell>
                                        <Table.Cell textAlign="left" warning={i != 0 && this.state.changedIsin.indexOf(t.security.IsinCode) > -1}>
                                            <HoldingWeigthControl factor={factor} data={t} onChange={(item) => this.handleItemChanged(item, i)} />
                                        </Table.Cell>
                                        {somethingIsChanged &&
                                            <Table.Cell error={suggWeight < -0.001 || suggWeight > 1} textAlign="right">{suggWeight !== 0 && fmt(suggWeight * 100)}</Table.Cell>
                                        }
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
                            <Table.HeaderCell textAlign="right">{fmt(tot)}</Table.HeaderCell>
                            <Table.HeaderCell textAlign="right">{fmt(sumBy(holdings, t => t.currentWeight) * 100)}</Table.HeaderCell>
                            <Table.HeaderCell textAlign="right"></Table.HeaderCell>
                            <Table.HeaderCell textAlign="right"></Table.HeaderCell>

                            <Table.HeaderCell textAlign="right">{somethingIsChanged && fmt(sumBy(finalWeight, t => t.weight) * 100)}</Table.HeaderCell>

                        </Table.Row>
                    </Table.Footer>
                </Table>
            </div >
        )
    }
}

const createEmptyRow = (i: number) => {
    return <Table.Row key={i}>
        {numArray(8).map(j => <Table.Cell key={j} style={{ color: 'white' }}>...</Table.Cell>)}
    </Table.Row>
}

export const OrderList = (props: { data: StrategyItem[], lang: LangDictionary }) => {
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
                    <Table.HeaderCell >{lang.ISIN}</Table.HeaderCell>
                    <Table.HeaderCell >{lang.SECURITY_NAME}</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center" >Operation</Table.HeaderCell>
                    <Table.HeaderCell width={2} textAlign="right">{lang.QUANTITY}</Table.HeaderCell>
                    <Table.HeaderCell width={2} textAlign="right">{lang.AMOUNT}</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.filter(i => i.suggestedDelta != 0 && !i.isCash).map((item, ix) => {
                    return <Table.Row key={ix}>
                        <Table.Cell >{item.security.IsinCode} </Table.Cell>
                        <Table.Cell >{item.security.SecurityName} </Table.Cell>
                        <Table.Cell textAlign="center" >{item.suggestedDelta > 0 ? 'BUY' : 'SELL'} </Table.Cell>
                        <Table.Cell textAlign="right" >{fmt.format(item.suggestedDelta * tot / item.currentPrice)} </Table.Cell>
                        <Table.Cell textAlign="right">{fmt.format(item.suggestedDelta * tot)} </Table.Cell>
                    </Table.Row>
                })}
            </Table.Body>
        </Table>
    </Segment>
}
