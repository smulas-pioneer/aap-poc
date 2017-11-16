import * as React from 'react';
import { StrategyItem } from '../../_db/interfaces';
import { Input } from 'semantic-ui-react';

interface EditCellState {
    item: StrategyItem,
    value: string
}
interface EditCellProps {
    data: StrategyItem,
    factor: number,
    onChange: (item: StrategyItem) => void
}

const getValue = (factor: number, s: StrategyItem) => Math.ceil(factor * (s.currentWeight + s.suggestedDelta) * 100000) / 1000

const getStrategyItem = (factor: number, s: StrategyItem, value: number, suggestionAccepted: boolean) => {
    return { ...s, suggestedDelta: (value / 100 / factor) - s.currentWeight, suggestionAccepted };
}

const isDiff = (a: number, b: number) => Math.round(a * 1000) != Math.round(b * 1000);

export class HoldingWeigthControl extends React.Component<EditCellProps, EditCellState> {
    state = {
        item: this.props.data,
        value: getValue(this.props.factor, this.props.data).toString()
    };

    componentWillReceiveProps(next: EditCellProps) {
        const item = getStrategyItem(next.factor, next.data, parseFloat(this.state.value), next.data.suggestionAccepted);
        const value = isDiff(item.suggestedDelta, next.data.suggestedDelta)
            ? getValue(next.factor, next.data).toString()
            : this.state.value
        this.setState({
            item: next.data,
            value
        })
    }

    handleAccept = (accept: boolean) => {
        const item = getStrategyItem(this.props.factor, this.props.data, parseFloat(this.state.value), accept);
        if (JSON.stringify(item) !== JSON.stringify(this.state.item)) {
            this.setState({ item },
                () => {
                    this.props.onChange(item);
                }
            )
        }
    }

    handleOnChange = (value: string) => {
        const item = { ...this.state.item, suggestedDelta: value == '' ? 0 : this.state.item.suggestedDelta }
        this.setState({ value, item }, () => {
            this.handleAccept(item.suggestionAccepted);
        });
    }

    render() {
        const { suggestedDelta, suggestionAccepted, isCash } = this.state.item;
        const action = { icon: 'check', size: 'mini', disabled: isCash, positive: suggestionAccepted, primary: !suggestionAccepted, onClick: () => this.handleAccept(!suggestionAccepted) }
        const suggested = getValue(this.props.factor, this.props.data).toString();
        const showValue = suggestedDelta != 0 || (suggested !== this.state.value && this.state.value !== '');
        const showAction = showValue && this.state.value !== '';

        return !isCash && <Input type="number" size="mini"
            disabled={suggestionAccepted || isCash}
            value={showValue ? this.state.value : ''}
            onChange={(a, b) => this.handleOnChange(b.value)}
            action={showAction && action}
        />
    }
}
