import * as React from 'react';
import { Modal, Segment, Input, Button, Message, Grid,  } from 'semantic-ui-react';
import { StrategyItem } from '../../_db/interfaces';
import { formatNumber } from '../../_db/utils';
import { English } from '../../reducers/language/language_english';


type WeightChangeProps = {
  item: StrategyItem;
  onChange: (item: StrategyItem) => void;
  onCancel: () => void;
  tot:number;
}

export const WeightChange = (props: WeightChangeProps) => {
  const newWeight = useValue((props.item.currentWeight + props.item.suggestedDelta) * 100, 'weight');
  const suggestion = useValue(props.item.suggestedDelta * 100, 'suggestion');
  const [enabled, setEnabled] = React.useState(props.item.suggestionAccepted);

  const error = { ...newWeight.error, ...suggestion.error };
  const hasError = Object.keys(error).some(k => error[k] !== undefined);

  const onChangeSuggestion = (value: number | string) => {
    suggestion.setValue(value);
    if (!isNaN(value as any)) {
      newWeight.setValue(props.item.currentWeight * 100 + parseFloat(value.toString()));
    }
  }
  const onChangeWeight = (value: number | string) => {
    newWeight.setValue(value);
    if (!isNaN(value as any)) {
      suggestion.setValue(parseFloat(value.toString()) - props.item.currentWeight * 100);
    }
  }

  const quantityFactor =  props.tot / props.item.currentPrice /100;
  const amountFactor = props.tot/100;

  return <Modal open>
    <Segment>
      <h1>{props.item.security.SecurityName}</h1>
      <p>{props.item.security.IsinCode} - {props.item.security.MacroAssetClass}</p>
      <div style={{ position: 'absolute', right: 15, top: 15 }}>
        <Button color={enabled ? 'green' : 'red'} onClick={() => { setEnabled(!enabled) }}>{enabled ? 'Accepted' : 'Rejected'}</Button>
      </div>

      <Grid columns="equal" centered celled divided padded>
        <Grid.Row verticalAlign="top">
          <Grid.Column style={{fontSize:'20px'}}>
            Weight
          </Grid.Column>
          <Grid.Column>
            <div>Current (%)</div>
            <Input fluid size="massive" value={`${fmt(props.item.currentWeight * 100, 2)}`} />
          </Grid.Column>
          <Grid.Column>
            <div>Suggestion (%)</div>
            <Input fluid size="massive" value={suggestion.stringValue || ""} onChange={(a, b) => onChangeSuggestion(b.value)} >
              <input style={{color:suggestion.value>0 ?'lightgreen':'red'}} />
            </Input>
            <Input type="range" min={-props.item.currentWeight*100} max={100-props.item.currentWeight*100} value={suggestion.value} onChange={(a, b) => onChangeSuggestion(b.value)}/>
          </Grid.Column>
            <Grid.Column>
              <div>New (%)</div>

              <Input fluid size="massive" error={error.weight} value={newWeight.stringValue || ""} onChange={(a, b) => onChangeWeight(b.value)} />
              <Input type="range" min={0} max={100} value={newWeight.value} onChange={(a, b) => onChangeWeight(b.value)}/>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row verticalAlign="top">
          <Grid.Column style={{fontSize:'20px'}}>
            Quantity
          </Grid.Column>
          <Grid.Column>
            <Input fluid size="huge" value={`${fmt(props.item.currentQuantity , 2)}`} />
          </Grid.Column>
          <Grid.Column>
            <Input fluid size="huge" value={fmt(suggestion.value * quantityFactor,2)}  >
              <input style={{color:suggestion.value>0 ?'lightgreen':'red'}}/>
            </Input>
          </Grid.Column>
            <Grid.Column>
              <Input fluid size="huge" error={error.weight} value={fmt(newWeight.value * quantityFactor,2) }  />
            </Grid.Column>
        </Grid.Row>
        <Grid.Row verticalAlign="top">
          <Grid.Column style={{fontSize:'20px'}}>
            Amount
          </Grid.Column>
          <Grid.Column>
            <Input fluid size="huge" value={`${fmt(props.item.currentAmount , 2)}`} />
          </Grid.Column>
          <Grid.Column>
            <Input fluid size="huge" value={fmt(suggestion.value * amountFactor,2)}  >
              <input style={{color:suggestion.value>0 ?'lightgreen':'red'}} />
            </Input>
          </Grid.Column>
            <Grid.Column>
              <Input fluid size="huge" error={error.weight} value={fmt(newWeight.value * amountFactor,2) }  />
            </Grid.Column>
        </Grid.Row>
      </Grid>


        {hasError && <Message warning>
          <ul>
            {Object.keys(error).map((k, ix) => (<li key={ix}>{error[ix]}</li>))}
          </ul>
        </Message>}
    </Segment>
      <Modal.Actions>
        <Button onClick={props.onCancel}>Cancel</Button>
        <Button disabled={hasError} primary onClick={() => props.onChange({
          ...props.item,
          suggestedDelta: enabled? newWeight.value / 100 - props.item.currentWeight : props.item.suggestedDelta,
          suggestionAccepted: enabled
        })}>Apply</Button>
      </Modal.Actions>
  </Modal>;
  };

const useValue = (value: number, tag: string) => {
  const [stringValue, setStringValue] = React.useState((fmt(value) ).toString());
    const [numValue, setNumValue] = React.useState(parseFloat(fmt(value)));
  const [error, setError] = React.useState<any>({});

  React.useEffect(() => {
    if (isNaN(stringValue as any)) {
        setError({ ...error, weight: `${tag} is not a valid number` });
      }
    else {
      const newValue = parseFloat(stringValue) ;
      if (newValue !== numValue) {
        setNumValue(parseFloat(stringValue));
      setError({...error, weight: undefined });
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [stringValue]);

  return {
        setValue: (value:string|number)=>{
        console.log(`set ${tag} = ${value}`)
      setStringValue(value.toString());
    } ,
    stringValue,
    value: numValue,
    error
  }

}
const fmt = (number: number, digits = 2) => {
  if (number === 0) return "0";
      return formatNumber(English.dictionary.NUMBER_FORMAT)(number, digits);
    }
