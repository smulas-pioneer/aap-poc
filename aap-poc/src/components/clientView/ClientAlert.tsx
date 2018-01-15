import { Radar, Client } from "../../_db/interfaces";
import { LangDictionary } from "../../reducers/language/interfaces";
import { List, Segment, Header, Icon, Accordion } from "semantic-ui-react";
import * as React from 'react';

export const ClientAlert = (props: { radar: Radar, lang: LangDictionary, client: Client }) => {
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

    const title = (
        <Segment basic as="span" >
            <Icon name='alarm' circular inverted color={radar.numOfAlerts ? 'red' : 'green'} />
            &nbsp;

            <Header key="0" as='h2' style={{ display: 'initial' }} color={radar.numOfAlerts ? 'red' : 'green'} >
                {
                    radar.numOfAlerts == 0
                        ? <Header.Content style={{ marginTop: '4px' }}>{lang.NO_ALERTS}</Header.Content>
                        : <Header.Content style={{ marginTop: '4px' }}>{`${lang.ALERT.name}${radar.numOfAlerts ? ` : ${radar.numOfAlerts} ${lang.ALERT.sentence}` : ''}`}</Header.Content>
                }

            </Header>

            <Icon style={{ float: 'right' }} name='history' circular inverted color="black" onClick={(e:any)=>{e.stopPropagation(); alert('hello')}}/>

            <Header floated="right" key="0" as='h2' style={{ display: 'initial' }} color="black">
                <Header.Content style={{ marginTop: '4px' }}>
                    {lang.STATUS} : {props.client.decision}
                </Header.Content>
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
