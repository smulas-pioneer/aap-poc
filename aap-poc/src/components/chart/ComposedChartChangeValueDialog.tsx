import { round } from "mathjs";
import React, { useState, Fragment } from "react";
import { appConnector } from "app-support";
import { getSearchParms } from "../../reducers";
import { searchClient } from "../../actions";
import { DynamicFilterOperation, DynamicSearchFilter } from "../../_db/interfaces";
import { Dropdown, Input, Button, Modal } from "semantic-ui-react";
import { unCamelCase } from "../../commonUtils";

export interface ComposedChartChangeValueDialogProps {
  uid: string;
  attributeName: string;
  attributeValue: string;
  onClose?: () => void;
  trigger?: React.ReactElement;
}

const conn = appConnector<ComposedChartChangeValueDialogProps>()(
  (s, p) => ({
    parms: getSearchParms(s, p.uid)
  }),
  { searchClient }
);

export const ComposedChartChangeValueDialog = conn.PureCompo(props => {
  const [isOpen, setIsOpen] = useState(!props.trigger);
  const { attributeName, attributeValue, onClose, searchClient, trigger } = props;

  const handleOnChange = ({ attributeName, attributeValue, operation, value }: CustomComposedChartValueChangeData) => {
    if (!operation) {
      handleCancel();
      return;
    }
    let filters = (props.parms && props.parms.dynamicFilters) || [];
    const newFilter: DynamicSearchFilter = {
      context: attributeName,
      key: attributeValue,
      operation,
      value
    }
    // update filter for same context and key (if any)
    const toUpdate = filters.findIndex(f => f.context === newFilter.context && f.key === newFilter.key);
    if (toUpdate !== -1) { filters[toUpdate] = newFilter; }
    else { filters = [...filters, newFilter]; }
    const newParms: any = { ...props.parms, dynamicFilters: filters };

    setIsOpen(false);
    if (onClose) onClose();
    searchClient(newParms);
  }

  const handleCancel = () => {
    setIsOpen(false);
    if (onClose) onClose();
  }

  const currentFilter = props.parms &&
    props.parms.dynamicFilters &&
    props.parms.dynamicFilters.find(f => f.context === attributeName && f.key === attributeValue);

  const ManagedTrigger = () => trigger ? React.cloneElement(trigger, ({ onClick: () => { setIsOpen(true); } })) : <Fragment />;
  return (
    <>
      <ManagedTrigger />
      <Modal size='small' open={isOpen} onClose={() => handleCancel()}>
        <Modal.Header>{unCamelCase(attributeName)} - Add dynamic filter</Modal.Header>
        <Modal.Content>
          <CustomComposedChartValueChange
            onChange={handleOnChange}
            attributeName={attributeName}
            attributeValue={attributeValue}
            defaultOperation={currentFilter && currentFilter.operation}
            defaultValue={currentFilter && currentFilter.value}
          />
        </Modal.Content>
      </Modal>
    </>
  );
});

interface CustomComposedChartValueChangeData {
  attributeName: string;
  attributeValue: string;
  operation?: DynamicFilterOperation;
  value?: number;
}

interface CustomComposedChartValueChangeProps {
  attributeName: string;
  attributeValue: string;
  onChange: (data: CustomComposedChartValueChangeData) => void;
  defaultOperation?: DynamicFilterOperation;
  defaultValue?: number;
}

const CustomComposedChartValueChange = (props: CustomComposedChartValueChangeProps) => {
  const [value, setValue] = React.useState(0);
  const [textValue, setTextValue] = React.useState("0");
  const [operation, setOperation] = React.useState(DynamicFilterOperation.GraterEqualThan);
  const [error, setError] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    props.defaultOperation && setOperation(props.defaultOperation);
    props.defaultValue && setTextValue(`${props.defaultValue * 100}`);
  }, []);

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

  const handleSliderChange = (value: string) => {
    if (!isNaN(value as any)) {
      const numValue = round(parseFloat(value));
      setTextValue(numValue.toString());
    }
  }

  const sendChange = (operation?: DynamicFilterOperation, value?: number) => {
    props.onChange({
      attributeName: props.attributeName,
      attributeValue: props.attributeValue,
      operation,
      value: ((value || 0) / 100)
    });
  }

  const reset = () => {
    setTextValue("0");
    sendChange();
  }

  const operations = [
    {
      key: DynamicFilterOperation.GraterEqualThan,
      text: "greater equal than",
      value: DynamicFilterOperation.GraterEqualThan
    },
    {
      key: DynamicFilterOperation.GreaterThan,
      text: "greater than",
      value: DynamicFilterOperation.GreaterThan
    },
    {
      key: DynamicFilterOperation.LesserEqualThan,
      text: "less equal than",
      value: DynamicFilterOperation.LesserEqualThan
    },
    {
      key: DynamicFilterOperation.LesserThan,
      text: "less than",
      value: DynamicFilterOperation.LesserThan
    },
  ]

  return <div style={{ display: 'flex', flexDirection: 'row', padding: 20 }}>

    <div style={{ flex: 3 }}>
      <h3>{props.attributeValue}</h3>
    </div>

    <div style={{ flex: 3 }}>
      <h3>
        <Dropdown
          inline
          options={operations}
          value={operation}
          onChange={(a, b) => setOperation(b.value as any)}
        />
      </h3>
    </div>

    <div style={{ flex: 2 }}>
      <Input type="range" min={0} max={100} value={value} onChange={(a, b) => handleSliderChange(b.value)} />
    </div>

    <div style={{ flex: 1 }}>
      <Input size="small" inverted fluid value={textValue || ""} onChange={(a, b) => setTextValue(b.value)} >
        <input />
      </Input>
    </div>

    <div style={{ flex: 1, display: 'flex' }}>
      <Button inverted size="small" negative icon="cancel" onClick={() => reset()} />
      <Button inverted size="small" positive icon="check" onClick={() => sendChange(operation, value)} />
    </div>
  </div>
};
