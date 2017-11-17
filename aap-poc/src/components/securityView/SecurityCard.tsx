import * as React from "react";
import { Grid, Table, Segment, Statistic, Icon } from "semantic-ui-react";
import { Security } from "../../_db/interfaces";
import { WithLang } from "../../reducers/language/interfaces";
import { getPerformances } from "../../_db/coreEngine";
import { PerformanceChart } from "./PerformanceChart";

export const SecurityCard = ({ security, lang }: { security: Security } & WithLang) => {
    const p = getPerformances([security.IsinCode], '1Y')[security.IsinCode];
    const fmt = new Intl.NumberFormat(lang.NUMBER_FORMAT, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const lastPerf = fmt.format(100 * (p[p.length - 1].perf)) + '%';
    const delta = p[p.length - 1].perf - p[p.length - 2].perf;

    return <Segment padded fluid="very">
        <Segment textAlign="center" basic >
            <h1>{security.SecurityName}</h1>
        </Segment>
        <Grid>
            <Grid.Row columns={2}  >
                <Grid.Column width={8}>
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
                </Grid.Column>
                <Grid.Column width={8}>
                    <PerformanceChart data={p} width={300} lang={lang} version={1} />
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
                {/*
                <Grid.Column width={8}>
                    <Grid>
                        <Grid.Row columns={2} verticalAlign="middle">
                            <Grid.Column textAlign="center"><Icon size="massive" name="line graph" color="blue"/></Grid.Column>
                            <Grid.Column textAlign="center"><Icon size="massive" name="bar graph" color="grey"/></Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={2} verticalAlign="middle">
                            <Grid.Column textAlign="center"><Icon size="massive" name="pie graph" color="brown" /></Grid.Column>
                            <Grid.Column textAlign="center"><Icon size="massive" name="address card" color="olive" /></Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
                */}
            </Grid.Row>
        </Grid>
    </Segment>
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
