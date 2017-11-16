import * as React from 'react';
import { appConnector } from 'app-support';
import { getSearchResult, getSearchFilter, getAgentView, getLanguage } from '../../reducers/index';
import { searchClient } from '../../actions/index';
import { SearchParms } from '../../_db/interfaces';
import { Segment, Icon, Header, Grid, Card } from 'semantic-ui-react';
import { FilterMapTypes } from '../../actions/model';
import { AgentList } from '../agentView/AgentList';

import { ClientFilter } from '../shared/ClientFilter';
import { AdvancedGrid, OverflowColumn, OverflowItem } from '../shared/GridOverflow';

const conn = appConnector<{ uid: string, showFilter?: boolean, showTitle?: boolean }>()(
    (s, p) => ({
        agentView: getAgentView(s, p.uid),
        filter: getSearchFilter(s, p.uid),
        lang: getLanguage(s)
    }),
    { searchClient }
)

class ManagerViewCompo extends conn.StatefulCompo<{ searchParms: SearchParms }> {

    constructor(props: any) {
        super(props);
        this.state = {
            searchParms: this.props.agentView && this.props.agentView.parms || {
                filter: '',
                uid: ''
            }
        }
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
        const { lang, filter, agentView, showFilter, showTitle } = this.props;
        const { searchParms } = this.state;

        if (!agentView) return <div />
        let filterMaps: FilterMapTypes[] = ['Regions', 'Agents', 'Alerts', 'Aum'];

        return <AdvancedGrid gridTemplateRows="min-content auto">
            {showTitle &&
                <Segment basic>
                    <Header as='h3'>
                        <Icon name='users' color="red" />
                        <Header.Content>
                            Agents List
                            <Header.Subheader content={`Research your agents and access to their profiles`} />
                        </Header.Content>
                    </Header>
                </Segment>}

            {showFilter
                ? <AdvancedGrid gridTemplateColumns="1fr fit-content(30%)">
                    <Card as={OverflowColumn} fluid>
                        <Segment as={OverflowItem}>
                            <AgentList data={agentView.result} lang={lang} />
                        </Segment>
                    </Card>
                    <Card style={{ margin: 0 }} >
                        <ClientFilter
                            freeFilterText={false}
                            searchPlaceholder={lang.ENTER_FILTER_TEXT}
                            data={filter}
                            filterMaps={filterMaps}
                            filterValue={searchParms}
                            onChange={this.handleOnChangeFilter}
                        />
                    </Card>
                </AdvancedGrid>
                : <AgentList data={agentView.result} lang={lang} />
            }
        </AdvancedGrid >
    }
}
export const ManagerView = conn.connect(ManagerViewCompo);