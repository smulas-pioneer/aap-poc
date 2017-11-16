import * as React from 'react';
import { Segment } from 'semantic-ui-react';

export class ResizableSegment extends React.Component<any, any>{
    render (){
        return <Segment>
                {this.props.children}
            </Segment>
    }
}