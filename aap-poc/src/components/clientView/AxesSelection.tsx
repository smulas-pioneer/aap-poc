import * as React from 'react';
import { Segment, Icon, Table } from 'semantic-ui-react';
import { RadarStrategyParm, Radar } from '../../_db/interfaces';
import { getRAG } from '../../_db/common/radarUtils';

interface AxesSelectionProps {
    data: RadarStrategyParm,
    radar: Radar,
    onChange: (parm: RadarStrategyParm) => void
}

export const AxesSelection = (props: AxesSelectionProps) => {
    if (!props.radar) return null;


    const handler = (key: string) => {
        props.onChange({ ...props.data, [key]: !props.data[key] })
    }

    const Item = (props: { name: string, data: RadarStrategyParm, radar: Radar }) => {
        const isActive = props.data[props.name] === true;
        const style: React.CSSProperties = isActive
            ? { color: 'black', fontWeight: 'bold' }
            : { color: 'lightgrey' }
        const delta = props.radar.actual[props.name] - props.radar.proposed[props.name];
        const proposedColor = getRAG (props.radar.proposed[props.name] , props.radar.limits[props.name], props.name=='riskAdequacy');
        return <Table.Row
            onClick={() => handler(props.name)}
            style={style} >
            <Table.Cell>
                {isActive && <Icon name="check" />}
            </Table.Cell>
            <Table.Cell >
                {props.name}
            </Table.Cell>
            <Table.Cell textAlign="right" style={{ color: props.radar[props.name + 'Alert'] }} >
                {Math.round(props.radar.actual[props.name] * 100) / 100}
            </Table.Cell>
            <Table.Cell textAlign="right" style={{ color: proposedColor}}>
                {Math.round(props.radar.proposed[props.name] * 100) / 100}
            </Table.Cell>
            <Table.Cell textAlign="center">
                {delta !== 0 && <Icon name={delta > 0 ? 'triangle up' : 'triangle down'} color={delta > 0 ? 'green' : 'red'} />}
            </Table.Cell>

        </Table.Row>
    }

    return (
        <Segment>
            <h5>Axes</h5>
            <Table  fixed>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell ></Table.HeaderCell>
                        <Table.HeaderCell width={6}>Indicator</Table.HeaderCell>
                        <Table.HeaderCell width={3} textAlign="right" >Actual</Table.HeaderCell>
                        <Table.HeaderCell width={3} textAlign="right" >Proposed</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center" ></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Item name="concentration" {...props} />
                    <Item name="consistency" {...props} />
                    <Item name="efficency" {...props} />
                    <Item name="overlap"  {...props} />
                    <Item name="riskAdequacy"  {...props} />
                    <Item name="riskAnalysis"  {...props} />
                </Table.Body>
            </Table>
        </Segment>
    )
}
