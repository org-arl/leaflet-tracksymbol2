import {LatLng, type LatLngExpression, type LatLngLiteral} from 'leaflet';

export function toLatLng(latLng: LatLngExpression): LatLng {
    if (latLng instanceof LatLng) {
        return latLng;
    } else if (Array.isArray(latLng)) {
        return new LatLng(latLng[0], latLng[1], latLng[2]);
    } else if (typeof latLng === 'object') {
        const latLngLiteral = latLng as LatLngLiteral;
        return new LatLng(latLngLiteral.lat, latLngLiteral.lng, latLngLiteral.alt);
    } else {
        throw new Error('invalid argument');
    }
}
