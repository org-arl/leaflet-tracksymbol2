import {TrackSymbol} from '../trackSymbol';
import type {ShapeOptions} from '../options';
import type {Points, ShapeSet} from '../types';
import type {AISTrackSymbolOptions} from './options';
import type {Dimension, ETA, PositionReport, ShipStaticData} from './types';
import {DomUtil, Util} from 'leaflet';

const DEFAULT_SIZE = 24;
const DEFAULT_MIN_ZOOM_LEVEL = 14;
const DEFAULT_LEADER_TIME = 60;
const KNOTS_PER_METER_PER_SECOND = 1.944;

interface ShipType {
    name: string;
    color: string;
    fillColor: string;
}

const RESERVED_COLOR = "#000000";
const RESERVED_FILL_COLOR = "#d3d3d3";
const WIG_COLOR = "#000000";
const WIG_FILL_COLOR = "#d3d3d3";
const TYPE_3X_COLOR = "#8b008b";
const TYPE_3X_FILL_COLOR = "#ff00ff";
const HSC_COLOR = "#00008b";
const HSC_FILL_COLOR = "#ffff00";
const TYPE_5X_COLOR = "#008b8b";
const TYPE_5X_FILL_COLOR = "#00ffff";
const PASSENGER_COLOR = "#00008b";
const PASSENGER_FILL_COLOR = "#0000ff";
const CARGO_COLOR = "#006400";
const CARGO_FILL_COLOR = "#90ee90";
const TANKER_COLOR = "#8b0000";
const TANKER_FILL_COLOR = "#ff0000";
const OTHER_COLOR = "#008b8b";
const OTHER_FILL_COLOR = "#00ffff";

