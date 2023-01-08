import L from 'leaflet';
import type {LatLngExpression} from 'leaflet';
import {TrackSymbol} from './trackSymbol';
import type {ShapeSetEntry, ShapeOptions, TrackSymbolOptions} from './options';
import type {Points, Shape, ShapeSet, Units} from './types';
import {AISTrackSymbol} from './ais/aisTrackSymbol';
import type {AISTrackSymbolOptions} from './ais/options';
import type {AISMessage, Dimension, ETA, PositionReport, ShipStaticData} from './ais/types';

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

L['trackSymbol'] = function(latLng: LatLngExpression, options?: TrackSymbolOptions): TrackSymbol {
    return new TrackSymbol(latLng, options);
}
L['TrackSymbol'] = TrackSymbol;

L['aisTrackSymbol'] = function(positionReport: PositionReport, options?: AISTrackSymbolOptions): AISTrackSymbol {
    return new AISTrackSymbol(positionReport, options);
}
L['AISTrackSymbol'] = AISTrackSymbol;

export default TrackSymbol;
