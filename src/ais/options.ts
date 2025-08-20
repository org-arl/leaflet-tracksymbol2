import {type TrackSymbolOptions} from '../options.js';
import {type ShipStaticData} from './types.js';

/**
 * AIS track symbol options.
 */
export interface AISTrackSymbolOptions
    extends TrackSymbolOptions {
    /** The length of the leader (unit: s). */
    leaderTime?: number;
    /** Min zoom level for silhouette. */
    minZoomLevel?: number;
    /** Size (pixels). */
    size?: number;
    /** Ship static data. */
    shipStaticData?: ShipStaticData;
}
