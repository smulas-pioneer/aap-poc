import * as React from 'react';
import { Modal, Segment, Input, Button, Message, Checkbox, Table, Form, Item, Grid } from 'semantic-ui-react';
import { StrategyItem } from '../../_db/interfaces';


type WeightChangeProps = {
  item: StrategyItem;
  onChange: (item: StrategyItem) => void;
  onCancel: () => void;
}

export const WeightChange = (props: WeightChangeProps) => {
  const newWeight = useValue(props.item.currentWeight + props.item.suggestedDelta, 'weight', 100);
  const [enabled, setEnabled] = React.useState(props.item.suggestionAccepted);

  const error = { ...newWeight.error };
  const hasError = Object.keys(error).some(k => error[k] !== undefined);

  return <Modal open>
    <Segment>
      <h1>{props.item.security.SecurityName}</h1>
      <p>{props.item.security.IsinCode} - {props.item.security.MacroAssetClass}</p>
      <div style={{ position: 'absolute', right: 15, top: 15 }}>
        <Button color={enabled?'green':'red'} onClick={() => { setEnabled(!enabled) }}>{enabled ? 'Enabled' : 'Disabled'}</Button>
      </div>

      <Grid columns="equal" celled>
        <Grid.Row verticalAlign="middle">
          <Grid.Column>Weight</Grid.Column>
          <Grid.Column>current: {`${props.item.currentWeight * 100} %`}</Grid.Column>
          <Grid.Column>new:  <Input size="massive" error={error.weight} value={newWeight.stringValue} onChange={(a, b) => newWeight.setValue(b.value)} /></Grid.Column>
        </Grid.Row>
      </Grid>


      {hasError && <Message warning>
        <ul>
          {Object.keys(error).map((k, ix) => (<li key={ix}>{error[ix]}</li>))}
        </ul>
      </Message>}
    </Segment>
    <Modal.Actions>
      <Button  onClick={props.onCancel}>Cancel</Button>
      <Button disabled={hasError} primary onClick={() => props.onChange({
        ...props.item,
        suggestedDelta: newWeight.value - props.item.currentWeight,
        suggestionAccepted: enabled
      })}>Apply</Button>
    </Modal.Actions>
  </Modal>;
};

const useValue = (value: number, tag: string, factor: number = 1) => {
  const [stringValue, setStringValue] = React.useState((value * factor).toString());

  const [numValue, setNumValue] = React.useState(value);
  const [error, setError] = React.useState<any>({});

  React.useEffect(() => {
    if (isNaN(stringValue as any)) {
      setError({ ...error, weight: `${tag} is not a valid number` });
    }
    else {
      setNumValue(parseFloat(stringValue) / factor);
      setError({ ...error, weight: undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringValue]);

  return {
    setValue: setStringValue,
    stringValue,
    value: numValue,
    error
  }

}
