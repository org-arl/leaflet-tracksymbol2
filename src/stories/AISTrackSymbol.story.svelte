<script lang="ts">
    import type {Hst} from '@histoire/plugin-svelte';
    import {onMount} from 'svelte';
    import {Map as LeafletMap, Polyline, TileLayer} from 'leaflet';
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

    let trueHeading1 = 320;
    let cog1 = 45;
    let sog1 = 2.0;
    let trueHeading2 = 120;
    let cog2 = 240;
    let sog2 = 5.0;

    let positionReport1: PositionReport = {
        latitude: p1[0],
        longitude: p1[1],
        trueHeading: trueHeading1,
        cog: cog1,
        sog: sog1,
    };
    let positionReport2: PositionReport = {
        latitude: p2[0],
        longitude: p2[1],
        trueHeading: trueHeading2,
        cog: cog2,
        sog: sog2,
    };

    $: {
        positionReport1.trueHeading = trueHeading1;
        positionReport1.cog = cog1;
        positionReport1.sog = sog1;
        if (ts1) {
            ts1.setPositionReport(positionReport1);
        }
    }
    $: {
        positionReport2.trueHeading = trueHeading2;
        positionReport2.cog = cog2;
        positionReport2.sog = sog2;
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
        map = new LeafletMap(mapElement, {
            center: center,
            zoom: 13,
        });
        new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
            .addTo(map);

        new Polyline([
            [1.239041, 103.806741],
            [1.229, 103.813],
            [1.216015, 103.842335],
        ])
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

        new Polyline([
            [1.235418, 103.831302],
            [1.239, 103.854],
            [1.254821, 103.867138],
        ])
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
        <Hst.Number bind:value={trueHeading1} title="Heading (deg)" />
        <Hst.Number bind:value={cog1} title="COG (deg)" />
        <Hst.Number bind:value={sog1} title="SOG (knots)" />
        <button class="htw-p-2" on:click={() => center = p1}>Locate</button>

        <h3>AISTrackSymbol2</h3>
        <Hst.Number bind:value={trueHeading2} title="Heading (deg)" />
        <Hst.Number bind:value={cog2} title="COG (deg)" />
        <Hst.Number bind:value={sog2} title="SOG (knots)" />
        <button class="htw-p-2" on:click={() => center = p2}>Locate</button>
    </svelte:fragment>
</Hst.Story>
