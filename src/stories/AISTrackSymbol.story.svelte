<script lang="ts">
    import type {Hst} from '@histoire/plugin-svelte';
    import {onMount} from 'svelte';
    import L, {Map as LeafletMap} from 'leaflet';
    import {AISTrackSymbol} from '@arl/leaflet-tracksymbol2';
    import type {PositionReport} from '@arl/leaflet-tracksymbol2';

    export let Hst: Hst;

    const p1 = [1.229, 103.813];
    const p2 = [1.239, 103.854];

    let mapElement: HTMLDivElement;
    let map: LeafletMap;
    let ts1: AISTrackSymbol;
    let ts2: AISTrackSymbol;
    let center = [1.251, 103.826];

    let positionReport1: PositionReport = {
        latitude: p1[0],
        longitude: p1[1],
        trueHeading: 320,
        cog: 45,
        sog: 2.0,
    };
    let positionReport2: PositionReport = {
        latitude: p2[0],
        longitude: p2[1],
        trueHeading: 120,
        cog: 240,
        sog: 5.0,
    };

    $: {
        positionReport1.trueHeading;
        positionReport1.cog;
        positionReport1.sog;
        if (ts1) {
            ts1.setPositionReport(positionReport1);
        }
    }
    $: {
        positionReport2.trueHeading;
        positionReport2.cog;
        positionReport2.sog;
        if (ts2) {
            ts2.setPositionReport(positionReport2);
        }
    }
    $: {
        if (map) {
            map.setView(center);
        }
    }

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

        ts1 = new AISTrackSymbol(positionReport1, {
            shipStaticData: {
                userId: 123,
                imoNumber: 456,
                callSign: 'ABC',
                name: 'ABC',
                type: 31,
                dimension: {
                    A: 80,
                    B: 30,
                    C: 20,
                    D: 40,
                },
                fixType: 1,
                eta: {
                    month: 2,
                    day: 5,
                    hour: 15,
                    minute: 37,
                },
                destination: "Singapore",
                dte: true,
            },
        });
        ts1.bindTooltip("AISTrackSymbol1");
        ts1
            .addTo(map);

        ts2 = new AISTrackSymbol(positionReport2, {
        });
        ts2.bindTooltip("AISTrackSymbol2");
        ts2
            .addTo(map);
    });
</script>

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

<Hst.Story group="layers">
    <div bind:this={mapElement} id="map">
    </div>

    <svelte:fragment slot="controls">
        <h3>AISTrackSymbol1</h3>
        <Hst.Number bind:value={positionReport1.trueHeading} title="Heading (deg)" />
        <Hst.Number bind:value={positionReport1.cog} title="COG (deg)" />
        <Hst.Number bind:value={positionReport1.sog} title="SOG (knots)" />
        <button class="htw-p-2" on:click={() => center = p1}>Locate</button>

        <h3>AISTrackSymbol2</h3>
        <Hst.Number bind:value={positionReport2.trueHeading} title="Heading (deg)" />
        <Hst.Number bind:value={positionReport2.cog} title="COG (deg)" />
        <Hst.Number bind:value={positionReport2.sog} title="SOG (knots)" />
        <button class="htw-p-2" on:click={() => center = p2}>Locate</button>
    </svelte:fragment>
</Hst.Story>
