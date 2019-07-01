/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { StrategyItem, Security, Radar, RadarStrategyParm, ClientState } from '../../_db/interfaces';
import { Table, Menu, Icon, Dropdown, Button, Transition, Popup } from 'semantic-ui-react';
import { LangDictionary } from '../../reducers/language/interfaces';
import { sumBy } from 'lodash';
import { formatNumber } from '../../_db/utils';
import { Spotlight } from '../spotlight';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { suggestedPosition, getRandomRadar } from '../../_db/common/radarUtils';
import Checkbox from 'semantic-ui-react/dist/commonjs/modules/Checkbox/Checkbox';
import { RadarGraph } from '../RadarGraph';
import { OrderList } from './OrderList';
import { WeightChange } from './WeightChange';
import { PopoverChange } from './PopoverChange';

interface Props {
  holdings: StrategyItem[],
  lang: LangDictionary,
  clientId: string,
  clientState: ClientState,
  onChange: (items: StrategyItem[]) => void;
  onAddSecurity: (props: { securityId: string, clientId: string }) => void;
  onAddHistory?: (props: { clientId: string, notes: string, status: ClientState }) => void;
  onShowModel: () => void;
  onSomethingChanged: (value: boolean) => void;
  radar?: Radar,
  axes: RadarStrategyParm,

}

