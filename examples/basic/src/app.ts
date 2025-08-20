import {LeafletMap, TileLayer} from 'leaflet';
import {AISTrackSymbol, TrackSymbol} from '@arl/leaflet-tracksymbol2';

import 'leaflet/dist/leaflet.css';

function toRadians(degs: number | null | undefined): number | undefined {
    if ((degs === null) || (degs === undefined)) {
        return undefined;
    }
    return degs * Math.PI / 180;
}

const map = new LeafletMap('map', {
    center: [1.251, 103.826],
    zoom: 13,
});

new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
})
   .addTo(map);

const ts1 = new TrackSymbol([1.229, 103.813], {
    fill: true,
    fillColor: 'yellow',
    fillOpacity: 1,
    heading: toRadians(320),
    course: toRadians(300),
    speed: 5.0,
});
ts1.bindTooltip("TrackSymbol1");
ts1
    .addTo(map);

const ts2 = new TrackSymbol([1.239, 103.854], {
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
    heading: toRadians(120),
    course: toRadians(100),
    speed: 10.0,
});
ts2.bindTooltip("TrackSymbol2");
ts2
    .addTo(map);

const ats1 = new AISTrackSymbol({
    latitude: 1.221,
    longitude: 103.82,
    trueHeading: 320,
    cog: 45,
    sog: 2.0,
}, {
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
ats1.bindTooltip("AISTrackSymbol1");
ats1
    .addTo(map);

const ats2 = new AISTrackSymbol({
    latitude: 1.25,
    longitude: 103.86,
    trueHeading: 120,
    cog: 240,
    sog: 5.0,
});
ats2.bindTooltip("AISTrackSymbol2");
ats2
    .addTo(map);
