import * as React from 'react';
import { Input, Button, } from 'semantic-ui-react';
import { StrategyItem } from '../../_db/interfaces';

type PopoverChangeProps = {
  item: StrategyItem;
  onChange: (item: StrategyItem) => void;
  onCancel: () => void;
  tot: number;
}

export const PopoverChange = (props: PopoverChangeProps) => {

  const originalSuggestion = round(props.item.suggestedDelta * 100);
  const [textValue, setTextValue] = React.useState(originalSuggestion.toString());
  const [value, setValue] = React.useState(originalSuggestion);
  const [enabled, setEnabled] = React.useState(props.item.suggestionAccepted);
  const [error, setError] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (isNaN(textValue as any)) {
      setError(`not a valid number`);
    }
    else {
      const newValue = parseFloat(textValue);
      if (newValue !== value) {
        setValue(parseFloat(textValue));
        setError(undefined);
      }
    }
  }, [textValue, value]);


  const sendChange = (value: number, enabled: boolean) => {
    props.onChange({
      ...props.item,
      suggestedDelta: enabled ? value / 100 : props.item.suggestedDelta,
      suggestionAccepted: enabled
    })
  }

  const reset = () => {
    setTextValue(originalSuggestion.toString());
    setEnabled(false);
    sendChange(originalSuggestion, false);
  }

  const isChanged = enabled !== props.item.suggestionAccepted || originalSuggestion !== value;
  const handleSliderChange = (value: string) => {
    if (!isNaN(value as any)) {
      const numValue = round(parseFloat(value) / 10);
      setTextValue(numValue.toString());
    }
  }

  const sliderValue = isNaN(value) ? originalSuggestion : value * 10;
  return <div style={{ display: 'flex', flexDirection: 'column', padding: 5 }}>
    {/*
    <div style={{ flex: 1, display: 'flex', alignContent: 'center' }}>
      <span style={{ flex: 1, marginRight: 3 }}>Enabled:</span>
      <Checkbox checked={enabled} onChange={(a, b) => setEnabled(b.checked || false)} />
    </div>
    */}

    <div style={{ flex: 1 }}>
      <Input type="range" min={-10 * (props.item.currentWeight * 100)} max={1000 - props.item.currentWeight * 1000} value={sliderValue} onChange={(a, b) => handleSliderChange(b.value)} />
    </div>
    <div style={{ flex: 1, display: 'flex' }}>
      <div style={{ flex: 3, verticalAlign: 'middle' }}>
        <Input size="small" inverted fluid value={textValue || ""} onChange={(a, b) => setTextValue(b.value)} >
          <input style={{ color: value > 0 ? 'lightgreen' : 'red' }} />
        </Input>
      </div>
      <div style={{ flex: 1, verticalAlign: 'middle', alignContent: 'center' }}>
        <Button inverted size="small" negative icon="cancel" onClick={() => reset()} />
      </div>
      <div style={{ flex: 1, verticalAlign: 'middle', alignContent: 'center' }}>
        <Button inverted size="small" positive icon="check" onClick={() => sendChange(value, true)} />
      </div>
    </div>
  </div>

};
/*
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
*/

const round = (number: number, dec = 1) => {
  const k = (Math.pow(10, dec));
  return Math.round(number * k) / k;
}

