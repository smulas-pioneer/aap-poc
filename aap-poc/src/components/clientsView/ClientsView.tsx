import * as React from 'react';
import { appConnector } from 'app-support';
import { getSearchResult, getSearchFilter, getAgentView, getLanguage } from '../../reducers/index';
import { searchClient } from '../../actions/index';
import { SearchParms } from '../../_db/interfaces';
import { Segment, Icon, Header, Grid, Card } from 'semantic-ui-react';
import { FilterMapTypes } from '../../actions/model';
import { AgentList } from '../agentView/AgentList';
import { ClientList } from './ClientList';
import { ClientFilter } from '../shared/ClientFilter';
import { AdvancedGrid, OverflowColumn, OverflowItem } from '../shared/GridOverflow';
import { WidgetTitle } from '../shared/WidgetTitle';

const conn = appConnector<{ uid: string, agent?: string, showFilter?: boolean, showTitle?: boolean }>()(
    (s, p) => ({
        data: getSearchResult(s, p.uid),
        filter: getSearchFilter(s, p.uid),
        lang: getLanguage(s)
    }),
    { searchClient }
)

class ClientsViewCompo extends conn.StatefulCompo<{ searchParms: SearchParms }> {

    constructor(props: any) {
        super(props);


        this.state = {
            searchParms: this.props.data && this.props.data.parms || {
                filter: '',
                uid: ''
            }
        }

        this.state.searchParms.agents = this.props.agent ? [this.props.agent] : undefined;

        this.search = this.search.bind(this);
        this.handleOnChangeFilter = this.handleOnChangeFilter.bind(this);

    }

    componentDidMount() {
        this.search();
    }

    search() {

        this.props.searchClient({ ...this.state.searchParms, uid: this.props.uid });
    }

    handleOnChangeFilter(filter: SearchParms) {
        this.setState(prevState => ({ searchParms: filter }), this.search);
    }

    render() {
        const { data, lang, filter, showFilter, showTitle } = this.props;
        const { searchParms } = this.state;

        if (!data) return <div />
        let filterMaps: FilterMapTypes[] = ['Regions', 'Alerts', 'Aum'];

        return <AdvancedGrid gridTemplateRows="min-content auto">
            {showTitle &&
                <Segment basic>
                    <Header as='h3'>
                        <Icon name='users' color="red" />
                        <Header.Content>
                            {this.props.agent
                                ? `${this.props.agent} client list`
                                : 'Clients List'
                            }
                            <Header.Subheader content={`Research your clients and access to their profiles`} />
                        </Header.Content>
                    </Header>
                </Segment>}

            {showFilter
                ? <AdvancedGrid gridTemplateColumns="auto 250px">
                    <Card as={OverflowColumn} fluid>
                        <Segment as={OverflowItem}>
                            <ClientList data={data.result} lang={lang} />
                        </Segment>
                    </Card>
                    <Segment style={{margin: 0}}>
                        <WidgetTitle title={lang.FILTER} />
                        <ClientFilter
                            freeFilterText
                            searchPlaceholder={lang.ENTER_FILTER_TEXT}
                            data={filter}
                            filterMaps={filterMaps}
                            filterValue={searchParms}
                            onChange={this.handleOnChangeFilter}
                        />
                    </Segment>
                </AdvancedGrid>
                : <ClientList data={data.result} lang={lang} />
            }
        </AdvancedGrid >
    }
}
export const ClientsView = conn.connect(ClientsViewCompo);