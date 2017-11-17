import * as React from 'react';
import { Header, SemanticICONS, SemanticCOLORS } from 'semantic-ui-react';

export const WidgetTitle = (props: { title: string, subtitle?: string, icon?: SemanticICONS, color?: SemanticCOLORS }) => {
    return (<Header as="h2" color={props.color} icon={props.icon} content={props.title} subheader={props.subtitle} />)
}
