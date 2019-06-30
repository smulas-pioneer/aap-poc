/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { StrategyItem, Security, Radar, RadarStrategyParm, ClientState } from '../../_db/interfaces';
import { Table, Menu, Icon, Dropdown, Button } from 'semantic-ui-react';
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
  const [holdings, setHoldings] = React.useState(props.holdings);
  const [currentHolding, setCurrentHolding] = React.useState<StrategyItem | undefined>(undefined);
  //  const [changedIsin, setChangedIsin] = React.useState<string[]>([]);
  const { onChange } = props;

  React.useEffect(() => {
    setHoldings(props.holdings);
  }, [props.holdings]);


  React.useEffect(() => {
    onChange(holdings);
  }, [
      holdings, onChange
    ]);


  const handleItemChanged = (item: StrategyItem, ix: number) => {
    let holdingsCopy = [...holdings];
    holdingsCopy[ix] = item;
    const originalValue = props.holdings.find(i => i.security.IsinCode === item.security.IsinCode);
    const changed = originalValue === undefined || originalValue.suggestedDelta !== item.suggestedDelta || originalValue.suggestionAccepted !== item.suggestionAccepted;

    setHoldings(holdingsCopy);
  }

  const handleAcceptAll = (accept: boolean) => {
    let holdingsCopy = holdings.map(h => (
      {
        ...h,
        suggestionAccepted: h.suggestedDelta !== 0 ? accept : false,
      }));
    const changedIsinNewValue = holdingsCopy.filter(i => {
      const pr = props.holdings.find(h => h.security.IsinCode === i.security.IsinCode);
      return pr === undefined || pr.suggestedDelta !== i.suggestedDelta || pr.suggestionAccepted !== i.suggestionAccepted;
    }).map(h => h.security.IsinCode);

    setHoldings(holdingsCopy);
  }


  const handleChangeSecurity = (security: Security) => {
    let holdingsCopy = holdings.map(h => {
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

    setHoldings(holdingsCopy);
    setChangingSecurity(changingSecurity);
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
    setHoldings([...holdings, h])
  }

  const handleOnAddHistory = (status: ClientState | null, notes?: string) => {
    const { onAddHistory } = props;
    onAddHistory!({ clientId: props.clientId, notes: notes || props.lang.PROPOSAL_VALIDATION.title, status: status || props.clientState });
  }

  const { lang } = props;
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
        <Menu.Menu position="right">

          <ConfirmDialog
            title={lang.ORDER_LIST}
            shareButtons={['Excel', 'Copy', 'Pdf']}
            showOnlyCloseButton
            trigger={<Menu.Item position="right"><Icon name="list layout" />Show Order List</Menu.Item>}
            style={{ border: '2px solid green' }}>
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
                style={{ border: '2px solid green' }}

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


        </Menu.Menu>
      </Menu>
      <Table compact size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell style={{ width: '10px' }} ></Table.HeaderCell>
            <Table.HeaderCell >{lang.SECURITY_NAME}</Table.HeaderCell>
            <Table.HeaderCell width={1} textAlign="right">{lang.QUANTITY}</Table.HeaderCell>
            <Table.HeaderCell width={1} textAlign="right">{lang.AMOUNT}</Table.HeaderCell>
            <Table.HeaderCell width={1} textAlign="right">{lang.WEIGHT}</Table.HeaderCell>
            <Table.HeaderCell width={1} textAlign="center">
              <Dropdown text={`${lang.PROPOSE}: ${mode}`} pointing='left' className='link item'>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setMode('Weight')} >Weight</Dropdown.Item>
                  <Dropdown.Item onClick={() => setMode('Quantity')} >Quantity</Dropdown.Item>
                  <Dropdown.Item onClick={() => setMode('Amount')} >Amount</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

            </Table.HeaderCell>
            <Table.HeaderCell width={2} textAlign="right">{lang.FINAL_WEIGHT}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body style={{ overflow: 'visible' }}>
          {
            holdings.map((t, i) => {
              const show = t.currentQuantity !== 0;
              const suggWeight = finalWeight[i].weight
              const factor = mode === 'Weight' ? 1
                : mode === 'Quantity' ? tot / t.currentPrice / 100
                  : tot / 100;
              return (!t.newSecurity && t.currentQuantity === 0 && t.suggestedDelta === 0) ? null :
                <Table.Row key={i}>
                  <Table.Cell>
                    {t.security.blacklisted && <Icon size="large" color="black" name='thumbs down' />}
                    {t.security.pushed && <Icon size="large" color="green" name='thumbs up' />}
                    {t.clientFavorites && <Icon size="large" color="red" name='heart' />}
                  </Table.Cell>
                  <Table.Cell >
                    <p style={{ padding: 0, margin: 0 }}><b>{t.security.SecurityName}</b></p>
                    <p style={{ padding: 0, margin: 0, color: 'lightgrey' }}><small>{t.security.IsinCode} - <i>{t.security.MacroAssetClass}</i></small> </p>
                  </Table.Cell>
                  <Table.Cell textAlign="right">{show && fmt(t.currentQuantity)}</Table.Cell>
                  <Table.Cell textAlign="right">{show && fmt(t.currentAmount)}</Table.Cell>
                  <Table.Cell textAlign="right">{show && fmt(t.currentWeight * 100, 0)} </Table.Cell>
                  <Table.Cell textAlign="left">
                    {/*
                    <HoldingWeigthControl factor={factor} data={t} onChange={(item) => handleItemChanged(item, i)} />
                     */}
                    <Button icon="pencil" onClick={() => setCurrentHolding(t)} />
                    {
                      currentHolding && <WeightChange
                        item={currentHolding}
                        onCancel={() => setCurrentHolding(undefined)}
                        onChange={(item) => {
                          setHoldings([...holdings.splice(0, i), item]);
                          setCurrentHolding(undefined);
                        }}
                      />
                    }
                  </Table.Cell>
                  {
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
            <Table.HeaderCell textAlign="right">{fmt(tot)}</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">{fmt(sumBy(holdings, t => t.currentWeight) * 100)}</Table.HeaderCell>
            <Table.HeaderCell textAlign="right"></Table.HeaderCell>
            <Table.HeaderCell textAlign="right">{fmt(sumBy(finalWeight, t => t.weight) * 100)}</Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </div >
  )
}




export type WeightChangeProps = {
  item: StrategyItem;
  onChange: (item: StrategyItem) => void;
  onCancel: () => void;
}