const TYPES = {
    0: newShipType('Not available', WIG_COLOR, WIG_FILL_COLOR),
    20: newShipType('Wing in ground (WIG), all ships of this type', WIG_COLOR, WIG_FILL_COLOR),
    21: newShipType('Wing in ground (WIG), Hazardous category A', WIG_COLOR, WIG_FILL_COLOR),
    22: newShipType('Wing in ground (WIG), Hazardous category B', WIG_COLOR, WIG_FILL_COLOR),
    23: newShipType('Wing in ground (WIG), Hazardous category C', WIG_COLOR, WIG_FILL_COLOR),
    24: newShipType('Wing in ground (WIG), Hazardous category D', WIG_COLOR, WIG_FILL_COLOR),
    25: newShipType('Wing in ground (WIG), Reserved for future use', WIG_COLOR, WIG_FILL_COLOR),
    26: newShipType('Wing in ground (WIG), Reserved for future use', WIG_COLOR, WIG_FILL_COLOR),
    27: newShipType('Wing in ground (WIG), Reserved for future use', WIG_COLOR, WIG_FILL_COLOR),
    28: newShipType('Wing in ground (WIG), Reserved for future use', WIG_COLOR, WIG_FILL_COLOR),
    29: newShipType('Wing in ground (WIG), Reserved for future use', WIG_COLOR, WIG_FILL_COLOR),
    30: newShipType('Fishing', TYPE_3X_COLOR, TYPE_3X_FILL_COLOR),
    31: newShipType('Towing', TYPE_3X_COLOR, TYPE_3X_FILL_COLOR),
    32: newShipType('Towing: length exceeds 200m or breadth exceeds 25m', TYPE_3X_COLOR, TYPE_3X_FILL_COLOR),
    33: newShipType('Dredging or underwater ops', TYPE_3X_COLOR, TYPE_3X_FILL_COLOR),
    34: newShipType('Diving ops', TYPE_3X_COLOR, TYPE_3X_FILL_COLOR),
    35: newShipType('Military ops', TYPE_3X_COLOR, TYPE_3X_FILL_COLOR),
    36: newShipType('Sailing', TYPE_3X_COLOR, TYPE_3X_FILL_COLOR),
    37: newShipType('Pleasure Craft', TYPE_3X_COLOR, TYPE_3X_FILL_COLOR),
    40: newShipType('High speed craft (HSC), all ships of this type', HSC_COLOR, HSC_FILL_COLOR),
    41: newShipType('High speed craft (HSC), Hazardous category A', HSC_COLOR, HSC_FILL_COLOR),
    42: newShipType('High speed craft (HSC), Hazardous category B', HSC_COLOR, HSC_FILL_COLOR),
    43: newShipType('High speed craft (HSC), Hazardous category C', HSC_COLOR, HSC_FILL_COLOR),
    44: newShipType('High speed craft (HSC), Hazardous category D', HSC_COLOR, HSC_FILL_COLOR),
    45: newShipType('High speed craft (HSC), Reserved for future use', HSC_COLOR, HSC_FILL_COLOR),
    46: newShipType('High speed craft (HSC), Reserved for future use', HSC_COLOR, HSC_FILL_COLOR),
    47: newShipType('High speed craft (HSC), Reserved for future use', HSC_COLOR, HSC_FILL_COLOR),
    48: newShipType('High speed craft (HSC), Reserved for future use', HSC_COLOR, HSC_FILL_COLOR),
    49: newShipType('High speed craft (HSC), No additional information', HSC_COLOR, HSC_FILL_COLOR),
    50: newShipType('Pilot Vessel', TYPE_5X_COLOR, TYPE_5X_FILL_COLOR),
    51: newShipType('Search and Rescue vessel', TYPE_5X_COLOR, TYPE_5X_FILL_COLOR),
    52: newShipType('Tug', TYPE_5X_COLOR, TYPE_5X_FILL_COLOR),
    53: newShipType('Port Tender', TYPE_5X_COLOR, TYPE_5X_FILL_COLOR),
    54: newShipType('Anti-pollution equipment', TYPE_5X_COLOR, TYPE_5X_FILL_COLOR),
    55: newShipType('Law Enforcement', TYPE_5X_COLOR, TYPE_5X_FILL_COLOR),
    56: newShipType('Spare - Local Vessel', TYPE_5X_COLOR, TYPE_5X_FILL_COLOR),
    57: newShipType('Spare - Local Vessel', TYPE_5X_COLOR, TYPE_5X_FILL_COLOR),
    58: newShipType('Medical Transport', TYPE_5X_COLOR, TYPE_5X_FILL_COLOR),
    59: newShipType('Noncombatant ship according to RR Resolution No. 18', '', ''),
    60: newShipType('Passenger, all ships of this type', PASSENGER_COLOR, PASSENGER_FILL_COLOR),
    61: newShipType('Passenger, Hazardous category A', PASSENGER_COLOR, PASSENGER_FILL_COLOR),
    62: newShipType('Passenger, Hazardous category B', PASSENGER_COLOR, PASSENGER_FILL_COLOR),
    63: newShipType('Passenger, Hazardous category C', PASSENGER_COLOR, PASSENGER_FILL_COLOR),
    64: newShipType('Passenger, Hazardous category D', PASSENGER_COLOR, PASSENGER_FILL_COLOR),
    65: newShipType('Passenger, Reserved for future use', PASSENGER_COLOR, PASSENGER_FILL_COLOR),
    66: newShipType('Passenger, Reserved for future use', PASSENGER_COLOR, PASSENGER_FILL_COLOR),
    67: newShipType('Passenger, Reserved for future use', PASSENGER_COLOR, PASSENGER_FILL_COLOR),
    68: newShipType('Passenger, Reserved for future use', PASSENGER_COLOR, PASSENGER_FILL_COLOR),
    69: newShipType('Passenger, No additional information', PASSENGER_COLOR, PASSENGER_FILL_COLOR),
    70: newShipType('Cargo, all ships of this type', CARGO_COLOR, CARGO_FILL_COLOR),
    71: newShipType('Cargo, Hazardous category A', CARGO_COLOR, CARGO_FILL_COLOR),
    72: newShipType('Cargo, Hazardous category B', CARGO_COLOR, CARGO_FILL_COLOR),
    73: newShipType('Cargo, Hazardous category C', CARGO_COLOR, CARGO_FILL_COLOR),
    74: newShipType('Cargo, Hazardous category D', CARGO_COLOR, CARGO_FILL_COLOR),
    75: newShipType('Cargo, Reserved for future use', CARGO_COLOR, CARGO_FILL_COLOR),
    76: newShipType('Cargo, Reserved for future use', CARGO_COLOR, CARGO_FILL_COLOR),
    77: newShipType('Cargo, Reserved for future use', CARGO_COLOR, CARGO_FILL_COLOR),
    78: newShipType('Cargo, Reserved for future use', CARGO_COLOR, CARGO_FILL_COLOR),
    79: newShipType('Cargo, No additional information', CARGO_COLOR, CARGO_FILL_COLOR),
    80: newShipType('Tanker, all ships of this type', TANKER_COLOR, TANKER_FILL_COLOR),
    81: newShipType('Tanker, Hazardous category A', TANKER_COLOR, TANKER_FILL_COLOR),
    82: newShipType('Tanker, Hazardous category B', TANKER_COLOR, TANKER_FILL_COLOR),
    83: newShipType('Tanker, Hazardous category C', TANKER_COLOR, TANKER_FILL_COLOR),
    84: newShipType('Tanker, Hazardous category D', TANKER_COLOR, TANKER_FILL_COLOR),
    85: newShipType('Tanker, Reserved for future use', TANKER_COLOR, TANKER_FILL_COLOR),
    86: newShipType('Tanker, Reserved for future use', TANKER_COLOR, TANKER_FILL_COLOR),
    87: newShipType('Tanker, Reserved for future use', TANKER_COLOR, TANKER_FILL_COLOR),
    88: newShipType('Tanker, Reserved for future use', TANKER_COLOR, TANKER_FILL_COLOR),
    89: newShipType('Tanker, No additional information', TANKER_COLOR, TANKER_FILL_COLOR),
    90: newShipType('Other Type, all ships of this type', OTHER_COLOR, OTHER_FILL_COLOR),
    91: newShipType('Other Type, Hazardous category A', OTHER_COLOR, OTHER_FILL_COLOR),
    92: newShipType('Other Type, Hazardous category B', OTHER_COLOR, OTHER_FILL_COLOR),
    93: newShipType('Other Type, Hazardous category C', OTHER_COLOR, OTHER_FILL_COLOR),
    94: newShipType('Other Type, Hazardous category D', OTHER_COLOR, OTHER_FILL_COLOR),
    95: newShipType('Other Type, Reserved for future use', OTHER_COLOR, OTHER_FILL_COLOR),
    96: newShipType('Other Type, Reserved for future use', OTHER_COLOR, OTHER_FILL_COLOR),
    97: newShipType('Other Type, Reserved for future use', OTHER_COLOR, OTHER_FILL_COLOR),
    98: newShipType('Other Type, Reserved for future use', OTHER_COLOR, OTHER_FILL_COLOR),
    99: newShipType('Other Type, no additional information', OTHER_COLOR, OTHER_FILL_COLOR),
};
const RESERVED_TYPE = newShipType('Reserved', RESERVED_COLOR, RESERVED_FILL_COLOR);
const UNKNOWN_TYPE = newShipType('Unknown', RESERVED_COLOR, RESERVED_FILL_COLOR);

