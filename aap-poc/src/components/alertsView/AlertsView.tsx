import * as React from 'react';
import { appConnector } from 'app-support';
import { getSearchFilter, selectAlertHistory, getLanguage, getSearchResult } from '../../reducers/index';
import { searchClient, getAlertHistory } from '../../actions/index';
import { SearchParms, SearchResult, Client } from '../../_db/interfaces';
import { Segment, Icon, Header, Grid, Table, Menu, Popup, SemanticWIDTHS } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { ClientFilter } from '../shared/ClientFilter';
import { AlertsChart } from './AlertsChart';
import { startCase, sortBy, orderBy } from 'lodash';
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
    columnSort?: string;
    sortDirection?: 'ascending' | 'descending';
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
        this.handleSort = this.handleSort.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
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

    handleSort(columnName: string) {
        const { columnSort, sortDirection } = this.state;

        if (columnSort !== columnName) {
            this.setState(prev => ({
                columnSort: columnName,
                sortDirection: 'ascending',
            }));
            return;
        }

        this.setState(prev => {
            if (prev.sortDirection === 'ascending') return ({ sortDirection: 'descending' });
            if (prev.sortDirection === 'descending') return ({ sortDirection: undefined });
            return ({ sortDirection: 'ascending' });
        });
    }

    renderHeader(columnName: string, langKey: string, width?: SemanticWIDTHS, textAlign?: 'center' | 'left' | 'right') {
        return (
            <Table.HeaderCell
                textAlign={textAlign}
                sorted={this.state.columnSort === columnName ? this.state.sortDirection : undefined}
                onClick={() => this.handleSort(columnName)}
                width={width}>
                {langKey}
            </Table.HeaderCell>
        );
    }

    renderTable() {
        const { lang, data, filter, manager, showFilter } = this.props;
        const { searchParms, pageIndex, columnSort, sortDirection } = this.state;
        const fmt = formatNumber(lang.NUMBER_FORMAT);

        if (!data) return null;
        const loSort = sortDirection === 'ascending' ? 'asc' : sortDirection ? 'desc' : false;
        const result = loSort && columnSort ? orderBy(data.result, [columnSort], [loSort]) : data.result;
        const start = ((pageIndex - 1) * AlertsViewCompo.ALERT_PAGE_SIZE);
        const resultPage = result.slice(start, start + AlertsViewCompo.ALERT_PAGE_SIZE);

        return (
            <Segment.Group>
                <Segment basic style={{ height: '54vh' }} >
                    <WidgetTitle title={lang.MY_ALERTS} shareButtons={['Pdf', 'Excel', 'Copy']} />
                    <Table celled compact striped fixed singleLine sortable>
                        <Table.Header fullWidth>
                            <Table.Row>
                                {this.renderHeader('name', lang.CLIENT_NAME, 2)}
                                {manager && <Table.HeaderCell width={2}>{lang.MANAGED_BY}</Table.HeaderCell>}
                                {this.renderHeader('aua', lang.AUA, 2, 'right')}
                                {this.renderHeader('lastInterviewDate', lang.LAST_INTERVIEW_DATE, 1)}
                                {this.renderHeader('clientStatus', lang.STATUS, 2)}
                                {this.renderHeader('clientStatusAge', lang.STATUS_DATE, 1)}
                                {this.renderHeader('modelName', lang.RISKPROFILE, 2)}
                                {this.renderHeader('radar.regulatoryIndicator', lang.REGULATORY_INDICATOR, 2)}
                                {this.renderHeader('radar.guidelineIndicator', lang.GUIDELINE_INDICATOR, 2)}
                                {this.renderHeader('radar.aboveGuidelines', lang.ABOVE_GUIDELINES, 2)}
                                {this.renderHeader('radar.belowGuidelines', lang.BELOW_GUIDELINES, 2)}
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
                                        <Table.Cell>{client.clientStatus}</Table.Cell>
                                        <Table.Cell>{client.clientStatusAge}</Table.Cell>
                                        <Table.Cell>{client.clientRiskProfile}</Table.Cell>
                                        <Table.Cell>{client.regulatoryIndicator == 0 ? '' :fmt( client.regulatoryIndicator,1)}</Table.Cell>
                                        <Table.Cell>{client.guidelineIndicator == 0 ? '' : fmt(client.guidelineIndicator,1)}</Table.Cell>
                                        <Table.Cell>{client.aboveGuidelines == 0 ? '' : fmt(client.aboveGuidelines,1)}</Table.Cell>
                                        <Table.Cell>{client.belowGuidelines == 0 ? '' : fmt(client.belowGuidelines,1)}</Table.Cell>
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