import * as React from 'react';
import { Modal, Segment, Input, Button, Message, Grid, } from 'semantic-ui-react';
import { StrategyItem } from '../../_db/interfaces';
import { formatNumber } from '../../_db/utils';
import { English } from '../../reducers/language/language_english';


type PopoverChangeProps = {
  item: StrategyItem;
  onChange: (item: StrategyItem) => void;
  onCancel: () => void;
  tot: number;
}

export const PopoverChange = (props: PopoverChangeProps) => {
  const newWeight = useValue((props.item.currentWeight + props.item.suggestedDelta) * 100, 'weight');
  const suggestion = useValue(props.item.suggestedDelta * 100, 'suggestion');
  const [enabled, setEnabled] = React.useState(props.item.suggestionAccepted);

  const error = { ...newWeight.error, ...suggestion.error };
  const hasError = Object.keys(error).some(k => error[k] !== undefined);

  const onChangeSuggestion = (value: number | string) => {
    suggestion.setValue(value);
    if (!isNaN(value as any)) {
      newWeight.setValue(props.item.currentWeight * 100 + parseFloat(value.toString()));
      props.onChange({
        ...props.item,
        suggestedDelta: enabled ? newWeight.value / 100 - props.item.currentWeight : props.item.suggestedDelta,
        suggestionAccepted: enabled
      })
    }
  }
  const onChangeWeight = (value: number | string) => {
    newWeight.setValue(value);
    if (!isNaN(value as any)) {
      suggestion.setValue(parseFloat(value.toString()) - props.item.currentWeight * 100);
    }
  }

  const quantityFactor = props.tot / props.item.currentPrice / 100;
  const amountFactor = props.tot / 100;

  return <div>
    <Input type="range" min={-props.item.currentWeight * 100} max={100 - props.item.currentWeight * 100} value={suggestion.value} onChange={(a, b) => onChangeSuggestion(b.value)} />
    <Input fluid value={suggestion.stringValue || ""} onChange={(a, b) => onChangeSuggestion(b.value)} >
      <input style={{ color: suggestion.value > 0 ? 'lightgreen' : 'red' }} />
    </Input>

  </div>

};

const useValue = (value: number, tag: string) => {
  const [stringValue, setStringValue] = React.useState((fmt(value)).toString());
  const [numValue, setNumValue] = React.useState(parseFloat(fmt(value)));
  const [error, setError] = React.useState<any>({});

  React.useEffect(() => {
    if (isNaN(stringValue as any)) {
      setError({ ...error, weight: `${tag} is not a valid number` });
    }
    else {
      const newValue = parseFloat(stringValue);
      if (newValue !== numValue) {
        setNumValue(parseFloat(stringValue));
        setError({ ...error, weight: undefined });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringValue]);

  return {
    setValue: (value: string | number) => {
      console.log(`set ${tag} = ${value}`)
      setStringValue(value.toString());
    },
    stringValue,
    value: numValue,
    error
  }

}
const fmt = (number: number, digits = 2) => {
  if (number === 0) return "0";
  return formatNumber(English.dictionary.NUMBER_FORMAT)(number, digits);
}
