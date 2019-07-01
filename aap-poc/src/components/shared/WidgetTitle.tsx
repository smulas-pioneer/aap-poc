import * as React from 'react';
import { Header, SemanticICONS, SemanticCOLORS, Segment } from 'semantic-ui-react';
import { ShareButton, Share } from '../Share';

export const WidgetTitle = (props: {
  size?: 'mini' | 'small' | 'large',
  title: string,
  shareButtons?: ShareButton[],
  subtitle?: string,
  icon?: SemanticICONS,
  color?: SemanticCOLORS,
  style?: React.CSSProperties,
  rightComponent?: any;
}) => {
  const { size = 'large', rightComponent } = props;

  const as = size === 'large' ? 'h2' : size === 'small' ? 'h3' : 'h4';


  return (
    <Segment clearing>
      <Header as={as} color={props.color} icon={props.icon} subheader={props.subtitle} style={props.style} floated={rightComponent ? 'left' : undefined} >
        {props.title}
        {props.shareButtons && <Share buttons={props.shareButtons} />}
      </Header>
      {
        rightComponent && <Header floated='right'>{rightComponent}</Header>
      }
    </Segment>
  )
}
