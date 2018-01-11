import * as React from 'react';
import { Header, SemanticICONS, SemanticCOLORS } from 'semantic-ui-react';
import { ShareButton, Share } from '../Share';

export const WidgetTitle = (props: { title: string, shareButtons?: ShareButton[], subtitle?: string, icon?: SemanticICONS, color?: SemanticCOLORS }) => {
    return (
        <Header as="h2" floated="left" color={props.color} icon={props.icon} subheader={props.subtitle} >
            {props.title}
            {props.shareButtons && <Share buttons={props.shareButtons} />}
        </Header>
    )
}
