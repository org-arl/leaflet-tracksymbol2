/**
 * Points.
 */
export type Points = [number, number][];

/**
 * Units.
 */
export type Units = "pixels" | "meters";

/**
 * Shape.
 */
export interface Shape {

    /** Points. */
    points: Points;
    /** Center. */
    center?: [number, number];
    /** Length. */
    length: number;
    /** Breadth. */
    breadth: number;
    /** Units. */
    units: Units;
}

/**
 * Shape set.
 */
export interface ShapeSet {

    /** 'withHeading' shape. */
    withHeading: Shape;
    /** 'withoutHeading' shape. */
    withoutHeading: Shape;
}
