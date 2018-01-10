import * as React from 'react';
import { Confirm, Modal, Button, Icon } from 'semantic-ui-react';
import { WidgetTitle } from './WidgetTitle';
import { ShareButton } from '../Share';

export interface ConfirmDialogProps {
    show?: boolean;
    title?: string;
    content?: JSX.Element;
    trigger?: JSX.Element;
    cancelButton?: string;
    confirmButton?: string;
    showOnlyCloseButton?: boolean;
    onCancel?: () => void;
    onConfirm?: () => void;
    style?: any;

    shareButtons?: ShareButton[]
}

export interface ConfirmDialogState {
    open: boolean;
}

export class ConfirmDialog extends React.Component<ConfirmDialogProps, ConfirmDialogState> {

    constructor(props: ConfirmDialogProps) {
        super(props);
        this.state = { open: props.show || false };

        this.show = this.show.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    componentWillReceiveProps(next: ConfirmDialogProps) {
        this.setState({ open: next.show || false });
    }
    show() { this.setState({ open: true }) }

    handleConfirm() {
        if (this.props.onConfirm) {
            this.props.onConfirm();
        } else {
            this.setState({ open: false })
        }
    }
    handleCancel() {
        if (this.props.onCancel) {
            this.props.onCancel();
        } else {
            this.setState({ open: false })
        }
    }

    render() {
        const { title, trigger, content, children, showOnlyCloseButton, cancelButton, confirmButton, onCancel, onConfirm, style ,shareButtons} = this.props;
        const { open } = this.state;

        let customTrigger = trigger && React.cloneElement(trigger, { onClick: this.show });

        return (
            <Modal trigger={customTrigger} open={open} onClose={this.handleCancel} dimmer={false} style={style}>
                {title && <Modal.Header> <WidgetTitle title={title} shareButtons={shareButtons}/></Modal.Header>}
                <Modal.Content image>
                    {content || children}
                </Modal.Content>
                <Modal.Actions>
                    {
                        showOnlyCloseButton ?
                            <Button color='blue' onClick={this.handleCancel}>
                                <Icon name='checkmark' /> CLOSE
                            </Button> :

                            <Button.Group fluid>

                                <Button color='green' onClick={this.handleConfirm}>
                                    <Icon name='checkmark' /> {confirmButton || 'YES'}
                                </Button>
                                <Button.Or />

                                <Button color='red' onClick={this.handleCancel}>
                                    <Icon name='remove' /> {cancelButton || 'NO'}
                                </Button>

                            </Button.Group>
                    }
                </Modal.Actions>
            </Modal>
        );
    }
}