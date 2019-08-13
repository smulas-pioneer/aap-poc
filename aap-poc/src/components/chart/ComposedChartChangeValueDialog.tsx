import React, { useState, Fragment } from "react";
import { appConnector } from "app-support";
import { getSearchParms } from "../../reducers";
import { searchClient } from "../../actions";
import { DynamicFilterOperation, DynamicSearchFilter } from "../../_db/interfaces";
import { Dropdown, Input, Button, Modal, Form } from "semantic-ui-react";
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
      <Modal style={{ width: 600 }} open={isOpen} onClose={() => handleCancel()} >
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

  React.useEffect(() => {
    props.defaultOperation && setOperation(props.defaultOperation);
    props.defaultValue && setTextValue(`${props.defaultValue * 100}`);
  }, [props.defaultOperation, props.defaultValue]);

  React.useEffect(() => {
    if (isNaN(textValue as any)) {
      setTextValue((value || 0).toString());
    }
    else {
      let newValue = parseFloat(textValue);
      if (newValue !== value) {
        if (newValue < 0) setTextValue("0");
        else if (newValue > 100) setTextValue("100");
        else
          setValue(newValue);
      }
    }
  }, [textValue, value]);


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
      key: DynamicFilterOperation.LessEqualThan,
      text: "less equal than",
      value: DynamicFilterOperation.LessEqualThan
    },
    {
      key: DynamicFilterOperation.LessThan,
      text: "less than",
      value: DynamicFilterOperation.LessThan
    },
  ]

  return <div style={{ display: 'flex', flexDirection: 'row', padding: 10 }}>

    <div style={{ textAlign: "right", paddingRight: 10 }}>
      <h2 style={{ color: "#2185d0" }} >{props.attributeValue}</h2>
    </div>

    <div >
      <h2>
        <Dropdown
          inline
          options={operations}
          value={operation}
          onChange={(a, b) => setOperation(b.value as any)}
        />
      </h2>
    </div>

    <div style={{ flex: 1 }}>
      <Form onSubmit={() => sendChange(operation, value)}>
        <Input
          autoFocus
          fluid
          label={{ corner: 'right', content: <h5>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%</h5> }}
          value={textValue || ""}
          onChange={(a, b) => setTextValue(b.value)} >
        </Input>
      </Form>
    </div>

    <div style={{ display: 'flex', alignItems: 'right' }}>
      <Button inverted size="small" negative icon="cancel" onClick={() => reset()} />
      <Button inverted size="small" positive icon="check" onClick={() => sendChange(operation, value)} />
    </div>
  </div >
};
