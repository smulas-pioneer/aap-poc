import * as React from "react";
import { Radar, Alert } from "../../_db/interfaces";
import { Icon, List, Statistic } from "semantic-ui-react";

const ICONS = {
    'Concentration': 'random',
    'Consistency': 'save',
    'Efficency': 'lab',
    'Risk Adequacy': 'eur',
    'Overlap': 'sitemap',
    'Risk Analysis': 'payment',
}

export const ClientAlerts = (props: { radar: Radar }) => {
    return (
        <div>
            <ClientAlertsIconItem name='Concentration' value={props.radar.concentrationAlert} />
            <ClientAlertsIconItem name='Consistency' value={props.radar.consistencyAlert} />
            <ClientAlertsIconItem name='Efficency' value={props.radar.efficencyAlert} />
            <ClientAlertsIconItem name='Risk Adequacy' value={props.radar.riskAdequacyAlert} />
            <ClientAlertsIconItem name='Overlap' value={props.radar.overlapAlert} />
            <ClientAlertsIconItem name='Risk Analysis' value={props.radar.riskAnalysisAlert} />
        </div>
    )
};

export const ClientAlertsIconItem = (props: { name: string, value: Alert }) => {
    return props.value !== 'green' ? <Icon name={ICONS[props.name]} color={props.value} /> : null
}