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

export const SpotlightResultItemPreview = ({ item, lang }: { item: SpotlightSearchResultItem, lang: LangDictionary }) => {
    if (!item) return null;
    let preview = undefined;
    if (isClient(item)) {
        preview = <div> <ClientCard client={item} lang={lang} /> <RadarGraph data={item.radar} width={650} height={320} /> </div>
    } else if (isAgent(item)) {
        preview = <div><AgentCard agent={item.name} clients={item.clients} lang={lang} /><AgentGeoPie width={700} height={325} clients={item.clients} /></div>
    } else if (isSecurity(item)) {
        preview = <SecurityCard security={item} lang={lang} />
    } else {
        preview = <pre>{JSON.stringify(item, null, 2)}</pre>
    }
    return (
        <Segment>
            {preview}
        </Segment >
    );
}