import type {LatLngExpression} from 'leaflet';
import L, {Bounds, LatLng, LatLngBounds, Path, Point, Util} from 'leaflet';
import Flatten from '@flatten-js/core';
import Matrix = Flatten.Matrix;
import type {Points, Shape, ShapeSet, Units} from './types';
import type {ShapeOptions, TrackSymbolOptions} from './options';

const DEFAULT_SIZE = 24;
const DEFAULT_LEADER_TIME = 60;

/**
 * Track symbol.
 */
export class TrackSymbol
    extends Path {

    /** Default 'withHeading' shape points. */
    public static DEFAULT_HEADING_SHAPE_POINTS: Points = [[0.75, 0], [-0.25, 0.3], [-0.25, -0.3]];

    /** Default 'withoutHeading' shape points. */
    public static DEFAULT_NOHEADING_SHAPE_POINTS: Points = [[0.3, 0], [0, 0.3], [-0.3, 0], [0, -0.3]];

    /** Default shape set. */
    private static DEFAULT_SHAPE_SET: ShapeSet = {
        withHeading: {
            points: TrackSymbol.DEFAULT_HEADING_SHAPE_POINTS,
            length: DEFAULT_SIZE,
            breadth: DEFAULT_SIZE,
            units: "pixels",
        },
        withoutHeading: {
            points: TrackSymbol.DEFAULT_NOHEADING_SHAPE_POINTS,
            length: DEFAULT_SIZE,
            breadth: DEFAULT_SIZE,
            units: "pixels",
        },
    };

    /** Location. */
    private _latLng: LatLng;
    /** Heading (radians, from north, clockwise. */
    private _heading?: number;
    /** Course (radians, from north, clockwise. */
    private _course?: number;
    /** Speed (m/s). */
    private _speed?: number;
    /** Shape options. */
    private _shapeOptions: ShapeOptions;

    /** Current shape points. */
    private _currentShapePoints: Point[] | undefined;
    /** Current leader points. */
    private _currentLeaderPoints: Point[] | undefined;
    /** Current bounds. */
    private _currentBounds: Bounds | undefined;
    /** Current lat/lng bounds. */
    private _currentLatLngBounds: LatLngBounds | undefined;

    /**
     * TrackSymbol constructor.
     *
     * @param latLng - Initial location.
     * @param options - Options.
     */
    constructor(latLng: LatLngExpression, options?: TrackSymbolOptions) {
        super();

        Util.setOptions(this, options);
        if (latLng == undefined) {
            throw Error("latLng required");
        }
        options = options || {};
        this._latLng = L.latLng(latLng);
        this._heading = options.heading;
        this._course = options.course;
        this._speed = options.speed;
        this._shapeOptions = options.shapeOptions || {
            leaderTime: DEFAULT_LEADER_TIME,
            defaultShapeSet: TrackSymbol.DEFAULT_SHAPE_SET,
        };
        this._setShapeOptions(options.shapeOptions);
    }

    // ---- Leaflet

    /**
     * Project to layer.
     *
     * [Leaflet internal]
     */
    protected _project() {
        this._currentShapePoints = this._getProjectedShapePoints();
        this._currentLeaderPoints = this._getLeaderShapePoints();

        const bounds = new Bounds();
        for (let i = 0; i < this._currentShapePoints.length; i++) {
            const point = this._currentShapePoints[i];
            bounds.extend(point);
        }
        if (this._currentLeaderPoints !== undefined) {
            for (let i = 0; i < this._currentLeaderPoints.length; i++) {
                const point = this._currentShapePoints[i];
                bounds.extend(point);
            }
        }
        this._currentBounds = bounds;
        this._currentLatLngBounds = new LatLngBounds(
            this._map.layerPointToLatLng(bounds.getBottomLeft()),
            this._map.layerPointToLatLng(bounds.getTopRight())
        );
    }

    /**
     * Update element.
     *
     * [Leaflet internal]
     */
    protected _update() {
        if (!this._map) {
            return;
        }
        const el = this.getElement();
        if (el === undefined) {
            return;
        }
        const paths: string[] = [];
        if (this._currentShapePoints !== undefined) {
            paths.push(TrackSymbol._toSVGPath(this._currentShapePoints, true));
        }
        if (this._currentLeaderPoints !== undefined) {
            paths.push(TrackSymbol._toSVGPath(this._currentLeaderPoints, false));
        }
        const viewPath = paths.join(' ');
        el.setAttribute('d', viewPath);
    }

    // ----

    /**
     * Set shape options.
     *
     * @param shapeOptions - Shape options.
     */
    private _setShapeOptions(shapeOptions: ShapeOptions | undefined) {
        this._shapeOptions = shapeOptions || {
            leaderTime: DEFAULT_LEADER_TIME,
            defaultShapeSet: TrackSymbol.DEFAULT_SHAPE_SET,
        };
        if (this._shapeOptions.leaderTime === undefined) {
            this._shapeOptions.leaderTime = DEFAULT_LEADER_TIME;
        }
        if (this._shapeOptions.defaultShapeSet === undefined) {
            this._shapeOptions.defaultShapeSet = TrackSymbol.DEFAULT_SHAPE_SET;
        }
        if (this._shapeOptions.shapeSetEntries !== undefined) {
            this._shapeOptions.shapeSetEntries
                .sort((a, b) => b.minZoomLevel - a.minZoomLevel);
        }
    }

    // ---

    /**
     * Sets the location.
     *
     * @param latLng - Location.
     * @returns this
     */
    public setLatLng(latLng: LatLngExpression): this {
        const oldLatLng = this._latLng;
        this._latLng = L.latLng(latLng);
        this.fire('move', {
            oldLatLng: oldLatLng,
            latlng: this._latLng,
        });
        return this.redraw();
    }

    /**
     * Sets the heading.
     *
     * @param heading - Heading (unit: radians, from north, clockwise).
     * @returns this
     */
    public setHeading(heading: number | undefined): this {
        this._heading = heading;
        return this.redraw();
    }

    /**
     * Sets the course over ground.
     *
     * @param course - Course over ground (unit: radians, from north, clockwise).
     * @returns this
     */
    public setCourse(course: number | undefined): this {
        this._course = course;
        return this.redraw();
    }

    /**
     * Sets the speed.
     *
     * @param speed - Speed (unit: m/s).
     * @returns this
     */
    public setSpeed(speed: number | undefined): this {
        this._speed = speed;
        return this.redraw();
    }

    /**
     * Sets the shape options.
     *
     * @param shapeOptions - Shape options.
     * @returns this
     */
    public setShapeOptions(shapeOptions: ShapeOptions): this {
        this._setShapeOptions(shapeOptions);
        return this.redraw();
    }

    /**
     * Returns the bounding box.
     *
     * @returns The bounding box.
     */
    public getBounds(): LatLngBounds | undefined {
        return this._currentLatLngBounds;
    }

    /**
     * Returns the location.
     *
     * @returns The location.
     */
    public getLatLng(): LatLng {
        return this._latLng;
    }

    /**
     * Returns the speed.
     *
     * @returns The speed (m/s).
     */
    public getSpeed(): number | undefined {
        return this._speed;
    }

    /**
     * Returns the heading.
     *
     * @returns The heading (radians, from north, clockwise).
     */
    public getHeading(): number | undefined {
        return this._heading;
    }

    /**
     * Returns the course.
     *
     * @returns The course (radians, from north, clockwise).
     */
    public getCourse(): number | undefined {
        return this._course;
    }

    /**
     * Creates a shape.
     *
     * @param points - Points.
     * @param size - Size (units: pixels).
     * @returns The new shape.
     */
    public static createShape(points: Points, size: number): Shape {
        return {
            points: points,
            length: size,
            breadth: size,
            units: "pixels",
        };
    }

    /**
     * Creates a shape set.
     *
     * @param size - Size (units: pixels).
     * @returns The new shape set.
     */
    public static createShapeSet(size: number): ShapeSet {
        return {
            withHeading: TrackSymbol.createShape(TrackSymbol.DEFAULT_HEADING_SHAPE_POINTS, size),
            withoutHeading: TrackSymbol.createShape(TrackSymbol.DEFAULT_NOHEADING_SHAPE_POINTS, size),
        };
    }

    /**
     * Get latitude size of y-distance.
     *
     * @param value - Y distance (m).
     * @returns dLat
     */
    private _getLatSizeOf(value: number): number {
        return (value / 40075017) * 360;
    }

    /**
     * Get longitude size of x-distance.
     *
     * @param value - X distance (m).
     * @returns dLng
     */
    private _getLngSizeOf(value: number): number {
        return ((value / 40075017) * 360) / Math.cos((Math.PI / 180) * this._latLng.lat);
    }

    /**
     * Get view angle from model.
     *
     * @param modelAngle - Model angle (radians).
     * @returns View angle from model (radians).
     */
    private _getViewAngleFromModel(modelAngle: number): number {
        return modelAngle - Math.PI / 2.0;
    }

    /**
     * Get leader shape points.
     *
     * @returns Points.
     */
    private _getLeaderShapePoints(): Point[] | undefined {
        if ((this._course === undefined) || (this._speed === undefined)
            || (this._shapeOptions === undefined) || (this._shapeOptions.leaderTime === undefined)) {
            return undefined;
        }
        const angle = this._getViewAngleFromModel(this._course);
        const leaderLength = this._speed * this._shapeOptions.leaderTime;
        const leaderEndLatLng = this._calcRelativeLatLng(this._latLng, leaderLength, angle);
        return this._latLngsToLayerPoints(this._latLng, leaderEndLatLng);
    }

    /**
     * Calculate relative lat/lng.
     *
     * @param latLng - LatLng.
     * @param distance - Distance (meters).
     * @param angle - Angle (radians).
     * @returns Calculated LatLng.
     */
    private _calcRelativeLatLng(latLng: LatLng, distance: number, angle: number): LatLng {
        return new LatLng(
            latLng.lat - this._getLatSizeOf(distance * Math.sin(angle)),
            latLng.lng + this._getLngSizeOf(distance * Math.cos(angle))
        );
    }

    /**
     * Convert LatLngs to map layer points.
     *
     * @param latLngs - LatLngs.
     * @returns Points.
     */
    private _latLngsToLayerPoints(...latLngs: LatLng[]): Point[] {
        return latLngs.map(latLng => this._map.latLngToLayerPoint(latLng));
    }

    /**
     * Gets the shape set.
     *
     * @returns The shape set.
     */
    private _getShapeSet(): ShapeSet {
        if ((this._shapeOptions.shapeSetEntries === undefined)
            || (this._shapeOptions.shapeSetEntries.length == 0)) {
            return this._shapeOptions.defaultShapeSet ? this._shapeOptions.defaultShapeSet : TrackSymbol.DEFAULT_SHAPE_SET;
        }
        const zoomLevel = this._map.getZoom();
        const shapeSetEntriesFiltered = this._shapeOptions.shapeSetEntries
            .sort((a, b) => b.minZoomLevel - a.minZoomLevel)
            .filter(shapeSetEntry => zoomLevel >= shapeSetEntry.minZoomLevel);
        if (shapeSetEntriesFiltered.length > 0) {
            return shapeSetEntriesFiltered[0].shapeSet;
        } else {
            return this._shapeOptions.defaultShapeSet ? this._shapeOptions.defaultShapeSet : TrackSymbol.DEFAULT_SHAPE_SET;
        }
    }

    /**
     * Gets the shape.
     *
     * @returns The shape.
     */
    private _getShape(): Shape {
        const shapeSet = this._getShapeSet();
        return (this._heading !== undefined) ? shapeSet.withHeading : shapeSet.withoutHeading;
    }

    /**
     * Get transformed shape points.
     *
     * @returns Transformed points and units.
     */
    private _getTransformedShapePoints(): [Points, Units] {
        const shape = this._getShape();
        let m = new Matrix();
        if (this._heading !== undefined) {
            const headingAngle = this._getViewAngleFromModel(this._heading);
            m = m.rotate(headingAngle);
        }
        if (shape.center !== undefined) {
            m = m.translate(-shape.center[0], -shape.center[1]);
        }
        m = m.scale(shape.length, shape.breadth);
        const points = shape.points.map(point => m.transform(point));
        return [points, shape.units];
    }

    /**
     * Get projected shape points.
     *
     * @returns Points projected to map layer.
     */
    private _getProjectedShapePoints(): Point[] {
        const [points, units] = this._getTransformedShapePoints();
        switch (units) {
            case "pixels": {
                const p = this._map.latLngToLayerPoint(this._latLng);
                const m = new Matrix().translate(p.x, p.y);
                return points.map(point => {
                    const p1 = m.transform(point);
                    return new Point(p1[0], p1[1]);
                });
            }
            case "meters": {
                return points.map(point => this._map.latLngToLayerPoint(
                    new LatLng(
                        this._latLng.lat - this._getLatSizeOf(point[1]),
                        this._latLng.lng + this._getLngSizeOf(point[0])
                    )
                ));
            }
            default:
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                throw new Error(`unsupported units: ${units}`);
        }
    }

    /**
     * Converts points to an SVG path string.
     *
     * @param points - Points.
     * @param close - Close path.
     * @returns SVG path string.
     */
    private static _toSVGPath(points: Point[], close: boolean): string {
        let result = '';
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            if (result === '') {
                result = `M ${point.x} ${point.y} `;
            } else {
                result += `L ${point.x} ${point.y} `;
            }
        }
        if (close) {
            result += 'Z';
        }
        return result;
    }
}
