import * as React from 'react';
import { Header, SemanticICONS, SemanticCOLORS } from 'semantic-ui-react';
import { ShareButton, Share } from '../Share';

export const WidgetTitle = (props: { title: string, shareButtons?: ShareButton[], subtitle?: string, icon?: SemanticICONS, color?: SemanticCOLORS, style?: React.CSSProperties }) => {
    return (
        <Header as="h2" color={props.color} icon={props.icon} subheader={props.subtitle} style={props.style} >
            {props.title}
            {props.shareButtons && <Share buttons={props.shareButtons} />}
        </Header>
    )
}