export class AISTrackSymbol
    extends TrackSymbol {

    /** Default silhouette shape points. */
    public static DEFAULT_SILHOUETTE_SHAPE_POINTS: Points = [[1, 0.5], [0.75, 1], [0, 1], [0, 0], [0.75, 0]];

    private readonly _leaderTime: number;
    private readonly _minZoomLevel: number;
    private readonly _size: number;
    private _positionReport: PositionReport;
    private _shipStaticData?: ShipStaticData;

    /**
     * AISTrackSymbol constructor.
     *
     * @param positionReport - Position report.
     * @param options - Options.
     */
    constructor(positionReport: PositionReport, options?: AISTrackSymbolOptions) {
        super([positionReport.latitude, positionReport.longitude], options);

        Util.setOptions(this, options);
        options = options || {};
        this._leaderTime = options.leaderTime || DEFAULT_LEADER_TIME;
        this._minZoomLevel = options.minZoomLevel || DEFAULT_MIN_ZOOM_LEVEL;
        this._size = options.size || DEFAULT_SIZE;
        this.setPositionReport(positionReport);
        this.setShipStaticData(options.shipStaticData);
    }

    /**
     * Sets the position report.
     *
     * @param positionReport - Position report.
     * @returns this
     */
    public setPositionReport(positionReport: PositionReport): this {
        this._positionReport = positionReport;
        this.setLatLng([positionReport.latitude, positionReport.longitude]);
        if (!isNullOrUndefined(positionReport.trueHeading) && (positionReport.trueHeading != 511)) {
            this.setHeading(toRadians(positionReport.trueHeading));
        } else {
            this.setHeading(undefined);
        }
        if (!isNullOrUndefined(positionReport.cog) && (positionReport.cog < 360)) {
            this.setCourse(toRadians(positionReport.cog));
        } else {
            this.setCourse(undefined);
        }
        if (!isNullOrUndefined(positionReport.sog) && (positionReport.sog < 102.3)) {
            this.setSpeed(positionReport.sog / KNOTS_PER_METER_PER_SECOND);
        } else {
            this.setSpeed(undefined);
        }
        return this.redraw();
    }

    /**
     * Sets the ship static data.
     *
     * @param shipStaticData - Ship static data.
     * @returns this
     */
    public setShipStaticData(shipStaticData?: ShipStaticData): this {
        this._shipStaticData = shipStaticData;
        const shipType = !isNullOrUndefined(shipStaticData) && !isNullOrUndefined(shipStaticData.type)
            ? getShipType(shipStaticData.type) : TYPES[0];
        this.setStyle({
            color: shipType.color,
            fill: true,
            fillOpacity: 1.0,
            fillColor: shipType.fillColor,
        });
        this.bindPopup(this._getPopupContent(this._positionReport, shipStaticData));
        return this.setShapeOptions(AISTrackSymbol._getShapeOptions(this._leaderTime, this._minZoomLevel, this._size,
            shipStaticData));
    }

    private static _getShapeOptions(leaderTime: number, minZoomLevel: number, size: number,
                                    shipStaticData?: ShipStaticData): ShapeOptions {
        const shapeOptions: ShapeOptions = {
            leaderTime: leaderTime,
            defaultShapeSet: TrackSymbol.createShapeSet(size),
        };
        const shapeSet = AISTrackSymbol._getShapeSet(size, shipStaticData);
        if (shapeSet !== null) {
            shapeOptions.shapeSetEntries = [{
                shapeSet: shapeSet,
                minZoomLevel: minZoomLevel,
            }];
        }
        return shapeOptions;
    }

    private static _getShapeSet(size: number, shipStaticData?: ShipStaticData): ShapeSet | null {
        if (isNullOrUndefined(shipStaticData) || isNullOrUndefined(shipStaticData.dimension)
            || !isDimensionValid(shipStaticData.dimension)) {
            return null;
        }
        return {
            withHeading: {
                points: AISTrackSymbol.DEFAULT_SILHOUETTE_SHAPE_POINTS,
                center: [shipStaticData.dimension.B, shipStaticData.dimension.D],
                length: shipStaticData.dimension.A + shipStaticData.dimension.B,
                breadth: shipStaticData.dimension.C + shipStaticData.dimension.D,
                units: "meters",
            },
            withoutHeading: TrackSymbol.createShape(TrackSymbol.DEFAULT_NOHEADING_SHAPE_POINTS, size),
        };
    }

    private _getPopupContent(positionReport?: PositionReport, shipStaticData?: ShipStaticData): HTMLElement {
        let content = "<table>";
        if (!isNullOrUndefined(shipStaticData)) {
            content += createTableRow("User ID", shipStaticData.userId);
            content += createTableRow("IMO Number", shipStaticData.imoNumber);
            content += createTableRow("Call sign", shipStaticData.callSign);
            content += createTableRow("Name", shipStaticData.name);
        }
        content += createTableRow("Location", `${this.getLatLng().lat}, ${this.getLatLng().lng}`)
        content += createTableRow("SOG", !isNullOrUndefined(this.getSpeed())
            ? (this.getSpeed() * KNOTS_PER_METER_PER_SECOND).toFixed(2) : undefined, "knots");
        content += createTableRow("COG", !isNullOrUndefined(this.getSpeed())
            ? toDegrees(this.getCourse()).toFixed(1) : undefined, "°");
        content += createTableRow("Heading", !isNullOrUndefined(this.getSpeed())
            ? toDegrees(this.getHeading()).toFixed(1) : undefined, "°");
        if (!isNullOrUndefined(positionReport)) {
            content += createTableRow("Navigation status",
                toNavigationStatusString(positionReport.navigationalStatus));
        }
        if (!isNullOrUndefined(shipStaticData)) {
            content += createTableRow("Type", toTypeString(shipStaticData.type));
            if (!isNullOrUndefined(shipStaticData.dimension) && isDimensionValid(shipStaticData.dimension)) {
                content += createTableRow("Ship length",
                    shipStaticData.dimension.A + shipStaticData.dimension.B, "m");
                content += createTableRow("Ship width",
                    shipStaticData.dimension.C + shipStaticData.dimension.D, "m");
            }
            content += createTableRow("Fix type", toFixTypeString(shipStaticData.fixType));
            content += createTableRow("ETA", toETAString(shipStaticData.eta));
            content += createTableRow("Maximum static draught",
                !isNullOrUndefined(shipStaticData.maximumStaticDraught)
                    ? shipStaticData.maximumStaticDraught.toFixed(1) : undefined, "m");
            content += createTableRow("Destination", shipStaticData.destination);
            content += createTableRow("DTE", shipStaticData.dte);
        }
        content += "</table>";
        const popupContent = DomUtil.create("div");
        popupContent.innerHTML = content;
        return popupContent;
    }
}

