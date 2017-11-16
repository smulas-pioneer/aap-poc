import * as React from 'react';
import { appConnector } from 'app-support';
import { selectAlertHistory, getLanguage } from '../../reducers/index';
import { searchClient, getAlertHistory } from '../../actions/index';
import { SearchParms } from '../../_db/interfaces';
import { Segment, Icon, Header, Grid, Table, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { ClientFilter } from '../shared/ClientFilter';
import { AlertsChart } from './AlertsChart';
import { startCase } from 'lodash';

const conn = appConnector<{ width?: number, height?: number }>()(
    (s, p) => ({
        alertHistory: selectAlertHistory(s),
        lang: getLanguage(s)
    }),
    {
        getAlertHistory
    }
)

class AlertsHistoryCompo extends conn.StatefulCompo<{}> {

    componentDidMount() {
        /*
        if (!this.props.alertHistory && this.props.alertHistory.length) {
            this.props.getAlertHistory();
        }*/
    }

    render() {
        const { lang, alertHistory, width, height } = this.props;
        if (!alertHistory) return null;
        1
        return (
            <AlertsChart data={alertHistory} lang={lang} width={width || 500} height={height || 500} showLegend />
        );
    }
}
export const AlertsHistory = conn.connect(AlertsHistoryCompo);