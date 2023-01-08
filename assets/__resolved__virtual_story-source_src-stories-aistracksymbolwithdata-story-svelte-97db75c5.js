const __resolved__virtual_storySource_srcStoriesAistracksymbolwithdataStorySvelte = `<script lang="ts">
    import type {Hst} from '@histoire/plugin-svelte';
    import {onMount} from 'svelte';
    import L, {LayerGroup, Map as LeafletMap} from 'leaflet';
    import {AISTrackSymbol} from '../';
    import type {Dimension, PositionReport, ShipStaticData} from '../';

    interface _PositionReport {
        MessageID?: number;
        RepeatIndicator?: number;
        UserID?: number;
        Valid?: boolean;
        NavigationStatus?: number;
        RateOfTurn?: number;
        Sog?: number;
        PositionAccuracy?: boolean;
        Longitude: number;
        Latitude: number;
        Cog?: number;
        TrueHeading?: number;
        Timestamp?: number;
        SpecialManoeuvreIndicator?: number;
        Spare?: number;
        Raim?: boolean;
        CommunicationState?: number;
    }

    interface _ShipStaticData {
        MessageID?: number;
        RepeatIndicator?: number;
        UserID?: number;
        Valid?: boolean;
        AisVersion?: number;
        ImoNumber?: number;
        CallSign?: string;
        Name?: string;
        Type?: number;
        Dimension?: Dimension;
        FixType?: number;
        MaximumStaticDraught?: number;
        Destination?: string;
        Dte?: boolean;
        Spare?: boolean;
    }

    interface Entry {
        userId: number;
        positionReport?: _PositionReport;
        shipStaticData?: _ShipStaticData;
    }

    interface Entries {
        entries?: Entry[];
    }

    export let Hst: Hst;

    let mapElement: HTMLDivElement;
    let map: LeafletMap;
    let center = [1.251, 103.826];
    let layerGroup: LayerGroup;
    let entries: Entries = {};

    onMount(() => {
        if (!mapElement) {
            return;
        }
        map = L.map(mapElement, {
            center: center,
            zoom: 13,
        });
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
            .addTo(map);

        layerGroup = new LayerGroup();
        layerGroup
            .addTo(map);
    });

    $: {
        if (layerGroup != null) {
            layerGroup.clearLayers();
            if ((entries !== null) && (entries !== undefined)
                && (entries.entries !== null) && (entries.entries !== undefined)) {
                entries.entries.forEach(entry => {
                    if (!entry.positionReport) {
                        return;
                    }
                    let tooltip = entry.userId.toString();
                    const positionReport: PositionReport = {
                        userId: entry.positionReport.UserID,
                        latitude: entry.positionReport.Latitude,
                        longitude: entry.positionReport.Longitude,
                        trueHeading: entry.positionReport.TrueHeading,
                        cog: entry.positionReport.Cog,
                        sog: entry.positionReport.Sog,
                        navigationalStatus: entry.positionReport.NavigationStatus,
                        specialManoeuvreIndicator: entry.positionReport.SpecialManoeuvreIndicator,
                    };
                    let shipStaticData: ShipStaticData | null = null;
                    if (entry.shipStaticData) {
                        shipStaticData = {
                            imoNumber: entry.shipStaticData.ImoNumber,
                            callSign: entry.shipStaticData.CallSign,
                            name: entry.shipStaticData.Name,
                            type: entry.shipStaticData.Type,
                            dimension: entry.shipStaticData.Dimension,
                            fixType: entry.shipStaticData.FixType,
                            maximumStaticDraught: entry.shipStaticData.MaximumStaticDraught,
                            destination: entry.shipStaticData.Destination,
                            dte: entry.shipStaticData.Dte,
                        };
                        if (entry.shipStaticData.Name) {
                            tooltip = entry.shipStaticData.Name;
                        }
                    }
                    const ts = new AISTrackSymbol(positionReport, {
                        shipStaticData: shipStaticData,
                    });
                    ts.bindTooltip(tooltip);
                    ts.addTo(layerGroup);
                });
            }
        }
    }
<\/script>

<style global>
    html,
    body,
    div#app,
    div#app > div,
    div#app > div > div,
    div#map {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }
</style>

<Hst.Story title="AIStrackSymbol (with data)" group="layers">
    <div bind:this={mapElement} id="map">
    </div>

    <svelte:fragment slot="controls">
        <Hst.Json bind:value={entries} title="AIS data (JSON)"/>
    </svelte:fragment>
</Hst.Story>
`;
export {
  __resolved__virtual_storySource_srcStoriesAistracksymbolwithdataStorySvelte as default
};
//# sourceMappingURL=__resolved__virtual_story-source_src-stories-aistracksymbolwithdata-story-svelte-97db75c5.js.map
