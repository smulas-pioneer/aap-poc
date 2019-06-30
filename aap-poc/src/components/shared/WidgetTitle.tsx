import * as React from 'react';
import { Header, SemanticICONS, SemanticCOLORS } from 'semantic-ui-react';
import { ShareButton, Share } from '../Share';

export const WidgetTitle = (props: { size?: 'mini' | 'small' | 'large', title: string, shareButtons?: ShareButton[], subtitle?: string, icon?: SemanticICONS, color?: SemanticCOLORS, style?: React.CSSProperties }) => {
    const { size='large' } = props; 
    
    const as = size==='large' ? 'h2' : size==='small' ? 'h3' : 'h4';
    
    return (
        <Header as={as} color={props.color} icon={props.icon} subheader={props.subtitle} style={props.style} >
            {props.title}
            {props.shareButtons && <Share buttons={props.shareButtons} />}
        </Header>
    )
}
