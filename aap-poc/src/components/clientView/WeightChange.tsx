import * as React from 'react';
import { Modal, Segment, Input, Button, Message } from 'semantic-ui-react';
import { StrategyItem } from '../../_db/interfaces';


 type WeightChangeProps = {
    item: StrategyItem;
    onChange: (item: StrategyItem) => void;
    onCancel: () => void;
  }
  
export const WeightChange = (props: WeightChangeProps) => {
    const [weight, setWeight] = React.useState(props.item.currentWeight.toString());
    const [weightValue, setWeightValue] = React.useState(props.item.currentWeight);
    const [error, setError] = React.useState<any>({});

    React.useEffect(() => {
        if (isNaN(weight as any)) {
            setError({ ...error, weight: 'Weight is not a correct number' });
        }
        else {
            setWeightValue(parseFloat(weight));
            setError({ ...error, weight: undefined });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [weight]);
    const hasError = Object.keys(error).some(k => error[k] !== undefined);
    
    return <Modal open>
        <Segment>
            <h1>Change Security Weight</h1>
            <span>Weight</span><Input error={error.weight} value={weight} onChange={(a, b) => setWeight(b.value)} />
            {hasError && <Message warning>
                <ul>
                    {Object.keys(error).map((k, ix) => (<li key={ix}>{error[ix]}</li>))}
                </ul>
            </Message>}
        </Segment>
        <Modal.Actions>
            <Button negative onClick={props.onCancel}>Cancel</Button>
            <Button disabled={hasError} positive onClick={() => props.onChange({ ...props.item, currentWeight: weightValue, suggestionAccepted: true })}>Apply</Button>
        </Modal.Actions>
    </Modal>;
};
