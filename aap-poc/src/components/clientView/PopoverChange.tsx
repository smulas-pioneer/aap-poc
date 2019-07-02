import * as React from 'react';
import { Modal, Segment, Input, Button, Message, Grid, Icon, Checkbox, Item, } from 'semantic-ui-react';
import { StrategyItem } from '../../_db/interfaces';
import { formatNumber } from '../../_db/utils';
import { English } from '../../reducers/language/language_english';
import { debounce } from 'lodash';


type PopoverChangeProps = {
  item: StrategyItem;
  onChange: (item: StrategyItem) => void;
  onCancel: () => void;
  tot: number;
}

export const PopoverChange = (props: PopoverChangeProps) => {
  const suggestion = useValue(props.item.suggestedDelta * 100, 'suggestion');
  const [enabled, setEnabled] = React.useState(props.item.suggestionAccepted);

  const error = { ...suggestion.error };
  const hasError = Object.keys(error).some(k => error[k] !== undefined);


  const sendChange = (value: number) => {
    console.log('send change');
    props.onChange({
      ...props.item,
      suggestedDelta: enabled ? value / 100 : props.item.suggestedDelta,
      suggestionAccepted: enabled
    })
  }


  const onChangeSuggestion = (value: number | string, propagate = false) => {
    suggestion.setValue(value);

    if (propagate && !isNaN(value as any)) {
      sendChange(parseFloat(value.toString()));
    }
  }

  const isChanged = enabled !== props.item.suggestionAccepted || props.item.suggestedDelta !== suggestion.value / 100;


  return <div style={{ display: 'flex', flexDirection: 'column', padding: 5 }}>
    <div style={{ flex: 1, display:'flex' , alignContent:'center'}}>
      <span style={{flex:1,marginRight:3}}>Enabled:</span>
      <a style={{flex:2, cursor:'pointer'}} onClick={()=>setEnabled(!enabled)}>
        <Checkbox checked={enabled} onChange={(a,b)=>setEnabled(b.checked||false)} />
      </a>
    </div>

    <div style={{ flex: 1 }}>
      <Input type="range" min={-props.item.currentWeight * 100} max={100 - props.item.currentWeight * 100} value={suggestion.value} onChange={(a, b) => onChangeSuggestion(b.value)} />

    </div>
    <div style={{ flex: 1, display: 'flex' }}>
      <div style={{ flex: 3, verticalAlign: 'middle' }}>
        <Input size="mini" inverted fluid value={suggestion.stringValue || ""} onChange={debounce((a, b) => onChangeSuggestion(b.value), 600)} >
          <input style={{ color: suggestion.value > 0 ? 'lightgreen' : 'red' }} />
        </Input>
      </div>
      <div style={{ flex: 1, verticalAlign: 'middle', alignContent: 'center' }}>
        <Button inverted disabled={!isChanged} size="mini" negative icon="cancel" onClick={() => onChangeSuggestion(props.item.suggestedDelta * 100, true)} />
      </div>
      <div style={{ flex: 1, verticalAlign: 'middle', alignContent: 'center' }}>
        <Button inverted disabled={!isChanged} size="mini" positive icon="check" onClick={() => sendChange(suggestion.value)} />
      </div>
    </div>
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
