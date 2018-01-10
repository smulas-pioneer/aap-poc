import * as React from 'react';
import { appConnector } from 'app-support';
import { getSearchFilter, selectAlertHistory, getLanguage, getSearchResult } from '../../reducers/index';
import { searchClient, getAlertHistory } from '../../actions/index';
import { SearchParms, SearchResult, Client } from '../../_db/interfaces';
import { Segment, Icon, Header, Grid, Table, Menu, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { ClientFilter } from '../shared/ClientFilter';
import { AlertsChart } from './AlertsChart';
import { startCase } from 'lodash';
import { AlertsHistory } from './AlertsHistory';
import { GeoItalyClientsChart } from './GeoItalyClientsChart';
import { MenuPagination } from '../shared/MenuPagination';
import { FilterMapTypes } from '../../actions/model';
import { ItalyMapClientsChart } from './ItalyMapClientsChart';
import { formatAua, formatNumber } from '../../_db/utils';
import { WidgetTitle } from '../shared/WidgetTitle';

const conn = appConnector<{ uid: string, hideGraphs?: boolean, manager?: boolean, showTitle?: boolean, showFilter?: boolean }>()(
    (s, p) => ({
        data: getSearchResult(s, p.uid),
        filter: getSearchFilter(s, p.uid),
        lang: getLanguage(s)
    }),
    {
        searchClient
    }
)

interface AlertsViewState {
    searchParms: SearchParms;
    pageIndex: number;
}

class AlertsViewCompo extends conn.StatefulCompo<AlertsViewState> {
    private static ALERT_PAGE_SIZE = 10;

    constructor(props: any) {
        super(props);
        this.state = {
            pageIndex: 1,
            searchParms: this.props.data && this.props.data.parms || {
                filter: '',
                uid: '',
                onlyWithAlerts: true
            }
        }
        this.search = this.search.bind(this);
        this.handleOnChangeFilter = this.handleOnChangeFilter.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.renderGraphs = this.renderGraphs.bind(this);
        this.renderBreaks = this.renderBreaks.bind(this);
    }

    componentDidMount() {
        if (!this.props.data) {
            this.search();
        }
    }

    componentWillReceiveProps(props: any) {
        // reset paging when new props
        this.setState(prev => ({ pageIndex: 1 }));
    }

    search() {
        this.props.searchClient({ ...this.state.searchParms, uid: this.props.uid });
    }

    handleOnChangeFilter(filter: SearchParms) {
        this.setState(prevState => ({ searchParms: filter }), this.search);
    }

    handleChangePage(pageIndex: number) { this.setState(prev => ({ pageIndex })); }
    renderBreaks(client: Client) {
        return client.breaks.reduce((p, c) => p ? `${p}, ${startCase(c)}` : startCase(c), '');
        // return startCase(client.breaks[0])
    };

    renderTable() {
        const { lang, data, filter, manager, showFilter } = this.props;
        const { searchParms, pageIndex } = this.state;
        const fmt = formatNumber(lang.NUMBER_FORMAT);

        if (!data) return null;

        const start = ((pageIndex - 1) * AlertsViewCompo.ALERT_PAGE_SIZE);
        const resultPage = data.result.slice(start, start + AlertsViewCompo.ALERT_PAGE_SIZE);

        return (
            <Segment.Group>
                <Segment basic style={{ height: '54vh' }} >
                    <WidgetTitle title={lang.MY_ALERTS} shareButtons={['Pdf','Excel','Copy']}/>
                    <Table celled compact striped fixed singleLine  >
                        <Table.Header fullWidth>
                            <Table.Row>
                                <Table.HeaderCell width={2}>{lang.CLIENT_NAME}</Table.HeaderCell>
                                {manager && <Table.HeaderCell width={2}>{lang.MANAGED_BY}</Table.HeaderCell>}
                                <Table.HeaderCell textAlign="right" width={2}>{lang.AUA}</Table.HeaderCell>
                                <Table.HeaderCell width={2} >{lang.LAST_INTERVIEW_DATE}</Table.HeaderCell>
                                <Table.HeaderCell width={2}>{lang.DECISION}</Table.HeaderCell>
                                <Table.HeaderCell>{lang.MODEL}</Table.HeaderCell>
                                <Table.HeaderCell width={1}>{lang.MIFID}</Table.HeaderCell>
                                <Table.HeaderCell width={4}>{lang.DELTA_ANALYSIS}</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {
                                resultPage.map((client, clIndex) =>
                                    <Table.Row key={clIndex}>
                                        <Table.Cell>
                                            <Link to={`/clients/${client.id}`}>
                                                {client.name}
                                            </Link>
                                        </Table.Cell>
                                        {manager && <Table.Cell>{client.agent}</Table.Cell>}
                                        <Table.Cell textAlign="right" >{fmt(client.aua)}</Table.Cell>
                                        <Table.Cell>{client.lastInterviewDate}</Table.Cell>
                                        <Table.Cell>{client.decision}</Table.Cell>
                                        <Table.Cell>{client.modelName}</Table.Cell>
                                        <Table.Cell>{client.mifid}</Table.Cell>

                                        <Table.Cell>
                                            <Popup
                                                key={clIndex}
                                                trigger={<span> {client.deltaAnalysis}</span>}
                                                wide='very'
                                                content={client.deltaAnalysis}
                                                header={lang.DELTA_ANALYSIS}
                                            />

                                        </Table.Cell>

                                    </Table.Row>
                                )
                            }
                        </Table.Body>
                    </Table>
                </Segment>
                <Segment basic>
                    <MenuPagination
                        pageIndex={pageIndex}
                        pageSize={AlertsViewCompo.ALERT_PAGE_SIZE}
                        totalCount={data.result.length}
                        onChangePage={this.handleChangePage}
                    />
                </Segment>
            </Segment.Group>
        );
    }
    renderGraphs() {
        const { hideGraphs, lang, filter, data } = this.props;
        if (hideGraphs) return null;
        return (
            <Grid columns={filter ? 2 : 1}>
                <Grid.Column >
                    <Segment>
                        <h5>Alerts</h5>
                        <AlertsHistory height={400} />
                    </Segment>
                </Grid.Column>
                {filter ?
                    <Grid.Column>
                        <Segment>
                            <h5>Regions</h5>
                            <ItalyMapClientsChart
                                lang={lang}
                                height={400}
                                clients={data!.result}
                                captions={{
                                    clients: lang.TOT_CLIENTS
                                }}
                            />
                        </Segment>
                    </Grid.Column>
                    : null
                }
            </Grid>
        );
    }
    render() {
        const { lang, data, manager, filter, showFilter, showTitle } = this.props;
        const { searchParms } = this.state;

        if (!data || !data.result) return <div />

        let filterMapsValues: FilterMapTypes[] = ['Regions', 'Alerts', 'Agents', 'AlertType', 'Aua', 'Segment'];
        if (!manager) filterMapsValues.splice(2, 1);

        return <div>
            {showTitle &&
                <Segment basic>
                    <Header as='h3'>
                        <Icon name='alarm' color="red" />
                        <Header.Content>
                            Alert List
                        <Header.Subheader content={`This page contains a filterable list of alerts based on current user profile.`} />
                        </Header.Content>
                    </Header>
                </Segment>}

            {showFilter
                ? <Grid>
                    <Grid.Column width={13}>
                        {this.renderTable()}
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <ClientFilter
                            freeFilterText
                            searchPlaceholder={lang.ENTER_FILTER_TEXT}
                            data={filter}
                            filterMaps={filterMapsValues}
                            filterValue={searchParms}
                            onChange={this.handleOnChangeFilter}
                        />
                    </Grid.Column>
                </Grid>
                : this.renderTable()
            }

            {this.renderGraphs()}
        </div>
    }
}
export const AlertsView = conn.connect(AlertsViewCompo);