import { InterviewResult } from "../../_db/interfaces";
import { LangDictionary } from "../../reducers/language/interfaces";
import * as React from "react";
import { Card, Table, Label, Icon } from "semantic-ui-react";
import * as moment from 'moment';
import IconButton from "../shared/IconButton/index";

const { Timeline, TimelineEvent } = require('react-event-timeline');

const { VerticalTimeline, VerticalTimelineElement } = require('react-vertical-timeline-component');
import 'react-vertical-timeline-component/style.min.css';


interface HistoryViewProps {
    history: InterviewResult[]
    lang: LangDictionary
}

const colors: { [id: string]: 'green' | 'red' | 'olive' } = {
    ACCEPTED: 'green',
    REJECTED: 'red',
    ONGOING: 'olive'
}

const icons: { [id: string]: 'alarm' | 'check' | 'wait' } = {
    ACCEPTED: 'check',
    REJECTED: 'alarm',
    ONGOING: 'wait'
}

export const HistoryView = ({ history, lang }: HistoryViewProps) => {
    return (
        <Card fluid>
            <Card.Content>
                <h5>{lang.HISTORY}</h5>
                <Table basic='very' celled compact size="small">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={2}>{lang.DATE}</Table.HeaderCell>
                            <Table.HeaderCell >{lang.NOTES}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{lang.STATUS}</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Pdf</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {history.map((item, ix) => {
                            return <Table.Row key={ix}>
                                <Table.Cell>{moment(item.date).format(lang.DATE_FORMAT)}</Table.Cell>
                                <Table.Cell>{item.notes}</Table.Cell>
                                <Table.Cell><Label color={colors[item.status]} content={lang[item.status]} /></Table.Cell>
                                <Table.Cell><IconButton circular color='green' inverted name='file pdf outline' /></Table.Cell>
                            </Table.Row>
                        })}
                    </Table.Body>
                </Table>
            </Card.Content>
        </Card>
    )
}

export const HistoryViewTimeline = ({ history, lang }: HistoryViewProps) => {
    return (
        <VerticalTimeline style={{ fontSize: 'smaller' }}>
            {history.reduce((memo, item, ix) => {
                memo.push(<VerticalTimelineElement className="vertical-timeline-element--work"
                    date={moment(item.date).format(lang.DATE_FORMAT)}
                    iconStyle={{ background: colors[item.status], color: '#fff' }}
                    icon={<Icon className="svg" name="home" />}>
                    <h3 className="vertical-timeline-element-title">{item.notes}</h3>
                    <p>{lang.STATUS}: {lang[item.status]} </p>
                </VerticalTimelineElement>,
                    <VerticalTimelineElement className="vertical-timeline-element--work"
                        date={moment(item.date).format(lang.DATE_FORMAT)}
                        iconStyle={{ background: colors[item.status], color: '#fff' }}
                        icon={<Icon className="svg" name="home" />}>
                        <h3 className="vertical-timeline-element-title">{item.notes}</h3>
                        <p>{lang.STATUS}: {lang[item.status]} </p>
                    </VerticalTimelineElement>
                );
                return memo;
            }, [] = [] as any)}
        </VerticalTimeline>
    )
}

export const HistoryViewTimelineEvent = ({ history, lang }: HistoryViewProps) => {
    return (
        <Timeline>
            {history.reduce((memo, item, ix) => {
                memo.unshift(
                    <TimelineEvent key={ix}
                        title=''
                        createdAt={moment(item.date).format(lang.DATE_FORMAT)}
                        icon={<Icon name={icons[item.status]} size="large" style={{ margin: 0 }} />}
                        iconColor={colors[item.status]}
                        container="card"
                        cardHeaderStyle={{ backgroundColor: colors[item.status] }}
                    >
                        <h3>{item.notes}</h3>
                        <p>{lang.STATUS}: {lang[item.status]} </p>
                    </TimelineEvent>
                );
                return memo;
            }, [] = [] as any)}
        </Timeline>
    )
}