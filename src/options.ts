import {type PathOptions} from 'leaflet';

import {type ShapeSet} from './types.js';

/**
 * Shape set entry.
 */
export interface ShapeSetEntry {
    /** Shape set. */
    shapeSet: ShapeSet;
    /** Minimum zoom level. */
    minZoomLevel: number;
}

/**
 * Shape options.
 */
export interface ShapeOptions {

    /** The length of the leader (unit: s). */
    leaderTime?: number;
    /** Shape set entries. */
    shapeSetEntries?: ShapeSetEntry[];
    /** Default shape set. */
    defaultShapeSet?: ShapeSet;
}

/**
 * Track symbol options.
 */
export interface TrackSymbolOptions
    extends PathOptions {

    /** Initial heading (units: radians from north, clockwise). */
    heading?: number;

    /** Initial course over ground (units: radians from north, clockwise). */
    course?: number;

    /** Initial speed (units: m/s). */
    speed?: number;

    /** Shape options. */
    shapeOptions?: ShapeOptions;
}