function toTypeString(type: number): string | undefined {
    if (isNullOrUndefined(type)) {
        return undefined;
    }
    const shipType = getShipType(type);
    return shipType.name;
}

function toFixTypeString(fixType: number): string | undefined {
    if (isNullOrUndefined(fixType)) {
        return undefined;
    }
    switch (fixType) {
        case 0:
            return undefined;
        case 1:
            return 'GPS';
        case 2:
            return 'GLONASS';
        case 3:
            return 'combined GPS/GLONASS';
        case 4:
            return 'Loran-C';
        case 5:
            return 'Chayka';
        case 6:
            return 'integrated navigation system';
        case 7:
            return 'surveyed';
        case 8:
            return 'Galileo';
        case 9:
        case 10:
        case 11:
        case 12:
        case 13:
        case 14:
            return `not used (${fixType})`;
        case 15:
            return "internal GNSS";
        default:
            return `unknown (${fixType})`;
    }
}

function toNavigationStatusString(navigationStatus: number): string | undefined {
    if (isNullOrUndefined(navigationStatus)) {
        return undefined;
    }
    switch (navigationStatus) {
        case 0:
            return 'Under way using engine';
        case 1:
            return 'At anchor';
        case 2:
            return 'Not under command';
        case 3:
            return 'Restricted manoeuverability';
        case 4:
            return 'Constrained by her draught';
        case 5:
            return 'Moored';
        case 6:
            return 'Aground';
        case 7:
            return 'Engaged in Fishing';
        case 8:
            return 'Under way sailing';
        case 9:
            return 'Reserved for future amendment of Navigational Status for HSC';
        case 10:
            return 'Reserved for future amendment of Navigational Status for WIG';
        case 11:
            return 'Reserved for future use';
        case 12:
            return 'Reserved for future use';
        case 13:
            return 'Reserved for future use';
        case 14:
            return 'AIS-SART is active';
        case 15:
            return 'Not defined (default)';
        default:
            return `unknown (${navigationStatus})`;
    }
}

