import L from 'leaflet';
import type {LatLngExpression} from 'leaflet';
import {TrackSymbol} from './trackSymbol';
import type {TrackSymbolOptions} from './options';

export {
    TrackSymbol,
    //TrackSymbolOptions,
};

L['trackSymbol'] = function(latLng: LatLngExpression, options?: TrackSymbolOptions): TrackSymbol {
    return new TrackSymbol(latLng, options);
}
L['TrackSymbol'] = TrackSymbol;

export default TrackSymbol;
