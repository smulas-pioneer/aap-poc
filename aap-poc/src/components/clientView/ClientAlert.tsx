import { Radar, Client } from "../../_db/interfaces";
import { LangDictionary } from "../../reducers/language/interfaces";
import { List, Segment, Header, Icon, Accordion, Card } from "semantic-ui-react";
import * as React from 'react';
import { REFERENCE_DATE_TODAY } from "../../_db/common/consts";
import moment from 'moment';
import { getColorCustomClassName } from "../../_db/utils";

export const ClientAlert = (props: { radar: Radar, lang: LangDictionary, client: Client, onOpenHistory: () => void, highlighedAlert?: string }) => {
    const { radar, lang } = props;

    const alertsListItem = (prop: string, key: any) => {
        const alert = lang.ALERTS[prop];
        const value = radar[prop];
        return alertItemView(key, value, alert, props.highlighedAlert === alert.name)
    }

    const alertTitle = radar.numOfAlerts === 0 ? lang.NO_ALERTS
        : `${lang.ALERT.name}${radar.numOfAlerts ? ` : ${radar.numOfAlerts} ${lang.ALERT.sentence}` : ''}`

    const actualTitle = props.client.clientStatus === 'ON HOLD'
        ? lang.ONHOLD + ' (' + alertTitle + ')'
        : alertTitle

    const alertColor = props.client.decision === 'ONHOLD' ? 'blue' : radar.numOfAlerts === 0 ? 'green' : radar.riskAdequacyAlert === 'red' ? 'red' : 'orange';

    const dur = moment(REFERENCE_DATE_TODAY).to(moment(props.client.clientStatusAge));
    const title = (
        <Segment basic as="span" size="small">
            <Icon name='alarm' circular inverted color={alertColor} />
            &nbsp;
            <Header key="0" as='h3' style={{ display: 'initial' }} color={alertColor} >
                <Header.Content style={{ marginTop: '4px' }}>{actualTitle}</Header.Content>
            </Header>
            <Icon style={{ float: 'right', cursor: 'pointer' }} name='history' circular onClick={(e: any) => { e.stopPropagation(); props.onOpenHistory() }} />
            <Header floated="right" key="1" as='h3' style={{ display: 'initial' }}>
                <Header.Subheader style={{ marginTop: '4px' }}>
                    {lang.LAST_STATUS}: <b>{lang[props.client.clientStatus]}</b> <small>({props.client.clientStatusAge}, {dur})</small>
                </Header.Subheader>
            </Header>

        </Segment>
    )

    if (true || radar.numOfAlerts) {
        const accordion = [
            {
                key: 'Alert',
                title: { key: 'alertTitle', content: title },
                content: {
                    key: 'alertContent',
                    content: (
                        <Card.Group itemsPerRow="6">
                            {Object.keys(lang.ALERTS).map((v, i) => alertsListItem(v, i))}
                        </Card.Group>
                    )
                }
            }
        ]
        return <Accordion defaultActiveIndex={undefined} panels={accordion} />;
    } else {
        return title;
    }
}

const higlightedStyle: React.CSSProperties = {
    backgroundColor: 'black',
    borderColor: 'yellow',
    transform: "scale(1.05)"
}
const alertItemView = (key: any, value: any, alert: any, higlighted: boolean) => {
    return <Card raised style={{ backgroundColor: 'rgb(25, 30, 36)', ...higlighted && higlightedStyle}} key = { key } >
        <Card.Content >
            <Card.Header><b className={getColorCustomClassName(value)}>{alert.name.toUpperCase()}</b></Card.Header>
            <Card.Description style={{ color: 'white' }}>
                {alert.color === 'green' ? alert.sentence : alert.positiveSentence}
            </Card.Description>
        </Card.Content>
    </Card >
}


const alertItemView_ = (key: any, value: any, alert: any) => {
    return <List.Item key={key}>
        <List.Content style={{ marginBottom: '6px' }}>
            <p style={{ fontSize: "14px" }}>
                <b style={{ minWidth: 150 }} className={getColorCustomClassName(value)}>{alert.name.toUpperCase()}</b>: {alert.sentence}
            </p>
        </List.Content>
    </List.Item>;
}
