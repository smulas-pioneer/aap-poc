import * as React from 'react';
import { Icon, IconProps } from 'semantic-ui-react';
import './iconButton.css';
import { Link } from 'react-router-dom';

export interface IconButtonProps extends IconProps {
    floated?: 'right' | 'left';
    to?: string;
}

export interface IconButtonState {
}

export default class IconButton extends React.Component<IconButtonProps, IconButtonState> {
    render() {
        const { floated, to, ...props } = this.props;
        const style = floated ? { float: floated } : {};
        return to
            ? <Link to={to}><Icon {...props} className="iconButton" style={style} /></Link>
            : <Icon  {...props} className="iconButton" style={style} />;
    }
}