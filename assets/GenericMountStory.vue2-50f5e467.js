import { X as Flatten, Y as leafletSrcExports, Z as SvelteComponentDev, _ as init, $ as dispatch_dev, a0 as safe_not_equal, a1 as binding_callbacks, a2 as bind, a3 as create_component, a4 as mount_component, a5 as transition_in, a6 as transition_out, a7 as destroy_component, a8 as validate_slots, a9 as onMount, aa as element, ab as attr_dev, ac as add_location, ad as insert_dev, ae as noop, af as detach_dev, ag as space, ah as listen_dev, ai as add_flush_callback, aj as run_all, ak as Logo_square, al as Logo_dark, am as useDark, an as useToggle, f as watch, ao as markRaw, R as reactive, d as defineComponent, k as ref, ap as watchEffect, o as openBlock, c as createBlock, m as mergeProps, aq as resolveDynamicComponent, q as createCommentVNode } from "./vendor-0c70ceb7.js";
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/leaflet-tracksymbol2/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  const links = document.getElementsByTagName("link");
  return Promise.all(deps.map((dep) => {
    dep = assetsURL(dep);
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    const isBaseRelative = !!importerUrl;
    if (isBaseRelative) {
      for (let i = links.length - 1; i >= 0; i--) {
        const link2 = links[i];
        if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
          return;
        }
      }
    } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link.as = "script";
      link.crossOrigin = "";
    }
    link.href = dep;
    document.head.appendChild(link);
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
      });
    }
  })).then(() => baseModule());
};
const Matrix = Flatten.Matrix;
const DEFAULT_SIZE$1 = 24;
const DEFAULT_LEADER_TIME$1 = 60;
const _TrackSymbol = class extends leafletSrcExports.Path {
  constructor(latLng, options) {
    super();
    leafletSrcExports.Util.setOptions(this, options);
    if (latLng == void 0) {
      throw Error("latLng required");
    }
    options = options || {};
    this._latLng = leafletSrcExports.latLng(latLng);
    this._heading = options.heading;
    this._course = options.course;
    this._speed = options.speed;
    this._setShapeOptions(options.shapeOptions);
  }
  _project() {
    this._currentShapePoints = this._getProjectedShapePoints();
    this._currentLeaderPoints = this._getLeaderShapePoints();
    const bounds = new leafletSrcExports.Bounds();
    for (let i = 0; i < this._currentShapePoints.length; i++) {
      const point = this._currentShapePoints[i];
      bounds.extend(point);
    }
    if (this._currentLeaderPoints !== void 0) {
      for (let i = 0; i < this._currentLeaderPoints.length; i++) {
        const point = this._currentShapePoints[i];
        bounds.extend(point);
      }
    }
    this._currentBounds = bounds;
    this._currentLatLngBounds = new leafletSrcExports.LatLngBounds(
      this._map.layerPointToLatLng(bounds.getBottomLeft()),
      this._map.layerPointToLatLng(bounds.getTopRight())
    );
  }
  _update() {
    if (!this._map) {
      return;
    }
    let viewPath = _TrackSymbol._toSVGPath(this._currentShapePoints, true);
    if (this._currentLeaderPoints !== void 0) {
      viewPath += " " + _TrackSymbol._toSVGPath(this._currentLeaderPoints, false);
    }
    this.getElement().setAttribute("d", viewPath);
  }
  _setShapeOptions(shapeOptions) {
    this._shapeOptions = shapeOptions || {
      leaderTime: DEFAULT_LEADER_TIME$1,
      defaultShapeSet: _TrackSymbol.DEFAULT_SHAPE_SET
    };
    if (this._shapeOptions.leaderTime === void 0) {
      this._shapeOptions.leaderTime = DEFAULT_LEADER_TIME$1;
    }
    if (this._shapeOptions.defaultShapeSet === void 0) {
      this._shapeOptions.defaultShapeSet = _TrackSymbol.DEFAULT_SHAPE_SET;
    }
    if (this._shapeOptions.shapeSetEntries !== void 0) {
      this._shapeOptions.shapeSetEntries.sort((a, b) => b.minZoomLevel - a.minZoomLevel);
    }
  }
  setLatLng(latLng) {
    const oldLatLng = this._latLng;
    this._latLng = leafletSrcExports.latLng(latLng);
    this.fire("move", {
      oldLatLng,
      latlng: this._latLng
    });
    return this.redraw();
  }
  setHeading(heading) {
    this._heading = heading;
    return this.redraw();
  }
  setCourse(course) {
    this._course = course;
    return this.redraw();
  }
  setSpeed(speed) {
    this._speed = speed;
    return this.redraw();
  }
  setShapeOptions(shapeOptions) {
    this._setShapeOptions(shapeOptions);
    return this.redraw();
  }
  getBounds() {
    return this._currentLatLngBounds;
  }
  getLatLng() {
    return this._latLng;
  }
  getSpeed() {
    return this._speed;
  }
  getHeading() {
    return this._heading;
  }
  getCourse() {
    return this._course;
  }
  static createShape(points, size) {
    return {
      points,
      length: size,
      breadth: size,
      units: "pixels"
    };
  }
  static createShapeSet(size) {
    return {
      withHeading: _TrackSymbol.createShape(_TrackSymbol.DEFAULT_HEADING_SHAPE_POINTS, size),
      withoutHeading: _TrackSymbol.createShape(_TrackSymbol.DEFAULT_NOHEADING_SHAPE_POINTS, size)
    };
  }
  _getLatSizeOf(value) {
    return value / 40075017 * 360;
  }
  _getLngSizeOf(value) {
    return value / 40075017 * 360 / Math.cos(Math.PI / 180 * this._latLng.lat);
  }
  _getViewAngleFromModel(modelAngle) {
    return modelAngle - Math.PI / 2;
  }
  _getLeaderShapePoints() {
    if (this._course === void 0 || this._speed === void 0) {
      return void 0;
    }
    const angle = this._getViewAngleFromModel(this._course);
    const leaderLength = this._speed * this._shapeOptions.leaderTime;
    const leaderEndLatLng = this._calcRelativeLatLng(this._latLng, leaderLength, angle);
    return this._latLngsToLayerPoints(this._latLng, leaderEndLatLng);
  }
  _calcRelativeLatLng(latLng, distance, angle) {
    return new leafletSrcExports.LatLng(
      latLng.lat - this._getLatSizeOf(distance * Math.sin(angle)),
      latLng.lng + this._getLngSizeOf(distance * Math.cos(angle))
    );
  }
  _latLngsToLayerPoints(...latLngs) {
    return latLngs.map((latLng) => this._map.latLngToLayerPoint(latLng));
  }
  _getShapeSet() {
    if (this._shapeOptions.shapeSetEntries === void 0 || this._shapeOptions.shapeSetEntries.length == 0) {
      return this._shapeOptions.defaultShapeSet;
    }
    const zoomLevel = this._map.getZoom();
    const shapeSetEntriesFiltered = this._shapeOptions.shapeSetEntries.sort((a, b) => b.minZoomLevel - a.minZoomLevel).filter((shapeSetEntry) => zoomLevel >= shapeSetEntry.minZoomLevel);
    if (shapeSetEntriesFiltered.length > 0) {
      return shapeSetEntriesFiltered[0].shapeSet;
    } else {
      return this._shapeOptions.defaultShapeSet;
    }
  }
  _getShape() {
    const shapeSet = this._getShapeSet();
    return this._heading !== void 0 ? shapeSet.withHeading : shapeSet.withoutHeading;
  }
  _getTransformedShapePoints() {
    const shape = this._getShape();
    let m = new Matrix();
    if (this._heading !== void 0) {
      const headingAngle = this._getViewAngleFromModel(this._heading);
      m = m.rotate(headingAngle);
    }
    if (shape.center !== void 0) {
      m = m.translate(-shape.center[0], -shape.center[1]);
    }
    m = m.scale(shape.length, shape.breadth);
    const points = shape.points.map((point) => m.transform(point));
    return [points, shape.units];
  }
  _getProjectedShapePoints() {
    const [points, units] = this._getTransformedShapePoints();
    switch (units) {
      case "pixels": {
        const p = this._map.latLngToLayerPoint(this._latLng);
        const m = new Matrix().translate(p.x, p.y);
        return points.map((point) => {
          const p1 = m.transform(point);
          return new leafletSrcExports.Point(p1[0], p1[1]);
        });
      }
      case "meters": {
        return points.map((point) => this._map.latLngToLayerPoint(
          new leafletSrcExports.LatLng(
            this._latLng.lat - this._getLatSizeOf(point[1]),
            this._latLng.lng + this._getLngSizeOf(point[0])
          )
        ));
      }
    }
  }
  static _toSVGPath(points, close) {
    let result = "";
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      if (result === "") {
        result = `M ${point.x} ${point.y} `;
      } else {
        result += `L ${point.x} ${point.y} `;
      }
    }
    if (close) {
      result += "Z";
    }
    return result;
  }
};
let TrackSymbol = _TrackSymbol;
TrackSymbol.DEFAULT_HEADING_SHAPE_POINTS = [[0.75, 0], [-0.25, 0.3], [-0.25, -0.3]];
TrackSymbol.DEFAULT_NOHEADING_SHAPE_POINTS = [[0.3, 0], [0, 0.3], [-0.3, 0], [0, -0.3]];
TrackSymbol.DEFAULT_SHAPE_SET = {
  withHeading: {
    points: _TrackSymbol.DEFAULT_HEADING_SHAPE_POINTS,
    length: DEFAULT_SIZE$1,
    breadth: DEFAULT_SIZE$1,
    units: "pixels"
  },
  withoutHeading: {
    points: _TrackSymbol.DEFAULT_NOHEADING_SHAPE_POINTS,
    length: DEFAULT_SIZE$1,
    breadth: DEFAULT_SIZE$1,
    units: "pixels"
  }
};
const DEFAULT_SIZE = 24;
const DEFAULT_MIN_ZOOM_LEVEL = 14;
const DEFAULT_LEADER_TIME = 60;
const KNOTS_PER_METER_PER_SECOND = 1.944;
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
  0: newShipType("Not available", WIG_COLOR, WIG_FILL_COLOR),
  20: newShipType("Wing in ground (WIG), all ships of this type", WIG_COLOR, WIG_FILL_COLOR),
  21: newShipType("Wing in ground (WIG), Hazardous category A", WIG_COLOR, WIG_FILL_COLOR),
  22: newShipType("Wing in ground (WIG), Hazardous category B", WIG_COLOR, WIG_FILL_COLOR),
  23: newShipType("Wing in ground (WIG), Hazardous category C", WIG_COLOR, WIG_FILL_COLOR),
  24: newShipType("Wing in ground (WIG), Hazardous category D", WIG_COLOR, WIG_FILL_COLOR),
  25: newShipType("Wing in ground (WIG), Reserved for future use", WIG_COLOR, WIG_FILL_COLOR),
  26: newShipType("Wing in ground (WIG), Reserved for future use", WIG_COLOR, WIG_FILL_COLOR),
  27: newShipType("Wing in ground (WIG), Reserved for future use", WIG_COLOR, WIG_FILL_COLOR),
  28: newShipType("Wing in ground (WIG), Reserved for future use", WIG_COLOR, WIG_FILL_COLOR),
  29: newShipType("Wing in ground (WIG), Reserved for future use", WIG_COLOR, WIG_FILL_COLOR),
  30: newShipType("Fishing", TYPE_3X_COLOR, TYPE_3X_FILL_COLOR),
  31: newShipType("Towing", TYPE_3X_COLOR, TYPE_3X_FILL_COLOR),
  32: newShipType("Towing: length exceeds 200m or breadth exceeds 25m", TYPE_3X_COLOR, TYPE_3X_FILL_COLOR),
  33: newShipType("Dredging or underwater ops", TYPE_3X_COLOR, TYPE_3X_FILL_COLOR),
  34: newShipType("Diving ops", TYPE_3X_COLOR, TYPE_3X_FILL_COLOR),
  35: newShipType("Military ops", TYPE_3X_COLOR, TYPE_3X_FILL_COLOR),
  36: newShipType("Sailing", TYPE_3X_COLOR, TYPE_3X_FILL_COLOR),
  37: newShipType("Pleasure Craft", TYPE_3X_COLOR, TYPE_3X_FILL_COLOR),
  40: newShipType("High speed craft (HSC), all ships of this type", HSC_COLOR, HSC_FILL_COLOR),
  41: newShipType("High speed craft (HSC), Hazardous category A", HSC_COLOR, HSC_FILL_COLOR),
  42: newShipType("High speed craft (HSC), Hazardous category B", HSC_COLOR, HSC_FILL_COLOR),
  43: newShipType("High speed craft (HSC), Hazardous category C", HSC_COLOR, HSC_FILL_COLOR),
  44: newShipType("High speed craft (HSC), Hazardous category D", HSC_COLOR, HSC_FILL_COLOR),
  45: newShipType("High speed craft (HSC), Reserved for future use", HSC_COLOR, HSC_FILL_COLOR),
  46: newShipType("High speed craft (HSC), Reserved for future use", HSC_COLOR, HSC_FILL_COLOR),
  47: newShipType("High speed craft (HSC), Reserved for future use", HSC_COLOR, HSC_FILL_COLOR),
  48: newShipType("High speed craft (HSC), Reserved for future use", HSC_COLOR, HSC_FILL_COLOR),
  49: newShipType("High speed craft (HSC), No additional information", HSC_COLOR, HSC_FILL_COLOR),
  50: newShipType("Pilot Vessel", TYPE_5X_COLOR, TYPE_5X_FILL_COLOR),
  51: newShipType("Search and Rescue vessel", TYPE_5X_COLOR, TYPE_5X_FILL_COLOR),
  52: newShipType("Tug", TYPE_5X_COLOR, TYPE_5X_FILL_COLOR),
  53: newShipType("Port Tender", TYPE_5X_COLOR, TYPE_5X_FILL_COLOR),
  54: newShipType("Anti-pollution equipment", TYPE_5X_COLOR, TYPE_5X_FILL_COLOR),
  55: newShipType("Law Enforcement", TYPE_5X_COLOR, TYPE_5X_FILL_COLOR),
  56: newShipType("Spare - Local Vessel", TYPE_5X_COLOR, TYPE_5X_FILL_COLOR),
  57: newShipType("Spare - Local Vessel", TYPE_5X_COLOR, TYPE_5X_FILL_COLOR),
  58: newShipType("Medical Transport", TYPE_5X_COLOR, TYPE_5X_FILL_COLOR),
  59: newShipType("Noncombatant ship according to RR Resolution No. 18", "", ""),
  60: newShipType("Passenger, all ships of this type", PASSENGER_COLOR, PASSENGER_FILL_COLOR),
  61: newShipType("Passenger, Hazardous category A", PASSENGER_COLOR, PASSENGER_FILL_COLOR),
  62: newShipType("Passenger, Hazardous category B", PASSENGER_COLOR, PASSENGER_FILL_COLOR),
  63: newShipType("Passenger, Hazardous category C", PASSENGER_COLOR, PASSENGER_FILL_COLOR),
  64: newShipType("Passenger, Hazardous category D", PASSENGER_COLOR, PASSENGER_FILL_COLOR),
  65: newShipType("Passenger, Reserved for future use", PASSENGER_COLOR, PASSENGER_FILL_COLOR),
  66: newShipType("Passenger, Reserved for future use", PASSENGER_COLOR, PASSENGER_FILL_COLOR),
  67: newShipType("Passenger, Reserved for future use", PASSENGER_COLOR, PASSENGER_FILL_COLOR),
  68: newShipType("Passenger, Reserved for future use", PASSENGER_COLOR, PASSENGER_FILL_COLOR),
  69: newShipType("Passenger, No additional information", PASSENGER_COLOR, PASSENGER_FILL_COLOR),
  70: newShipType("Cargo, all ships of this type", CARGO_COLOR, CARGO_FILL_COLOR),
  71: newShipType("Cargo, Hazardous category A", CARGO_COLOR, CARGO_FILL_COLOR),
  72: newShipType("Cargo, Hazardous category B", CARGO_COLOR, CARGO_FILL_COLOR),
  73: newShipType("Cargo, Hazardous category C", CARGO_COLOR, CARGO_FILL_COLOR),
  74: newShipType("Cargo, Hazardous category D", CARGO_COLOR, CARGO_FILL_COLOR),
  75: newShipType("Cargo, Reserved for future use", CARGO_COLOR, CARGO_FILL_COLOR),
  76: newShipType("Cargo, Reserved for future use", CARGO_COLOR, CARGO_FILL_COLOR),
  77: newShipType("Cargo, Reserved for future use", CARGO_COLOR, CARGO_FILL_COLOR),
  78: newShipType("Cargo, Reserved for future use", CARGO_COLOR, CARGO_FILL_COLOR),
  79: newShipType("Cargo, No additional information", CARGO_COLOR, CARGO_FILL_COLOR),
  80: newShipType("Tanker, all ships of this type", TANKER_COLOR, TANKER_FILL_COLOR),
  81: newShipType("Tanker, Hazardous category A", TANKER_COLOR, TANKER_FILL_COLOR),
  82: newShipType("Tanker, Hazardous category B", TANKER_COLOR, TANKER_FILL_COLOR),
  83: newShipType("Tanker, Hazardous category C", TANKER_COLOR, TANKER_FILL_COLOR),
  84: newShipType("Tanker, Hazardous category D", TANKER_COLOR, TANKER_FILL_COLOR),
  85: newShipType("Tanker, Reserved for future use", TANKER_COLOR, TANKER_FILL_COLOR),
  86: newShipType("Tanker, Reserved for future use", TANKER_COLOR, TANKER_FILL_COLOR),
  87: newShipType("Tanker, Reserved for future use", TANKER_COLOR, TANKER_FILL_COLOR),
  88: newShipType("Tanker, Reserved for future use", TANKER_COLOR, TANKER_FILL_COLOR),
  89: newShipType("Tanker, No additional information", TANKER_COLOR, TANKER_FILL_COLOR),
  90: newShipType("Other Type, all ships of this type", OTHER_COLOR, OTHER_FILL_COLOR),
  91: newShipType("Other Type, Hazardous category A", OTHER_COLOR, OTHER_FILL_COLOR),
  92: newShipType("Other Type, Hazardous category B", OTHER_COLOR, OTHER_FILL_COLOR),
  93: newShipType("Other Type, Hazardous category C", OTHER_COLOR, OTHER_FILL_COLOR),
  94: newShipType("Other Type, Hazardous category D", OTHER_COLOR, OTHER_FILL_COLOR),
  95: newShipType("Other Type, Reserved for future use", OTHER_COLOR, OTHER_FILL_COLOR),
  96: newShipType("Other Type, Reserved for future use", OTHER_COLOR, OTHER_FILL_COLOR),
  97: newShipType("Other Type, Reserved for future use", OTHER_COLOR, OTHER_FILL_COLOR),
  98: newShipType("Other Type, Reserved for future use", OTHER_COLOR, OTHER_FILL_COLOR),
  99: newShipType("Other Type, no additional information", OTHER_COLOR, OTHER_FILL_COLOR)
};
const RESERVED_TYPE = newShipType("Reserved", RESERVED_COLOR, RESERVED_FILL_COLOR);
const UNKNOWN_TYPE = newShipType("Unknown", RESERVED_COLOR, RESERVED_FILL_COLOR);
const _AISTrackSymbol = class extends TrackSymbol {
  constructor(positionReport, options) {
    super([positionReport.latitude, positionReport.longitude], options);
    leafletSrcExports.Util.setOptions(this, options);
    options = options || {};
    this._leaderTime = options.leaderTime || DEFAULT_LEADER_TIME;
    this._minZoomLevel = options.minZoomLevel || DEFAULT_MIN_ZOOM_LEVEL;
    this._size = options.size || DEFAULT_SIZE;
    this.setPositionReport(positionReport);
    this.setShipStaticData(options.shipStaticData);
  }
  setPositionReport(positionReport) {
    this._positionReport = positionReport;
    this.setLatLng([positionReport.latitude, positionReport.longitude]);
    if (!isNullOrUndefined(positionReport.trueHeading) && positionReport.trueHeading != 511) {
      this.setHeading(toRadians$1(positionReport.trueHeading));
    } else {
      this.setHeading(void 0);
    }
    if (!isNullOrUndefined(positionReport.cog) && positionReport.cog < 360) {
      this.setCourse(toRadians$1(positionReport.cog));
    } else {
      this.setCourse(void 0);
    }
    if (!isNullOrUndefined(positionReport.sog) && positionReport.sog < 102.3) {
      this.setSpeed(positionReport.sog / KNOTS_PER_METER_PER_SECOND);
    } else {
      this.setSpeed(void 0);
    }
    return this.redraw();
  }
  setShipStaticData(shipStaticData) {
    this._shipStaticData = shipStaticData;
    const shipType = !isNullOrUndefined(shipStaticData) && !isNullOrUndefined(shipStaticData.type) ? getShipType(shipStaticData.type) : TYPES[0];
    this.setStyle({
      color: shipType.color,
      fill: true,
      fillOpacity: 1,
      fillColor: shipType.fillColor
    });
    this.bindPopup(this._getPopupContent(this._positionReport, shipStaticData));
    return this.setShapeOptions(_AISTrackSymbol._getShapeOptions(
      this._leaderTime,
      this._minZoomLevel,
      this._size,
      shipStaticData
    ));
  }
  static _getShapeOptions(leaderTime, minZoomLevel, size, shipStaticData) {
    const shapeOptions = {
      leaderTime,
      defaultShapeSet: TrackSymbol.createShapeSet(size)
    };
    const shapeSet = _AISTrackSymbol._getShapeSet(size, shipStaticData);
    if (shapeSet !== null) {
      shapeOptions.shapeSetEntries = [{
        shapeSet,
        minZoomLevel
      }];
    }
    return shapeOptions;
  }
  static _getShapeSet(size, shipStaticData) {
    if (isNullOrUndefined(shipStaticData) || isNullOrUndefined(shipStaticData.dimension) || !isDimensionValid(shipStaticData.dimension)) {
      return null;
    }
    return {
      withHeading: {
        points: _AISTrackSymbol.DEFAULT_SILHOUETTE_SHAPE_POINTS,
        center: [shipStaticData.dimension.B, shipStaticData.dimension.D],
        length: shipStaticData.dimension.A + shipStaticData.dimension.B,
        breadth: shipStaticData.dimension.C + shipStaticData.dimension.D,
        units: "meters"
      },
      withoutHeading: TrackSymbol.createShape(TrackSymbol.DEFAULT_NOHEADING_SHAPE_POINTS, size)
    };
  }
  _getPopupContent(positionReport, shipStaticData) {
    let content = "<table>";
    if (!isNullOrUndefined(shipStaticData)) {
      content += createTableRow("User ID", shipStaticData.userId);
      content += createTableRow("IMO Number", shipStaticData.imoNumber);
      content += createTableRow("Call sign", shipStaticData.callSign);
      content += createTableRow("Name", shipStaticData.name);
    }
    if (!isNullOrUndefined(positionReport)) {
      content += createTableRow("Location", `${positionReport.latitude}, ${positionReport.longitude}`);
      content += createTableRow("SOG", !isNullOrUndefined(positionReport.sog) ? positionReport.sog.toFixed(2) : void 0, "knots");
      content += createTableRow("COG", !isNullOrUndefined(positionReport.cog) ? positionReport.cog.toFixed(1) : void 0, "°");
      content += createTableRow("Heading", !isNullOrUndefined(positionReport.trueHeading) ? positionReport.trueHeading.toFixed(1) : void 0, "°");
      content += createTableRow(
        "Navigation status",
        toNavigationStatusString(positionReport.navigationalStatus)
      );
    }
    if (!isNullOrUndefined(shipStaticData)) {
      content += createTableRow("Type", toTypeString(shipStaticData.type));
      if (!isNullOrUndefined(shipStaticData.dimension) && isDimensionValid(shipStaticData.dimension)) {
        content += createTableRow(
          "Ship length",
          shipStaticData.dimension.A + shipStaticData.dimension.B,
          "m"
        );
        content += createTableRow(
          "Ship width",
          shipStaticData.dimension.C + shipStaticData.dimension.D,
          "m"
        );
      }
      content += createTableRow("Fix type", toFixTypeString(shipStaticData.fixType));
      content += createTableRow("ETA", toETAString(shipStaticData.eta));
      content += createTableRow(
        "Maximum static draught",
        !isNullOrUndefined(shipStaticData.maximumStaticDraught) ? shipStaticData.maximumStaticDraught.toFixed(1) : void 0,
        "m"
      );
      content += createTableRow("Destination", shipStaticData.destination);
      content += createTableRow("DTE", shipStaticData.dte);
    }
    content += "</table>";
    const popupContent = leafletSrcExports.DomUtil.create("div");
    popupContent.innerHTML = content;
    return popupContent;
  }
};
let AISTrackSymbol = _AISTrackSymbol;
AISTrackSymbol.DEFAULT_SILHOUETTE_SHAPE_POINTS = [[1, 0.5], [0.75, 1], [0, 1], [0, 0], [0.75, 0]];
function toTypeString(type) {
  if (isNullOrUndefined(type)) {
    return void 0;
  }
  const shipType = getShipType(type);
  return shipType.name;
}
function toFixTypeString(fixType) {
  if (isNullOrUndefined(fixType)) {
    return void 0;
  }
  switch (fixType) {
    case 0:
      return void 0;
    case 1:
      return "GPS";
    case 2:
      return "GLONASS";
    case 3:
      return "combined GPS/GLONASS";
    case 4:
      return "Loran-C";
    case 5:
      return "Chayka";
    case 6:
      return "integrated navigation system";
    case 7:
      return "surveyed";
    case 8:
      return "Galileo";
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
function toNavigationStatusString(navigationStatus) {
  if (isNullOrUndefined(navigationStatus)) {
    return void 0;
  }
  switch (navigationStatus) {
    case 0:
      return "Under way using engine";
    case 1:
      return "At anchor";
    case 2:
      return "Not under command";
    case 3:
      return "Restricted manoeuverability";
    case 4:
      return "Constrained by her draught";
    case 5:
      return "Moored";
    case 6:
      return "Aground";
    case 7:
      return "Engaged in Fishing";
    case 8:
      return "Under way sailing";
    case 9:
      return "Reserved for future amendment of Navigational Status for HSC";
    case 10:
      return "Reserved for future amendment of Navigational Status for WIG";
    case 11:
      return "Reserved for future use";
    case 12:
      return "Reserved for future use";
    case 13:
      return "Reserved for future use";
    case 14:
      return "AIS-SART is active";
    case 15:
      return "Not defined (default)";
    default:
      return `unknown (${navigationStatus})`;
  }
}
function toETAString(eta) {
  if (isNullOrUndefined(eta)) {
    return void 0;
  }
  return `${eta.month.toString().padStart(2, "0")}/${eta.day.toString().padStart(2, "0")} ${eta.hour.toString().padStart(2, "0")}:${eta.minute.toString().padStart(2, "0")} UTC`;
}
function toRadians$1(degs) {
  if (degs === null || degs === void 0) {
    return void 0;
  }
  return degs * Math.PI / 180;
}
function isNullOrUndefined(v) {
  return v === null || v === void 0;
}
function isDimensionValid(dimension) {
  return !isNullOrUndefined(dimension) && dimension.A > 0 && dimension.B > 0 && dimension.C > 0 && dimension.D > 0;
}
function createTableRow(name, value, unit) {
  if (isNullOrUndefined(value)) {
    return "";
  }
  return `<tr><td>${name}</td><td>${value} ${isNullOrUndefined(unit) ? "" : unit}</td></tr>`;
}
function newShipType(name, color, fillColor) {
  return {
    name,
    color,
    fillColor
  };
}
function getShipType(type) {
  if (type < 0 || type > 99) {
    return UNKNOWN_TYPE;
  }
  const shipType = TYPES[type];
  if (!isNullOrUndefined(shipType)) {
    return shipType;
  }
  return RESERVED_TYPE;
}
leafletSrcExports["trackSymbol"] = function(latLng, options) {
  return new TrackSymbol(latLng, options);
};
leafletSrcExports["TrackSymbol"] = TrackSymbol;
leafletSrcExports["aisTrackSymbol"] = function(positionReport, options) {
  return new AISTrackSymbol(positionReport, options);
};
leafletSrcExports["AISTrackSymbol"] = AISTrackSymbol;
const AISTrackSymbol_story_svelte_svelte_type_style_lang = "";
const file$1 = "src/stories/AISTrackSymbol.story.svelte";
function create_default_slot$1(ctx) {
  let div;
  const block = {
    c: function create() {
      div = element("div");
      attr_dev(div, "id", "map");
      add_location(div, file$1, 108, 4, 2369);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      ctx[18](div);
    },
    p: noop,
    d: function destroy(detaching) {
      if (detaching)
        detach_dev(div);
      ctx[18](null);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot$1.name,
    type: "slot",
    source: '(108:0) <Hst.Story group=\\"layers\\">',
    ctx
  });
  return block;
}
function create_controls_slot$1(ctx) {
  let h30;
  let t1;
  let hst_number0;
  let updating_value;
  let t2;
  let hst_number1;
  let updating_value_1;
  let t3;
  let hst_number2;
  let updating_value_2;
  let t4;
  let button0;
  let t6;
  let h31;
  let t8;
  let hst_number3;
  let updating_value_3;
  let t9;
  let hst_number4;
  let updating_value_4;
  let t10;
  let hst_number5;
  let updating_value_5;
  let t11;
  let button1;
  let current;
  let mounted;
  let dispose;
  function hst_number0_value_binding(value) {
    ctx[10](value);
  }
  let hst_number0_props = { title: "Heading (deg)" };
  if (ctx[2].trueHeading !== void 0) {
    hst_number0_props.value = ctx[2].trueHeading;
  }
  hst_number0 = new ctx[0].Number({ props: hst_number0_props, $$inline: true });
  binding_callbacks.push(() => bind(hst_number0, "value", hst_number0_value_binding, ctx[2].trueHeading));
  function hst_number1_value_binding(value) {
    ctx[11](value);
  }
  let hst_number1_props = { title: "COG (deg)" };
  if (ctx[2].cog !== void 0) {
    hst_number1_props.value = ctx[2].cog;
  }
  hst_number1 = new ctx[0].Number({ props: hst_number1_props, $$inline: true });
  binding_callbacks.push(() => bind(hst_number1, "value", hst_number1_value_binding, ctx[2].cog));
  function hst_number2_value_binding(value) {
    ctx[12](value);
  }
  let hst_number2_props = { title: "SOG (knots)" };
  if (ctx[2].sog !== void 0) {
    hst_number2_props.value = ctx[2].sog;
  }
  hst_number2 = new ctx[0].Number({ props: hst_number2_props, $$inline: true });
  binding_callbacks.push(() => bind(hst_number2, "value", hst_number2_value_binding, ctx[2].sog));
  function hst_number3_value_binding(value) {
    ctx[14](value);
  }
  let hst_number3_props = { title: "Heading (deg)" };
  if (ctx[3].trueHeading !== void 0) {
    hst_number3_props.value = ctx[3].trueHeading;
  }
  hst_number3 = new ctx[0].Number({ props: hst_number3_props, $$inline: true });
  binding_callbacks.push(() => bind(hst_number3, "value", hst_number3_value_binding, ctx[3].trueHeading));
  function hst_number4_value_binding(value) {
    ctx[15](value);
  }
  let hst_number4_props = { title: "COG (deg)" };
  if (ctx[3].cog !== void 0) {
    hst_number4_props.value = ctx[3].cog;
  }
  hst_number4 = new ctx[0].Number({ props: hst_number4_props, $$inline: true });
  binding_callbacks.push(() => bind(hst_number4, "value", hst_number4_value_binding, ctx[3].cog));
  function hst_number5_value_binding(value) {
    ctx[16](value);
  }
  let hst_number5_props = { title: "SOG (knots)" };
  if (ctx[3].sog !== void 0) {
    hst_number5_props.value = ctx[3].sog;
  }
  hst_number5 = new ctx[0].Number({ props: hst_number5_props, $$inline: true });
  binding_callbacks.push(() => bind(hst_number5, "value", hst_number5_value_binding, ctx[3].sog));
  const block = {
    c: function create() {
      h30 = element("h3");
      h30.textContent = "AISTrackSymbol1";
      t1 = space();
      create_component(hst_number0.$$.fragment);
      t2 = space();
      create_component(hst_number1.$$.fragment);
      t3 = space();
      create_component(hst_number2.$$.fragment);
      t4 = space();
      button0 = element("button");
      button0.textContent = "Locate";
      t6 = space();
      h31 = element("h3");
      h31.textContent = "AISTrackSymbol2";
      t8 = space();
      create_component(hst_number3.$$.fragment);
      t9 = space();
      create_component(hst_number4.$$.fragment);
      t10 = space();
      create_component(hst_number5.$$.fragment);
      t11 = space();
      button1 = element("button");
      button1.textContent = "Locate";
      add_location(h30, file$1, 112, 8, 2465);
      attr_dev(button0, "class", "htw-p-2");
      add_location(button0, file$1, 116, 8, 2734);
      add_location(h31, file$1, 118, 8, 2812);
      attr_dev(button1, "class", "htw-p-2");
      add_location(button1, file$1, 122, 8, 3081);
    },
    m: function mount(target, anchor) {
      insert_dev(target, h30, anchor);
      insert_dev(target, t1, anchor);
      mount_component(hst_number0, target, anchor);
      insert_dev(target, t2, anchor);
      mount_component(hst_number1, target, anchor);
      insert_dev(target, t3, anchor);
      mount_component(hst_number2, target, anchor);
      insert_dev(target, t4, anchor);
      insert_dev(target, button0, anchor);
      insert_dev(target, t6, anchor);
      insert_dev(target, h31, anchor);
      insert_dev(target, t8, anchor);
      mount_component(hst_number3, target, anchor);
      insert_dev(target, t9, anchor);
      mount_component(hst_number4, target, anchor);
      insert_dev(target, t10, anchor);
      mount_component(hst_number5, target, anchor);
      insert_dev(target, t11, anchor);
      insert_dev(target, button1, anchor);
      current = true;
      if (!mounted) {
        dispose = [
          listen_dev(button0, "click", ctx[13], false, false, false),
          listen_dev(button1, "click", ctx[17], false, false, false)
        ];
        mounted = true;
      }
    },
    p: function update(ctx2, dirty) {
      const hst_number0_changes = {};
      if (!updating_value && dirty & 4) {
        updating_value = true;
        hst_number0_changes.value = ctx2[2].trueHeading;
        add_flush_callback(() => updating_value = false);
      }
      hst_number0.$set(hst_number0_changes);
      const hst_number1_changes = {};
      if (!updating_value_1 && dirty & 4) {
        updating_value_1 = true;
        hst_number1_changes.value = ctx2[2].cog;
        add_flush_callback(() => updating_value_1 = false);
      }
      hst_number1.$set(hst_number1_changes);
      const hst_number2_changes = {};
      if (!updating_value_2 && dirty & 4) {
        updating_value_2 = true;
        hst_number2_changes.value = ctx2[2].sog;
        add_flush_callback(() => updating_value_2 = false);
      }
      hst_number2.$set(hst_number2_changes);
      const hst_number3_changes = {};
      if (!updating_value_3 && dirty & 8) {
        updating_value_3 = true;
        hst_number3_changes.value = ctx2[3].trueHeading;
        add_flush_callback(() => updating_value_3 = false);
      }
      hst_number3.$set(hst_number3_changes);
      const hst_number4_changes = {};
      if (!updating_value_4 && dirty & 8) {
        updating_value_4 = true;
        hst_number4_changes.value = ctx2[3].cog;
        add_flush_callback(() => updating_value_4 = false);
      }
      hst_number4.$set(hst_number4_changes);
      const hst_number5_changes = {};
      if (!updating_value_5 && dirty & 8) {
        updating_value_5 = true;
        hst_number5_changes.value = ctx2[3].sog;
        add_flush_callback(() => updating_value_5 = false);
      }
      hst_number5.$set(hst_number5_changes);
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(hst_number0.$$.fragment, local);
      transition_in(hst_number1.$$.fragment, local);
      transition_in(hst_number2.$$.fragment, local);
      transition_in(hst_number3.$$.fragment, local);
      transition_in(hst_number4.$$.fragment, local);
      transition_in(hst_number5.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(hst_number0.$$.fragment, local);
      transition_out(hst_number1.$$.fragment, local);
      transition_out(hst_number2.$$.fragment, local);
      transition_out(hst_number3.$$.fragment, local);
      transition_out(hst_number4.$$.fragment, local);
      transition_out(hst_number5.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching)
        detach_dev(h30);
      if (detaching)
        detach_dev(t1);
      destroy_component(hst_number0, detaching);
      if (detaching)
        detach_dev(t2);
      destroy_component(hst_number1, detaching);
      if (detaching)
        detach_dev(t3);
      destroy_component(hst_number2, detaching);
      if (detaching)
        detach_dev(t4);
      if (detaching)
        detach_dev(button0);
      if (detaching)
        detach_dev(t6);
      if (detaching)
        detach_dev(h31);
      if (detaching)
        detach_dev(t8);
      destroy_component(hst_number3, detaching);
      if (detaching)
        detach_dev(t9);
      destroy_component(hst_number4, detaching);
      if (detaching)
        detach_dev(t10);
      destroy_component(hst_number5, detaching);
      if (detaching)
        detach_dev(t11);
      if (detaching)
        detach_dev(button1);
      mounted = false;
      run_all(dispose);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_controls_slot$1.name,
    type: "slot",
    source: '(112:4) <svelte:fragment slot=\\"controls\\">',
    ctx
  });
  return block;
}
function create_fragment$1(ctx) {
  let hst_story;
  let current;
  hst_story = new ctx[0].Story({
    props: {
      group: "layers",
      $$slots: {
        controls: [create_controls_slot$1],
        default: [create_default_slot$1]
      },
      $$scope: { ctx }
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(hst_story.$$.fragment);
    },
    l: function claim(nodes) {
      throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    },
    m: function mount(target, anchor) {
      mount_component(hst_story, target, anchor);
      current = true;
    },
    p: function update(ctx2, [dirty]) {
      const hst_story_changes = {};
      if (dirty & 524318) {
        hst_story_changes.$$scope = { dirty, ctx: ctx2 };
      }
      hst_story.$set(hst_story_changes);
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(hst_story.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(hst_story.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(hst_story, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$1.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}
function instance$1($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  validate_slots("AISTrackSymbol_story", slots, []);
  let { Hst } = $$props;
  const p1 = [1.229, 103.813];
  const p2 = [1.239, 103.854];
  let mapElement;
  let map;
  let ts1;
  let ts2;
  let center = [1.251, 103.826];
  let positionReport1 = {
    latitude: p1[0],
    longitude: p1[1],
    trueHeading: 320,
    cog: 45,
    sog: 2
  };
  let positionReport2 = {
    latitude: p2[0],
    longitude: p2[1],
    trueHeading: 120,
    cog: 240,
    sog: 5
  };
  onMount(() => {
    if (!mapElement) {
      return;
    }
    $$invalidate(7, map = leafletSrcExports.map(mapElement, { center, zoom: 13 }));
    leafletSrcExports.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    $$invalidate(8, ts1 = new AISTrackSymbol(
      positionReport1,
      {
        shipStaticData: {
          userId: 123,
          imoNumber: 456,
          callSign: "ABC",
          name: "ABC",
          type: 31,
          dimension: { A: 80, B: 30, C: 20, D: 40 },
          fixType: 1,
          eta: { month: 2, day: 5, hour: 15, minute: 37 },
          destination: "Singapore",
          dte: true
        }
      }
    ));
    ts1.bindTooltip("AISTrackSymbol1");
    ts1.addTo(map);
    $$invalidate(9, ts2 = new AISTrackSymbol(positionReport2, {}));
    ts2.bindTooltip("AISTrackSymbol2");
    ts2.addTo(map);
  });
  $$self.$$.on_mount.push(function() {
    if (Hst === void 0 && !("Hst" in $$props || $$self.$$.bound[$$self.$$.props["Hst"]])) {
      console.warn("<AISTrackSymbol_story> was created without expected prop 'Hst'");
    }
  });
  const writable_props = ["Hst"];
  Object.keys($$props).forEach((key) => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
      console.warn(`<AISTrackSymbol_story> was created with unknown prop '${key}'`);
  });
  function hst_number0_value_binding(value) {
    if ($$self.$$.not_equal(positionReport1.trueHeading, value)) {
      positionReport1.trueHeading = value;
      $$invalidate(2, positionReport1);
    }
  }
  function hst_number1_value_binding(value) {
    if ($$self.$$.not_equal(positionReport1.cog, value)) {
      positionReport1.cog = value;
      $$invalidate(2, positionReport1);
    }
  }
  function hst_number2_value_binding(value) {
    if ($$self.$$.not_equal(positionReport1.sog, value)) {
      positionReport1.sog = value;
      $$invalidate(2, positionReport1);
    }
  }
  const click_handler = () => $$invalidate(1, center = p1);
  function hst_number3_value_binding(value) {
    if ($$self.$$.not_equal(positionReport2.trueHeading, value)) {
      positionReport2.trueHeading = value;
      $$invalidate(3, positionReport2);
    }
  }
  function hst_number4_value_binding(value) {
    if ($$self.$$.not_equal(positionReport2.cog, value)) {
      positionReport2.cog = value;
      $$invalidate(3, positionReport2);
    }
  }
  function hst_number5_value_binding(value) {
    if ($$self.$$.not_equal(positionReport2.sog, value)) {
      positionReport2.sog = value;
      $$invalidate(3, positionReport2);
    }
  }
  const click_handler_1 = () => $$invalidate(1, center = p2);
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      mapElement = $$value;
      $$invalidate(4, mapElement);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("Hst" in $$props2)
      $$invalidate(0, Hst = $$props2.Hst);
  };
  $$self.$capture_state = () => ({
    onMount,
    L: leafletSrcExports,
    LeafletMap: leafletSrcExports.Map,
    AISTrackSymbol,
    Hst,
    p1,
    p2,
    mapElement,
    map,
    ts1,
    ts2,
    center,
    positionReport1,
    positionReport2
  });
  $$self.$inject_state = ($$props2) => {
    if ("Hst" in $$props2)
      $$invalidate(0, Hst = $$props2.Hst);
    if ("mapElement" in $$props2)
      $$invalidate(4, mapElement = $$props2.mapElement);
    if ("map" in $$props2)
      $$invalidate(7, map = $$props2.map);
    if ("ts1" in $$props2)
      $$invalidate(8, ts1 = $$props2.ts1);
    if ("ts2" in $$props2)
      $$invalidate(9, ts2 = $$props2.ts2);
    if ("center" in $$props2)
      $$invalidate(1, center = $$props2.center);
    if ("positionReport1" in $$props2)
      $$invalidate(2, positionReport1 = $$props2.positionReport1);
    if ("positionReport2" in $$props2)
      $$invalidate(3, positionReport2 = $$props2.positionReport2);
  };
  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 260) {
      {
        positionReport1.trueHeading;
        positionReport1.cog;
        positionReport1.sog;
        if (ts1) {
          ts1.setPositionReport(positionReport1);
        }
      }
    }
    if ($$self.$$.dirty & 520) {
      {
        positionReport2.trueHeading;
        positionReport2.cog;
        positionReport2.sog;
        if (ts2) {
          ts2.setPositionReport(positionReport2);
        }
      }
    }
    if ($$self.$$.dirty & 130) {
      {
        if (map) {
          map.setView(center);
        }
      }
    }
  };
  return [
    Hst,
    center,
    positionReport1,
    positionReport2,
    mapElement,
    p1,
    p2,
    map,
    ts1,
    ts2,
    hst_number0_value_binding,
    hst_number1_value_binding,
    hst_number2_value_binding,
    click_handler,
    hst_number3_value_binding,
    hst_number4_value_binding,
    hst_number5_value_binding,
    click_handler_1,
    div_binding
  ];
}
class AISTrackSymbol_story extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$1, create_fragment$1, safe_not_equal, { Hst: 0 });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "AISTrackSymbol_story",
      options,
      id: create_fragment$1.name
    });
  }
  get Hst() {
    throw new Error("<AISTrackSymbol_story>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set Hst(value) {
    throw new Error("<AISTrackSymbol_story>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
}
const TrackSymbol_story_svelte_svelte_type_style_lang = "";
const file = "src/stories/TrackSymbol.story.svelte";
function create_default_slot(ctx) {
  let div;
  const block = {
    c: function create() {
      div = element("div");
      attr_dev(div, "id", "map");
      add_location(div, file, 117, 4, 2994);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      ctx[22](div);
    },
    p: noop,
    d: function destroy(detaching) {
      if (detaching)
        detach_dev(div);
      ctx[22](null);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot.name,
    type: "slot",
    source: '(117:0) <Hst.Story group=\\"layers\\">',
    ctx
  });
  return block;
}
function create_controls_slot(ctx) {
  let h30;
  let t1;
  let hst_number0;
  let updating_value;
  let t2;
  let hst_number1;
  let updating_value_1;
  let t3;
  let hst_number2;
  let updating_value_2;
  let t4;
  let button0;
  let t6;
  let h31;
  let t8;
  let hst_number3;
  let updating_value_3;
  let t9;
  let hst_number4;
  let updating_value_4;
  let t10;
  let hst_number5;
  let updating_value_5;
  let t11;
  let button1;
  let current;
  let mounted;
  let dispose;
  function hst_number0_value_binding(value) {
    ctx[14](value);
  }
  let hst_number0_props = { title: "Heading (deg)" };
  if (ctx[2] !== void 0) {
    hst_number0_props.value = ctx[2];
  }
  hst_number0 = new ctx[0].Number({ props: hst_number0_props, $$inline: true });
  binding_callbacks.push(() => bind(hst_number0, "value", hst_number0_value_binding, ctx[2]));
  function hst_number1_value_binding(value) {
    ctx[15](value);
  }
  let hst_number1_props = { title: "Course (deg)" };
  if (ctx[3] !== void 0) {
    hst_number1_props.value = ctx[3];
  }
  hst_number1 = new ctx[0].Number({ props: hst_number1_props, $$inline: true });
  binding_callbacks.push(() => bind(hst_number1, "value", hst_number1_value_binding, ctx[3]));
  function hst_number2_value_binding(value) {
    ctx[16](value);
  }
  let hst_number2_props = { title: "Speed (m/s)" };
  if (ctx[4] !== void 0) {
    hst_number2_props.value = ctx[4];
  }
  hst_number2 = new ctx[0].Number({ props: hst_number2_props, $$inline: true });
  binding_callbacks.push(() => bind(hst_number2, "value", hst_number2_value_binding, ctx[4]));
  function hst_number3_value_binding(value) {
    ctx[18](value);
  }
  let hst_number3_props = { title: "Heading (deg)" };
  if (ctx[5] !== void 0) {
    hst_number3_props.value = ctx[5];
  }
  hst_number3 = new ctx[0].Number({ props: hst_number3_props, $$inline: true });
  binding_callbacks.push(() => bind(hst_number3, "value", hst_number3_value_binding, ctx[5]));
  function hst_number4_value_binding(value) {
    ctx[19](value);
  }
  let hst_number4_props = { title: "Course (deg)" };
  if (ctx[6] !== void 0) {
    hst_number4_props.value = ctx[6];
  }
  hst_number4 = new ctx[0].Number({ props: hst_number4_props, $$inline: true });
  binding_callbacks.push(() => bind(hst_number4, "value", hst_number4_value_binding, ctx[6]));
  function hst_number5_value_binding(value) {
    ctx[20](value);
  }
  let hst_number5_props = { title: "Speed (m/s)" };
  if (ctx[7] !== void 0) {
    hst_number5_props.value = ctx[7];
  }
  hst_number5 = new ctx[0].Number({ props: hst_number5_props, $$inline: true });
  binding_callbacks.push(() => bind(hst_number5, "value", hst_number5_value_binding, ctx[7]));
  const block = {
    c: function create() {
      h30 = element("h3");
      h30.textContent = "TrackSymbol1";
      t1 = space();
      create_component(hst_number0.$$.fragment);
      t2 = space();
      create_component(hst_number1.$$.fragment);
      t3 = space();
      create_component(hst_number2.$$.fragment);
      t4 = space();
      button0 = element("button");
      button0.textContent = "Locate";
      t6 = space();
      h31 = element("h3");
      h31.textContent = "TrackSymbol2";
      t8 = space();
      create_component(hst_number3.$$.fragment);
      t9 = space();
      create_component(hst_number4.$$.fragment);
      t10 = space();
      create_component(hst_number5.$$.fragment);
      t11 = space();
      button1 = element("button");
      button1.textContent = "Locate";
      add_location(h30, file, 121, 8, 3090);
      attr_dev(button0, "class", "htw-p-2");
      add_location(button0, file, 125, 8, 3315);
      add_location(h31, file, 127, 8, 3393);
      attr_dev(button1, "class", "htw-p-2");
      add_location(button1, file, 131, 8, 3618);
    },
    m: function mount(target, anchor) {
      insert_dev(target, h30, anchor);
      insert_dev(target, t1, anchor);
      mount_component(hst_number0, target, anchor);
      insert_dev(target, t2, anchor);
      mount_component(hst_number1, target, anchor);
      insert_dev(target, t3, anchor);
      mount_component(hst_number2, target, anchor);
      insert_dev(target, t4, anchor);
      insert_dev(target, button0, anchor);
      insert_dev(target, t6, anchor);
      insert_dev(target, h31, anchor);
      insert_dev(target, t8, anchor);
      mount_component(hst_number3, target, anchor);
      insert_dev(target, t9, anchor);
      mount_component(hst_number4, target, anchor);
      insert_dev(target, t10, anchor);
      mount_component(hst_number5, target, anchor);
      insert_dev(target, t11, anchor);
      insert_dev(target, button1, anchor);
      current = true;
      if (!mounted) {
        dispose = [
          listen_dev(button0, "click", ctx[17], false, false, false),
          listen_dev(button1, "click", ctx[21], false, false, false)
        ];
        mounted = true;
      }
    },
    p: function update(ctx2, dirty) {
      const hst_number0_changes = {};
      if (!updating_value && dirty & 4) {
        updating_value = true;
        hst_number0_changes.value = ctx2[2];
        add_flush_callback(() => updating_value = false);
      }
      hst_number0.$set(hst_number0_changes);
      const hst_number1_changes = {};
      if (!updating_value_1 && dirty & 8) {
        updating_value_1 = true;
        hst_number1_changes.value = ctx2[3];
        add_flush_callback(() => updating_value_1 = false);
      }
      hst_number1.$set(hst_number1_changes);
      const hst_number2_changes = {};
      if (!updating_value_2 && dirty & 16) {
        updating_value_2 = true;
        hst_number2_changes.value = ctx2[4];
        add_flush_callback(() => updating_value_2 = false);
      }
      hst_number2.$set(hst_number2_changes);
      const hst_number3_changes = {};
      if (!updating_value_3 && dirty & 32) {
        updating_value_3 = true;
        hst_number3_changes.value = ctx2[5];
        add_flush_callback(() => updating_value_3 = false);
      }
      hst_number3.$set(hst_number3_changes);
      const hst_number4_changes = {};
      if (!updating_value_4 && dirty & 64) {
        updating_value_4 = true;
        hst_number4_changes.value = ctx2[6];
        add_flush_callback(() => updating_value_4 = false);
      }
      hst_number4.$set(hst_number4_changes);
      const hst_number5_changes = {};
      if (!updating_value_5 && dirty & 128) {
        updating_value_5 = true;
        hst_number5_changes.value = ctx2[7];
        add_flush_callback(() => updating_value_5 = false);
      }
      hst_number5.$set(hst_number5_changes);
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(hst_number0.$$.fragment, local);
      transition_in(hst_number1.$$.fragment, local);
      transition_in(hst_number2.$$.fragment, local);
      transition_in(hst_number3.$$.fragment, local);
      transition_in(hst_number4.$$.fragment, local);
      transition_in(hst_number5.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(hst_number0.$$.fragment, local);
      transition_out(hst_number1.$$.fragment, local);
      transition_out(hst_number2.$$.fragment, local);
      transition_out(hst_number3.$$.fragment, local);
      transition_out(hst_number4.$$.fragment, local);
      transition_out(hst_number5.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching)
        detach_dev(h30);
      if (detaching)
        detach_dev(t1);
      destroy_component(hst_number0, detaching);
      if (detaching)
        detach_dev(t2);
      destroy_component(hst_number1, detaching);
      if (detaching)
        detach_dev(t3);
      destroy_component(hst_number2, detaching);
      if (detaching)
        detach_dev(t4);
      if (detaching)
        detach_dev(button0);
      if (detaching)
        detach_dev(t6);
      if (detaching)
        detach_dev(h31);
      if (detaching)
        detach_dev(t8);
      destroy_component(hst_number3, detaching);
      if (detaching)
        detach_dev(t9);
      destroy_component(hst_number4, detaching);
      if (detaching)
        detach_dev(t10);
      destroy_component(hst_number5, detaching);
      if (detaching)
        detach_dev(t11);
      if (detaching)
        detach_dev(button1);
      mounted = false;
      run_all(dispose);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_controls_slot.name,
    type: "slot",
    source: '(121:4) <svelte:fragment slot=\\"controls\\">',
    ctx
  });
  return block;
}
function create_fragment(ctx) {
  let hst_story;
  let current;
  hst_story = new ctx[0].Story({
    props: {
      group: "layers",
      $$slots: {
        controls: [create_controls_slot],
        default: [create_default_slot]
      },
      $$scope: { ctx }
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(hst_story.$$.fragment);
    },
    l: function claim(nodes) {
      throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    },
    m: function mount(target, anchor) {
      mount_component(hst_story, target, anchor);
      current = true;
    },
    p: function update(ctx2, [dirty]) {
      const hst_story_changes = {};
      if (dirty & 8389118) {
        hst_story_changes.$$scope = { dirty, ctx: ctx2 };
      }
      hst_story.$set(hst_story_changes);
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(hst_story.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(hst_story.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(hst_story, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}
function toRadians(degs) {
  if (degs === null || degs === void 0) {
    return void 0;
  }
  return degs * Math.PI / 180;
}
function normalize(value) {
  if (value === null || value === void 0) {
    return void 0;
  }
  return value;
}
function instance($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  validate_slots("TrackSymbol_story", slots, []);
  let { Hst } = $$props;
  const p1 = [1.229, 103.813];
  const p2 = [1.239, 103.854];
  let mapElement;
  let map;
  let ts1;
  let ts2;
  let center = [1.251, 103.826];
  let heading1 = 320;
  let course1 = 45;
  let speed1 = 2;
  let heading2 = 120;
  let course2 = 240;
  let speed2 = 5;
  onMount(() => {
    if (!mapElement) {
      return;
    }
    $$invalidate(11, map = leafletSrcExports.map(mapElement, { center, zoom: 13 }));
    leafletSrcExports.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    $$invalidate(12, ts1 = new TrackSymbol(
      p1,
      {
        fill: true,
        fillColor: "yellow",
        fillOpacity: 1,
        heading: toRadians(heading1),
        course: toRadians(course1),
        speed: normalize(speed1)
      }
    ));
    ts1.bindTooltip("TrackSymbol1");
    ts1.addTo(map);
    $$invalidate(13, ts2 = new TrackSymbol(
      p2,
      {
        fill: true,
        fillColor: "red",
        fillOpacity: 1,
        shapeOptions: {
          shapeSetEntries: [
            {
              shapeSet: {
                withHeading: {
                  points: [[1, 0.5], [0.75, 1], [0, 1], [0, 0], [0.75, 0]],
                  center: [30, 40],
                  length: 110,
                  breadth: 60,
                  units: "meters"
                },
                withoutHeading: TrackSymbol.createShape(TrackSymbol.DEFAULT_NOHEADING_SHAPE_POINTS, 24)
              },
              minZoomLevel: 14
            }
          ],
          defaultShapeSet: TrackSymbol.createShapeSet(24)
        },
        heading: toRadians(heading2),
        course: toRadians(course2),
        speed: normalize(speed2)
      }
    ));
    ts2.bindTooltip("TrackSymbol2");
    ts2.addTo(map);
  });
  $$self.$$.on_mount.push(function() {
    if (Hst === void 0 && !("Hst" in $$props || $$self.$$.bound[$$self.$$.props["Hst"]])) {
      console.warn("<TrackSymbol_story> was created without expected prop 'Hst'");
    }
  });
  const writable_props = ["Hst"];
  Object.keys($$props).forEach((key) => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
      console.warn(`<TrackSymbol_story> was created with unknown prop '${key}'`);
  });
  function hst_number0_value_binding(value) {
    heading1 = value;
    $$invalidate(2, heading1);
  }
  function hst_number1_value_binding(value) {
    course1 = value;
    $$invalidate(3, course1);
  }
  function hst_number2_value_binding(value) {
    speed1 = value;
    $$invalidate(4, speed1);
  }
  const click_handler = () => $$invalidate(1, center = p1);
  function hst_number3_value_binding(value) {
    heading2 = value;
    $$invalidate(5, heading2);
  }
  function hst_number4_value_binding(value) {
    course2 = value;
    $$invalidate(6, course2);
  }
  function hst_number5_value_binding(value) {
    speed2 = value;
    $$invalidate(7, speed2);
  }
  const click_handler_1 = () => $$invalidate(1, center = p2);
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      mapElement = $$value;
      $$invalidate(8, mapElement);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("Hst" in $$props2)
      $$invalidate(0, Hst = $$props2.Hst);
  };
  $$self.$capture_state = () => ({
    onMount,
    L: leafletSrcExports,
    LeafletMap: leafletSrcExports.Map,
    TrackSymbol,
    Hst,
    p1,
    p2,
    mapElement,
    map,
    ts1,
    ts2,
    center,
    heading1,
    course1,
    speed1,
    heading2,
    course2,
    speed2,
    toRadians,
    normalize
  });
  $$self.$inject_state = ($$props2) => {
    if ("Hst" in $$props2)
      $$invalidate(0, Hst = $$props2.Hst);
    if ("mapElement" in $$props2)
      $$invalidate(8, mapElement = $$props2.mapElement);
    if ("map" in $$props2)
      $$invalidate(11, map = $$props2.map);
    if ("ts1" in $$props2)
      $$invalidate(12, ts1 = $$props2.ts1);
    if ("ts2" in $$props2)
      $$invalidate(13, ts2 = $$props2.ts2);
    if ("center" in $$props2)
      $$invalidate(1, center = $$props2.center);
    if ("heading1" in $$props2)
      $$invalidate(2, heading1 = $$props2.heading1);
    if ("course1" in $$props2)
      $$invalidate(3, course1 = $$props2.course1);
    if ("speed1" in $$props2)
      $$invalidate(4, speed1 = $$props2.speed1);
    if ("heading2" in $$props2)
      $$invalidate(5, heading2 = $$props2.heading2);
    if ("course2" in $$props2)
      $$invalidate(6, course2 = $$props2.course2);
    if ("speed2" in $$props2)
      $$invalidate(7, speed2 = $$props2.speed2);
  };
  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 4124) {
      {
        if (ts1) {
          ts1.setHeading(toRadians(heading1));
          ts1.setCourse(toRadians(course1));
          ts1.setSpeed(normalize(speed1));
        }
      }
    }
    if ($$self.$$.dirty & 8416) {
      {
        if (ts2) {
          ts2.setHeading(toRadians(heading2));
          ts2.setCourse(toRadians(course2));
          ts2.setSpeed(normalize(speed2));
        }
      }
    }
    if ($$self.$$.dirty & 2050) {
      {
        if (map) {
          map.setView(center);
        }
      }
    }
  };
  return [
    Hst,
    center,
    heading1,
    course1,
    speed1,
    heading2,
    course2,
    speed2,
    mapElement,
    p1,
    p2,
    map,
    ts1,
    ts2,
    hst_number0_value_binding,
    hst_number1_value_binding,
    hst_number2_value_binding,
    click_handler,
    hst_number3_value_binding,
    hst_number4_value_binding,
    hst_number5_value_binding,
    click_handler_1,
    div_binding
  ];
}
class TrackSymbol_story extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, { Hst: 0 });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "TrackSymbol_story",
      options,
      id: create_fragment.name
    });
  }
  get Hst() {
    throw new Error("<TrackSymbol_story>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set Hst(value) {
    throw new Error("<TrackSymbol_story>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
}
const Comp2 = { "title": "HTML usage", "icon": "carbon:bookmark", "group": "usage", "docsOnly": true, "variants": [] };
const Comp3 = { "title": "Introduction", "icon": "carbon:bookmark", "group": "top", "docsOnly": true, "variants": [] };
let files = [
  { "id": "src-stories-aistracksymbol-story-svelte", "path": ["AISTrackSymbol"], "filePath": "src/stories/AISTrackSymbol.story.svelte", "story": { "id": "src-stories-aistracksymbol-story-svelte", "title": "AISTrackSymbol", "group": "layers", "layout": { "type": "single", "iframe": true }, "icon": null, "iconColor": null, "docsOnly": false, "variants": [{ "id": "_default", "title": "default" }] }, "supportPluginId": "svelte3", "index": 0, component: AISTrackSymbol_story, source: () => __vitePreload(() => import("./__resolved__virtual_story-source_src-stories-aistracksymbol-story-svelte-219a906b.js"), true ? [] : void 0) },
  { "id": "src-stories-tracksymbol-story-svelte", "path": ["TrackSymbol"], "filePath": "src/stories/TrackSymbol.story.svelte", "story": { "id": "src-stories-tracksymbol-story-svelte", "title": "TrackSymbol", "group": "layers", "layout": { "type": "single", "iframe": true }, "icon": null, "iconColor": null, "docsOnly": false, "variants": [{ "id": "_default", "title": "default" }] }, "supportPluginId": "svelte3", "index": 1, component: TrackSymbol_story, source: () => __vitePreload(() => import("./__resolved__virtual_story-source_src-stories-tracksymbol-story-svelte-e53e7244.js"), true ? [] : void 0) },
  { "id": "src-stories-htmlusage-story-js", "path": ["HTML usage"], "filePath": "src/stories/HtmlUsage.story.js", "story": { "id": "src-stories-htmlusage-story-js", "title": "HTML usage", "group": "usage", "layout": { "type": "single", "iframe": true }, "icon": "carbon:bookmark", "docsOnly": true, "variants": [] }, "supportPluginId": "vanilla", "index": 2, component: Comp2, source: () => __vitePreload(() => import("./__resolved__virtual_story-source_src-stories-htmlusage-story-js-f43d4315.js"), true ? [] : void 0) },
  { "id": "src-stories-introduction-story-js", "path": ["Introduction"], "filePath": "src/stories/Introduction.story.js", "story": { "id": "src-stories-introduction-story-js", "title": "Introduction", "group": "top", "layout": { "type": "single", "iframe": true }, "icon": "carbon:bookmark", "docsOnly": true, "variants": [] }, "supportPluginId": "vanilla", "index": 3, component: Comp3, source: () => __vitePreload(() => import("./__resolved__virtual_story-source_src-stories-introduction-story-js-310c24de.js"), true ? [] : void 0) }
];
let tree = [{ "group": true, "id": "top", "title": "", "children": [{ "title": "Introduction", "index": 3 }] }, { "group": true, "id": "usage", "title": "", "children": [{ "title": "HTML usage", "index": 2 }] }, { "group": true, "id": "layers", "title": "Layers", "children": [{ "title": "AISTrackSymbol", "index": 0 }, { "title": "TrackSymbol", "index": 1 }] }];
const config = { "plugins": [{ "name": "builtin:tailwind-tokens" }, { "name": "builtin:vanilla-support", "supportPlugin": { "id": "vanilla", "moduleName": "/home/nick/Code/org-arl/leaflet-tracksymbol2/node_modules/.pnpm/histoire@0.12.4_vite@4.0.4/node_modules/histoire/dist/node/builtin-plugins/vanilla-support", "setupFn": "setupVanilla" } }, { "name": "@histoire/plugin-svelte", "supportPlugin": { "id": "svelte3", "moduleName": "@histoire/plugin-svelte", "setupFn": "setupSvelte3" } }], "outDir": "/home/nick/Code/org-arl/leaflet-tracksymbol2/build/histoire", "storyMatch": ["**/*.story.vue", "**/*.story.svelte"], "storyIgnored": ["**/node_modules/**", "**/dist/**"], "supportMatch": [{ "id": "vanilla", "patterns": ["**/*.js"], "pluginIds": ["vanilla"] }, { "id": "svelte", "patterns": ["**/*.svelte"], "pluginIds": ["svelte3"] }], "tree": { "file": "title", "order": "asc", "groups": [{ "id": "top", "title": "" }, { "id": "usage", "title": "" }, { "id": "layers", "title": "Layers" }] }, "theme": { "title": "leaflet-tracksymbol2", "colors": { "primary": { "50": "#fff7ed", "100": "#ffedd5", "200": "#fed7aa", "300": "#fdba74", "400": "#fb923c", "500": "#f97316", "600": "#ea580c", "700": "#c2410c", "800": "#9a3412", "900": "#7c2d12" }, "gray": { "50": "#fafafa", "100": "#f4f4f5", "200": "#e4e4e7", "300": "#d4d4d8", "400": "#a1a1aa", "500": "#71717a", "600": "#52525b", "700": "#3f3f46", "750": "#323238", "800": "#27272a", "850": "#1f1f21", "900": "#18181b", "950": "#101012" } }, "logo": { "square": "@histoire/plugin-svelte/assets/histoire-svelte.svg", "light": "@histoire/plugin-svelte/assets/histoire-svelte-text.svg", "dark": "@histoire/plugin-svelte/assets/histoire-svelte-text.svg" } }, "responsivePresets": [{ "label": "Mobile (Small)", "width": 320, "height": 560 }, { "label": "Mobile (Medium)", "width": 360, "height": 640 }, { "label": "Mobile (Large)", "width": 414, "height": 896 }, { "label": "Tablet", "width": 768, "height": 1024 }, { "label": "Laptop (Small)", "width": 1024, "height": null }, { "label": "Laptop (Large)", "width": 1366, "height": null }, { "label": "Desktop", "width": 1920, "height": null }, { "label": "4K", "width": 3840, "height": null }], "backgroundPresets": [{ "label": "Transparent", "color": "transparent", "contrastColor": "#333" }, { "label": "White", "color": "#fff", "contrastColor": "#333" }, { "label": "Light gray", "color": "#aaa", "contrastColor": "#000" }, { "label": "Dark gray", "color": "#333", "contrastColor": "#fff" }, { "label": "Black", "color": "#000", "contrastColor": "#eee" }], "sandboxDarkClass": "dark", "routerMode": "hash", "vite": { "base": "/leaflet-tracksymbol2/", "resolve": { "alias": { "@arl/leaflet-tracksymbol2": "/src" } } }, "viteIgnorePlugins": ["vite-plugin-sveltekit-compile"], "setupFile": "src/stories/setup.ts" };
const logos = { square: Logo_square, light: Logo_dark, dark: Logo_dark };
const histoireConfig = config;
const customLogos = logos;
const isDark = useDark({ valueDark: "htw-dark" });
const toggleDark = useToggle(isDark);
function applyDarkToControls() {
  var _a;
  (_a = window.__hst_controls_dark) == null ? void 0 : _a.forEach((ref2) => {
    ref2.value = isDark.value;
  });
}
watch(isDark, () => {
  applyDarkToControls();
}, {
  immediate: true
});
window.__hst_controls_dark_ready = () => {
  applyDarkToControls();
};
const copiedFromExistingVariant = [
  "state",
  "slots",
  "source",
  "responsiveDisabled",
  "autoPropsDisabled",
  "setupApp",
  "configReady",
  "previewReady"
];
function mapFile(file2, existingFile) {
  let result;
  if (existingFile) {
    result = existingFile;
    for (const key in file2) {
      if (key === "story") {
        Object.assign(result.story, {
          ...file2.story,
          file: markRaw(result),
          variants: file2.story.variants.map((v) => mapVariant(v, existingFile.story.variants.find((item) => item.id === v.id)))
        });
      } else if (key !== "component") {
        result[key] = file2[key];
      }
    }
  } else {
    result = {
      ...file2,
      component: markRaw(file2.component),
      story: {
        ...file2.story,
        title: file2.story.title,
        file: markRaw(file2),
        variants: file2.story.variants.map((v) => mapVariant(v)),
        slots: () => ({})
      }
    };
  }
  return result;
}
function mapVariant(variant, existingVariant) {
  let result;
  if (existingVariant) {
    result = existingVariant;
    for (const key in variant) {
      if (!copiedFromExistingVariant.includes(key)) {
        result[key] = variant[key];
      }
    }
  } else {
    result = {
      ...variant,
      state: reactive({
        _hPropState: {},
        _hPropDefs: {}
      }),
      setupApp: null,
      slots: () => ({}),
      previewReady: false
    };
  }
  return result;
}
const clientSupportPlugins = {
  "vanilla": () => __vitePreload(() => import("./vendor-0c70ceb7.js").then((n) => n.aT), true ? [] : void 0),
  "svelte3": () => __vitePreload(() => import("./vendor-0c70ceb7.js").then((n) => n.aU), true ? [] : void 0)
};
const __default__ = {
  inheritAttrs: false
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...__default__,
  __name: "GenericMountStory",
  props: {
    story: null
  },
  setup(__props) {
    const props = __props;
    const mountComponent = ref(null);
    watchEffect(async () => {
      var _a;
      const clientPlugin = clientSupportPlugins[(_a = props.story.file) == null ? void 0 : _a.supportPluginId];
      if (clientPlugin) {
        const pluginModule = await clientPlugin();
        mountComponent.value = markRaw(pluginModule.MountStory);
      }
    });
    return (_ctx, _cache) => {
      return mountComponent.value ? (openBlock(), createBlock(resolveDynamicComponent(mountComponent.value), mergeProps({
        key: 0,
        class: "histoire-generic-mount-story",
        story: __props.story
      }, _ctx.$attrs), null, 16, ["story"])) : createCommentVNode("", true);
    };
  }
});
export {
  __vitePreload as _,
  tree as a,
  _sfc_main as b,
  customLogos as c,
  clientSupportPlugins as d,
  files as f,
  histoireConfig as h,
  isDark as i,
  mapFile as m,
  toggleDark as t
};
//# sourceMappingURL=GenericMountStory.vue2-50f5e467.js.map
