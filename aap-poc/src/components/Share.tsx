import * as React from 'react';
import { Dropdown, Icon } from 'semantic-ui-react';

export type ShareButton = 'Email' | 'Pdf' | 'Excel' | 'Image' | 'Print' | 'Copy';

const icons = {
  Email: 'mail',
  Pdf: 'file pdf outline',
  Excel: 'file excel outline',
  Image: 'image',
  Print: 'print',
  Copy: 'copy'
}

interface ShareProps {
  buttons?: ShareButton[]
  pointing?: boolean | 'left' | 'right' | 'top' | 'top left' | 'top right' | 'bottom' | 'bottom left' | 'bottom right';
  text?: string
}

interface ShareState {
}

export class Share extends React.Component<ShareProps, ShareState> {

  render() {
    const { buttons } = this.props;
    if (!buttons) return null;
    const opts = buttons.map((btn, ix) => {
      return { key: ix, text: btn, icon: icons[btn] }
    });
    return <Dropdown style={{ position: 'relative' }} trigger={trigger(this.props.text)} options={opts} pointing={this.props.pointing || 'top left'} icon={null} />
  }
}


const trigger = (text: string = '') => (
  <span>
    <Icon name="share alternate" />
    {text}
  </span>
)
