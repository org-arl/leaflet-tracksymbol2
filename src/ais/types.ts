/** Ship dimension. */
export interface Dimension {
    /** To the bow (m). */
    A: number;
    /** To the stern (m). */
    B: number;
    /** To the port side (m). */
    C: number;
    /** To the starboard side (m). */
    D: number;
}

/** ETA. */
export interface ETA {
    /** Month. */
    month: number;
    /** Day. */
    day: number;
    /** Hour. */
    hour: number;
    /** Minute. */
    minute: number;
}

/** AIS message. */
export interface AISMessage {
    /** MMSI number. */
    userId?: number;
}

/** Position report. */
export interface PositionReport
    extends AISMessage {
    /** Navigational status. */
    navigationalStatus?: number;
    /** Rate of turn. AIS encoded value. */
    rateOfTurn?: number;
    /** Speed over ground (knots), 102.3 = not available . */
    sog?: number;
    /** Position accuracy. */
    positionAccuracy?: boolean;
    /** Longitude. */
    longitude: number;
    /** Latitude. */
    latitude: number;
    /** Course over ground (degrees, 360 = not available, \> 360 not used). */
    cog?: number;
    /** True heading (degrees, 511 = not available) */
    trueHeading?: number;
    /** UTC second when the report was generated. 60 = not available, 61 = manual input mode, 62 = estimated / dead reckoning mode, 63 = inoperative) */
    timestamp?: number;
    /** Special manoeuvre indicator. */
    specialManoeuvreIndicator?: number;
    /** Receiver autonomous integrity monitoring flag. */
    raim?: boolean;
}

/** Ship static data. */
export interface ShipStaticData
    extends AISMessage {
    /** IMO number. */
    imoNumber?: number;
    /** Call sign. */
    callSign?: string;
    /** Name. */
    name?: string;
    /** Type of ship and cargo type. */
    type?: number;
    /** Overall dimension/reference for position. */
    dimension?: Dimension;
    /** Type of electronic position fixing device. */
    fixType?: number;
    /** ETA. */
    eta?: ETA,
    /** Maximum present static draught (m). */
    maximumStaticDraught?: number;
    /** Destination. */
    destination?: string;
    /** Data terminal equipment ready. */
    dte?: boolean;
}
