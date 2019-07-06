import * as React from "react";
import { Grid, Table, Statistic, Icon } from "semantic-ui-react";
import { Security } from "../../_db/interfaces";
import { WithLang } from "../../reducers/language/interfaces";
import { getPerformances } from "../../_db/coreEngine";
import { PerformanceChart } from "../chart/PerformanceChart";

export const SecurityCard = ({ security, lang, height }: { security: Security, height: number } & WithLang) => {
    const p = getPerformances([security.IsinCode], '1Y')[security.IsinCode];
    const fmt = new Intl.NumberFormat(lang.NUMBER_FORMAT, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const lastPerf = fmt.format(100 * (p[p.length - 1].perf)) + '%';
    const delta = p[p.length - 1].perf - p[p.length - 2].perf;

    return <Grid style={{ height: `${height}px` }}>
        <Grid.Row >
            <Grid.Column textAlign="center" >
                <h1>{security.SecurityName}</h1>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row >
            <Grid.Column width={6}>
                <Table compact>
                    <Table.Body>
                        <Item label="Country" value={security.Country} />
                        <Item label="Currency" value={security.Currency} />
                        <Item label="Isin Code" value={security.IsinCode} />
                        <Item label="Kilovar" value={security.Kilovar} />
                        <Item label="Macro Asset Class" value={security.MacroAssetClass} />
                        <Item label="Micro Asset Class" value={security.MicroAssetClass} />
                        <Item label="Maturity" value={security.Maturity} />
                        <Item label="Rating" value={security.Rating} />
                        <Item label="Region" value={security.Region} />
                        <Item label="Sector" value={security.Sector} />
                        <Advise label="Advise" value={security} />
                    </Table.Body>
                </Table>
                <Statistic.Group size="small" widths="1">
                    <Statistic>
                        <Statistic.Value>
                            {lastPerf}
                            {' '}
                            <Icon size="large" name={delta > 0 ? 'triangle up' : 'triangle down'} color={delta > 0 ? 'green' : 'red'} />
                        </Statistic.Value>
                        <Statistic.Label>performance</Statistic.Label>
                    </Statistic>
                </Statistic.Group>
            </Grid.Column>
            <Grid.Column width={10} >
                <div style={{ height: `100%` }}>
                    <PerformanceChart data={p} lang={lang} version={1} actions={false} />
                </div>
            </Grid.Column>
        </Grid.Row>
    </Grid>
}

const Item = (props: { label: string, value: string | null }) => {
    return props.value ? <Table.Row>
        <Table.Cell style={{ fontWeight: 'bold' }} textAlign="right">{props.label}</Table.Cell>
        <Table.Cell>{props.value}</Table.Cell>
    </Table.Row> : null
}

const Advise = (props: { label: string, value: Security }) => {
    return (props.value.blacklisted || props.value.pushed) ? <Table.Row>
        <Table.Cell style={{ fontWeight: 'bold' }} textAlign="right">{props.label}</Table.Cell>
        <Table.Cell>
            {props.value.blacklisted && <Icon color="black" name='thumbs down' />}
            {props.value.pushed && <Icon color="green" name='thumbs up' />}
        </Table.Cell>
    </Table.Row> : null
}
