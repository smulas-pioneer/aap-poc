import * as React from "react";
import { Segment } from "semantic-ui-react";
import { isClient, isAgent, isSecurity } from "../../_db/utils";
import { ClientCard } from "../clientsView/ClientCard";
import { SpotlightSearchResultItem } from "../../_db/interfaces";
import { LangDictionary } from "../../reducers/language/interfaces";
import { AgentCard } from "../agentView/AgentCard";
import { SecurityCard } from "../securityView/SecurityCard";
import { AgentGeoPie } from "../agentView/AgentGeoPie";
import { RadarGraph } from "../chart/RadarGraph1";

export const SpotlightResultItemPreview = ({ item, lang, height }: { item: SpotlightSearchResultItem, lang: LangDictionary, height: number }) => {
    if (!item) return null;
    let preview = undefined;

    const childHeight = height -24;

    if (isClient(item)) {
        preview = <>
            <ClientCard client={item} lang={lang} />
            <RadarGraph data={item.radar} width={650} height={childHeight - 160} />
        </>
    } else if (isAgent(item)) {
        preview = <>
            <AgentCard agent={item.name} clients={item.clients} lang={lang} />
            <AgentGeoPie width={650} height={childHeight - 120} clients={item.clients} />
        </>
    } else if (isSecurity(item)) {
        preview = <SecurityCard security={item} lang={lang} height={height - 2} />
    } else {
        preview = <pre>{JSON.stringify(item, null, 2)}</pre>
    }
    return (
        <Segment>
            {preview}
        </Segment >
    );
}