import { Radar, Client } from "../../_db/interfaces";
import { LangDictionary } from "../../reducers/language/interfaces";
import { List, Segment, Header, Icon, Accordion } from "semantic-ui-react";
import * as React from 'react';
import { REFERENCE_DATE_TODAY } from "../../_db/common/consts";
import moment from 'moment';

export const ClientAlert = (props: { radar: Radar, lang: LangDictionary, client: Client, onOpenHistory: () => void }) => {
    const { radar, lang } = props;

    const alertsListItem = (prop: string, key: any) => {
        const alert = lang.ALERTS[prop];
        const value = radar[prop];

        return value !== 'green'
            ? (<List.Item key={key}  >
                <List.Content style={{ marginBottom: '6px' }}>
                    {/*<h3 style={{ color: value === "orange" ? "darkorange" : value }}>*/}
                    <p style={{ color: "black", fontSize: "20px" }}>
                        <b style={{ color: value === "orange" ? "darkorange" : value }}>{alert.name.toUpperCase()}</b> : {alert.sentence}
                    </p>
                    {/* <Statistic size="mini" color={value}  >
                        <Statistic.Value as="p" style={{ textAlign: 'left' }}  >

                        </Statistic.Value>
                    </Statistic> */}
                </List.Content>
            </List.Item>)
            : null;
    }

    const alertTitle = radar.numOfAlerts === 0 ? lang.NO_ALERTS
        : `${lang.ALERT.name}${radar.numOfAlerts ? ` : ${radar.numOfAlerts} ${lang.ALERT.sentence}` : ''}`

    const actualTitle = props.client.clientStatus === 'ON HOLD'
        ? lang.ONHOLD + ' (' + alertTitle + ')'
        : alertTitle

    const alertColor = props.client.decision==='ONHOLD' ? 'blue': radar.numOfAlerts ===0 ? 'green' : radar.riskAdequacyAlert ==='red' ? 'red' : 'orange';
    const dur = moment(REFERENCE_DATE_TODAY).to(moment(props.client.clientStatusAge));
    const title = (
        <Segment basic as="span" >
            <Icon name='alarm' circular inverted color={alertColor} />
            &nbsp;

            <Header key="0" as='h2' style={{ display: 'initial' }} color={alertColor} >
                <Header.Content style={{ marginTop: '4px' }}>{actualTitle}</Header.Content>
            </Header>

            <Icon style={{ float: 'right', cursor: 'pointer' }} name='history' circular color="black" onClick={(e: any) => { e.stopPropagation(); props.onOpenHistory() }} />

            <Header floated="right" key="1" as='h2' style={{ display: 'initial' }} color="black">
                <Header.Subheader style={{ marginTop: '4px' }}>
                    {lang.LAST_STATUS}: <b>{lang[props.client.clientStatus]}</b> <small>({props.client.clientStatusAge}, {dur})</small>
                </Header.Subheader>
            </Header>

        </Segment>
    )

    if (radar.numOfAlerts) {
        const accordion = [
            {
                key: 'Alert',
                title: { key: 'alertTitle', content: title },
                content: {
                    key: 'alertContent',
                    content: (
                        <Segment basic>
                            {Object.keys(lang.ALERTS).map((v, i) => alertsListItem(v, i))}
                        </Segment>
                    )
                }
            }
        ]
        return <Accordion defaultActiveIndex={undefined} panels={accordion} />;
    } else {
        return title;
    }
}