function toETAString(eta: ETA): string | undefined {
    if (isNullOrUndefined(eta)) {
        return undefined;
    }
    return `${eta.month.toString().padStart(2, '0')}/${eta.day.toString().padStart(2, '0')} ${eta.hour.toString().padStart(2, '0')}:${eta.minute.toString().padStart(2, '0')} UTC`;
}

function toRadians(degs: number | null | undefined): number | undefined {
    if ((degs === null) || (degs === undefined)) {
        return undefined;
    }
    return degs * Math.PI / 180;
}

function isNullOrUndefined(v: any): boolean {
    return (v === null) || (v === undefined);
}

function isDimensionValid(dimension?: Dimension): boolean {
    return !isNullOrUndefined(dimension)
        && (dimension.A > 0) && (dimension.B > 0) && (dimension.C > 0) && (dimension.D > 0);
}

function createTableRow(name: string, value: any, unit?: string): string {
    if (isNullOrUndefined(value)) {
        return '';
    }
    return `<tr><td>${name}</td><td>${value} ${isNullOrUndefined(unit) ? "" : unit}</td></tr>`;
}

function toDegrees(rads: number | null | undefined): number | undefined {
    if ((rads === null) || (rads === undefined)) {
        return undefined;
    }
    return rads * 180 / Math.PI;
}

function newShipType(name: string, color: string, fillColor): ShipType {
    return {
        name: name,
        color: color,
        fillColor: fillColor,
    }
}

function getShipType(type: number): ShipType {
    if ((type < 0) || (type > 99)) {
        return UNKNOWN_TYPE;
    }
    const shipType = TYPES[type];
    if (!isNullOrUndefined(shipType)) {
        return shipType;
    }
    return RESERVED_TYPE;
}
