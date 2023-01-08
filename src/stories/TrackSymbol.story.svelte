<script lang="ts">
    import type {Hst} from '@histoire/plugin-svelte';
    import {onMount} from 'svelte';
    import L, {Map as LeafletMap} from 'leaflet';
    import TrackSymbol from '../';

    export let Hst: Hst;

    const p1 = [1.229, 103.813];
    const p2 = [1.239, 103.854];

    let mapElement: HTMLDivElement;
    let map: LeafletMap;
    let ts1: TrackSymbol;
    let ts2: TrackSymbol;
    let center = [1.251, 103.826];

    let heading1 = 320;
    let course1 = 45;
    let speed1 = 2.0;
    let heading2 = 120;
    let course2 = 240;
    let speed2 = 5.0

    $: {
        if (ts1) {
            ts1.setHeading(toRadians(heading1));
            ts1.setCourse(toRadians(course1));
            ts1.setSpeed(normalize(speed1));
        }
    }
    $: {
        if (ts2) {
            ts2.setHeading(toRadians(heading2));
            ts2.setCourse(toRadians(course2));
            ts2.setSpeed(normalize(speed2));
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

        ts1 = new TrackSymbol(p1, {
            fill: true,
            fillColor: 'yellow',
            fillOpacity: 1,
            heading: toRadians(heading1),
            course: toRadians(course1),
            speed: normalize(speed1),
        });
        ts1.bindTooltip("TrackSymbol1");
        ts1
            .addTo(map);

        ts2 = new TrackSymbol(p2, {
            fill: true,
            fillColor: 'red',
            fillOpacity: 1,
            shapeOptions: {
                shapeSetEntries: [{
                    shapeSet: {
                        withHeading: {
                            points: [[1, 0.5], [0.75, 1], [0, 1], [0, 0], [0.75, 0]],
                            center: [30, 40],
                            length: 110,
                            breadth: 60,
                            units: "meters",
                        },
                        withoutHeading: TrackSymbol.createShape(TrackSymbol.DEFAULT_NOHEADING_SHAPE_POINTS, 24),
                    },
                    minZoomLevel: 14,
                }],
                defaultShapeSet: TrackSymbol.createShapeSet(24),
            },
            heading: toRadians(heading2),
            course: toRadians(course2),
            speed: normalize(speed2),
        });
        ts2.bindTooltip("TrackSymbol2");
        ts2
            .addTo(map);
    });

    function toRadians(degs: number | null | undefined): number | undefined {
        if ((degs === null) || (degs === undefined)) {
            return undefined;
        }
        return degs * Math.PI / 180;
    }

    function normalize(value: number | null | undefined): number | undefined {
        if ((value === null) || (value === undefined)) {
            return undefined;
        }
        return value;
    }
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
        <h3>TrackSymbol1</h3>
        <Hst.Number bind:value={heading1} title="Heading (deg)" />
        <Hst.Number bind:value={course1} title="Course (deg)" />
        <Hst.Number bind:value={speed1} title="Speed (m/s)" />
        <button class="htw-p-2" on:click={() => center = p1}>Locate</button>

        <h3>TrackSymbol2</h3>
        <Hst.Number bind:value={heading2} title="Heading (deg)" />
        <Hst.Number bind:value={course2} title="Course (deg)" />
        <Hst.Number bind:value={speed2} title="Speed (m/s)" />
        <button class="htw-p-2" on:click={() => center = p2}>Locate</button>
    </svelte:fragment>
</Hst.Story>
