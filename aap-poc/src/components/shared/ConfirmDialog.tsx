import * as React from 'react';
import { Modal, Button, Icon, SemanticICONS, SemanticCOLORS, Segment } from 'semantic-ui-react';
import { WidgetTitle } from './WidgetTitle';
import { ShareButton } from '../Share';

export interface ConfirmDialogProps {
    show?: boolean;
    title?: string;
    content?: JSX.Element;
    trigger?: JSX.Element;
    customButton?: { text: string, color: SemanticCOLORS, icon: SemanticICONS };
    cancelButton?: string;
    confirmButton?: string;
    showOnlyCloseButton?: boolean;
    onCancel?: () => void;
    onConfirm?: () => void;
    onCustom?: () => void;
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
        this.handleCustom = this.handleCustom.bind(this);
        this.createCustomButton = this.createCustomButton.bind(this);
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

    handleCustom() {
        
        if (this.props.onCustom) {
            this.props.onCustom();
        } else {   
            this.setState({ open: false });
        }
        
    }

   handleClose  = () => {
    this.setState({ open: false });

   }

    private createCustomButton() {
        const { customButton } = this.props;
        if (customButton) {
            return [
                <Button.Or key={1} />,
                <Button key={2} color={customButton.color} onClick={this.handleCustom}>
                    <Icon name={customButton.icon} />{customButton.text}
                </Button>
            ];
        }
        return null;
    }

    render() {
        const { title, trigger, content, children, showOnlyCloseButton, cancelButton, confirmButton, style, shareButtons } = this.props;
        const { open } = this.state;

        let customTrigger = trigger && React.cloneElement(trigger, { onClick: this.show });

        return (
            <Modal
                closeOnDimmerClick={false}
                trigger={customTrigger}
                dimmer
                style={style}
                open={open}
                onClose={this.handleCancel}
            >
                <Modal.Header>
                    <Segment basic clearing style={{ padding: 0 }}>
                        <Button floated="right" size="tiny" basic negative circular icon="remove" onClick={this.handleClose} />
                        {title && <WidgetTitle title={title} shareButtons={shareButtons} style={{ marginTop: 0 }} />}
                    </Segment>
                </Modal.Header>
                <Modal.Content image>
                    {content || children}
                </Modal.Content>
                {!showOnlyCloseButton && <Modal.Actions>
                    <Button.Group fluid>

                        <Button color='green' onClick={this.handleConfirm}>
                            <Icon name='checkmark' /> {confirmButton || 'Yes'}
                        </Button>

                        <Button.Or />

                        <Button color='red' onClick={this.handleCancel}>
                            <Icon name='remove' /> {cancelButton || 'No'}
                        </Button>

                        {this.createCustomButton()}
                    </Button.Group>

                </Modal.Actions>
                }
            </Modal>
        );
    }
}