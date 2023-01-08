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

export default TrackSymbol;
