//@ts-strict-ignore
import L, {type LatLngExpression} from 'leaflet';

import {TrackSymbol} from './trackSymbol.js';
import {type ShapeSetEntry, type ShapeOptions, type TrackSymbolOptions} from './options.js';
import {type Points, type Shape, type ShapeSet, type Units} from './types.js';
import {AISTrackSymbol} from './ais/aisTrackSymbol.js';
import {type AISTrackSymbolOptions} from './ais/options.js';
import {type AISMessage, type Dimension, type ETA, type PositionReport, type ShipStaticData} from './ais/types.js';

export {
    Points,
    Shape,
    ShapeOptions,
    ShapeSet,
    ShapeSetEntry,
    TrackSymbol,
    TrackSymbolOptions,
    Units,
};

export {
    AISMessage,
    AISTrackSymbol,
    AISTrackSymbolOptions,
    Dimension,
    ETA,
    PositionReport,
    ShipStaticData,
};

L['trackSymbol'] = function (latLng: LatLngExpression, options?: TrackSymbolOptions): TrackSymbol {
    return new TrackSymbol(latLng, options);
}
L['TrackSymbol'] = TrackSymbol;

L['aisTrackSymbol'] = function (positionReport: PositionReport, options?: AISTrackSymbolOptions): AISTrackSymbol {
    return new AISTrackSymbol(positionReport, options);
}
L['AISTrackSymbol'] = AISTrackSymbol;

export default TrackSymbol;