export const Holdings = (props: Props) => {
  const [addingSecurity, setAddingSecurity] = React.useState(false);
  const [changingSecurity, setChangingSecurity] = React.useState<string | undefined>(undefined);
  const [mode, setMode] = React.useState<'Weight' | 'Quantity' | 'Amount'>('Weight');
  //const [holdings, setHoldings] = React.useState(props.holdings);
  const [currentHolding, setCurrentHolding] = React.useState<{ item: StrategyItem, index: number } | undefined>(undefined);
  const { onChange } = props;
  const [isProposingMode, setIsProposingMode] = React.useState(false);

  const handleItemChanged = (item: StrategyItem, ix: number) => {
    let holdingsCopy = [...props.holdings];
    holdingsCopy[ix] = item;
    //const originalValue = props.holdings.find(i => i.security.IsinCode === item.security.IsinCode);
    //const changed = originalValue === undefined || originalValue.suggestedDelta !== item.suggestedDelta || originalValue.suggestionAccepted !== item.suggestionAccepted;
    setCurrentHolding(undefined);
    onChange(holdingsCopy);
  }

  const handleAcceptAll = (accept: boolean) => {
    let holdingsCopy = props.holdings.map(h => (
      {
        ...h,
        suggestionAccepted: h.suggestedDelta !== 0 ? accept : false,
      }));
    const changedIsinNewValue = holdingsCopy.filter(i => {
      const pr = props.holdings.find(h => h.security.IsinCode === i.security.IsinCode);
      return pr === undefined || pr.suggestedDelta !== i.suggestedDelta || pr.suggestionAccepted !== i.suggestionAccepted;
    }).map(h => h.security.IsinCode);
    props.onChange(holdingsCopy);
  }


  const handleChangeSecurity = (security: Security) => {
    let holdingsCopy = props.holdings.map(h => {
      return h.security.IsinCode !== changingSecurity ? h : {
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

    setChangingSecurity(changingSecurity);
    props.onChange(holdingsCopy);
  }

  const handleOnAddSecurity = (security: Security) => {
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

    setAddingSecurity(false);
    props.onChange([...props.holdings, h])
  }

  const handleOnAddHistory = (status: ClientState | null, notes?: string) => {
    const { onAddHistory } = props;
    onAddHistory!({ clientId: props.clientId, notes: notes || props.lang.PROPOSAL_VALIDATION.title, status: status || props.clientState });
  }

  const { lang, holdings } = props;
  const finalWeight = suggestedPosition(holdings);
  const fmt = formatNumber(lang.NUMBER_FORMAT);
  const tot = sumBy(holdings, t => t.currentAmount);
  const accepted = holdings.slice(1).filter(a => a.suggestionAccepted).length;
  const proposed = holdings.slice(1).filter(a => a.suggestedDelta !== 0).length;
  const canSelectAll = accepted !== proposed;
  const acceptAll = !(accepted === proposed);
  const isValid = finalWeight.filter(h => h.weight < -0.001 || h.weight > 1).length === 0;

  return (
    <div >
      {
        addingSecurity && <Spotlight
          onCancel={() => { setAddingSecurity(false) }}
          onItemNavigate={i => handleOnAddSecurity(i as Security)}
          searchText=""
          context="Security"
          limit={12}
          visible
        />
      }
      {
        changingSecurity && <Spotlight
          onCancel={() => { setAddingSecurity(false) }}
          onItemNavigate={i => handleChangeSecurity(i as Security)}
          searchText=""
          context="Security"
          limit={12}
          macroAssetClass={holdings.find(s => s.security.IsinCode === changingSecurity)!.security.MacroAssetClass}
          visible
        />
      }
      {
        currentHolding && <WeightChange
          tot={tot}
          item={currentHolding.item}
          onCancel={() => setCurrentHolding(undefined)}
          onChange={(item) => {
            handleItemChanged(item, currentHolding.index);
          }}
        />
      }
      <Menu size='mini'>
        <Menu.Item onClick={props.onShowModel}  ><Icon name="table" />Model</Menu.Item>
        <Menu.Item onClick={() => setAddingSecurity(true)} >
          <Icon name="add" />
          Add Security
        </Menu.Item>
        <Menu.Item>
          <Icon name="add" />
          New Cash
        </Menu.Item>
        {!isProposingMode && <Menu.Menu position="right">
          <Menu.Item onClick={() => setIsProposingMode(true)}  ><Icon name="lightning" />Get Proposals</Menu.Item>
        </Menu.Menu>}
        {isProposingMode && <Menu.Menu position="right">
          <Menu.Item onClick={() => setIsProposingMode(false)}  ><Icon name="close" />Back</Menu.Item>
          <ConfirmDialog
            title={lang.ORDER_LIST}
            shareButtons={['Excel', 'Copy', 'Pdf']}
            showOnlyCloseButton
            trigger={<Menu.Item position="right"><Icon name="list layout" />Show Order List</Menu.Item>}
          >
            <OrderList data={holdings} lang={lang} />
          </ConfirmDialog>

          <Menu.Item position="right" onClick={() => handleAcceptAll(acceptAll)}>
            <Icon name="check" />
            {canSelectAll ? 'Select All' : 'UnSelect All'}
          </Menu.Item>

          {props.onAddHistory
            ? (
              <ConfirmDialog
                title={lang.PROPOSAL_VALIDATION.title}
                trigger={<Menu.Item position="right" disabled={!isValid}><Icon name="send" />Validate</Menu.Item>}
                confirmButton="Accept"
                cancelButton="Reject"
                customButton={{ text: 'Postpone', icon: 'forward', color: 'blue' }}
                onConfirm={() => handleOnAddHistory('PENDING EXECUTION')}
                onCancel={() => handleOnAddHistory('ON HOLD', 'Last proposal rejected')}
                onCustom={() => handleOnAddHistory('PENDING PROPOSAL')} >
                <div style={{ width: '100%' }}>
                  <OrderList data={holdings} lang={lang} />
                  <RadarGraph data={props.radar!} lang={lang} axes={props.axes} onClickShape={() => { }} width={700} height={413} alertsAbout={'proposed'} />
                  <br />
                  <Checkbox defaultChecked label='Open pdf after generation' />
                </div>

              </ConfirmDialog>
            ) : <Menu.Item position="right" disabled={!isValid}><Icon name="send" />Validate</Menu.Item>
          }
        </Menu.Menu>}
      </Menu>
      <Transition animation="pulse" duration={500} visible={true}>


        <Table striped compact size="small">
          <Table.Header>
            <Table.Row>
              {<Table.HeaderCell style={{ width: '6px' }} ></Table.HeaderCell>}
              {<Table.HeaderCell style={{ width: '6px' }} ></Table.HeaderCell>}
              <Table.HeaderCell >{lang.SECURITY_NAME}</Table.HeaderCell>
              <Table.HeaderCell width={1} textAlign="right">{lang.QUANTITY}</Table.HeaderCell>
              <Table.HeaderCell width={2} textAlign="right">{lang.AMOUNT}</Table.HeaderCell>
              <Table.HeaderCell width={1} textAlign="right">{lang.WEIGHT}</Table.HeaderCell>
              {isProposingMode && <Table.HeaderCell width={2} textAlign="center">{lang.PROPOSE}</Table.HeaderCell>}
              {isProposingMode && <Table.HeaderCell width={2} textAlign="right">{lang.FINAL_WEIGHT}</Table.HeaderCell>}
            </Table.Row>
          </Table.Header>
          <Table.Body style={{ overflow: 'visible' }}>
            {
              holdings.sort(holdingsSort).map((t, i) => {
                const show = t.currentQuantity !== 0;
                const suggWeight = finalWeight[i].weight
                const factor = mode === 'Weight' ? 1
                  : mode === 'Quantity' ? tot / t.currentPrice / 100
                    : tot / 100;
                return (!t.newSecurity && t.currentQuantity === 0 && t.suggestedDelta === 0 && !t.isCash) ? null :
                  <Table.Row key={i}>
                    {<Table.Cell>
                      {t.security.blacklisted && <Icon size="large" color="black" name='thumbs down' />}
                      {t.security.pushed && <Icon size="large" color="green" name='thumbs up' />}
                      {t.clientFavorites && <Icon size="large" color="red" name='heart' />}
                    </Table.Cell>}
                    {<Table.Cell>
                      {!t.isCash && <Icon name="exchange" style={{ cursor: 'pointer' }} />}
                    </Table.Cell>}
                    <Table.Cell >

                      <p style={{ padding: 0, margin: 0 }}> {' '}<b>{t.security.SecurityName}</b></p>
                      <p style={{ padding: 0, margin: 0, color: 'lightgrey' }}><small>{t.security.IsinCode} - <i>{t.security.MacroAssetClass}</i></small> </p>
                    </Table.Cell>
                    <Table.Cell textAlign="right">{show && fmt(t.currentQuantity)}</Table.Cell>
                    <Table.Cell textAlign="right">{show && fmt(t.currentAmount) + ' €'} </Table.Cell>
                    <Table.Cell textAlign="right">{show && fmt(t.currentWeight * 100, 0) + ' %'} </Table.Cell>
                    {isProposingMode && <Table.Cell textAlign="right">
                      <div style={{ display: 'flex', flexDirection: 'row' }}>

                        <div
                          onClick={() => setCurrentHolding({ item: t, index: i })}
                          style={{ ...proposalStyle(t.suggestionAccepted, t.suggestedDelta > 0), flex: 1 }}
                        >
                          {t.suggestedDelta > 0 ? '+' : ''} {fmt(t.suggestedDelta * 100)} {t.suggestedDelta !== 0 && ' %'}
                        </div>

                        <Popup wide trigger={<Icon style={{ cursor: 'pointer', flex: 1 }} name="pencil" />} on='click'>
                          <h6></h6>
                          <PopoverChange tot={tot}
                            item={t}
                            onCancel={() => setCurrentHolding(undefined)}
                            onChange={(item) => {
                              handleItemChanged(item, i);
                            }} />
                        </Popup>

                      </div>
                    </Table.Cell>}
                    {isProposingMode &&
                      <Table.Cell error={suggWeight < -0.001 || suggWeight > 1} textAlign="right">{suggWeight !== 0 && fmt(suggWeight * 100) + ' %'}</Table.Cell>
                    }
                  </Table.Row>
              })
            }
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              {<Table.HeaderCell></Table.HeaderCell>}
              {<Table.HeaderCell></Table.HeaderCell>}
              <Table.HeaderCell>{lang.TOTAL}</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell textAlign="right">{fmt(tot)} €</Table.HeaderCell>
              <Table.HeaderCell textAlign="right">{fmt(sumBy(holdings, t => t.currentWeight) * 100)} %</Table.HeaderCell>
              {isProposingMode && <Table.HeaderCell textAlign="right"></Table.HeaderCell>}
              {isProposingMode && <Table.HeaderCell textAlign="right">{fmt(sumBy(finalWeight, t => t.weight) * 100)} %</Table.HeaderCell>}
            </Table.Row>
          </Table.Footer>
        </Table>
      </Transition>
    </div >
  )
}






const holdingsSort = (a: StrategyItem, b: StrategyItem) => {
  if (a.isCash) return -1;
  if (b.isCash) return 1;
  return a.security.MacroAssetClass.localeCompare(b.security.MacroAssetClass);
}


const proposalStyle = (accepted: boolean, positive: boolean): React.CSSProperties => {
  let style: React.CSSProperties = accepted ? { fontWeight: 'bold' } : { color: 'lightgrey' };
  if (accepted) {
    style.color = positive ? 'lightgreen' : 'red';
  }
  return style;
}
