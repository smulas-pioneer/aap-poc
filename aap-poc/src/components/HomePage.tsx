import * as React from 'react';
import { appConnector } from 'app-support';
import { getLanguage } from '../reducers/index';
import { Card, Grid, Image, Table, Icon, Header } from 'semantic-ui-react';
import * as Model from '../actions/model';
import { Link } from 'react-router-dom';
const paragraphImage = require('./paragraph.png');

export interface HomePageProps {
}
export interface HomePageState {
}

const conn = appConnector<HomePageProps>()(
    (s, p) => ({
        lang: getLanguage(s)
    }),
    {}
)

class HomePage extends conn.StatefulCompo<HomePageState> {
    renderItem(item: Model.MemuItemModel, paragraph?: any) {
        return (<Grid.Column key={item.langProps}>
            <Card as={Link} fluid className={`color${item.color}`} to={item.linkTo || ''}>
                <Card.Content>
                    <Table basic='very' compact="very">
                        <Table.Body>
                            <Table.Row >
                                <Table.Cell verticalAlign="top" collapsing>
                                    <Icon name={item.icon} size="large" circular color={item.color} />
                                </Table.Cell>
                                <Table.Cell singleLine>
                                    <Header size='medium'>
                                        {this.props.lang[item.langProps]}
                                    </Header>
                                    {paragraph || <Image src={paragraphImage} fluid style={{ maxHeight: '190px' }} />}
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Card.Content >
            </Card >
        </Grid.Column>);
    }

    render() {
        return <Table style={{ height: '80vh' }} basic='very'>
            <Table.Body>
                <Table.Row>
                    <Table.Cell>
                        <Grid container columns='equal'>
                            {
                                Model.memuItems.reduce((rows, v, i) => {
                                    if (!v.excludeHomePage) {
                                        if (i === 0 || v.innewline) rows.push([]);
                                        const row = (rows.pop() || []);
                                        row.push(this.renderItem(v));
                                        rows.push(row);
                                    }
                                    return rows;
                                }, [[]] = [] as any).map((v: any, i: any) => <Grid.Row key={i}>{v}</Grid.Row>)
                            }
                        </Grid>
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table >
    }
}

export default conn.connect(HomePage);