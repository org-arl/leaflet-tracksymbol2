import Et, { Path as bn, Util as $e, Bounds as On, LatLngBounds as Nn, LatLng as we, Point as Cn, DomUtil as Rn } from "leaflet";
const He = !0, Mn = !1, Dt = { CCW: -1, CW: 1, NOT_ORIENTABLE: 0 }, Un = 2 * Math.PI, Wt = 1, Ge = 0, D = 2, Fn = 3, kn = 4, Bn = 1, Vn = 2, ce = 0, bt = 1, mt = 2;
var zt = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  BOUNDARY: D,
  CCW: He,
  CONTAINS: Fn,
  CW: Mn,
  END_VERTEX: mt,
  INSIDE: Wt,
  INTERLACE: kn,
  NOT_VERTEX: ce,
  ORIENTATION: Dt,
  OUTSIDE: Ge,
  OVERLAP_OPPOSITE: Vn,
  OVERLAP_SAME: Bn,
  PIx2: Un,
  START_VERTEX: bt
});
let Y = 1e-6;
function qe(r) {
  Y = r;
}
function De() {
  return Y;
}
const $n = 3;
function ne(r) {
  return r < Y && r > -Y;
}
function rt(r, t) {
  return r - t < Y && r - t > -Y;
}
function We(r, t) {
  return r - t > Y;
}
function Hn(r, t) {
  return r - t > -Y;
}
function ze(r, t) {
  return r - t < -Y;
}
function Gn(r, t) {
  return r - t < Y;
}
var qn = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  DECIMALS: $n,
  EQ: rt,
  EQ_0: ne,
  GE: Hn,
  GT: We,
  LE: Gn,
  LT: ze,
  getTolerance: De,
  setTolerance: qe
});
let i = {
  Utils: qn,
  Errors: void 0,
  Matrix: void 0,
  Planar_set: void 0,
  Point: void 0,
  Vector: void 0,
  Line: void 0,
  Circle: void 0,
  Segment: void 0,
  Arc: void 0,
  Box: void 0,
  Edge: void 0,
  Face: void 0,
  Ray: void 0,
  Ray_shooting: void 0,
  Multiline: void 0,
  Polygon: void 0,
  Distance: void 0,
  Inversion: void 0
};
for (let r in zt)
  i[r] = zt[r];
Object.defineProperty(i, "DP_TOL", {
  get: function() {
    return De();
  },
  set: function(r) {
    qe(r);
  }
});
class T {
  /**
   * Throw error ILLEGAL_PARAMETERS when cannot instantiate from given parameter
   * @returns {ReferenceError}
   */
  static get ILLEGAL_PARAMETERS() {
    return new ReferenceError("Illegal Parameters");
  }
  /**
   * Throw error ZERO_DIVISION to catch situation of zero division
   * @returns {Error}
   */
  static get ZERO_DIVISION() {
    return new Error("Zero division");
  }
  /**
   * Error to throw from BooleanOperations module in case when fixBoundaryConflicts not capable to fix it
   * @returns {Error}
   */
  static get UNRESOLVED_BOUNDARY_CONFLICT() {
    return new Error("Unresolved boundary conflict in boolean operation");
  }
  /**
   * Error to throw from LinkedList:testInfiniteLoop static method
   * in case when circular loop detected in linked list
   * @returns {Error}
   */
  static get INFINITE_LOOP() {
    return new Error("Infinite loop");
  }
  static get CANNOT_COMPLETE_BOOLEAN_OPERATION() {
    return new Error("Cannot complete boolean operation");
  }
  static get CANNOT_INVOKE_ABSTRACT_METHOD() {
    return new Error("Abstract method cannot be invoked");
  }
  static get OPERATION_IS_NOT_SUPPORTED() {
    return new Error("Operation is not supported");
  }
  static get UNSUPPORTED_SHAPE_TYPE() {
    return new Error("Unsupported shape type");
  }
}
i.Errors = T;
class de {
  constructor(t, e) {
    this.first = t, this.last = e || this.first;
  }
  [Symbol.iterator]() {
    let t;
    return {
      next: () => (t = t ? t.next : this.first, { value: t, done: t === void 0 })
    };
  }
  /**
   * Return number of elements in the list
   * @returns {number}
   */
  get size() {
    let t = 0;
    for (let e of this)
      t++;
    return t;
  }
  /**
   * Return array of elements from start to end,
   * If start or end not defined, take first as start, last as end
   * @returns {Array}
   */
  toArray(t = void 0, e = void 0) {
    let n = [], s = t || this.first, l = e || this.last, o = s;
    if (o === void 0) return n;
    do
      n.push(o), o = o.next;
    while (o !== l.next);
    return n;
  }
  /**
   * Append new element to the end of the list
   * @param {LinkedListElement} element
   * @returns {LinkedList}
   */
  append(t) {
    return this.isEmpty() ? this.first = t : (t.prev = this.last, this.last.next = t), this.last = t, this.last.next = void 0, this.first.prev = void 0, this;
  }
  /**
   * Insert new element to the list after elementBefore
   * @param {LinkedListElement} newElement
   * @param {LinkedListElement} elementBefore
   * @returns {LinkedList}
   */
  insert(t, e) {
    if (this.isEmpty())
      this.first = t, this.last = t;
    else if (e == null)
      t.next = this.first, this.first.prev = t, this.first = t;
    else {
      let n = e.next;
      e.next = t, n && (n.prev = t), t.prev = e, t.next = n, this.last === e && (this.last = t);
    }
    return this.last.next = void 0, this.first.prev = void 0, this;
  }
  /**
   * Remove element from the list
   * @param {LinkedListElement} element
   * @returns {LinkedList}
   */
  remove(t) {
    return t === this.first && t === this.last ? (this.first = void 0, this.last = void 0) : (t.prev && (t.prev.next = t.next), t.next && (t.next.prev = t.prev), t === this.first && (this.first = t.next), t === this.last && (this.last = t.prev)), this;
  }
  /**
   * Return true if list is empty
   * @returns {boolean}
   */
  isEmpty() {
    return this.first === void 0;
  }
  /**
   * Throw an error if circular loop detected in the linked list
   * @param {LinkedListElement} first element to start iteration
   * @throws {Errors.INFINITE_LOOP}
   */
  static testInfiniteLoop(t) {
    let e = t, n = t;
    do {
      if (e != t && e === n)
        throw T.INFINITE_LOOP;
      e = e.next, n = n.next.next;
    } while (e != t);
  }
}
const Se = {
  stroke: "black"
};
class Dn {
  constructor(t = Se) {
    for (const e in t)
      this[e] = t[e];
    this.stroke = t.stroke ?? Se.stroke;
  }
  toAttributesString() {
    return Object.keys(this).reduce(
      (t, e) => t + (this[e] !== void 0 ? this.toAttrString(e, this[e]) : ""),
      ""
    );
  }
  toAttrString(t, e) {
    const n = t === "className" ? "class" : this.convertCamelToKebabCase(t);
    return e === null ? `${n} ` : `${n}="${e.toString()}" `;
  }
  convertCamelToKebabCase(t) {
    return t.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g).join("-").toLowerCase();
  }
}
function ot(r) {
  return new Dn(r).toAttributesString();
}
function wt(r, t) {
  let e = [], [n, s, l] = r.standard, [o, a, u] = t.standard, h = n * a - s * o, f = l * a - s * u, g = n * u - l * o;
  if (!i.Utils.EQ_0(h)) {
    let _, w;
    s === 0 ? (_ = l / n, w = g / h) : a === 0 ? (_ = u / o, w = g / h) : n === 0 ? (_ = f / h, w = l / s) : o === 0 ? (_ = f / h, w = u / a) : (_ = f / h, w = g / h), e.push(new i.Point(_, w));
  }
  return e;
}
function lt(r, t) {
  let e = [], n = t.pc.projectionOn(r), s = t.pc.distanceTo(n)[0];
  if (i.Utils.EQ(s, t.r))
    e.push(n);
  else if (i.Utils.LT(s, t.r)) {
    let l = Math.sqrt(t.r * t.r - s * s), o, a;
    o = r.norm.rotate90CCW().multiply(l), a = n.translate(o), e.push(a), o = r.norm.rotate90CW().multiply(l), a = n.translate(o), e.push(a);
  }
  return e;
}
function xt(r, t) {
  let e = [];
  for (let n of t.toSegments()) {
    let s = Ft(n, r);
    for (let l of s)
      en(l, e) || e.push(l);
  }
  return e;
}
function Qt(r, t) {
  let e = [];
  if (xt(r, t.box).length === 0)
    return e;
  let n = new i.Circle(t.pc, t.r), s = lt(r, n);
  for (let l of s)
    l.on(t) && e.push(l);
  return e;
}
function Ft(r, t) {
  let e = [];
  if (r.ps.on(t) && e.push(r.ps), r.pe.on(t) && !r.isZeroLength() && e.push(r.pe), e.length > 0 || r.isZeroLength() || r.ps.leftTo(t) && r.pe.leftTo(t) || !r.ps.leftTo(t) && !r.pe.leftTo(t))
    return e;
  let n = new i.Line(r.ps, r.pe);
  return wt(n, t);
}
function jt(r, t) {
  let e = [];
  if (r.box.not_intersect(t.box))
    return e;
  if (r.isZeroLength())
    return r.ps.on(t) && e.push(r.ps), e;
  if (t.isZeroLength())
    return t.ps.on(r) && e.push(t.ps), e;
  let n = new i.Line(r.ps, r.pe), s = new i.Line(t.ps, t.pe);
  if (n.incidentTo(s))
    r.ps.on(t) && e.push(r.ps), r.pe.on(t) && e.push(r.pe), t.ps.on(r) && !t.ps.equalTo(r.ps) && !t.ps.equalTo(r.pe) && e.push(t.ps), t.pe.on(r) && !t.pe.equalTo(r.ps) && !t.pe.equalTo(r.pe) && e.push(t.pe);
  else {
    let l = wt(n, s);
    l.length > 0 && ye(l[0], r) && ye(l[0], t) && e.push(l[0]);
  }
  return e;
}
function ye(r, t) {
  const e = t.box;
  return i.Utils.LE(r.x, e.xmax) && i.Utils.GE(r.x, e.xmin) && i.Utils.LE(r.y, e.ymax) && i.Utils.GE(r.y, e.ymin);
}
function Zt(r, t) {
  let e = [];
  if (r.box.not_intersect(t.box))
    return e;
  if (r.isZeroLength()) {
    let [l, o] = r.ps.distanceTo(t.pc);
    return i.Utils.EQ(l, t.r) && e.push(r.ps), e;
  }
  let n = new i.Line(r.ps, r.pe), s = lt(n, t);
  for (let l of s)
    l.on(r) && e.push(l);
  return e;
}
function St(r, t) {
  let e = [];
  if (r.box.not_intersect(t.box))
    return e;
  if (r.isZeroLength())
    return r.ps.on(t) && e.push(r.ps), e;
  let n = new i.Line(r.ps, r.pe), s = new i.Circle(t.pc, t.r), l = lt(n, s);
  for (let o of l)
    o.on(r) && o.on(t) && e.push(o);
  return e;
}
function Wn(r, t) {
  let e = [];
  for (let n of t.toSegments()) {
    let s = jt(n, r);
    for (let l of s)
      e.push(l);
  }
  return e;
}
function Ye(r, t) {
  let e = [];
  if (r.box.not_intersect(t.box))
    return e;
  let n = new i.Vector(r.pc, t.pc), s = r.r, l = t.r;
  if (i.Utils.EQ_0(s) || i.Utils.EQ_0(l))
    return e;
  if (i.Utils.EQ_0(n.x) && i.Utils.EQ_0(n.y) && i.Utils.EQ(s, l))
    return e.push(r.pc.translate(-s, 0)), e;
  let o = r.pc.distanceTo(t.pc)[0];
  if (i.Utils.GT(o, s + l) || i.Utils.LT(o, Math.abs(s - l)))
    return e;
  n.x /= o, n.y /= o;
  let a;
  if (i.Utils.EQ(o, s + l) || i.Utils.EQ(o, Math.abs(s - l)))
    return a = r.pc.translate(s * n.x, s * n.y), e.push(a), e;
  let u = s * s / (2 * o) - l * l / (2 * o) + o / 2, h = r.pc.translate(u * n.x, u * n.y), f = Math.sqrt(s * s - u * u);
  return a = h.translate(n.rotate90CCW().multiply(f)), e.push(a), a = h.translate(n.rotate90CW().multiply(f)), e.push(a), e;
}
function zn(r, t) {
  let e = [];
  for (let n of t.toSegments()) {
    let s = Zt(n, r);
    for (let l of s)
      e.push(l);
  }
  return e;
}
function Qe(r, t) {
  let e = [];
  if (r.box.not_intersect(t.box))
    return e;
  if (r.pc.equalTo(t.pc) && i.Utils.EQ(r.r, t.r)) {
    let o;
    return o = r.start, o.on(t) && e.push(o), o = r.end, o.on(t) && e.push(o), o = t.start, o.on(r) && e.push(o), o = t.end, o.on(r) && e.push(o), e;
  }
  let n = new i.Circle(r.pc, r.r), s = new i.Circle(t.pc, t.r), l = n.intersect(s);
  for (let o of l)
    o.on(r) && o.on(t) && e.push(o);
  return e;
}
function ge(r, t) {
  let e = [];
  if (r.box.not_intersect(t.box))
    return e;
  if (t.pc.equalTo(r.pc) && i.Utils.EQ(t.r, r.r))
    return e.push(r.start), e.push(r.end), e;
  let n = t, s = new i.Circle(r.pc, r.r), l = Ye(n, s);
  for (let o of l)
    o.on(r) && e.push(o);
  return e;
}
function Yn(r, t) {
  let e = [];
  for (let n of t.toSegments()) {
    let s = St(n, r);
    for (let l of s)
      e.push(l);
  }
  return e;
}
function je(r, t) {
  return r.isSegment ? jt(r.shape, t) : St(t, r.shape);
}
function Ze(r, t) {
  return r.isSegment ? St(r.shape, t) : Qe(r.shape, t);
}
function Xe(r, t) {
  return r.isSegment ? Ft(r.shape, t) : Qt(t, r.shape);
}
function Qn(r, t) {
  return r.isSegment ? me(t, r.shape) : Ee(t, r.shape);
}
function jn(r, t) {
  return r.isSegment ? Zt(r.shape, t) : ge(r.shape, t);
}
function pe(r, t) {
  let e = [];
  for (let n of t.edges)
    for (let s of je(n, r))
      e.push(s);
  return e;
}
function _e(r, t) {
  let e = [];
  for (let n of t.edges)
    for (let s of Ze(n, r))
      e.push(s);
  return e;
}
function kt(r, t) {
  let e = [];
  if (t.isEmpty())
    return e;
  for (let n of t.edges)
    for (let s of Xe(n, r))
      en(s, e) || e.push(s);
  return r.sortPoints(e);
}
function Ke(r, t) {
  let e = [];
  if (t.isEmpty())
    return e;
  for (let n of t.edges)
    for (let s of jn(n, r))
      e.push(s);
  return e;
}
function Je(r, t) {
  return r.isSegment ? je(t, r.shape) : r.isArc ? Ze(t, r.shape) : r.isLine ? Xe(t, r.shape) : r.isRay ? Qn(t, r.shape) : [];
}
function tn(r, t) {
  let e = [];
  if (t.isEmpty() || r.shape.box.not_intersect(t.box))
    return e;
  let n = t.edges.search(r.shape.box);
  for (let s of n)
    e = [...e, ...Je(r, s)];
  return e;
}
function Zn(r, t) {
  let e = [];
  if (t.isEmpty() || r.size === 0)
    return e;
  for (let n of r)
    e = [...e, ...tn(n, t)];
  return e;
}
function Xn(r, t) {
  let e = [];
  if (r.isEmpty() || t.isEmpty() || r.box.not_intersect(t.box))
    return e;
  for (let n of r.edges)
    e = [...e, ...tn(n, t)];
  return e;
}
function Kn(r, t) {
  return r instanceof i.Line ? kt(r, t) : r instanceof i.Segment ? pe(r, t) : r instanceof i.Arc ? _e(r, t) : [];
}
function en(r, t) {
  return t.some((e) => e.equalTo(r));
}
function nt(r) {
  return new i.Line(r.start, r.norm);
}
function me(r, t) {
  return Ft(t, nt(r)).filter((e) => r.contains(e));
}
function Ee(r, t) {
  return Qt(nt(r), t).filter((e) => r.contains(e));
}
function nn(r, t) {
  return lt(nt(r), t).filter((e) => r.contains(e));
}
function Jn(r, t) {
  return xt(nt(r), t).filter((e) => r.contains(e));
}
function rn(r, t) {
  return wt(nt(r), t).filter((e) => r.contains(e));
}
function ti(r, t) {
  return wt(nt(r), nt(t)).filter((e) => r.contains(e)).filter((e) => t.contains(e));
}
function sn(r, t) {
  return kt(nt(r), t).filter((e) => r.contains(e));
}
function on(r, t) {
  if (r.intersect && r.intersect instanceof Function)
    return r.intersect(t);
  throw T.UNSUPPORTED_SHAPE_TYPE;
}
function Bt(r, t) {
  let e = [];
  for (let n of t)
    e = [...e, ...on(r, n.shape)];
  return e;
}
function ei(r, t) {
  let e = [];
  for (let n of r)
    for (let s of t)
      e = [...e, ...on(n, s)];
  return e;
}
let at = class At extends de {
  constructor(...t) {
    if (super(), this.isInfinite = !1, t.length === 1 && t[0] instanceof Array && t[0].length > 0) {
      let e = !1;
      const n = t[0], s = n.length, l = (u) => u instanceof i.Segment || u instanceof i.Arc || u instanceof i.Ray || u instanceof i.Line, o = (u) => u instanceof i.Segment || u instanceof i.Arc || u instanceof i.Ray, a = (u) => u instanceof i.Segment || u instanceof i.Arc;
      if (e = s === 1 && l(n[0]) || s > 1 && o(n[0]) && o(n[s - 1]) && n.slice(1, s - 1).every(a), e) {
        this.isInfinite = n.some(
          (u) => u instanceof i.Ray || u instanceof i.Line
        );
        for (let u of n) {
          let h = new i.Edge(u);
          this.append(h);
        }
        this.setArcLength();
      } else
        throw i.Errors.ILLEGAL_PARAMETERS;
    }
  }
  /**
   * (Getter) Return array of edges
   * @returns {Edge[]}
   */
  get edges() {
    return [...this];
  }
  /**
   * (Getter) Return bounding box of the multiline
   * @returns {Box}
   */
  get box() {
    return this.edges.reduce((t, e) => t.merge(e.box), new i.Box());
  }
  /**
   * (Getter) Returns array of vertices
   * @returns {Point[]}
   */
  get vertices() {
    let t = this.edges.map((e) => e.start);
    return t.push(this.last.end), t;
  }
  /**
   * (Getter) Returns length of the multiline, return POSITIVE_INFINITY if multiline is infinite
   * @returns {number}
   */
  get length() {
    if (this.isEmpty()) return 0;
    if (this.isInfinite) return Number.POSITIVE_INFINITY;
    let t = 0;
    for (let e of this)
      t += e.length;
    return t;
  }
  /**
   * Return new cloned instance of Multiline
   * @returns {Multiline}
   */
  clone() {
    return new At(this.toShapes());
  }
  /**
   * Set arc_length property for each of the edges in the multiline.
   * Arc_length of the edge is the arc length from the multiline start vertex to the edge start vertex
   */
  setArcLength() {
    for (let t of this)
      this.setOneEdgeArcLength(t);
  }
  setOneEdgeArcLength(t) {
    t === this.first ? t.arc_length = 0 : t.arc_length = t.prev.arc_length + t.prev.length;
  }
  /**
   * Return point on multiline at given length from the start of the multiline
   * @param length
   * @returns {Point | null}
   */
  pointAtLength(t) {
    if (t > this.length || t < 0 || this.isInfinite) return null;
    let e = null;
    for (let n of this)
      if (t >= n.arc_length && (n === this.last || t < n.next.arc_length)) {
        e = n.pointAtLength(t - n.arc_length);
        break;
      }
    return e;
  }
  /**
   * Split edge and add new vertex, return new edge inserted
   * @param {Point} pt - point on edge that will be added as new vertex
   * @param {Edge} edge - edge to split
   * @returns {Edge}
   */
  addVertex(t, e) {
    let n = e.shape.split(t);
    if (n[0] === null)
      return e.prev;
    if (n[1] === null)
      return e;
    let s = new i.Edge(n[0]), l = e.prev;
    return this.insert(s, l), e.shape = n[1], s;
  }
  getChain(t, e) {
    let n = [];
    for (let s = t; s !== e.next; s = s.next)
      n.push(s);
    return n;
  }
  /**
   * Split edges of multiline with intersection points and return mutated multiline
   * @param {Point[]} ip - array of points to be added as new vertices
   * @returns {Multiline}
   */
  split(t) {
    for (let e of t) {
      let n = this.findEdgeByPoint(e);
      this.addVertex(e, n);
    }
    return this;
  }
  /**
   * Returns edge which contains given point
   * @param {Point} pt
   * @returns {Edge}
   */
  findEdgeByPoint(t) {
    let e;
    for (let n of this)
      if (n.shape.contains(t)) {
        e = n;
        break;
      }
    return e;
  }
  /**
   * Calculate distance and shortest segment from any shape to multiline
   * @param shape
   * @returns {[number,Flatten.Segment]}
   */
  distanceTo(t) {
    if (t instanceof Point) {
      const [e, n] = i.Distance.shape2multiline(t, this);
      return [e, n.reverse()];
    }
    if (t instanceof i.Line) {
      const [e, n] = i.Distance.shape2multiline(t, this);
      return [e, n.reverse()];
    }
    if (t instanceof i.Circle) {
      const [e, n] = i.Distance.shape2multiline(t, this);
      return [e, n.reverse()];
    }
    if (t instanceof i.Segment) {
      const [e, n] = i.Distance.shape2multiline(t, this);
      return [e, n.reverse()];
    }
    if (t instanceof i.Arc) {
      const [e, n] = i.Distance.shape2multiline(t, this);
      return [e, n.reverse()];
    }
    if (t instanceof i.Multiline)
      return i.Distance.multiline2multiline(this, t);
    throw i.Errors.UNSUPPORTED_SHAPE_TYPE;
  }
  /**
   * Calculate intersection of multiline with other shape
   * @param {Shape} shape
   * @returns {Point[]}
   */
  intersect(t) {
    return t instanceof i.Multiline ? ei(this, t) : Bt(t, this);
  }
  /**
   * Return true if multiline contains the shape: no point of shape lies outside
   * @param shape
   * @returns {boolean}
   */
  contains(t) {
    if (t instanceof i.Point)
      return this.edges.some((e) => e.shape.contains(t));
    throw i.Errors.UNSUPPORTED_SHAPE_TYPE;
  }
  /**
   * Returns new multiline translated by vector vec
   * @param {Vector} vec
   * @returns {Multiline}
   */
  translate(t) {
    return new At(this.edges.map((e) => e.shape.translate(t)));
  }
  /**
   * Return new multiline rotated by given angle around given point
   * If point omitted, rotate around origin (0,0)
   * Positive value of angle defines rotation counterclockwise, negative - clockwise
   * @param {number} angle - rotation angle in radians
   * @param {Point} center - rotation center, default is (0,0)
   * @returns {Multiline} - new rotated polygon
   */
  rotate(t = 0, e = new i.Point()) {
    return new At(this.edges.map((n) => n.shape.rotate(t, e)));
  }
  /**
   * Return new multiline transformed using affine transformation matrix
   * Method does not support unbounded shapes
   * @param {Matrix} matrix - affine transformation matrix
   * @returns {Multiline} - new multiline
   */
  transform(t = new i.Matrix()) {
    return new At(this.edges.map((e) => e.shape.transform(t)));
  }
  /**
   * Transform multiline into array of shapes
   * @returns {Shape[]}
   */
  toShapes() {
    return this.edges.map((t) => t.shape.clone());
  }
  /**
   * This method returns an object that defines how data will be
   * serialized when called JSON.stringify() method
   * @returns {Object}
   */
  toJSON() {
    return this.edges.map((t) => t.toJSON());
  }
  /**
   * Return string to be inserted into 'points' attribute of <polyline> element
   * @returns {string}
   */
  svgPoints() {
    return this.vertices.map((t) => `${t.x},${t.y}`).join(" ");
  }
  /**
   * Return string to be assigned to 'd' attribute of <path> element
   * @returns {*}
   */
  dpath() {
    let t = `M${this.first.start.x},${this.first.start.y}`;
    for (let e of this)
      t += e.svg();
    return t;
  }
  /**
   * Return string to draw multiline in svg
   * @param attrs  - an object with attributes for svg path element
   * TODO: support semi-infinite Ray and infinite Line
   * @returns {string}
   */
  svg(t = {}) {
    let e = `
<path ${ot({ fill: "none", ...t })} d="`;
    e += `
M${this.first.start.x},${this.first.start.y}`;
    for (let n of this)
      e += n.svg();
    return e += `" >
</path>`, e;
  }
};
i.Multiline = at;
const ni = (...r) => new i.Multiline(...r);
i.multiline = ni;
function Tt(r, t, e) {
  let n = e.length, s = r.shape.split(t);
  if (s.length === 0) return;
  let l = 0;
  s[0] === null ? l = 0 : s[1] === null ? l = r.shape.length : l = s[0].length;
  let o = ce;
  rt(l, 0) && (o |= bt), rt(l, r.shape.length) && (o |= mt);
  let a;
  l === 1 / 0 ? a = s[0].coord(t) : a = o & mt && r.next && r.next.arc_length === 0 ? 0 : r.arc_length + l, e.push({
    id: n,
    pt: t,
    arc_length: a,
    edge_before: r,
    edge_after: void 0,
    face: r.face,
    is_vertex: o
  });
}
function Mt(r) {
  r.int_points1_sorted = tt(r.int_points1), r.int_points2_sorted = tt(r.int_points2);
}
function tt(r) {
  let t = /* @__PURE__ */ new Map(), e = 0;
  for (let s of r)
    t.has(s.face) || (t.set(s.face, e), e++);
  for (let s of r)
    s.faceId = t.get(s.face);
  return r.slice().sort(ii);
}
function ii(r, t) {
  return r.faceId < t.faceId ? -1 : r.faceId > t.faceId ? 1 : r.arc_length < t.arc_length ? -1 : r.arc_length > t.arc_length ? 1 : 0;
}
function xe(r) {
  if (r.int_points1.length < 2) return;
  let t = !1, e, n, s, l;
  for (let o = 0; o < r.int_points1_sorted.length; o++)
    if (r.int_points1_sorted[o].id !== -1) {
      e = r.int_points1_sorted[o], n = r.int_points2[e.id];
      for (let a = o + 1; a < r.int_points1_sorted.length && (s = r.int_points1_sorted[a], !!rt(s.arc_length, e.arc_length)); a++)
        s.id !== -1 && (l = r.int_points2[s.id], l.id !== -1 && s.edge_before === e.edge_before && s.edge_after === e.edge_after && l.edge_before === n.edge_before && l.edge_after === n.edge_after && (s.id = -1, l.id = -1, t = !0));
    }
  n = r.int_points2_sorted[0], e = r.int_points1[n.id];
  for (let o = 1; o < r.int_points2_sorted.length; o++) {
    let a = r.int_points2_sorted[o];
    if (a.id === -1) continue;
    if (n.id === -1 || /* can't be reference if already deleted */
    !rt(a.arc_length, n.arc_length)) {
      n = a, e = r.int_points1[n.id];
      continue;
    }
    let u = r.int_points1[a.id];
    u.edge_before === e.edge_before && u.edge_after === e.edge_after && a.edge_before === n.edge_before && a.edge_after === n.edge_after && (u.id = -1, a.id = -1, t = !0);
  }
  t && (r.int_points1 = r.int_points1.filter((o) => o.id >= 0), r.int_points2 = r.int_points2.filter((o) => o.id >= 0), r.int_points1.forEach((o, a) => o.id = a), r.int_points2.forEach((o, a) => o.id = a));
}
function ie(r) {
  for (let t of r)
    t.edge_before && (t.edge_before.bvStart = void 0, t.edge_before.bvEnd = void 0, t.edge_before.bv = void 0, t.edge_before.overlap = void 0), t.edge_after && (t.edge_after.bvStart = void 0, t.edge_after.bvEnd = void 0, t.edge_after.bv = void 0, t.edge_after.overlap = void 0);
  for (let t of r)
    t.edge_before && (t.edge_before.bvEnd = D), t.edge_after && (t.edge_after.bvStart = D);
}
function re(r, t) {
  for (let e of r)
    e.edge_before && e.edge_before.setInclusion(t), e.edge_after && e.edge_after.setInclusion(t);
}
function ri(r) {
  let t, e, n, s = r.int_points1.length;
  for (let l = 0; l < s; l++) {
    let o = r.int_points1_sorted[l];
    o.face !== t && (e = l, t = o.face);
    let a = l, u = It(r.int_points1_sorted, l, t), h;
    a + u < s && r.int_points1_sorted[a + u].face === t ? h = a + u : h = e;
    let f = It(r.int_points1_sorted, h, t);
    n = null;
    for (let E = h; E < h + f; E++) {
      let x = r.int_points1_sorted[E];
      if (x.face === t && r.int_points2[x.id].face === r.int_points2[o.id].face) {
        n = x;
        break;
      }
    }
    if (n === null)
      continue;
    let g = o.edge_after, _ = n.edge_before;
    if (!(g.bv === D && _.bv === D) || g !== _)
      continue;
    let w = r.int_points2[o.id], v = r.int_points2[n.id], I = w.edge_after, S = v.edge_before;
    I.bv === D && S.bv === D && I === S || (w = r.int_points2[n.id], v = r.int_points2[o.id], I = w.edge_after, S = v.edge_before), I.bv === D && S.bv === D && I === S && g.setOverlap(I);
  }
}
function It(r, t, e) {
  let n, s, l = 1;
  if (r.length === 1) return 1;
  n = r[t];
  for (let o = t + 1; o < r.length && !(n.face !== e || (s = r[o], !(s.pt.equalTo(n.pt) && s.edge_before === n.edge_before && s.edge_after === n.edge_after))); o++)
    l++;
  return l;
}
function vt(r, t) {
  if (t) {
    for (let e of t) {
      let n = e.edge_before;
      if (e.is_vertex = ce, n.shape.start && n.shape.start.equalTo(e.pt) && (e.is_vertex |= bt), n.shape.end && n.shape.end.equalTo(e.pt) && (e.is_vertex |= mt), e.is_vertex & bt) {
        e.edge_before = n.prev, n.prev && (e.is_vertex = mt);
        continue;
      }
      if (e.is_vertex & mt)
        continue;
      let s = r.addVertex(e.pt, n);
      e.edge_before = s;
    }
    for (let e of t)
      e.edge_before ? e.edge_after = e.edge_before.next : r instanceof at && e.is_vertex & bt && (e.edge_after = r.first);
  }
}
function Pe(r, t, e) {
  const n = r.edge_before, s = t.edge_after, l = e.length;
  n.next = e[0], e[0].prev = n, e[l - 1].next = s, s.prev = e[l - 1];
}
const { INSIDE: W, OUTSIDE: z, BOUNDARY: P, OVERLAP_SAME: si, OVERLAP_OPPOSITE: oi } = zt, { NOT_VERTEX: _r, START_VERTEX: Le, END_VERTEX: Ae } = zt, Xt = 1, Vt = 2, st = 3;
function li(r, t) {
  let [e, n] = $t(r, t, Xt, !0);
  return e;
}
function se(r, t) {
  let n = t.clone().reverse(), [s, l] = $t(r, n, st, !0);
  return s;
}
function ln(r, t) {
  let [e, n] = $t(r, t, Vt, !0);
  return e;
}
function an(r, t) {
  let [e, n] = $t(r, t, Vt, !1), s = [];
  for (let o of e.faces)
    s = [...s, ...[...o.edges].map((a) => a.shape)];
  let l = [];
  for (let o of n.faces)
    l = [...l, ...[...o.edges].map((a) => a.shape)];
  return [s, l];
}
function oe(r, t) {
  let [e, n] = $t(r, t, st, !1), s = [];
  for (let l of e.faces)
    s = [...s, ...[...l.edges].map((o) => o.shape)];
  return s;
}
function fn(r, t) {
  let e = r.clone(), n = t.clone(), s = un(e, n);
  Mt(s), vt(e, s.int_points1_sorted), vt(n, s.int_points2_sorted), xe(s), Mt(s);
  let l = s.int_points1_sorted.map((a) => a.pt), o = s.int_points2_sorted.map((a) => a.pt);
  return [l, o];
}
function ai(r, t, e, n) {
  let s = be(r, e.int_points1), l = be(t, e.int_points2);
  for (Oe(s, t), Oe(l, r), ie(e.int_points1), ie(e.int_points2), re(e.int_points1, t), re(e.int_points2, r); ui(r, t, e.int_points1, e.int_points1_sorted, e.int_points2, e); ) ;
  ri(e), le(r, n, e.int_points1_sorted, !0), le(t, n, e.int_points2_sorted, !1), Ne(r, s, n, !0), Ne(t, l, n, !1);
}
function fi(r, t, e, n) {
  hi(r, t, n, e.int_points2), ci(r, t, e), ae(r, e.int_points1), ae(t, e.int_points2), fe(r, e.int_points1, e.int_points2), fe(r, e.int_points2, e.int_points1);
}
function $t(r, t, e, n) {
  let s = r.clone(), l = t.clone(), o = un(s, l);
  return Mt(o), vt(s, o.int_points1_sorted), vt(l, o.int_points2_sorted), xe(o), Mt(o), ai(s, l, o, e), n && fi(s, l, o, e), [s, l];
}
function un(r, t) {
  let e = {
    int_points1: [],
    int_points2: []
  };
  for (let n of r.edges) {
    let s = t.edges.search(n.box);
    for (let l of s) {
      let o = n.shape.intersect(l.shape);
      for (let a of o)
        Tt(n, a, e.int_points1), Tt(l, a, e.int_points2);
    }
  }
  return e;
}
function be(r, t) {
  let e = [];
  for (let n of r.faces)
    t.find((s) => s.face === n) || e.push(n);
  return e;
}
function Oe(r, t) {
  for (let e of r)
    e.first.bv = e.first.bvStart = e.first.bvEnd = void 0, e.first.setInclusion(t);
}
function ui(r, t, e, n, s, l) {
  let o, a, u, h = n.length, f = !1;
  for (let g = 0; g < h; g++) {
    let _ = n[g];
    _.face !== o && (a = g, o = _.face);
    let w = g, v = It(n, g, o), I;
    w + v < h && n[w + v].face === o ? I = w + v : I = a;
    let S = It(n, I, o);
    u = null;
    for (let p = I; p < I + S; p++) {
      let b = n[p];
      if (b.face === o && s[b.id].face === s[_.id].face) {
        u = b;
        break;
      }
    }
    if (u === null)
      continue;
    let E = _.edge_after, x = u.edge_before;
    if (E.bv === P && x.bv != P) {
      E.bv = x.bv;
      continue;
    }
    if (E.bv != P && x.bv === P) {
      x.bv = E.bv;
      continue;
    }
    if (E.bv === P && x.bv === P && E != x || E.bv === W && x.bv === z || E.bv === z && x.bv === W) {
      let p = E.next;
      for (; p != x; )
        p.bvStart = void 0, p.bvEnd = void 0, p.bv = void 0, p.setInclusion(t), p = p.next;
    }
    if (E.bv === P && x.bv === P && E != x) {
      let p = E.next, b;
      for (; p != x; ) {
        if (p.bv != P) {
          if (b === void 0)
            b = p.bv;
          else if (p.bv != b)
            throw T.UNRESOLVED_BOUNDARY_CONFLICT;
        }
        p = p.next;
      }
      b != null && (E.bv = b, x.bv = b);
      continue;
    }
    if (E.bv === W && x.bv === z || E.bv === z && x.bv === W) {
      let p = E;
      for (; p != x; ) {
        if (p.bvStart === E.bv && p.bvEnd === x.bv) {
          let [b, Kt] = p.shape.distanceTo(t);
          if (b < 10 * i.DP_TOL) {
            Tt(p, Kt.ps, e);
            let Z = e[e.length - 1];
            if (Z.is_vertex & Le)
              Z.edge_after = p, Z.edge_before = p.prev, p.bvStart = P, p.bv = void 0, p.setInclusion(t);
            else if (Z.is_vertex & Ae)
              Z.edge_after = p.next, p.bvEnd = P, p.bv = void 0, p.setInclusion(t);
            else {
              let R = t.addVertex(Z.pt, p);
              Z.edge_before = R, Z.edge_after = R.next, R.setInclusion(t), R.next.bvStart = P, R.next.bvEnd = void 0, R.next.bv = void 0, R.next.setInclusion(t);
            }
            let ft = t.findEdgeByPoint(Kt.pe);
            Tt(ft, Kt.pe, s);
            let X = s[s.length - 1];
            if (X.is_vertex & Le)
              X.edge_after = ft, X.edge_before = ft.prev;
            else if (X.is_vertex & Ae)
              X.edge_after = ft.next;
            else {
              let R = s.find((An) => An.edge_after === ft), O = t.addVertex(X.pt, ft);
              X.edge_before = O, X.edge_after = O.next, R && (R.edge_after = O), O.bvStart = void 0, O.bvEnd = P, O.bv = void 0, O.setInclusion(r), O.next.bvStart = P, O.next.bvEnd = void 0, O.next.bv = void 0, O.next.setInclusion(r);
            }
            Mt(l), f = !0;
            break;
          }
        }
        p = p.next;
      }
      if (f)
        break;
      throw T.UNRESOLVED_BOUNDARY_CONFLICT;
    }
  }
  return f;
}
function le(r, t, e, n) {
  if (!e) return;
  let s, l, o, a;
  for (let u = 0; u < e.length; u++) {
    if (o = e[u], o.face !== s && (l = u, s = o.face), s.isEmpty())
      continue;
    let h = u, f = It(e, u, s), g;
    h + f < e.length && e[h + f].face === o.face ? g = h + f : g = l, a = e[g];
    let _ = g, w = It(e, _, s), v = o.edge_after, I = a.edge_before;
    if (v.bv === W && I.bv === W && t === Xt || v.bv === z && I.bv === z && t === Vt || (v.bv === z || I.bv === z) && t === st && !n || (v.bv === W || I.bv === W) && t === st && n || v.bv === P && I.bv === P && v.overlap & si && n || v.bv === P && I.bv === P && v.overlap & oi) {
      r.removeChain(s, v, I);
      for (let S = h; S < h + f; S++)
        e[S].edge_after = void 0;
      for (let S = _; S < _ + w; S++)
        e[S].edge_before = void 0;
    }
    u += f - 1;
  }
}
function hi(r, t, e, n) {
  for (let s of t.faces) {
    for (let l of s)
      r.edges.add(l);
    /*(op === BOOLEAN_UNION || op == BOOLEAN_SUBTRACT) &&*/
    n.find((l) => l.face === s) === void 0 && r.addFace(s.first, s.last);
  }
}
function ci(r, t, e) {
  if (e.int_points1.length !== 0)
    for (let n = 0; n < e.int_points1.length; n++) {
      let s = e.int_points1[n], l = e.int_points2[n];
      if (s.edge_before !== void 0 && s.edge_after === void 0 && l.edge_before === void 0 && l.edge_after !== void 0 && (s.edge_before.next = l.edge_after, l.edge_after.prev = s.edge_before, s.edge_after = l.edge_after, l.edge_before = s.edge_before), l.edge_before !== void 0 && l.edge_after === void 0 && s.edge_before === void 0 && s.edge_after !== void 0 && (l.edge_before.next = s.edge_after, s.edge_after.prev = l.edge_before, l.edge_after = s.edge_after, s.edge_before = l.edge_before), s.edge_before !== void 0 && s.edge_after === void 0)
        for (let o of e.int_points1_sorted)
          o !== s && o.edge_before === void 0 && o.edge_after !== void 0 && o.pt.equalTo(s.pt) && (s.edge_before.next = o.edge_after, o.edge_after.prev = s.edge_before, s.edge_after = o.edge_after, o.edge_before = s.edge_before);
      if (l.edge_before !== void 0 && l.edge_after === void 0)
        for (let o of e.int_points2_sorted)
          o !== l && o.edge_before === void 0 && o.edge_after !== void 0 && o.pt.equalTo(l.pt) && (l.edge_before.next = o.edge_after, o.edge_after.prev = l.edge_before, l.edge_after = o.edge_after, o.edge_before = l.edge_before);
    }
}
function ae(r, t) {
  for (let e of t)
    r.faces.delete(e.face), e.face = void 0, e.edge_before && (e.edge_before.face = void 0), e.edge_after && (e.edge_after.face = void 0);
}
function fe(r, t, e) {
  for (let n of t) {
    if (n.edge_before === void 0 || n.edge_after === void 0 || n.face || n.edge_after.face || n.edge_before.face)
      continue;
    let s = n.edge_after, l = n.edge_before;
    try {
      de.testInfiniteLoop(s);
    } catch {
      throw T.CANNOT_COMPLETE_BOOLEAN_OPERATION;
    }
    let o = r.addFace(s, l);
    for (let a of t)
      a.edge_before && a.edge_after && a.edge_before.face === o && a.edge_after.face === o && (a.face = o);
    for (let a of e)
      a.edge_before && a.edge_after && a.edge_before.face === o && a.edge_after.face === o && (a.face = o);
  }
}
function Ne(r, t, e, n) {
  for (let s of t) {
    let l = s.first.bv;
    (e === Xt && l === W || e === st && l === W && n || e === st && l === z && !n || e === Vt && l === z) && r.deleteFace(s);
  }
}
var di = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  BOOLEAN_INTERSECT: Vt,
  BOOLEAN_SUBTRACT: st,
  BOOLEAN_UNION: Xt,
  calculateIntersections: fn,
  innerClip: an,
  intersect: ln,
  outerClip: oe,
  removeNotRelevantChains: le,
  removeOldFaces: ae,
  restoreFaces: fe,
  subtract: se,
  unify: li
});
const gi = RegExp("T.F..FFF.|T.F...F.."), pi = RegExp("T........|.T.......|...T.....|....T...."), _i = RegExp("FT.......|F..T.....|F...T...."), mi = RegExp("T.F..F..."), Ei = RegExp("T.F..F...|.TF..F...|..FT.F...|..F.TF...");
class yt {
  /**
   * Create new instance of DE9IM matrix
   */
  constructor() {
    this.m = new Array(9).fill(void 0);
  }
  /**
   * Get Interior To Interior intersection
   * @returns {Shape[] | undefined}
   */
  get I2I() {
    return this.m[0];
  }
  /**
   * Set Interior To Interior intersection
   * @param geom
   */
  set I2I(t) {
    this.m[0] = t;
  }
  /**
   * Get Interior To Boundary intersection
   * @returns {Shape[] | undefined}
   */
  get I2B() {
    return this.m[1];
  }
  /**
   * Set Interior to Boundary intersection
   * @param geomc
   */
  set I2B(t) {
    this.m[1] = t;
  }
  /**
   * Get Interior To Exterior intersection
   * @returns {Shape[] | undefined}
   */
  get I2E() {
    return this.m[2];
  }
  /**
   * Set Interior to Exterior intersection
   * @param geom
   */
  set I2E(t) {
    this.m[2] = t;
  }
  /**
   * Get Boundary To Interior intersection
   * @returns {Shape[] | undefined}
   */
  get B2I() {
    return this.m[3];
  }
  /**
   * Set Boundary to Interior intersection
   * @param geom
   */
  set B2I(t) {
    this.m[3] = t;
  }
  /**
   * Get Boundary To Boundary intersection
   * @returns {Shape[] | undefined}
   */
  get B2B() {
    return this.m[4];
  }
  /**
   * Set Boundary to Boundary intersection
   * @param geom
   */
  set B2B(t) {
    this.m[4] = t;
  }
  /**
   * Get Boundary To Exterior intersection
   * @returns {Shape[] | undefined}
   */
  get B2E() {
    return this.m[5];
  }
  /**
   * Set Boundary to Exterior intersection
   * @param geom
   */
  set B2E(t) {
    this.m[5] = t;
  }
  /**
   * Get Exterior To Interior intersection
   * @returns {Shape[] | undefined}
   */
  get E2I() {
    return this.m[6];
  }
  /**
   * Set Exterior to Interior intersection
   * @param geom
   */
  set E2I(t) {
    this.m[6] = t;
  }
  /**
   * Get Exterior To Boundary intersection
   * @returns {Shape[] | undefined}
   */
  get E2B() {
    return this.m[7];
  }
  /**
   * Set Exterior to Boundary intersection
   * @param geom
   */
  set E2B(t) {
    this.m[7] = t;
  }
  /**
   * Get Exterior to Exterior intersection
   * @returns {Shape[] | undefined}
   */
  get E2E() {
    return this.m[8];
  }
  /**
   * Set Exterior to Exterior intersection
   * @param geom
   */
  set E2E(t) {
    this.m[8] = t;
  }
  /**
   * Return de9im matrix as string where<br/>
   * - intersection is 'T'<br/>
   * - not intersected is 'F'<br/>
   * - not relevant is '*'<br/>
   * For example, string 'FF**FF****' means 'DISJOINT'
   * @returns {string}
   */
  toString() {
    return this.m.map((t) => t instanceof Array && t.length > 0 ? "T" : t instanceof Array && t.length === 0 ? "F" : "*").join("");
  }
  equal() {
    return gi.test(this.toString());
  }
  intersect() {
    return pi.test(this.toString());
  }
  touch() {
    return _i.test(this.toString());
  }
  inside() {
    return mi.test(this.toString());
  }
  covered() {
    return Ei.test(this.toString());
  }
}
function Ot(r, t) {
  let e, n = new i.Ray(t), s = new i.Line(n.pt, n.norm);
  const l = new i.Box(
    n.box.xmin - i.DP_TOL,
    n.box.ymin - i.DP_TOL,
    n.box.xmax,
    n.box.ymax + i.DP_TOL
  );
  if (r.box.not_intersect(l))
    return i.OUTSIDE;
  let o = r.edges.search(l);
  if (o.length === 0)
    return i.OUTSIDE;
  for (let f of o)
    if (f.shape.contains(t))
      return i.BOUNDARY;
  let a = [...r.faces], u = [];
  for (let f of o)
    for (let g of n.intersect(f.shape)) {
      if (g.equalTo(t))
        return i.BOUNDARY;
      u.push({
        pt: g,
        edge: f,
        face_index: a.indexOf(f.face)
      });
    }
  u.sort((f, g) => ze(f.pt.x, g.pt.x) ? -1 : We(f.pt.x, g.pt.x) ? 1 : f.face_index < g.face_index ? -1 : f.face_index > g.face_index ? 1 : f.edge.arc_length < g.edge.arc_length ? -1 : f.edge.arc_length > g.edge.arc_length ? 1 : 0);
  let h = 0;
  for (let f = 0; f < u.length; f++) {
    let g = u[f];
    if (g.pt.equalTo(g.edge.shape.start)) {
      if (f > 0 && g.pt.equalTo(u[f - 1].pt) && g.face_index === u[f - 1].face_index && g.edge.prev === u[f - 1].edge)
        continue;
      let _ = g.edge.prev;
      for (; ne(_.length); )
        _ = _.prev;
      let w = _.shape.tangentInEnd(), v = g.pt.translate(w), I = g.edge.shape.tangentInStart(), S = g.pt.translate(I), E = v.leftTo(s), x = S.leftTo(s);
      (E && !x || !E && x) && h++;
    } else if (g.pt.equalTo(g.edge.shape.end)) {
      if (f > 0 && g.pt.equalTo(u[f - 1].pt) && g.face_index === u[f - 1].face_index && g.edge.next === u[f - 1].edge)
        continue;
      let _ = g.edge.next;
      for (; ne(_.length); )
        _ = _.next;
      let w = _.shape.tangentInStart(), v = g.pt.translate(w), I = g.edge.shape.tangentInEnd(), S = g.pt.translate(I), E = v.leftTo(s), x = S.leftTo(s);
      (E && !x || !E && x) && h++;
    } else if (g.edge.shape instanceof i.Segment)
      h++;
    else {
      let _ = g.edge.shape.box;
      rt(g.pt.y, _.ymin) || rt(g.pt.y, _.ymax) || h++;
    }
  }
  return e = h % 2 === 1 ? Wt : Ge, e;
}
function xi(r, t) {
  return Pt(r, t).equal();
}
function hn(r, t) {
  return Pt(r, t).intersect();
}
function Ti(r, t) {
  return Pt(r, t).touch();
}
function Ii(r, t) {
  return !hn(r, t);
}
function cn(r, t) {
  return Pt(r, t).inside();
}
function dn(r, t) {
  return Pt(r, t).covered();
}
function vi(r, t) {
  return cn(t, r);
}
function gn(r, t) {
  return dn(t, r);
}
function Pt(r, t) {
  if (r instanceof i.Line && t instanceof i.Line)
    return wi(r, t);
  if (r instanceof i.Line && t instanceof i.Circle)
    return Si(r, t);
  if (r instanceof i.Line && t instanceof i.Box)
    return yi(r, t);
  if (r instanceof i.Line && t instanceof i.Polygon)
    return Pi(r, t);
  if ((r instanceof i.Segment || r instanceof i.Arc) && t instanceof i.Polygon)
    return Ce(r, t);
  if ((r instanceof i.Segment || r instanceof i.Arc) && (t instanceof i.Circle || t instanceof i.Box))
    return Ce(r, new i.Polygon(t));
  if (r instanceof i.Polygon && t instanceof i.Polygon)
    return Ht(r, t);
  if ((r instanceof i.Circle || r instanceof i.Box) && (t instanceof i.Circle || t instanceof i.Box))
    return Ht(new i.Polygon(r), new i.Polygon(t));
  if ((r instanceof i.Circle || r instanceof i.Box) && t instanceof i.Polygon)
    return Ht(new i.Polygon(r), t);
  if (r instanceof i.Polygon && (t instanceof i.Circle || t instanceof i.Box))
    return Ht(r, new i.Polygon(t));
}
function wi(r, t) {
  let e = new yt(), n = wt(r, t);
  return n.length === 0 ? r.contains(t.pt) && t.contains(r.pt) ? (e.I2I = [r], e.I2E = [], e.E2I = []) : (e.I2I = [], e.I2E = [r], e.E2I = [t]) : (e.I2I = n, e.I2E = r.split(n), e.E2I = t.split(n)), e;
}
function Si(r, t) {
  let e = new yt(), n = lt(r, t);
  if (n.length === 0)
    e.I2I = [], e.I2B = [], e.I2E = [r], e.E2I = [t];
  else if (n.length === 1)
    e.I2I = [], e.I2B = n, e.I2E = r.split(n), e.E2I = [t];
  else {
    let s = new at([r]), l = r.sortPoints(n);
    s.split(l);
    let o = s.toShapes();
    e.I2I = [o[1]], e.I2B = l, e.I2E = [o[0], o[2]], e.E2I = new i.Polygon([t.toArc()]).cutWithLine(r);
  }
  return e;
}
function yi(r, t) {
  let e = new yt(), n = xt(r, t);
  if (n.length === 0)
    e.I2I = [], e.I2B = [], e.I2E = [r], e.E2I = [t];
  else if (n.length === 1)
    e.I2I = [], e.I2B = n, e.I2E = r.split(n), e.E2I = [t];
  else {
    let s = new at([r]), l = r.sortPoints(n);
    s.split(l);
    let o = s.toShapes();
    t.toSegments().some((a) => a.contains(n[0]) && a.contains(n[1])) ? (e.I2I = [], e.I2B = [o[1]], e.I2E = [o[0], o[2]], e.E2I = [t]) : (e.I2I = [o[1]], e.I2B = l, e.I2E = [o[0], o[2]], e.E2I = new i.Polygon(t.toSegments()).cutWithLine(r));
  }
  return e;
}
function Pi(r, t) {
  let e = new yt(), n = kt(r, t), s = new at([r]), l = n.length > 0 ? n.slice() : r.sortPoints(n);
  return s.split(l), [...s].forEach((o) => o.setInclusion(t)), e.I2I = [...s].filter((o) => o.bv === i.INSIDE).map((o) => o.shape), e.I2B = [...s].slice(1).map((o) => o.bv === i.BOUNDARY ? o.shape : o.shape.start), e.I2E = [...s].filter((o) => o.bv === i.OUTSIDE).map((o) => o.shape), e.E2I = t.cutWithLine(r), e;
}
function Ce(r, t) {
  let e = new yt(), n = Kn(r, t), s = n.length > 0 ? n.slice() : r.sortPoints(n), l = new at([r]);
  l.split(s), [...l].forEach((o) => o.setInclusion(t)), e.I2I = [...l].filter((o) => o.bv === i.INSIDE).map((o) => o.shape), e.I2B = [...l].slice(1).map((o) => o.bv === i.BOUNDARY ? o.shape : o.shape.start), e.I2E = [...l].filter((o) => o.bv === i.OUTSIDE).map((o) => o.shape), e.B2I = [], e.B2B = [], e.B2E = [];
  for (let o of [r.start, r.end])
    switch (Ot(t, o)) {
      case i.INSIDE:
        e.B2I.push(o);
        break;
      case i.BOUNDARY:
        e.B2B.push(o);
        break;
      case i.OUTSIDE:
        e.B2E.push(o);
        break;
    }
  return e;
}
function Ht(r, t) {
  let e = new yt(), [n, s] = fn(r, t), l = ln(r, t), o = se(r, t), a = se(t, r), [u, h] = an(r, t), f = oe(r, t), g = oe(t, r);
  return e.I2I = l.isEmpty() ? [] : [l], e.I2B = h, e.I2E = o.isEmpty() ? [] : [o], e.B2I = u, e.B2B = n, e.B2E = f, e.E2I = a.isEmpty() ? [] : [a], e.E2B = g, e;
}
var Li = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  contain: vi,
  cover: gn,
  covered: dn,
  disjoint: Ii,
  equal: xi,
  inside: cn,
  intersect: hn,
  relate: Pt,
  touch: Ti
});
let Nt = class ct {
  /**
   * Construct new instance of affine transformation matrix <br/>
   * If parameters omitted, construct identity matrix a = 1, d = 1
   * @param {number} a - position(0,0)   sx*cos(alpha)
   * @param {number} b - position (0,1)  sx*sin(alpha)
   * @param {number} c - position (1,0)  -sy*sin(alpha)
   * @param {number} d - position (1,1)  sy*cos(alpha)
   * @param {number} tx - position (2,0) translation by x
   * @param {number} ty - position (2,1) translation by y
   */
  constructor(t = 1, e = 0, n = 0, s = 1, l = 0, o = 0) {
    this.a = t, this.b = e, this.c = n, this.d = s, this.tx = l, this.ty = o;
  }
  /**
   * Return new cloned instance of matrix
   * @return {Matrix}
   **/
  clone() {
    return new ct(this.a, this.b, this.c, this.d, this.tx, this.ty);
  }
  /**
   * Transform vector [x,y] using transformation matrix. <br/>
   * Vector [x,y] is an abstract array[2] of numbers and not a FlattenJS object <br/>
   * The result is also an abstract vector [x',y'] = A * [x,y]:
   * <code>
   * [x'       [ ax + by + tx
   *  y'   =     cx + dy + ty
   *  1]                    1 ]
   * </code>
   * @param {number[]} vector - array[2] of numbers
   * @returns {number[]} transformation result - array[2] of numbers
   */
  transform(t) {
    return [
      t[0] * this.a + t[1] * this.c + this.tx,
      t[0] * this.b + t[1] * this.d + this.ty
    ];
  }
  /**
   * Returns result of multiplication of this matrix by other matrix
   * @param {Matrix} other_matrix - matrix to multiply by
   * @returns {Matrix}
   */
  multiply(t) {
    return new ct(
      this.a * t.a + this.c * t.b,
      this.b * t.a + this.d * t.b,
      this.a * t.c + this.c * t.d,
      this.b * t.c + this.d * t.d,
      this.a * t.tx + this.c * t.ty + this.tx,
      this.b * t.tx + this.d * t.ty + this.ty
    );
  }
  /**
   * Return new matrix as a result of multiplication of the current matrix
   * by the matrix(1,0,0,1,tx,ty)
   * @param {Vector} vector - Translation by vector or
   * @param {number} tx - translation by x-axis
   * @param {number} ty - translation by y-axis
   * @returns {Matrix}
   */
  translate(...t) {
    let e, n;
    if (t.length == 1 && !isNaN(t[0].x) && !isNaN(t[0].y))
      e = t[0].x, n = t[0].y;
    else if (t.length === 2 && typeof t[0] == "number" && typeof t[1] == "number")
      e = t[0], n = t[1];
    else
      throw T.ILLEGAL_PARAMETERS;
    return this.multiply(new ct(1, 0, 0, 1, e, n));
  }
  /**
   * Return new matrix as a result of multiplication of the current matrix
   * by the matrix that defines rotation by given angle (in radians) around
   * center of rotation (centerX,centerY) in counterclockwise direction
   * @param {number} angle - angle in radians
   * @param {number} centerX - center of rotation
   * @param {number} centerY - center of rotation
   * @returns {Matrix}
   */
  rotate(t, e = 0, n = 0) {
    let s = Math.cos(t), l = Math.sin(t);
    return this.translate(e, n).multiply(new ct(s, l, -l, s, 0, 0)).translate(-e, -n);
  }
  /**
   * Return new matrix as a result of multiplication of the current matrix
   * by the matrix (sx,0,0,sy,0,0) that defines scaling
   * @param {number} sx
   * @param {number} sy
   * @returns {Matrix}
   */
  scale(t, e) {
    return this.multiply(new ct(t, 0, 0, e, 0, 0));
  }
  /**
   * Returns true if two matrix are equal parameter by parameter
   * @param {Matrix} matrix - other matrix
   * @returns {boolean} true if equal, false otherwise
   */
  equalTo(t) {
    return !(!i.Utils.EQ(this.tx, t.tx) || !i.Utils.EQ(this.ty, t.ty) || !i.Utils.EQ(this.a, t.a) || !i.Utils.EQ(this.b, t.b) || !i.Utils.EQ(this.c, t.c) || !i.Utils.EQ(this.d, t.d));
  }
};
i.Matrix = Nt;
const Ai = (...r) => new i.Matrix(...r);
i.matrix = Ai;
const bi = class ue {
  /**
   * Accept two comparable values and creates new instance of interval
   * Predicate Interval.comparable_less(low, high) supposed to return true on these values
   * @param low
   * @param high
   */
  constructor(t, e) {
    this.low = t, this.high = e;
  }
  /**
   * Clone interval
   * @returns {Interval}
   */
  clone() {
    return new ue(this.low, this.high);
  }
  /**
   * Propery max returns clone of this interval
   * @returns {Interval}
   */
  get max() {
    return this.clone();
  }
  /**
   * Predicate returns true is this interval less than other interval
   * @param other_interval
   * @returns {boolean}
   */
  less_than(t) {
    return this.low < t.low || this.low == t.low && this.high < t.high;
  }
  /**
   * Predicate returns true is this interval equals to other interval
   * @param other_interval
   * @returns {boolean}
   */
  equal_to(t) {
    return this.low == t.low && this.high == t.high;
  }
  /**
   * Predicate returns true if this interval intersects other interval
   * @param other_interval
   * @returns {boolean}
   */
  intersect(t) {
    return !this.not_intersect(t);
  }
  /**
   * Predicate returns true if this interval does not intersect other interval
   * @param other_interval
   * @returns {boolean}
   */
  not_intersect(t) {
    return this.high < t.low || t.high < this.low;
  }
  /**
   * Returns new interval merged with other interval
   * @param {Interval} interval - Other interval to merge with
   * @returns {Interval}
   */
  merge(t) {
    return new ue(
      this.low === void 0 ? t.low : Math.min(this.low, t.low),
      this.high === void 0 ? t.high : Math.max(this.high, t.high)
    );
  }
  /**
   * Returns how key should return
   */
  output() {
    return [this.low, this.high];
  }
  /**
   * Function returns maximum between two comparable values
   * @param interval1
   * @param interval2
   * @returns {Interval}
   */
  static comparable_max(t, e) {
    return t.merge(e);
  }
  /**
   * Predicate returns true if first value less than second value
   * @param val1
   * @param val2
   * @returns {boolean}
   */
  static comparable_less_than(t, e) {
    return t < e;
  }
}, L = 0, m = 1;
class ut {
  constructor(t = void 0, e = void 0, n = null, s = null, l = null, o = m) {
    this.left = n, this.right = s, this.parent = l, this.color = o, this.item = { key: t, value: e }, t && t instanceof Array && t.length == 2 && !Number.isNaN(t[0]) && !Number.isNaN(t[1]) && (this.item.key = new bi(Math.min(t[0], t[1]), Math.max(t[0], t[1]))), this.max = this.item.key ? this.item.key.max : void 0;
  }
  isNil() {
    return this.item.key === void 0 && this.item.value === void 0 && this.left === null && this.right === null && this.color === m;
  }
  _value_less_than(t) {
    return this.item.value && t.item.value && this.item.value.less_than ? this.item.value.less_than(t.item.value) : this.item.value < t.item.value;
  }
  less_than(t) {
    return this.item.value === this.item.key && t.item.value === t.item.key ? this.item.key.less_than(t.item.key) : this.item.key.less_than(t.item.key) || this.item.key.equal_to(t.item.key) && this._value_less_than(t);
  }
  _value_equal(t) {
    return this.item.value && t.item.value && this.item.value.equal_to ? this.item.value.equal_to(t.item.value) : this.item.value == t.item.value;
  }
  equal_to(t) {
    return this.item.value === this.item.key && t.item.value === t.item.key ? this.item.key.equal_to(t.item.key) : this.item.key.equal_to(t.item.key) && this._value_equal(t);
  }
  intersect(t) {
    return this.item.key.intersect(t.item.key);
  }
  copy_data(t) {
    this.item.key = t.item.key, this.item.value = t.item.value;
  }
  update_max() {
    if (this.max = this.item.key ? this.item.key.max : void 0, this.right && this.right.max) {
      const t = this.item.key.constructor.comparable_max;
      this.max = t(this.max, this.right.max);
    }
    if (this.left && this.left.max) {
      const t = this.item.key.constructor.comparable_max;
      this.max = t(this.max, this.left.max);
    }
  }
  // Other_node does not intersect any node of left subtree, if this.left.max < other_node.item.key.low
  not_intersect_left_subtree(t) {
    const e = this.item.key.constructor.comparable_less_than;
    let n = this.left.max.high !== void 0 ? this.left.max.high : this.left.max;
    return e(n, t.item.key.low);
  }
  // Other_node does not intersect right subtree if other_node.item.key.high < this.right.key.low
  not_intersect_right_subtree(t) {
    const e = this.item.key.constructor.comparable_less_than;
    let n = this.right.max.low !== void 0 ? this.right.max.low : this.right.item.key.low;
    return e(t.item.key.high, n);
  }
}
class Ut {
  /**
   * Construct new empty instance of IntervalTree
   */
  constructor() {
    this.root = null, this.nil_node = new ut();
  }
  /**
   * Returns number of items stored in the interval tree
   * @returns {number}
   */
  get size() {
    let t = 0;
    return this.tree_walk(this.root, () => t++), t;
  }
  /**
   * Returns array of sorted keys in the ascending order
   * @returns {Array}
   */
  get keys() {
    let t = [];
    return this.tree_walk(this.root, (e) => t.push(
      e.item.key.output ? e.item.key.output() : e.item.key
    )), t;
  }
  /**
   * Return array of values in the ascending keys order
   * @returns {Array}
   */
  get values() {
    let t = [];
    return this.tree_walk(this.root, (e) => t.push(e.item.value)), t;
  }
  /**
   * Returns array of items (<key,value> pairs) in the ascended keys order
   * @returns {Array}
   */
  get items() {
    let t = [];
    return this.tree_walk(this.root, (e) => t.push({
      key: e.item.key.output ? e.item.key.output() : e.item.key,
      value: e.item.value
    })), t;
  }
  /**
   * Returns true if tree is empty
   * @returns {boolean}
   */
  isEmpty() {
    return this.root == null || this.root == this.nil_node;
  }
  /**
   * Clear tree
   */
  clear() {
    this.root = null;
  }
  /**
   * Insert new item into interval tree
   * @param {Interval} key - interval object or array of two numbers [low, high]
   * @param {any} value - value representing any object (optional)
   * @returns {Node} returns reference to inserted node as an object {key:interval, value: value}
   */
  insert(t, e = t) {
    if (t === void 0) return;
    let n = new ut(t, e, this.nil_node, this.nil_node, null, L);
    return this.tree_insert(n), this.recalc_max(n), n;
  }
  /**
   * Returns true if item {key,value} exist in the tree
   * @param {Interval} key - interval correspondent to keys stored in the tree
   * @param {any} value - value object to be checked
   * @returns {boolean} true if item {key, value} exist in the tree, false otherwise
   */
  exist(t, e = t) {
    let n = new ut(t, e);
    return !!this.tree_search(this.root, n);
  }
  /**
   * Remove entry {key, value} from the tree
   * @param {Interval} key - interval correspondent to keys stored in the tree
   * @param {any} value - value object
   * @returns {boolean} true if item {key, value} deleted, false if not found
   */
  remove(t, e = t) {
    let n = new ut(t, e), s = this.tree_search(this.root, n);
    return s && this.tree_delete(s), s;
  }
  /**
   * Returns array of entry values which keys intersect with given interval <br/>
   * If no values stored in the tree, returns array of keys which intersect given interval
   * @param {Interval} interval - search interval, or tuple [low, high]
   * @param outputMapperFn(value,key) - optional function that maps (value, key) to custom output
   * @returns {Array}
   */
  search(t, e = (n, s) => n === s ? s.output() : n) {
    let n = new ut(t), s = [];
    return this.tree_search_interval(this.root, n, s), s.map((l) => e(l.item.value, l.item.key));
  }
  /**
   * Returns true if intersection between given and any interval stored in the tree found
   * @param {Interval} interval - search interval or tuple [low, high]
   * @returns {boolean}
   */
  intersect_any(t) {
    let e = new ut(t);
    return this.tree_find_any_interval(this.root, e);
  }
  /**
   * Tree visitor. For each node implement a callback function. <br/>
   * Method calls a callback function with two parameters (key, value)
   * @param visitor(key,value) - function to be called for each tree item
   */
  forEach(t) {
    this.tree_walk(this.root, (e) => t(e.item.key, e.item.value));
  }
  /** Value Mapper. Walk through every node and map node value to another value
  * @param callback(value,key) - function to be called for each tree item
  */
  map(t) {
    const e = new Ut();
    return this.tree_walk(this.root, (n) => e.insert(n.item.key, t(n.item.value, n.item.key))), e;
  }
  recalc_max(t) {
    let e = t;
    for (; e.parent != null; )
      e.parent.update_max(), e = e.parent;
  }
  tree_insert(t) {
    let e = this.root, n = null;
    if (this.root == null || this.root == this.nil_node)
      this.root = t;
    else {
      for (; e != this.nil_node; )
        n = e, t.less_than(e) ? e = e.left : e = e.right;
      t.parent = n, t.less_than(n) ? n.left = t : n.right = t;
    }
    this.insert_fixup(t);
  }
  // After insertion insert_node may have red-colored parent, and this is a single possible violation
  // Go upwords to the root and re-color until violation will be resolved
  insert_fixup(t) {
    let e, n;
    for (e = t; e != this.root && e.parent.color == L; )
      e.parent == e.parent.parent.left ? (n = e.parent.parent.right, n.color == L ? (e.parent.color = m, n.color = m, e.parent.parent.color = L, e = e.parent.parent) : (e == e.parent.right && (e = e.parent, this.rotate_left(e)), e.parent.color = m, e.parent.parent.color = L, this.rotate_right(e.parent.parent))) : (n = e.parent.parent.left, n.color == L ? (e.parent.color = m, n.color = m, e.parent.parent.color = L, e = e.parent.parent) : (e == e.parent.left && (e = e.parent, this.rotate_right(e)), e.parent.color = m, e.parent.parent.color = L, this.rotate_left(e.parent.parent)));
    this.root.color = m;
  }
  tree_delete(t) {
    let e, n;
    t.left == this.nil_node || t.right == this.nil_node ? e = t : e = this.tree_successor(t), e.left != this.nil_node ? n = e.left : n = e.right, n.parent = e.parent, e == this.root ? this.root = n : (e == e.parent.left ? e.parent.left = n : e.parent.right = n, e.parent.update_max()), this.recalc_max(n), e != t && (t.copy_data(e), t.update_max(), this.recalc_max(t)), /*fix_node != this.nil_node && */
    e.color == m && this.delete_fixup(n);
  }
  delete_fixup(t) {
    let e = t, n;
    for (; e != this.root && e.parent != null && e.color == m; )
      e == e.parent.left ? (n = e.parent.right, n.color == L && (n.color = m, e.parent.color = L, this.rotate_left(e.parent), n = e.parent.right), n.left.color == m && n.right.color == m ? (n.color = L, e = e.parent) : (n.right.color == m && (n.color = L, n.left.color = m, this.rotate_right(n), n = e.parent.right), n.color = e.parent.color, e.parent.color = m, n.right.color = m, this.rotate_left(e.parent), e = this.root)) : (n = e.parent.left, n.color == L && (n.color = m, e.parent.color = L, this.rotate_right(e.parent), n = e.parent.left), n.left.color == m && n.right.color == m ? (n.color = L, e = e.parent) : (n.left.color == m && (n.color = L, n.right.color = m, this.rotate_left(n), n = e.parent.left), n.color = e.parent.color, e.parent.color = m, n.left.color = m, this.rotate_right(e.parent), e = this.root));
    e.color = m;
  }
  tree_search(t, e) {
    if (!(t == null || t == this.nil_node))
      return e.equal_to(t) ? t : e.less_than(t) ? this.tree_search(t.left, e) : this.tree_search(t.right, e);
  }
  // Original search_interval method; container res support push() insertion
  // Search all intervals intersecting given one
  tree_search_interval(t, e, n) {
    t != null && t != this.nil_node && (t.left != this.nil_node && !t.not_intersect_left_subtree(e) && this.tree_search_interval(t.left, e, n), t.intersect(e) && n.push(t), t.right != this.nil_node && !t.not_intersect_right_subtree(e) && this.tree_search_interval(t.right, e, n));
  }
  tree_find_any_interval(t, e) {
    let n = !1;
    return t != null && t != this.nil_node && (t.left != this.nil_node && !t.not_intersect_left_subtree(e) && (n = this.tree_find_any_interval(t.left, e)), n || (n = t.intersect(e)), !n && t.right != this.nil_node && !t.not_intersect_right_subtree(e) && (n = this.tree_find_any_interval(t.right, e))), n;
  }
  local_minimum(t) {
    let e = t;
    for (; e.left != null && e.left != this.nil_node; )
      e = e.left;
    return e;
  }
  // not in use
  local_maximum(t) {
    let e = t;
    for (; e.right != null && e.right != this.nil_node; )
      e = e.right;
    return e;
  }
  tree_successor(t) {
    let e, n, s;
    if (t.right != this.nil_node)
      e = this.local_minimum(t.right);
    else {
      for (n = t, s = t.parent; s != null && s.right == n; )
        n = s, s = s.parent;
      e = s;
    }
    return e;
  }
  //           |            right-rotate(T,y)       |
  //           y            ---------------.       x
  //          / \                                  / \
  //         x   c          left-rotate(T,x)      a   y
  //        / \             <---------------         / \
  //       a   b                                    b   c
  rotate_left(t) {
    let e = t.right;
    t.right = e.left, e.left != this.nil_node && (e.left.parent = t), e.parent = t.parent, t == this.root ? this.root = e : t == t.parent.left ? t.parent.left = e : t.parent.right = e, e.left = t, t.parent = e, t != null && t != this.nil_node && t.update_max(), e = t.parent, e != null && e != this.nil_node && e.update_max();
  }
  rotate_right(t) {
    let e = t.left;
    t.left = e.right, e.right != this.nil_node && (e.right.parent = t), e.parent = t.parent, t == this.root ? this.root = e : t == t.parent.left ? t.parent.left = e : t.parent.right = e, e.right = t, t.parent = e, t != null && t != this.nil_node && t.update_max(), e = t.parent, e != null && e != this.nil_node && e.update_max();
  }
  tree_walk(t, e) {
    t != null && t != this.nil_node && (this.tree_walk(t.left, e), e(t), this.tree_walk(t.right, e));
  }
  /* Return true if all red nodes have exactly two black child nodes */
  testRedBlackProperty() {
    let t = !0;
    return this.tree_walk(this.root, function(e) {
      e.color == L && (e.left.color == m && e.right.color == m || (t = !1));
    }), t;
  }
  /* Throw error if not every path from root to bottom has same black height */
  testBlackHeightProperty(t) {
    let e = 0, n = 0, s = 0;
    if (t.color == m && e++, t.left != this.nil_node ? n = this.testBlackHeightProperty(t.left) : n = 1, t.right != this.nil_node ? s = this.testBlackHeightProperty(t.right) : s = 1, n != s)
      throw new Error("Red-black height property violated");
    return e += n, e;
  }
}
class Oi extends Set {
  /**
   * Create new instance of PlanarSet
   * @param shapes - array or set of geometric objects to store in planar set
   * Each object should have a <b>box</b> property
   */
  constructor(t) {
    super(t), this.index = new Ut(), this.forEach((e) => this.index.insert(e));
  }
  /**
   * Add new shape to planar set and to its spatial index.<br/>
   * If shape already exist, it will not be added again.
   * This happens with no error, it is possible to use <i>size</i> property to check if
   * a shape was actually added.<br/>
   * Method returns planar set object updated and may be chained
   * @param {AnyShape | {Box, AnyShape}} entry - shape to be added, should have valid <i>box</i> property
   * Another option to transfer as an object {key: Box, value: AnyShape}
   * @returns {PlanarSet}
   */
  add(t) {
    let e = this.size;
    const { key: n, value: s } = t, l = n || t.box, o = s || t;
    return super.add(o), this.size > e && this.index.insert(l, o), this;
  }
  /**
   * Delete shape from planar set. Returns true if shape was actually deleted, false otherwise
   * @param {AnyShape | {Box, AnyShape}} entry - shape to be deleted
   * @returns {boolean}
   */
  delete(t) {
    const { key: e, value: n } = t, s = e || t.box, l = n || t;
    let o = super.delete(l);
    return o && this.index.remove(s, l), o;
  }
  /**
   * Clear planar set
   */
  clear() {
    super.clear(), this.index = new Ut();
  }
  /**
   * 2d range search in planar set.<br/>
   * Returns array of all shapes in planar set which bounding box is intersected with query box
   * @param {Box} box - query box
   * @returns {AnyShape[]}
   */
  search(t) {
    return this.index.search(t);
  }
  /**
   * Point location test. Returns array of shapes which contains given point
   * @param {Point} point - query point
   * @returns {AnyShape[]}
   */
  hit(t) {
    let e = new i.Box(t.x - 1, t.y - 1, t.x + 1, t.y + 1);
    return this.index.search(e).filter((s) => t.on(s));
  }
  /**
   * Returns svg string to draw all shapes in planar set
   * @returns {String}
   */
  svg() {
    return [...this].reduce((e, n) => e + n.svg(), "");
  }
}
i.PlanarSet = Oi;
class it {
  get name() {
    throw T.CANNOT_INVOKE_ABSTRACT_METHOD;
  }
  get box() {
    throw T.CANNOT_INVOKE_ABSTRACT_METHOD;
  }
  clone() {
    throw T.CANNOT_INVOKE_ABSTRACT_METHOD;
  }
  /**
   * Returns new shape translated by given vector.
   * Translation vector may be also defined by a pair of numbers.
   * @param {Vector | (number, number) } args - Translation vector
   * or tuple of numbers
   * @returns {Shape}
   */
  translate(...t) {
    return this.transform(new Nt().translate(...t));
  }
  /**
   * Returns new shape rotated by given angle around given center point.
   * If center point is omitted, rotates around zero point (0,0).
   * Positive value of angle defines rotation in counterclockwise direction,
   * negative angle defines rotation in clockwise direction
   * @param {number} angle - angle in radians
   * @param {Point} [center=(0,0)] center
   * @returns {Shape}
   */
  rotate(t, e = new i.Point()) {
    return this.transform(new Nt().rotate(t, e.x, e.y));
  }
  /**
   * Return new shape with coordinates multiplied by scaling factor
   * @param {number} sx - x-axis scaling factor
   * @param {number} sy - y-axis scaling factor
   * @returns {Shape}
   */
  scale(t, e) {
    return this.transform(new Nt().scale(t, e));
  }
  transform(...t) {
    throw T.CANNOT_INVOKE_ABSTRACT_METHOD;
  }
  /**
   * This method returns an object that defines how data will be
   * serialized when called JSON.stringify() method
   * @returns {Object}
   */
  toJSON() {
    return Object.assign({}, this, { name: this.name });
  }
  svg(t = {}) {
    throw T.CANNOT_INVOKE_ABSTRACT_METHOD;
  }
}
let Ni = class pn extends it {
  /**
   * Point may be constructed by two numbers, or by array of two numbers
   * @param {number} x - x-coordinate (float number)
   * @param {number} y - y-coordinate (float number)
   */
  constructor(...t) {
    if (super(), this.x = 0, this.y = 0, t.length !== 0) {
      if (t.length === 1 && t[0] instanceof Array && t[0].length === 2) {
        let e = t[0];
        if (typeof e[0] == "number" && typeof e[1] == "number") {
          this.x = e[0], this.y = e[1];
          return;
        }
      }
      if (t.length === 1 && t[0] instanceof Object && t[0].name === "point") {
        let { x: e, y: n } = t[0];
        this.x = e, this.y = n;
        return;
      }
      if (t.length === 2 && typeof t[0] == "number" && typeof t[1] == "number") {
        this.x = t[0], this.y = t[1];
        return;
      }
      throw T.ILLEGAL_PARAMETERS;
    }
  }
  /**
   * Returns bounding box of a point
   * @returns {Box}
   */
  get box() {
    return new i.Box(this.x, this.y, this.x, this.y);
  }
  /**
   * Return new cloned instance of point
   * @returns {Point}
   */
  clone() {
    return new i.Point(this.x, this.y);
  }
  get vertices() {
    return [this.clone()];
  }
  /**
   * Returns true if points are equal up to [Flatten.Utils.DP_TOL]{@link DP_TOL} tolerance
   * @param {Point} pt Query point
   * @returns {boolean}
   */
  equalTo(t) {
    return i.Utils.EQ(this.x, t.x) && i.Utils.EQ(this.y, t.y);
  }
  /**
   * Defines predicate "less than" between points. Returns true if the point is less than query points, false otherwise <br/>
   * By definition point1 < point2 if {point1.y < point2.y || point1.y == point2.y && point1.x < point2.x <br/>
   * Numeric values compared with [Flatten.Utils.DP_TOL]{@link DP_TOL} tolerance
   * @param {Point} pt Query point
   * @returns {boolean}
   */
  lessThan(t) {
    return !!(i.Utils.LT(this.y, t.y) || i.Utils.EQ(this.y, t.y) && i.Utils.LT(this.x, t.x));
  }
  /**
   * Return new point transformed by affine transformation matrix
   * @param {Matrix} m - affine transformation matrix (a,b,c,d,tx,ty)
   * @returns {Point}
   */
  transform(t) {
    return new i.Point(t.transform([this.x, this.y]));
  }
  /**
   * Returns projection point on given line
   * @param {Line} line Line this point be projected on
   * @returns {Point}
   */
  projectionOn(t) {
    if (this.equalTo(t.pt))
      return this.clone();
    let e = new i.Vector(this, t.pt);
    if (i.Utils.EQ_0(e.cross(t.norm)))
      return t.pt.clone();
    let n = e.dot(t.norm), s = t.norm.multiply(n);
    return this.translate(s);
  }
  /**
   * Returns true if point belongs to the "left" semi-plane, which means, point belongs to the same semi plane where line normal vector points to
   * Return false if point belongs to the "right" semi-plane or to the line itself
   * @param {Line} line Query line
   * @returns {boolean}
   */
  leftTo(t) {
    let e = new i.Vector(t.pt, this);
    return i.Utils.GT(e.dot(t.norm), 0);
  }
  /**
   * Calculate distance and shortest segment from point to shape and return as array [distance, shortest segment]
   * @param {Shape} shape Shape of the one of supported types Point, Line, Circle, Segment, Arc, Polygon or Planar Set
   * @returns {number} distance from point to shape
   * @returns {Segment} shortest segment between point and shape (started at point, ended at shape)
   */
  distanceTo(t) {
    if (t instanceof pn) {
      let e = t.x - this.x, n = t.y - this.y;
      return [Math.sqrt(e * e + n * n), new i.Segment(this, t)];
    }
    if (t instanceof i.Line)
      return i.Distance.point2line(this, t);
    if (t instanceof i.Circle)
      return i.Distance.point2circle(this, t);
    if (t instanceof i.Segment)
      return i.Distance.point2segment(this, t);
    if (t instanceof i.Arc)
      return i.Distance.point2arc(this, t);
    if (t instanceof i.Polygon)
      return i.Distance.point2polygon(this, t);
    if (t instanceof i.PlanarSet)
      return i.Distance.shape2planarSet(this, t);
    if (t instanceof i.Multiline)
      return i.Distance.shape2multiline(this, t);
  }
  /**
   * Returns true if point is on a shape, false otherwise
   * @param {Shape} shape
   * @returns {boolean}
   */
  on(t) {
    if (t instanceof i.Point)
      return this.equalTo(t);
    if (t.contains && t.contains instanceof Function)
      return t.contains(this);
    throw i.Errors.UNSUPPORTED_SHAPE_TYPE;
  }
  get name() {
    return "point";
  }
  /**
   * Return string to draw point in svg as circle with radius "r" <br/>
   * Accept any valid attributes of svg elements as svg object
   * Defaults attribues are: <br/>
   * {
   *    r:"3",
   *    stroke:"black",
   *    strokeWidth:"1",
   *    fill:"red"
   * }
   * @param {Object} attrs - Any valid attributes of svg circle element, like "r", "stroke", "strokeWidth", "fill"
   * @returns {String}
   */
  svg(t = {}) {
    const e = t.r ?? 3;
    return `
<circle cx="${this.x}" cy="${this.y}" r="${e}"
            ${ot({ fill: "red", ...t })} />`;
  }
};
i.Point = Ni;
const Ci = (...r) => new i.Point(...r);
i.point = Ci;
let Ri = class extends it {
  /**
   * Vector may be constructed by two points, or by two float numbers,
   * or by array of two numbers
   * @param {Point} ps - start point
   * @param {Point} pe - end point
   */
  constructor(...t) {
    if (super(), this.x = 0, this.y = 0, t.length !== 0) {
      if (t.length === 1 && t[0] instanceof Array && t[0].length === 2) {
        let e = t[0];
        if (typeof e[0] == "number" && typeof e[1] == "number") {
          this.x = e[0], this.y = e[1];
          return;
        }
      }
      if (t.length === 1 && t[0] instanceof Object && t[0].name === "vector") {
        let { x: e, y: n } = t[0];
        this.x = e, this.y = n;
        return;
      }
      if (t.length === 2) {
        let e = t[0], n = t[1];
        if (typeof e == "number" && typeof n == "number") {
          this.x = e, this.y = n;
          return;
        }
        if (e instanceof i.Point && n instanceof i.Point) {
          this.x = n.x - e.x, this.y = n.y - e.y;
          return;
        }
      }
      throw T.ILLEGAL_PARAMETERS;
    }
  }
  /**
   * Method clone returns new instance of Vector
   * @returns {Vector}
   */
  clone() {
    return new i.Vector(this.x, this.y);
  }
  /**
   * Slope of the vector in radians from 0 to 2PI
   * @returns {number}
   */
  get slope() {
    let t = Math.atan2(this.y, this.x);
    return t < 0 && (t = 2 * Math.PI + t), t;
  }
  /**
   * Length of vector
   * @returns {number}
   */
  get length() {
    return Math.sqrt(this.dot(this));
  }
  /**
   * Returns true if vectors are equal up to [DP_TOL]{@link http://localhost:63342/flatten-js/docs/global.html#DP_TOL}
   * tolerance
   * @param {Vector} v
   * @returns {boolean}
   */
  equalTo(t) {
    return i.Utils.EQ(this.x, t.x) && i.Utils.EQ(this.y, t.y);
  }
  /**
   * Returns new vector multiplied by scalar
   * @param {number} scalar
   * @returns {Vector}
   */
  multiply(t) {
    return new i.Vector(t * this.x, t * this.y);
  }
  /**
   * Returns scalar product (dot product) of two vectors <br/>
   * <code>dot_product = (this * v)</code>
   * @param {Vector} v Other vector
   * @returns {number}
   */
  dot(t) {
    return this.x * t.x + this.y * t.y;
  }
  /**
   * Returns vector product (cross product) of two vectors <br/>
   * <code>cross_product = (this x v)</code>
   * @param {Vector} v Other vector
   * @returns {number}
   */
  cross(t) {
    return this.x * t.y - this.y * t.x;
  }
  /**
   * Returns unit vector.<br/>
   * Throw error if given vector has zero length
   * @returns {Vector}
   */
  normalize() {
    if (!i.Utils.EQ_0(this.length))
      return new i.Vector(this.x / this.length, this.y / this.length);
    throw T.ZERO_DIVISION;
  }
  /**
   * Returns new vector rotated by given angle,
   * positive angle defines rotation in counterclockwise direction,
   * negative - in clockwise direction
   * Vector only can be rotated around (0,0) point!
   * @param {number} angle - Angle in radians
   * @returns {Vector}
   */
  rotate(t, e = new i.Point()) {
    if (e.x === 0 && e.y === 0)
      return this.transform(new Nt().rotate(t));
    throw T.OPERATION_IS_NOT_SUPPORTED;
  }
  /**
   * Return new vector transformed by affine transformation matrix m
   * @param {Matrix} m - affine transformation matrix (a,b,c,d,tx,ty)
   * @returns {Vector}
   */
  transform(t) {
    return new i.Vector(t.transform([this.x, this.y]));
  }
  /**
   * Returns vector rotated 90 degrees counterclockwise
   * @returns {Vector}
   */
  rotate90CCW() {
    return new i.Vector(-this.y, this.x);
  }
  /**
   * Returns vector rotated 90 degrees clockwise
   * @returns {Vector}
   */
  rotate90CW() {
    return new i.Vector(this.y, -this.x);
  }
  /**
   * Return inverted vector
   * @returns {Vector}
   */
  invert() {
    return new i.Vector(-this.x, -this.y);
  }
  /**
   * Return result of addition of other vector to this vector as a new vector
   * @param {Vector} v Other vector
   * @returns {Vector}
   */
  add(t) {
    return new i.Vector(this.x + t.x, this.y + t.y);
  }
  /**
   * Return result of subtraction of other vector from current vector as a new vector
   * @param {Vector} v Another vector
   * @returns {Vector}
   */
  subtract(t) {
    return new i.Vector(this.x - t.x, this.y - t.y);
  }
  /**
   * Return angle between this vector and other vector. <br/>
   * Angle is measured from 0 to 2*PI in the counterclockwise direction
   * from current vector to  another.
   * @param {Vector} v Another vector
   * @returns {number}
   */
  angleTo(t) {
    let e = this.normalize(), n = t.normalize(), s = Math.atan2(e.cross(n), e.dot(n));
    return s < 0 && (s += 2 * Math.PI), s;
  }
  /**
   * Return vector projection of the current vector on another vector
   * @param {Vector} v Another vector
   * @returns {Vector}
   */
  projectionOn(t) {
    let e = t.normalize(), n = this.dot(e);
    return e.multiply(n);
  }
  get name() {
    return "vector";
  }
};
i.Vector = Ri;
const _n = (...r) => new i.Vector(...r);
i.vector = _n;
let Mi = class he extends it {
  /**
   *
   * @param {Point} ps - start point
   * @param {Point} pe - end point
   */
  constructor(...t) {
    if (super(), this.ps = new i.Point(), this.pe = new i.Point(), t.length !== 0) {
      if (t.length === 1 && t[0] instanceof Array && t[0].length === 4) {
        let e = t[0];
        this.ps = new i.Point(e[0], e[1]), this.pe = new i.Point(e[2], e[3]);
        return;
      }
      if (t.length === 1 && t[0] instanceof Object && t[0].name === "segment") {
        let { ps: e, pe: n } = t[0];
        this.ps = new i.Point(e.x, e.y), this.pe = new i.Point(n.x, n.y);
        return;
      }
      if (t.length === 1 && t[0] instanceof i.Point) {
        this.ps = t[0].clone();
        return;
      }
      if (t.length === 2 && t[0] instanceof i.Point && t[1] instanceof i.Point) {
        this.ps = t[0].clone(), this.pe = t[1].clone();
        return;
      }
      if (t.length === 4) {
        this.ps = new i.Point(t[0], t[1]), this.pe = new i.Point(t[2], t[3]);
        return;
      }
      throw T.ILLEGAL_PARAMETERS;
    }
  }
  /**
   * Return new cloned instance of segment
   * @returns {Segment}
   */
  clone() {
    return new i.Segment(this.start, this.end);
  }
  /**
   * Start point
   * @returns {Point}
   */
  get start() {
    return this.ps;
  }
  /**
   * End point
   * @returns {Point}
   */
  get end() {
    return this.pe;
  }
  /**
   * Returns array of start and end point
   * @returns [Point,Point]
   */
  get vertices() {
    return [this.ps.clone(), this.pe.clone()];
  }
  /**
   * Length of a segment
   * @returns {number}
   */
  get length() {
    return this.start.distanceTo(this.end)[0];
  }
  /**
   * Slope of the line - angle to axe x in radians from 0 to 2PI
   * @returns {number}
   */
  get slope() {
    return new i.Vector(this.start, this.end).slope;
  }
  /**
   * Bounding box
   * @returns {Box}
   */
  get box() {
    return new i.Box(
      Math.min(this.start.x, this.end.x),
      Math.min(this.start.y, this.end.y),
      Math.max(this.start.x, this.end.x),
      Math.max(this.start.y, this.end.y)
    );
  }
  /**
   * Returns true if equals to query segment, false otherwise
   * @param {Segment} seg - query segment
   * @returns {boolean}
   */
  equalTo(t) {
    return this.ps.equalTo(t.ps) && this.pe.equalTo(t.pe);
  }
  /**
   * Returns true if segment contains point
   * @param {Point} pt Query point
   * @returns {boolean}
   */
  contains(t) {
    return i.Utils.EQ_0(this.distanceToPoint(t));
  }
  /**
   * Returns array of intersection points between segment and other shape
   * @param {Shape} shape - Shape of the one of supported types <br/>
   * @returns {Point[]}
   */
  intersect(t) {
    if (t instanceof i.Point)
      return this.contains(t) ? [t] : [];
    if (t instanceof i.Line)
      return Ft(this, t);
    if (t instanceof i.Ray)
      return me(t, this);
    if (t instanceof i.Segment)
      return jt(this, t);
    if (t instanceof i.Circle)
      return Zt(this, t);
    if (t instanceof i.Box)
      return Wn(this, t);
    if (t instanceof i.Arc)
      return St(this, t);
    if (t instanceof i.Polygon)
      return pe(this, t);
    if (t instanceof i.Multiline)
      return Bt(this, t);
  }
  /**
   * Calculate distance and shortest segment from segment to shape and return as array [distance, shortest segment]
   * @param {Shape} shape Shape of the one of supported types Point, Line, Circle, Segment, Arc, Polygon or Planar Set
   * @returns {[number, Segment]} shortest segment between segment and shape (started at segment, ended at shape)
   */
  distanceTo(t) {
    if (t instanceof i.Point) {
      let [e, n] = i.Distance.point2segment(t, this);
      return n = n.reverse(), [e, n];
    }
    if (t instanceof i.Circle) {
      let [e, n] = i.Distance.segment2circle(this, t);
      return [e, n];
    }
    if (t instanceof i.Line) {
      let [e, n] = i.Distance.segment2line(this, t);
      return [e, n];
    }
    if (t instanceof i.Segment) {
      let [e, n] = i.Distance.segment2segment(this, t);
      return [e, n];
    }
    if (t instanceof i.Arc) {
      let [e, n] = i.Distance.segment2arc(this, t);
      return [e, n];
    }
    if (t instanceof i.Polygon) {
      let [e, n] = i.Distance.shape2polygon(this, t);
      return [e, n];
    }
    if (t instanceof i.PlanarSet) {
      let [e, n] = i.Distance.shape2planarSet(this, t);
      return [e, n];
    }
    if (t instanceof i.Multiline)
      return i.Distance.shape2multiline(this, t);
  }
  /**
   * Returns unit vector in the direction from start to end
   * @returns {Vector}
   */
  tangentInStart() {
    return new i.Vector(this.start, this.end).normalize();
  }
  /**
   * Return unit vector in the direction from end to start
   * @returns {Vector}
   */
  tangentInEnd() {
    return new i.Vector(this.end, this.start).normalize();
  }
  /**
   * Returns new segment with swapped start and end points
   * @returns {Segment}
   */
  reverse() {
    return new he(this.end, this.start);
  }
  /**
   * When point belongs to segment, return array of two segments split by given point,
   * if point is inside segment. Returns clone of this segment if query point is incident
   * to start or end point of the segment. Returns empty array if point does not belong to segment
   * @param {Point} pt Query point
   * @returns {Segment[]}
   */
  split(t) {
    return this.start.equalTo(t) ? [null, this.clone()] : this.end.equalTo(t) ? [this.clone(), null] : [
      new i.Segment(this.start, t),
      new i.Segment(t, this.end)
    ];
  }
  /**
   * Return middle point of the segment
   * @returns {Point}
   */
  middle() {
    return new i.Point((this.start.x + this.end.x) / 2, (this.start.y + this.end.y) / 2);
  }
  /**
   * Get point at given length
   * @param {number} length - The length along the segment
   * @returns {Point}
   */
  pointAtLength(t) {
    if (t > this.length || t < 0) return null;
    if (t == 0) return this.start;
    if (t == this.length) return this.end;
    let e = t / this.length;
    return new i.Point(
      (this.end.x - this.start.x) * e + this.start.x,
      (this.end.y - this.start.y) * e + this.start.y
    );
  }
  distanceToPoint(t) {
    let [e, ...n] = i.Distance.point2segment(t, this);
    return e;
  }
  definiteIntegral(t = 0) {
    let e = this.end.x - this.start.x, n = this.start.y - t, s = this.end.y - t;
    return e * (n + s) / 2;
  }
  /**
   * Return new segment transformed using affine transformation matrix
   * @param {Matrix} matrix - affine transformation matrix
   * @returns {Segment} - transformed segment
   */
  transform(t = new i.Matrix()) {
    return new he(this.ps.transform(t), this.pe.transform(t));
  }
  /**
   * Returns true if segment start is equal to segment end up to DP_TOL
   * @returns {boolean}
   */
  isZeroLength() {
    return this.ps.equalTo(this.pe);
  }
  /**
   * Sort given array of points from segment start to end, assuming all points lay on the segment
   * @param {Point[]} - array of points
   * @returns {Point[]} new array sorted
   */
  sortPoints(t) {
    return new i.Line(this.start, this.end).sortPoints(t);
  }
  get name() {
    return "segment";
  }
  /**
   * Return string to draw segment in svg
   * @param {Object} attrs - an object with attributes for svg path element,
   * like "stroke", "strokeWidth" <br/>
   * Defaults are stroke:"black", strokeWidth:"1"
   * @returns {string}
   */
  svg(t = {}) {
    return `
<line x1="${this.start.x}" y1="${this.start.y}" x2="${this.end.x}" y2="${this.end.y}" ${ot(t)} />`;
  }
};
i.Segment = Mi;
const Ui = (...r) => new i.Segment(...r);
i.segment = Ui;
let { vector: Lt } = i, Fi = class mn extends it {
  /**
   * Line may be constructed by point and normal vector or by two points that a line passes through
   * @param {Point} pt - point that a line passes through
   * @param {Vector|Point} norm - normal vector to a line or second point a line passes through
   */
  constructor(...t) {
    if (super(), this.pt = new i.Point(), this.norm = new i.Vector(0, 1), t.length !== 0) {
      if (t.length === 1 && t[0] instanceof Object && t[0].name === "line") {
        let { pt: e, norm: n } = t[0];
        this.pt = new i.Point(e), this.norm = new i.Vector(n);
        return;
      }
      if (t.length === 2) {
        let e = t[0], n = t[1];
        if (e instanceof i.Point && n instanceof i.Point) {
          this.pt = e, this.norm = mn.points2norm(e, n), this.norm.dot(Lt(this.pt.x, this.pt.y)) >= 0 && this.norm.invert();
          return;
        }
        if (e instanceof i.Point && n instanceof i.Vector) {
          if (i.Utils.EQ_0(n.x) && i.Utils.EQ_0(n.y))
            throw T.ILLEGAL_PARAMETERS;
          this.pt = e.clone(), this.norm = n.clone(), this.norm = this.norm.normalize(), this.norm.dot(Lt(this.pt.x, this.pt.y)) >= 0 && this.norm.invert();
          return;
        }
        if (e instanceof i.Vector && n instanceof i.Point) {
          if (i.Utils.EQ_0(e.x) && i.Utils.EQ_0(e.y))
            throw T.ILLEGAL_PARAMETERS;
          this.pt = n.clone(), this.norm = e.clone(), this.norm = this.norm.normalize(), this.norm.dot(Lt(this.pt.x, this.pt.y)) >= 0 && this.norm.invert();
          return;
        }
      }
      throw T.ILLEGAL_PARAMETERS;
    }
  }
  /**
   * Return new cloned instance of line
   * @returns {Line}
   */
  clone() {
    return new i.Line(this.pt, this.norm);
  }
  /* The following methods need for implementation of Edge interface
  /**
   * Line has no start point
   * @returns {undefined}
   */
  get start() {
  }
  /**
   * Line has no end point
   */
  get end() {
  }
  /**
   * Return positive infinity number as length
   * @returns {number}
   */
  get length() {
    return Number.POSITIVE_INFINITY;
  }
  /**
   * Returns infinite box
   * @returns {Box}
   */
  get box() {
    return new i.Box(
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY
    );
  }
  /**
   * Middle point is undefined
   * @returns {undefined}
   */
  get middle() {
  }
  /**
   * Slope of the line - angle in radians between line and axe x from 0 to 2PI
   * @returns {number} - slope of the line
   */
  get slope() {
    return new i.Vector(this.norm.y, -this.norm.x).slope;
  }
  /**
   * Get coefficients [A,B,C] of a standard line equation in the form Ax + By = C
   * @code [A, B, C] = line.standard
   * @returns {number[]} - array of coefficients
   */
  get standard() {
    let t = this.norm.x, e = this.norm.y, n = this.norm.dot(Lt(this.pt.x, this.pt.y));
    return [t, e, n];
  }
  /**
   * Return true if parallel or incident to other line
   * @param {Line} other_line - line to check
   * @returns {boolean}
   */
  parallelTo(t) {
    return i.Utils.EQ_0(this.norm.cross(t.norm));
  }
  /**
   * Returns true if incident to other line
   * @param {Line} other_line - line to check
   * @returns {boolean}
   */
  incidentTo(t) {
    return this.parallelTo(t) && this.pt.on(t);
  }
  /**
   * Returns true if point belongs to line
   * @param {Point} pt Query point
   * @returns {boolean}
   */
  contains(t) {
    if (this.pt.equalTo(t))
      return !0;
    let e = new i.Vector(this.pt, t);
    return i.Utils.EQ_0(this.norm.dot(e));
  }
  /**
   * Return coordinate of the point that lies on the line in the transformed
   * coordinate system where center is the projection of the point(0,0) to
   * the line and axe y is collinear to the normal vector. <br/>
   * This method assumes that point lies on the line and does not check it
   * @param {Point} pt - point on a line
   * @returns {number}
   */
  coord(t) {
    return Lt(t.x, t.y).cross(this.norm);
  }
  /**
   * Returns array of intersection points
   * @param {Shape} shape - shape to intersect with
   * @returns {Point[]}
   */
  intersect(t) {
    if (t instanceof i.Point)
      return this.contains(t) ? [t] : [];
    if (t instanceof i.Line)
      return wt(this, t);
    if (t instanceof i.Ray)
      return rn(t, this);
    if (t instanceof i.Circle)
      return lt(this, t);
    if (t instanceof i.Box)
      return xt(this, t);
    if (t instanceof i.Segment)
      return Ft(t, this);
    if (t instanceof i.Arc)
      return Qt(this, t);
    if (t instanceof i.Polygon)
      return kt(this, t);
    if (t instanceof i.Multiline)
      return Bt(this, t);
  }
  /**
   * Calculate distance and shortest segment from line to shape and returns array [distance, shortest_segment]
   * @param {Shape} shape Shape of the one of the types Point, Circle, Segment, Arc, Polygon
   * @returns {[number, Segment]}
   */
  distanceTo(t) {
    if (t instanceof i.Point) {
      let [e, n] = i.Distance.point2line(t, this);
      return n = n.reverse(), [e, n];
    }
    if (t instanceof i.Circle) {
      let [e, n] = i.Distance.circle2line(t, this);
      return n = n.reverse(), [e, n];
    }
    if (t instanceof i.Segment) {
      let [e, n] = i.Distance.segment2line(t, this);
      return [e, n.reverse()];
    }
    if (t instanceof i.Arc) {
      let [e, n] = i.Distance.arc2line(t, this);
      return [e, n.reverse()];
    }
    if (t instanceof i.Polygon) {
      let [e, n] = i.Distance.shape2polygon(this, t);
      return [e, n];
    }
  }
  /**
   * Split line with a point or array of points and return array of shapes
   * Assumed (but not checked) that all points lay on the line
   * @param {Point | Point[]} pt
   * @returns {MultilineShapes}
   */
  split(t) {
    if (t instanceof i.Point)
      return [new i.Ray(t, this.norm), new i.Ray(t, this.norm)];
    {
      let e = new i.Multiline([this]), n = this.sortPoints(t);
      return e.split(n), e.toShapes();
    }
  }
  /**
   * Return new line rotated by angle
   * @param {number} angle - angle in radians
   * @param {Point} center - center of rotation
   */
  rotate(t, e = new i.Point()) {
    return new i.Line(
      this.pt.rotate(t, e),
      this.norm.rotate(t)
    );
  }
  /**
   * Return new line transformed by affine transformation matrix
   * @param {Matrix} m - affine transformation matrix (a,b,c,d,tx,ty)
   * @returns {Line}
   */
  transform(t) {
    return new i.Line(
      this.pt.transform(t),
      this.norm.clone()
    );
  }
  /**
   * Sort given array of points that lay on a line with respect to coordinate on a line
   * The method assumes that points lay on the line and does not check this
   * @param {Point[]} pts - array of points
   * @returns {Point[]} new array sorted
   */
  sortPoints(t) {
    return t.slice().sort((e, n) => this.coord(e) < this.coord(n) ? -1 : this.coord(e) > this.coord(n) ? 1 : 0);
  }
  get name() {
    return "line";
  }
  /**
   * Return string to draw svg segment representing line inside given box
   * @param {Box} box Box representing drawing area
   * @param {Object} attrs - an object with attributes of svg circle element
   */
  svg(t, e = {}) {
    let n = xt(this, t);
    if (n.length === 0)
      return "";
    let s = n[0], l = n.length === 2 ? n[1] : n.find((a) => !a.equalTo(s));
    return l === void 0 && (l = s), new i.Segment(s, l).svg(e);
  }
  static points2norm(t, e) {
    if (t.equalTo(e))
      throw T.ILLEGAL_PARAMETERS;
    return new i.Vector(t, e).normalize().rotate90CCW();
  }
};
i.Line = Fi;
const ki = (...r) => new i.Line(...r);
i.line = ki;
let Bi = class extends it {
  /**
   * Class private property
   * @type {string}
   */
  /**
   *
   * @param {Point} pc - circle center point
   * @param {number} r - circle radius
   */
  constructor(...t) {
    if (super(), this.pc = new i.Point(), this.r = 1, t.length === 1 && t[0] instanceof Object && t[0].name === "circle") {
      let { pc: e, r: n } = t[0];
      this.pc = new i.Point(e), this.r = n;
    } else {
      let [e, n] = [...t];
      e && e instanceof i.Point && (this.pc = e.clone()), n !== void 0 && (this.r = n);
    }
  }
  /**
   * Return new cloned instance of circle
   * @returns {Circle}
   */
  clone() {
    return new i.Circle(this.pc.clone(), this.r);
  }
  /**
   * Circle center
   * @returns {Point}
   */
  get center() {
    return this.pc;
  }
  /**
   * Circle bounding box
   * @returns {Box}
   */
  get box() {
    return new i.Box(
      this.pc.x - this.r,
      this.pc.y - this.r,
      this.pc.x + this.r,
      this.pc.y + this.r
    );
  }
  /**
   * Return true if circle contains shape: no point of shape lies outside of the circle
   * @param {Shape} shape - test shape
   * @returns {boolean}
   */
  contains(t) {
    if (t instanceof i.Point)
      return i.Utils.LE(t.distanceTo(this.center)[0], this.r);
    if (t instanceof i.Segment)
      return i.Utils.LE(t.start.distanceTo(this.center)[0], this.r) && i.Utils.LE(t.end.distanceTo(this.center)[0], this.r);
    if (t instanceof i.Arc)
      return this.intersect(t).length === 0 && i.Utils.LE(t.start.distanceTo(this.center)[0], this.r) && i.Utils.LE(t.end.distanceTo(this.center)[0], this.r);
    if (t instanceof i.Circle)
      return this.intersect(t).length === 0 && i.Utils.LE(t.r, this.r) && i.Utils.LE(t.center.distanceTo(this.center)[0], this.r);
  }
  /**
   * Transform circle to closed arc
   * @param {boolean} counterclockwise
   * @returns {Arc}
   */
  toArc(t = !0) {
    return new i.Arc(this.center, this.r, Math.PI, -Math.PI, t);
  }
  /**
   * Method scale is supported only for uniform scaling of the circle with (0,0) center
   * @param {number} sx
   * @param {number} sy
   * @returns {Circle}
   */
  scale(t, e) {
    if (t !== e || !(this.pc.x === 0 && this.pc.y === 0))
      throw T.OPERATION_IS_NOT_SUPPORTED;
    return new i.Circle(this.pc, this.r * t);
  }
  /**
   * Return new circle transformed using affine transformation matrix
   * @param {Matrix} matrix - affine transformation matrix
   * @returns {Circle}
   */
  transform(t = new i.Matrix()) {
    return new i.Circle(this.pc.transform(t), this.r);
  }
  /**
   * Returns array of intersection points between circle and other shape
   * @param {Shape} shape Shape of the one of supported types
   * @returns {Point[]}
   */
  intersect(t) {
    if (t instanceof i.Point)
      return this.contains(t) ? [t] : [];
    if (t instanceof i.Line)
      return lt(t, this);
    if (t instanceof i.Ray)
      return nn(t, this);
    if (t instanceof i.Segment)
      return Zt(t, this);
    if (t instanceof i.Circle)
      return Ye(t, this);
    if (t instanceof i.Box)
      return zn(this, t);
    if (t instanceof i.Arc)
      return ge(t, this);
    if (t instanceof i.Polygon)
      return Ke(this, t);
    if (t instanceof i.Multiline)
      return Bt(this, t);
  }
  /**
       * Calculate distance and shortest segment from circle to shape and return array [distance, shortest segment]
       * @param {Shape} shape Shape of the one of supported types Point, Line, Circle, Segment, Arc, Polygon or Planar Set
       * @returns {number} distance from circle to shape
       * @returns {Segment} shortest segment between circle and shape (started at circle, ended at shape)
  
       */
  distanceTo(t) {
    if (t instanceof i.Point) {
      let [e, n] = i.Distance.point2circle(t, this);
      return n = n.reverse(), [e, n];
    }
    if (t instanceof i.Circle) {
      let [e, n] = i.Distance.circle2circle(this, t);
      return [e, n];
    }
    if (t instanceof i.Line) {
      let [e, n] = i.Distance.circle2line(this, t);
      return [e, n];
    }
    if (t instanceof i.Segment) {
      let [e, n] = i.Distance.segment2circle(t, this);
      return n = n.reverse(), [e, n];
    }
    if (t instanceof i.Arc) {
      let [e, n] = i.Distance.arc2circle(t, this);
      return n = n.reverse(), [e, n];
    }
    if (t instanceof i.Polygon) {
      let [e, n] = i.Distance.shape2polygon(this, t);
      return [e, n];
    }
    if (t instanceof i.PlanarSet) {
      let [e, n] = i.Distance.shape2planarSet(this, t);
      return [e, n];
    }
    if (t instanceof i.Multiline) {
      let [e, n] = i.Distance.shape2multiline(this, t);
      return [e, n];
    }
  }
  get name() {
    return "circle";
  }
  /**
   * Return string to draw circle in svg
   * @param {Object} attrs - an object with attributes of svg circle element
   * @returns {string}
   */
  svg(t = {}) {
    return `
<circle cx="${this.pc.x}" cy="${this.pc.y}" r="${this.r}"
                ${ot({ fill: "none", ...t })} />`;
  }
};
i.Circle = Bi;
const Vi = (...r) => new i.Circle(...r);
i.circle = Vi;
class $i extends it {
  /**
   *
   * @param {Point} pc - arc center
   * @param {number} r - arc radius
   * @param {number} startAngle - start angle in radians from 0 to 2*PI
   * @param {number} endAngle - end angle in radians from 0 to 2*PI
   * @param {boolean} counterClockwise - arc direction, true - clockwise, false - counterclockwise
   */
  constructor(...t) {
    if (super(), this.pc = new i.Point(), this.r = 1, this.startAngle = 0, this.endAngle = 2 * Math.PI, this.counterClockwise = i.CCW, t.length !== 0)
      if (t.length === 1 && t[0] instanceof Object && t[0].name === "arc") {
        let { pc: e, r: n, startAngle: s, endAngle: l, counterClockwise: o } = t[0];
        this.pc = new i.Point(e.x, e.y), this.r = n, this.startAngle = s, this.endAngle = l, this.counterClockwise = o;
      } else {
        let [e, n, s, l, o] = [...t];
        e && e instanceof i.Point && (this.pc = e.clone()), n !== void 0 && (this.r = n), s !== void 0 && (this.startAngle = s), l !== void 0 && (this.endAngle = l), o !== void 0 && (this.counterClockwise = o);
      }
  }
  /**
   * Return new cloned instance of arc
   * @returns {Arc}
   */
  clone() {
    return new i.Arc(this.pc.clone(), this.r, this.startAngle, this.endAngle, this.counterClockwise);
  }
  /**
   * Get sweep angle in radians. Sweep angle is non-negative number from 0 to 2*PI
   * @returns {number}
   */
  get sweep() {
    if (i.Utils.EQ(this.startAngle, this.endAngle))
      return 0;
    if (i.Utils.EQ(Math.abs(this.startAngle - this.endAngle), i.PIx2))
      return i.PIx2;
    let t;
    return this.counterClockwise ? t = i.Utils.GT(this.endAngle, this.startAngle) ? this.endAngle - this.startAngle : this.endAngle - this.startAngle + i.PIx2 : t = i.Utils.GT(this.startAngle, this.endAngle) ? this.startAngle - this.endAngle : this.startAngle - this.endAngle + i.PIx2, i.Utils.GT(t, i.PIx2) && (t -= i.PIx2), i.Utils.LT(t, 0) && (t += i.PIx2), t;
  }
  /**
   * Get start point of arc
   * @returns {Point}
   */
  get start() {
    return new i.Point(this.pc.x + this.r, this.pc.y).rotate(this.startAngle, this.pc);
  }
  /**
   * Get end point of arc
   * @returns {Point}
   */
  get end() {
    return new i.Point(this.pc.x + this.r, this.pc.y).rotate(this.endAngle, this.pc);
  }
  /**
   * Get center of arc
   * @returns {Point}
   */
  get center() {
    return this.pc.clone();
  }
  get vertices() {
    return [this.start.clone(), this.end.clone()];
  }
  /**
   * Get arc length
   * @returns {number}
   */
  get length() {
    return Math.abs(this.sweep * this.r);
  }
  /**
   * Get bounding box of the arc
   * @returns {Box}
   */
  get box() {
    let e = this.breakToFunctional().reduce((n, s) => n.merge(s.start.box), new i.Box());
    return e = e.merge(this.end.box), e;
  }
  /**
   * Returns true if arc contains point, false otherwise
   * @param {Point} pt - point to test
   * @returns {boolean}
   */
  contains(t) {
    if (!i.Utils.EQ(this.pc.distanceTo(t)[0], this.r))
      return !1;
    if (t.equalTo(this.start))
      return !0;
    let e = new i.Vector(this.pc, t).slope, n = new i.Arc(this.pc, this.r, this.startAngle, e, this.counterClockwise);
    return i.Utils.LE(n.length, this.length);
  }
  /**
   * When given point belongs to arc, return array of two arcs split by this point. If points is incident
   * to start or end point of the arc, return clone of the arc. If point does not belong to the arcs, return
   * empty array.
   * @param {Point} pt Query point
   * @returns {Arc[]}
   */
  split(t) {
    if (this.start.equalTo(t))
      return [null, this.clone()];
    if (this.end.equalTo(t))
      return [this.clone(), null];
    let e = new i.Vector(this.pc, t).slope;
    return [
      new i.Arc(this.pc, this.r, this.startAngle, e, this.counterClockwise),
      new i.Arc(this.pc, this.r, e, this.endAngle, this.counterClockwise)
    ];
  }
  /**
   * Return middle point of the arc
   * @returns {Point}
   */
  middle() {
    let t = this.counterClockwise ? this.startAngle + this.sweep / 2 : this.startAngle - this.sweep / 2;
    return new i.Arc(this.pc, this.r, this.startAngle, t, this.counterClockwise).end;
  }
  /**
   * Get point at given length
   * @param {number} length - The length along the arc
   * @returns {Point}
   */
  pointAtLength(t) {
    if (t > this.length || t < 0) return null;
    if (t === 0) return this.start;
    if (t === this.length) return this.end;
    let e = t / this.length, n = this.counterClockwise ? this.startAngle + this.sweep * e : this.startAngle - this.sweep * e;
    return new i.Arc(this.pc, this.r, this.startAngle, n, this.counterClockwise).end;
  }
  /**
   * Returns chord height ("sagitta") of the arc
   * @returns {number}
   */
  chordHeight() {
    return (1 - Math.cos(Math.abs(this.sweep / 2))) * this.r;
  }
  /**
   * Returns array of intersection points between arc and other shape
   * @param {Shape} shape Shape of the one of supported types <br/>
   * @returns {Point[]}
   */
  intersect(t) {
    if (t instanceof i.Point)
      return this.contains(t) ? [t] : [];
    if (t instanceof i.Line)
      return Qt(t, this);
    if (t instanceof i.Ray)
      return Ee(t, this);
    if (t instanceof i.Circle)
      return ge(this, t);
    if (t instanceof i.Segment)
      return St(t, this);
    if (t instanceof i.Box)
      return Yn(this, t);
    if (t instanceof i.Arc)
      return Qe(this, t);
    if (t instanceof i.Polygon)
      return _e(this, t);
    if (t instanceof i.Multiline)
      return Bt(this, t);
  }
  /**
       * Calculate distance and shortest segment from arc to shape and return array [distance, shortest segment]
       * @param {Shape} shape Shape of the one of supported types Point, Line, Circle, Segment, Arc, Polygon or Planar Set
       * @returns {number} distance from arc to shape
       * @returns {Segment} shortest segment between arc and shape (started at arc, ended at shape)
  
       */
  distanceTo(t) {
    if (t instanceof i.Point) {
      let [e, n] = i.Distance.point2arc(t, this);
      return n = n.reverse(), [e, n];
    }
    if (t instanceof i.Circle) {
      let [e, n] = i.Distance.arc2circle(this, t);
      return [e, n];
    }
    if (t instanceof i.Line) {
      let [e, n] = i.Distance.arc2line(this, t);
      return [e, n];
    }
    if (t instanceof i.Segment) {
      let [e, n] = i.Distance.segment2arc(t, this);
      return n = n.reverse(), [e, n];
    }
    if (t instanceof i.Arc) {
      let [e, n] = i.Distance.arc2arc(this, t);
      return [e, n];
    }
    if (t instanceof i.Polygon) {
      let [e, n] = i.Distance.shape2polygon(this, t);
      return [e, n];
    }
    if (t instanceof i.PlanarSet) {
      let [e, n] = i.Distance.shape2planarSet(this, t);
      return [e, n];
    }
    if (t instanceof i.Multiline)
      return i.Distance.shape2multiline(this, t);
  }
  /**
   * Breaks arc in extreme point 0, pi/2, pi, 3*pi/2 and returns array of sub-arcs
   * @returns {Arc[]}
   */
  breakToFunctional() {
    let t = [], e = [0, Math.PI / 2, 2 * Math.PI / 2, 3 * Math.PI / 2], n = [
      this.pc.translate(this.r, 0),
      this.pc.translate(0, this.r),
      this.pc.translate(-this.r, 0),
      this.pc.translate(0, -this.r)
    ], s = [];
    for (let l = 0; l < 4; l++)
      n[l].on(this) && s.push(new i.Arc(this.pc, this.r, this.startAngle, e[l], this.counterClockwise));
    if (s.length === 0)
      t.push(this.clone());
    else {
      s.sort((a, u) => a.length - u.length);
      for (let a = 0; a < s.length; a++) {
        let u = t.length > 0 ? t[t.length - 1] : void 0, h;
        u ? h = new i.Arc(this.pc, this.r, u.endAngle, s[a].endAngle, this.counterClockwise) : h = new i.Arc(this.pc, this.r, this.startAngle, s[a].endAngle, this.counterClockwise), i.Utils.EQ_0(h.length) || t.push(h.clone());
      }
      let l = t.length > 0 ? t[t.length - 1] : void 0, o;
      l ? o = new i.Arc(this.pc, this.r, l.endAngle, this.endAngle, this.counterClockwise) : o = new i.Arc(this.pc, this.r, this.startAngle, this.endAngle, this.counterClockwise), !i.Utils.EQ_0(o.length) && !i.Utils.EQ(o.sweep, 2 * Math.PI) && t.push(o.clone());
    }
    return t;
  }
  /**
   * Return tangent unit vector in the start point in the direction from start to end
   * @returns {Vector}
   */
  tangentInStart() {
    let t = new i.Vector(this.pc, this.start), e = this.counterClockwise ? Math.PI / 2 : -Math.PI / 2;
    return t.rotate(e).normalize();
  }
  /**
   * Return tangent unit vector in the end point in the direction from end to start
   * @returns {Vector}
   */
  tangentInEnd() {
    let t = new i.Vector(this.pc, this.end), e = this.counterClockwise ? -Math.PI / 2 : Math.PI / 2;
    return t.rotate(e).normalize();
  }
  /**
   * Returns new arc with swapped start and end angles and reversed direction
   * @returns {Arc}
   */
  reverse() {
    return new i.Arc(this.pc, this.r, this.endAngle, this.startAngle, !this.counterClockwise);
  }
  /**
   * Return new arc transformed using affine transformation matrix <br/>
   * @param {Matrix} matrix - affine transformation matrix
   * @returns {Arc}
   */
  transform(t = new i.Matrix()) {
    let e = this.start.transform(t), n = this.end.transform(t), s = this.pc.transform(t), l = this.counterClockwise;
    return t.a * t.d < 0 && (l = !l), i.Arc.arcSE(s, e, n, l);
  }
  static arcSE(t, e, n, s) {
    let { vector: l } = i, o = l(t, e).slope, a = l(t, n).slope;
    i.Utils.EQ(o, a) && (a += 2 * Math.PI, s = !0);
    let u = l(t, e).length;
    return new i.Arc(t, u, o, a, s);
  }
  definiteIntegral(t = 0) {
    return this.breakToFunctional().reduce((s, l) => s + l.circularSegmentDefiniteIntegral(t), 0);
  }
  circularSegmentDefiniteIntegral(t) {
    let e = new i.Line(this.start, this.end), n = this.pc.leftTo(e), l = new i.Segment(this.start, this.end).definiteIntegral(t), o = this.circularSegmentArea();
    return n ? l - o : l + o;
  }
  circularSegmentArea() {
    return 0.5 * this.r * this.r * (this.sweep - Math.sin(this.sweep));
  }
  /**
   * Sort given array of points from arc start to end, assuming all points lay on the arc
   * @param {Point[]} pts array of points
   * @returns {Point[]} new array sorted
   */
  sortPoints(t) {
    let { vector: e } = i;
    return t.slice().sort((n, s) => {
      let l = e(this.pc, n).slope, o = e(this.pc, s).slope;
      return l < o ? -1 : l > o ? 1 : 0;
    });
  }
  get name() {
    return "arc";
  }
  /**
   * Return string to draw arc in svg
   * @param {Object} attrs - an object with attributes of svg path element
   * @returns {string}
   */
  svg(t = {}) {
    let e = this.sweep <= Math.PI ? "0" : "1", n = this.counterClockwise ? "1" : "0";
    return i.Utils.EQ(this.sweep, 2 * Math.PI) ? new i.Circle(this.pc, this.r).svg(t) : `
<path d="M${this.start.x},${this.start.y}
                             A${this.r},${this.r} 0 ${e},${n} ${this.end.x},${this.end.y}"
                    ${ot({ fill: "none", ...t })} />`;
  }
}
i.Arc = $i;
const Hi = (...r) => new i.Arc(...r);
i.arc = Hi;
class Ct extends it {
  /**
   *
   * @param {number} xmin - minimal x coordinate
   * @param {number} ymin - minimal y coordinate
   * @param {number} xmax - maximal x coordinate
   * @param {number} ymax - maximal y coordinate
   */
  constructor(t = void 0, e = void 0, n = void 0, s = void 0) {
    super(), this.xmin = t, this.ymin = e, this.xmax = n, this.ymax = s;
  }
  /**
   * Return new cloned instance of box
   * @returns {Box}
   */
  clone() {
    return new Ct(this.xmin, this.ymin, this.xmax, this.ymax);
  }
  /**
   * Property low need for interval tree interface
   * @returns {Point}
   */
  get low() {
    return new i.Point(this.xmin, this.ymin);
  }
  /**
   * Property high need for interval tree interface
   * @returns {Point}
   */
  get high() {
    return new i.Point(this.xmax, this.ymax);
  }
  /**
   * Property max returns the box itself !
   * @returns {Box}
   */
  get max() {
    return this.clone();
  }
  /**
   * Return center of the box
   * @returns {Point}
   */
  get center() {
    return new i.Point((this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2);
  }
  /**
   * Return the width of the box
   * @returns {number}
   */
  get width() {
    return Math.abs(this.xmax - this.xmin);
  }
  /**
   * Return the height of the box
   * @returns {number}
   */
  get height() {
    return Math.abs(this.ymax - this.ymin);
  }
  /**
   * Return property box like all other shapes
   * @returns {Box}
   */
  get box() {
    return this.clone();
  }
  /**
   * Returns true if not intersected with other box
   * @param {Box} other_box - other box to test
   * @returns {boolean}
   */
  not_intersect(t) {
    return this.xmax < t.xmin || this.xmin > t.xmax || this.ymax < t.ymin || this.ymin > t.ymax;
  }
  /**
   * Returns true if intersected with other box
   * @param {Box} other_box - Query box
   * @returns {boolean}
   */
  intersect(t) {
    return !this.not_intersect(t);
  }
  /**
   * Returns new box merged with other box
   * @param {Box} other_box - Other box to merge with
   * @returns {Box}
   */
  merge(t) {
    return new Ct(
      this.xmin === void 0 ? t.xmin : Math.min(this.xmin, t.xmin),
      this.ymin === void 0 ? t.ymin : Math.min(this.ymin, t.ymin),
      this.xmax === void 0 ? t.xmax : Math.max(this.xmax, t.xmax),
      this.ymax === void 0 ? t.ymax : Math.max(this.ymax, t.ymax)
    );
  }
  /**
   * Defines predicate "less than" between two boxes. Need for interval index
   * @param {Box} other_box - other box
   * @returns {boolean} - true if this box less than other box, false otherwise
   */
  less_than(t) {
    return !!(this.low.lessThan(t.low) || this.low.equalTo(t.low) && this.high.lessThan(t.high));
  }
  /**
   * Returns true if this box is equal to other box, false otherwise
   * @param {Box} other_box - query box
   * @returns {boolean}
   */
  equal_to(t) {
    return this.low.equalTo(t.low) && this.high.equalTo(t.high);
  }
  output() {
    return this.clone();
  }
  static comparable_max(t, e) {
    return t.merge(e);
  }
  static comparable_less_than(t, e) {
    return t.lessThan(e);
  }
  /**
   * Set new values to the box object
   * @param {number} xmin - mininal x coordinate
   * @param {number} ymin - minimal y coordinate
   * @param {number} xmax - maximal x coordinate
   * @param {number} ymax - maximal y coordinate
   */
  set(t, e, n, s) {
    this.xmin = t, this.ymin = e, this.xmax = n, this.ymax = s;
  }
  /**
   * Transform box into array of points from low left corner in counterclockwise
   * @returns {Point[]}
   */
  toPoints() {
    return [
      new i.Point(this.xmin, this.ymin),
      new i.Point(this.xmax, this.ymin),
      new i.Point(this.xmax, this.ymax),
      new i.Point(this.xmin, this.ymax)
    ];
  }
  /**
   * Transform box into array of segments from low left corner in counterclockwise
   * @returns {Segment[]}
   */
  toSegments() {
    let t = this.toPoints();
    return [
      new i.Segment(t[0], t[1]),
      new i.Segment(t[1], t[2]),
      new i.Segment(t[2], t[3]),
      new i.Segment(t[3], t[0])
    ];
  }
  /**
   * Box rotation is not supported
   * Attempt to rotate box throws error
   * @param {number} angle - angle in radians
   * @param {Point} [center=(0,0)] center
   */
  rotate(t, e = new i.Point()) {
    throw T.OPERATION_IS_NOT_SUPPORTED;
  }
  /**
   * Return new box transformed using affine transformation matrix
   * New box is a bounding box of transformed corner points
   * @param {Matrix} m - affine transformation matrix
   * @returns {Box}
   */
  transform(t = new i.Matrix()) {
    return this.toPoints().map((n) => n.transform(t)).reduce(
      (n, s) => n.merge(s.box),
      new Ct()
    );
  }
  /**
   * Return true if box contains shape: no point of shape lies outside the box
   * @param {AnyShape} shape - test shape
   * @returns {boolean}
   */
  contains(t) {
    if (t instanceof i.Point)
      return t.x >= this.xmin && t.x <= this.xmax && t.y >= this.ymin && t.y <= this.ymax;
    if (t instanceof i.Segment)
      return t.vertices.every((e) => this.contains(e));
    if (t instanceof i.Box)
      return t.toSegments().every((e) => this.contains(e));
    if (t instanceof i.Circle)
      return this.contains(t.box);
    if (t instanceof i.Arc)
      return t.vertices.every((e) => this.contains(e)) && t.toSegments().every((e) => St(e, t).length === 0);
    if (t instanceof i.Line || t instanceof i.Ray)
      return !1;
    if (t instanceof i.Multiline)
      return t.toShapes().every((e) => this.contains(e));
    if (t instanceof i.Polygon)
      return this.contains(t.box);
  }
  /**
   * Calculate distance and shortest segment from box to shape and return as array [distance, shortest segment]
   * @param {Shape} shape Shape of the one of supported types Point, Line, Circle, Segment, Arc, Polygon or Planar Set
   * @returns {number} distance from box to shape
   * @returns {Segment} shortest segment between box and shape (started at box, ended at shape)
   */
  distanceTo(t) {
    const e = this.toSegments().map((s) => s.distanceTo(t));
    let n = [
      Number.MAX_SAFE_INTEGER,
      null
    ];
    return e.forEach((s) => {
      s[0] < n[0] && (n = s);
    }), n;
  }
  get name() {
    return "box";
  }
  /**
   * Return string to draw box in svg
   * @param {Object} attrs - an object with attributes of svg rectangle element
   * @returns {string}
   */
  svg(t = {}) {
    const e = this.xmax - this.xmin, n = this.ymax - this.ymin;
    return `
<rect x="${this.xmin}" y="${this.ymin}" width="${e}" height="${n}"
                ${ot({ fill: "none", ...t })} />`;
  }
}
i.Box = Ct;
const Gi = (...r) => new i.Box(...r);
i.box = Gi;
class qi {
  /**
   * Construct new instance of edge
   * @param {Shape} shape Shape of type Segment or Arc
   */
  constructor(t) {
    this.shape = t, this.next = void 0, this.prev = void 0, this.face = void 0, this.arc_length = 0, this.bvStart = void 0, this.bvEnd = void 0, this.bv = void 0, this.overlap = void 0;
  }
  /**
   * Get edge start point
   */
  get start() {
    return this.shape.start;
  }
  /**
   * Get edge end point
   */
  get end() {
    return this.shape.end;
  }
  /**
   * Get edge length
   */
  get length() {
    return this.shape.length;
  }
  /**
   * Get bounding box of the edge
   * @returns {Box}
   */
  get box() {
    return this.shape.box;
  }
  get isSegment() {
    return this.shape instanceof i.Segment;
  }
  get isArc() {
    return this.shape instanceof i.Arc;
  }
  get isLine() {
    return this.shape instanceof i.Line;
  }
  get isRay() {
    return this.shape instanceof i.Ray;
  }
  /**
   * Get middle point of the edge
   * @returns {Point}
   */
  middle() {
    return this.shape.middle();
  }
  /**
   * Get point at given length
   * @param {number} length - The length along the edge
   * @returns {Point}
   */
  pointAtLength(t) {
    return this.shape.pointAtLength(t);
  }
  /**
   * Returns true if point belongs to the edge, false otherwise
   * @param {Point} pt - test point
   */
  contains(t) {
    return this.shape.contains(t);
  }
  /**
   * Set inclusion flag of the edge with respect to another polygon
   * Inclusion flag is one of Flatten.INSIDE, Flatten.OUTSIDE, Flatten.BOUNDARY
   * @param polygon
   */
  setInclusion(t) {
    if (this.bv !== void 0) return this.bv;
    if (this.shape instanceof i.Line || this.shape instanceof i.Ray)
      return this.bv = i.OUTSIDE, this.bv;
    if (this.bvStart === void 0 && (this.bvStart = Ot(t, this.start)), this.bvEnd === void 0 && (this.bvEnd = Ot(t, this.end)), this.bvStart === i.OUTSIDE || this.bvEnd == i.OUTSIDE)
      this.bv = i.OUTSIDE;
    else if (this.bvStart === i.INSIDE || this.bvEnd == i.INSIDE)
      this.bv = i.INSIDE;
    else {
      let e = Ot(t, this.middle());
      this.bv = e;
    }
    return this.bv;
  }
  /**
   * Set overlapping between two coincident boundary edges
   * Overlapping flag is one of Flatten.OVERLAP_SAME or Flatten.OVERLAP_OPPOSITE
   * @param edge
   */
  setOverlap(t) {
    let e, n = this.shape, s = t.shape;
    n instanceof i.Segment && s instanceof i.Segment ? n.start.equalTo(s.start) && n.end.equalTo(s.end) ? e = i.OVERLAP_SAME : n.start.equalTo(s.end) && n.end.equalTo(s.start) && (e = i.OVERLAP_OPPOSITE) : (n instanceof i.Arc && s instanceof i.Arc || n instanceof i.Segment && s instanceof i.Arc || n instanceof i.Arc && s instanceof i.Segment) && (n.start.equalTo(s.start) && n.end.equalTo(s.end) && n.middle().equalTo(s.middle()) ? e = i.OVERLAP_SAME : n.start.equalTo(s.end) && n.end.equalTo(s.start) && n.middle().equalTo(s.middle()) && (e = i.OVERLAP_OPPOSITE)), this.overlap === void 0 && (this.overlap = e), t.overlap === void 0 && (t.overlap = e);
  }
  svg() {
    if (this.shape instanceof i.Segment)
      return ` L${this.shape.end.x},${this.shape.end.y}`;
    if (this.shape instanceof i.Arc) {
      let t = this.shape, e, n = t.counterClockwise ? "1" : "0";
      if (i.Utils.EQ(t.sweep, 2 * Math.PI)) {
        let s = t.counterClockwise ? 1 : -1, l = new i.Arc(t.pc, t.r, t.startAngle, t.startAngle + s * Math.PI, t.counterClockwise), o = new i.Arc(t.pc, t.r, t.startAngle + s * Math.PI, t.endAngle, t.counterClockwise);
        return e = "0", ` A${l.r},${l.r} 0 ${e},${n} ${l.end.x},${l.end.y}
                    A${o.r},${o.r} 0 ${e},${n} ${o.end.x},${o.end.y}`;
      } else
        return e = t.sweep <= Math.PI ? "0" : "1", ` A${t.r},${t.r} 0 ${e},${n} ${t.end.x},${t.end.y}`;
    }
  }
  toJSON() {
    return this.shape.toJSON();
  }
}
i.Edge = qi;
class Di extends de {
  constructor(t, e) {
    super(t, e), this.setCircularLinks();
  }
  setCircularLinks() {
    this.isEmpty() || (this.last.next = this.first, this.first.prev = this.last);
  }
  [Symbol.iterator]() {
    let t;
    return {
      next: () => {
        let e = t || this.first, n = this.first ? t ? t === this.first : !1 : !0;
        return t = e ? e.next : void 0, { value: e, done: n };
      }
    };
  }
  /**
   * Append new element to the end of the list
   * @param {LinkedListElement} element - new element to be appended
   * @returns {CircularLinkedList}
   */
  append(t) {
    return super.append(t), this.setCircularLinks(), this;
  }
  /**
   * Insert new element to the list after elementBefore
   * @param {LinkedListElement} newElement - new element to be inserted
   * @param {LinkedListElement} elementBefore - element in the list to insert after it
   * @returns {CircularLinkedList}
   */
  insert(t, e) {
    return super.insert(t, e), this.setCircularLinks(), this;
  }
  /**
   * Remove element from the list
   * @param {LinkedListElement} element - element to be removed from the list
   * @returns {CircularLinkedList}
   */
  remove(t) {
    return super.remove(t), this;
  }
}
class gt extends Di {
  constructor(t, ...e) {
    if (super(), this._box = void 0, this._orientation = void 0, e.length !== 0) {
      if (e.length === 1) {
        if (e[0] instanceof Array) {
          let n = e[0];
          if (n.length === 0)
            return;
          if (n.every((s) => s instanceof i.Point)) {
            let s = gt.points2segments(n);
            this.shapes2face(t.edges, s);
          } else if (n.every((s) => s instanceof Array && s.length === 2)) {
            let s = n.map((o) => new i.Point(o[0], o[1])), l = gt.points2segments(s);
            this.shapes2face(t.edges, l);
          } else if (n.every((s) => s instanceof i.Segment || s instanceof i.Arc))
            this.shapes2face(t.edges, n);
          else if (n.every((s) => s.name === "segment" || s.name === "arc")) {
            let s = [];
            for (let l of n) {
              let o;
              l.name === "segment" ? o = new i.Segment(l) : o = new i.Arc(l), s.push(o);
            }
            this.shapes2face(t.edges, s);
          }
        } else if (e[0] instanceof gt) {
          let n = e[0];
          this.first = n.first, this.last = n.last;
          for (let s of n)
            t.edges.add(s);
        } else if (e[0] instanceof i.Circle)
          this.shapes2face(t.edges, [e[0].toArc(He)]);
        else if (e[0] instanceof i.Box) {
          let n = e[0];
          this.shapes2face(t.edges, [
            new i.Segment(new i.Point(n.xmin, n.ymin), new i.Point(n.xmax, n.ymin)),
            new i.Segment(new i.Point(n.xmax, n.ymin), new i.Point(n.xmax, n.ymax)),
            new i.Segment(new i.Point(n.xmax, n.ymax), new i.Point(n.xmin, n.ymax)),
            new i.Segment(new i.Point(n.xmin, n.ymax), new i.Point(n.xmin, n.ymin))
          ]);
        }
      }
      e.length === 2 && e[0] instanceof i.Edge && e[1] instanceof i.Edge && (this.first = e[0], this.last = e[1], this.last.next = this.first, this.first.prev = this.last, this.setArcLength());
    }
  }
  /**
   * Return array of edges from first to last
   * @returns {Array}
   */
  get edges() {
    return this.toArray();
  }
  /**
   * Return array of shapes which comprise face
   * @returns {Array}
   */
  get shapes() {
    return this.edges.map((t) => t.shape.clone());
  }
  /**
   * Return bounding box of the face
   * @returns {Box}
   */
  get box() {
    if (this._box === void 0) {
      let t = new i.Box();
      for (let e of this)
        t = t.merge(e.box);
      this._box = t;
    }
    return this._box;
  }
  /**
   * Get all edges length
   * @returns {number}
   */
  get perimeter() {
    return this.last.arc_length + this.last.length;
  }
  /**
   * Get point on face boundary at given length
   * @param {number} length - The length along the face boundary
   * @returns {Point}
   */
  pointAtLength(t) {
    if (t > this.perimeter || t < 0) return null;
    let e = null;
    for (let n of this)
      if (t >= n.arc_length && (n === this.last || t < n.next.arc_length)) {
        e = n.pointAtLength(t - n.arc_length);
        break;
      }
    return e;
  }
  static points2segments(t) {
    let e = [];
    for (let n = 0; n < t.length; n++)
      t[n].equalTo(t[(n + 1) % t.length]) || e.push(new i.Segment(t[n], t[(n + 1) % t.length]));
    return e;
  }
  shapes2face(t, e) {
    for (let n of e) {
      let s = new i.Edge(n);
      this.append(s), t.add(s);
    }
  }
  /**
   * Append edge after the last edge of the face (and before the first edge). <br/>
   * @param {Edge} edge - Edge to be appended to the linked list
   * @returns {Face}
   */
  append(t) {
    return super.append(t), this.setOneEdgeArcLength(t), t.face = this, this;
  }
  /**
   * Insert edge newEdge into the linked list after the edge edgeBefore <br/>
   * @param {Edge} newEdge - Edge to be inserted into linked list
   * @param {Edge} edgeBefore - Edge to insert newEdge after it
   * @returns {Face}
   */
  insert(t, e) {
    return super.insert(t, e), this.setOneEdgeArcLength(t), t.face = this, this;
  }
  /**
   * Remove the given edge from the linked list of the face <br/>
   * @param {Edge} edge - Edge to be removed
   * @returns {Face}
   */
  remove(t) {
    return super.remove(t), this.setArcLength(), this;
  }
  /**
   * Merge current edge with the next edge. Given edge will be extended,
   * next edge after it will be removed. The distortion of the polygon
   * is on the responsibility of the user of this method
   * @param {Edge} edge - edge to be extended
   * @returns {Face}
   */
  merge_with_next_edge(t) {
    return t.shape.end.x = t.next.shape.end.x, t.shape.end.y = t.next.shape.end.y, this.remove(t.next), this;
  }
  /**
   * Reverse orientation of the face: first edge become last and vice a verse,
   * all edges starts and ends swapped, direction of arcs inverted. If face was oriented
   * clockwise, it becomes counterclockwise and vice versa
   */
  reverse() {
    let t = [], e = this.last;
    do
      e.shape = e.shape.reverse(), t.push(e), e = e.prev;
    while (e !== this.last);
    this.first = void 0, this.last = void 0;
    for (let n of t)
      this.first === void 0 ? (n.prev = n, n.next = n, this.first = n, this.last = n) : (n.prev = this.last, this.last.next = n, this.last = n, this.last.next = this.first, this.first.prev = this.last), this.setOneEdgeArcLength(n);
    this._orientation !== void 0 && (this._orientation = void 0, this._orientation = this.orientation());
  }
  /**
   * Set arc_length property for each of the edges in the face.
   * Arc_length of the edge it the arc length from the first edge of the face
   */
  setArcLength() {
    for (let t of this)
      this.setOneEdgeArcLength(t), t.face = this;
  }
  setOneEdgeArcLength(t) {
    t === this.first ? t.arc_length = 0 : t.arc_length = t.prev.arc_length + t.prev.length;
  }
  /**
   * Returns the absolute value of the area of the face
   * @returns {number}
   */
  area() {
    return Math.abs(this.signedArea());
  }
  /**
   * Returns signed area of the simple face.
   * Face is simple if it has no self intersections that change its orientation.
   * Then the area will be positive if the orientation of the face is clockwise,
   * and negative if orientation is counterclockwise.
   * It may be zero if polygon is degenerated.
   * @returns {number}
   */
  signedArea() {
    let t = 0, e = this.box.ymin;
    for (let n of this)
      t += n.shape.definiteIntegral(e);
    return t;
  }
  /**
   * Return face orientation: one of Flatten.ORIENTATION.CCW, Flatten.ORIENTATION.CW, Flatten.ORIENTATION.NOT_ORIENTABLE <br/>
   * According to Green theorem the area of a closed curve may be calculated as double integral,
   * and the sign of the integral will be defined by the direction of the curve.
   * When the integral ("signed area") will be negative, direction is counterclockwise,
   * when positive - clockwise and when it is zero, polygon is not orientable.
   * See {@link https://mathinsight.org/greens_theorem_find_area}
   * @returns {number}
   */
  orientation() {
    if (this._orientation === void 0) {
      let t = this.signedArea();
      i.Utils.EQ_0(t) ? this._orientation = Dt.NOT_ORIENTABLE : i.Utils.LT(t, 0) ? this._orientation = Dt.CCW : this._orientation = Dt.CW;
    }
    return this._orientation;
  }
  /**
   * Returns true if face of the polygon is simple (no self-intersection points found)
   * NOTE: this method is incomplete because it does not exclude touching points.
   * Self intersection test should check if polygon change orientation in the test point.
   * @param {PlanarSet} edges - reference to polygon edges to provide search index
   * @returns {boolean}
   */
  isSimple(t) {
    return gt.getSelfIntersections(this, t, !0).length === 0;
  }
  static getSelfIntersections(t, e, n = !1) {
    let s = [];
    for (let l of t) {
      let o = e.search(l.box);
      for (let a of o) {
        if (l === a || a.face !== t || l.shape instanceof i.Segment && a.shape instanceof i.Segment && (l.next === a || l.prev === a))
          continue;
        let u = l.shape.intersect(a.shape);
        for (let h of u)
          if (!(h.equalTo(l.start) && h.equalTo(a.end) && a === l.prev) && !(h.equalTo(l.end) && h.equalTo(a.start) && a === l.next) && (s.push(h), n))
            break;
        if (s.length > 0 && n)
          break;
      }
      if (s.length > 0 && n)
        break;
    }
    return s;
  }
  /**
   * Returns edge which contains given point
   * @param {Point} pt - test point
   * @returns {Edge}
   */
  findEdgeByPoint(t) {
    let e;
    for (let n of this)
      if (!t.equalTo(n.shape.start) && (t.equalTo(n.shape.end) || n.shape.contains(t))) {
        e = n;
        break;
      }
    return e;
  }
  /**
   * Returns new polygon created from one face
   * @returns {Polygon}
   */
  toPolygon() {
    return new i.Polygon(this.shapes);
  }
  toJSON() {
    return this.edges.map((t) => t.toJSON());
  }
  /**
   * Returns string to be assigned to "d" attribute inside defined "path"
   * @returns {string}
   */
  svg() {
    let t = `M${this.first.start.x},${this.first.start.y}`;
    for (let e of this)
      t += e.svg();
    return t += " z", t;
  }
}
i.Face = gt;
class Te extends it {
  /**
   * Ray may be constructed by setting an <b>origin</b> point and a <b>normal</b> vector, so that any point <b>x</b>
   * on a ray fit an equation: <br />
   *  (<b>x</b> - <b>origin</b>) * <b>vector</b> = 0 <br />
   * Ray defined by constructor is a right semi-infinite line with respect to the normal vector <br/>
   * If normal vector is omitted ray is considered horizontal (normal vector is (0,1)). <br/>
   * Don't be confused: direction of the normal vector is orthogonal to the ray <br/>
   * @param {Point} pt - start point
   * @param {Vector} norm - normal vector
   */
  constructor(...t) {
    if (super(), this.pt = new i.Point(), this.norm = new i.Vector(0, 1), t.length !== 0 && (t.length >= 1 && t[0] instanceof i.Point && (this.pt = t[0].clone()), t.length !== 1)) {
      if (t.length === 2 && t[1] instanceof i.Vector) {
        this.norm = t[1].clone();
        return;
      }
      throw T.ILLEGAL_PARAMETERS;
    }
  }
  /**
   * Return new cloned instance of ray
   * @returns {Ray}
   */
  clone() {
    return new Te(this.pt, this.norm);
  }
  /**
   * Slope of the ray - angle in radians between ray and axe x from 0 to 2PI
   * @returns {number} - slope of the line
   */
  get slope() {
    return new i.Vector(this.norm.y, -this.norm.x).slope;
  }
  /**
   * Returns half-infinite bounding box of the ray
   * @returns {Box} - bounding box
   */
  get box() {
    let t = this.slope;
    return new i.Box(
      t > Math.PI / 2 && t < 3 * Math.PI / 2 ? Number.NEGATIVE_INFINITY : this.pt.x,
      t >= 0 && t <= Math.PI ? this.pt.y : Number.NEGATIVE_INFINITY,
      t >= Math.PI / 2 && t <= 3 * Math.PI / 2 ? this.pt.x : Number.POSITIVE_INFINITY,
      t >= Math.PI && t <= 2 * Math.PI || t === 0 ? this.pt.y : Number.POSITIVE_INFINITY
    );
  }
  /**
   * Return ray start point
   * @returns {Point} - ray start point
   */
  get start() {
    return this.pt;
  }
  /**
   * Ray has no end point?
   * @returns {undefined}
   */
  get end() {
  }
  /**
   * Return positive infinity number as length
   * @returns {number}
   */
  get length() {
    return Number.POSITIVE_INFINITY;
  }
  /**
   * Returns true if point belongs to ray
   * @param {Point} pt Query point
   * @returns {boolean}
   */
  contains(t) {
    if (this.pt.equalTo(t))
      return !0;
    let e = new i.Vector(this.pt, t);
    return i.Utils.EQ_0(this.norm.dot(e)) && i.Utils.GE(e.cross(this.norm), 0);
  }
  /**
   * Return coordinate of the point that lies on the ray in the transformed
   * coordinate system where center is the projection of the point(0,0) to
   * the line containing this ray and axe y is collinear to the normal vector. <br/>
   * This method assumes that point lies on the ray
   * @param {Point} pt - point on a ray
   * @returns {number}
   */
  coord(t) {
    return _n(t.x, t.y).cross(this.norm);
  }
  /**
   * Split ray with point and return array of segment and new ray
   * @param {Point} pt
   * @returns [Segment,Ray]
   */
  split(t) {
    return this.contains(t) ? this.pt.equalTo(t) ? [this] : [
      new i.Segment(this.pt, t),
      new i.Ray(t, this.norm)
    ] : [];
  }
  /**
   * Returns array of intersection points between ray and another shape
   * @param {Shape} shape - Shape to intersect with ray
   * @returns {Point[]} array of intersection points
   */
  intersect(t) {
    if (t instanceof i.Point)
      return this.contains(t) ? [t] : [];
    if (t instanceof i.Segment)
      return me(this, t);
    if (t instanceof i.Arc)
      return Ee(this, t);
    if (t instanceof i.Line)
      return rn(this, t);
    if (t instanceof i.Ray)
      return ti(this, t);
    if (t instanceof i.Circle)
      return nn(this, t);
    if (t instanceof i.Box)
      return Jn(this, t);
    if (t instanceof i.Polygon)
      return sn(this, t);
  }
  /**
   * Return new line rotated by angle
   * @param {number} angle - angle in radians
   * @param {Point} center - center of rotation
   */
  rotate(t, e = new i.Point()) {
    return new i.Ray(
      this.pt.rotate(t, e),
      this.norm.rotate(t)
    );
  }
  /**
   * Return new ray transformed by affine transformation matrix
   * @param {Matrix} m - affine transformation matrix (a,b,c,d,tx,ty)
   * @returns {Ray}
   */
  transform(t) {
    return new i.Ray(
      this.pt.transform(t),
      this.norm.clone()
    );
  }
  get name() {
    return "ray";
  }
  /**
   * Return string to draw svg segment representing ray inside given box
   * @param {Box} box Box representing drawing area
   * @param {Object} attrs - an object with attributes of svg segment element
   */
  svg(t, e = {}) {
    let n = new i.Line(this.pt, this.norm), s = xt(n, t);
    return s = s.filter((o) => this.contains(o)), s.length === 0 || s.length === 2 ? "" : new i.Segment(this.pt, s[0]).svg(e);
  }
}
i.Ray = Te;
const Wi = (...r) => new i.Ray(...r);
i.ray = Wi;
let zi = class dt {
  /**
   * Constructor creates new instance of polygon. With no arguments new polygon is empty.<br/>
   * Constructor accepts as argument array that define loop of shapes
   * or array of arrays in case of multi polygon <br/>
   * Loop may be defined in different ways: <br/>
   * - array of shapes of type Segment or Arc <br/>
   * - array of points (Flatten.Point) <br/>
   * - array of numeric pairs which represent points <br/>
   * - box or circle object <br/>
   * Alternatively, it is possible to use polygon.addFace method
   * @param {args} - array of shapes or array of arrays
   */
  constructor() {
    this.faces = new i.PlanarSet(), this.edges = new i.PlanarSet();
    let t = [...arguments];
    if (t.length === 1 && (t[0] instanceof Array && t[0].length > 0 || t[0] instanceof i.Circle || t[0] instanceof i.Box)) {
      let e = t[0];
      if (t[0] instanceof Array && t[0].every((n) => n instanceof Array))
        if (e.every((n) => n instanceof Array && n.length === 2 && typeof n[0] == "number" && typeof n[1] == "number"))
          this.faces.add(new i.Face(this, e));
        else
          for (let n of e)
            if (n instanceof Array && n[0] instanceof Array && n[0].every((s) => s instanceof Array && s.length === 2 && typeof s[0] == "number" && typeof s[1] == "number"))
              for (let s of n)
                this.faces.add(new i.Face(this, s));
            else
              this.faces.add(new i.Face(this, n));
      else
        this.faces.add(new i.Face(this, e));
    }
  }
  /**
   * (Getter) Returns bounding box of the polygon
   * @returns {Box}
   */
  get box() {
    return [...this.faces].reduce((t, e) => t.merge(e.box), new i.Box());
  }
  /**
   * (Getter) Returns array of vertices
   * @returns {Array}
   */
  get vertices() {
    return [...this.edges].map((t) => t.start);
  }
  /**
   * Create new cloned instance of the polygon
   * @returns {Polygon}
   */
  clone() {
    let t = new dt();
    for (let e of this.faces)
      t.addFace(e.shapes);
    return t;
  }
  /**
   * Return true is polygon has no edges
   * @returns {boolean}
   */
  isEmpty() {
    return this.edges.size === 0;
  }
  /**
   * Return true if polygon is valid for boolean operations
   * Polygon is valid if <br/>
   * 1. All faces are simple polygons (there are no self-intersected polygons) <br/>
   * 2. All faces are orientable and there is no island inside island or hole inside hole - TODO <br/>
   * 3. There is no intersections between faces (excluding touching) - TODO <br/>
   * @returns {boolean}
   */
  isValid() {
    let t = !0;
    for (let e of this.faces)
      if (!e.isSimple(this.edges)) {
        t = !1;
        break;
      }
    return t;
  }
  /**
   * Returns area of the polygon. Area of an island will be added, area of a hole will be subtracted
   * @returns {number}
   */
  area() {
    let t = [...this.faces].reduce((e, n) => e + n.signedArea(), 0);
    return Math.abs(t);
  }
  /**
   * Add new face to polygon. Returns added face
   * @param {Point[]|Segment[]|Arc[]|Circle|Box} args -  new face may be create with one of the following ways: <br/>
   * 1) array of points that describe closed path (edges are segments) <br/>
   * 2) array of shapes (segments and arcs) which describe closed path <br/>
   * 3) circle - will be added as counterclockwise arc <br/>
   * 4) box - will be added as counterclockwise rectangle <br/>
   * You can chain method face.reverse() is you need to change direction of the creates face
   * @returns {Face}
   */
  addFace(...t) {
    let e = new i.Face(this, ...t);
    return this.faces.add(e), e;
  }
  /**
   * Delete existing face from polygon
   * @param {Face} face Face to be deleted
   * @returns {boolean}
   */
  deleteFace(t) {
    for (let e of t)
      this.edges.delete(e);
    return this.faces.delete(t);
  }
  /**
   * Clear all faces and create new faces from edges
   */
  recreateFaces() {
    this.faces.clear();
    for (let n of this.edges)
      n.face = null;
    let t, e = !0;
    for (; e; ) {
      e = !1;
      for (let n of this.edges)
        if (n.face === null) {
          t = n, e = !0;
          break;
        }
      if (e) {
        let n = t;
        do
          n = n.next;
        while (n.next !== t);
        this.addFace(t, n);
      }
    }
  }
  /**
   * Delete chain of edges from the face.
   * @param {Face} face Face to remove chain
   * @param {Edge} edgeFrom Start of the chain of edges to be removed
   * @param {Edge} edgeTo End of the chain of edges to be removed
   */
  removeChain(t, e, n) {
    if (n.next === e) {
      this.deleteFace(t);
      return;
    }
    for (let s = e; s !== n.next; s = s.next)
      if (t.remove(s), this.edges.delete(s), t.isEmpty()) {
        this.deleteFace(t);
        break;
      }
  }
  /**
   * Add point as a new vertex and split edge. Point supposed to belong to an edge.
   * When edge is split, new edge created from the start of the edge to the new vertex
   * and inserted before current edge.
   * Current edge is trimmed and updated.
   * Method returns new edge added. If no edge added, it returns edge before vertex
   * @param {Point} pt Point to be added as a new vertex
   * @param {Edge} edge Edge to be split with new vertex and then trimmed from start
   * @returns {Edge}
   */
  addVertex(t, e) {
    let n = e.shape.split(t);
    if (n[0] === null)
      return e.prev;
    if (n[1] === null)
      return e;
    let s = new i.Edge(n[0]), l = e.prev;
    return e.face.insert(s, l), this.edges.delete(e), this.edges.add(s), e.shape = n[1], this.edges.add(e), s;
  }
  /**
   * Merge given edge with next edge and remove vertex between them
   * @param {Edge} edge
   */
  removeEndVertex(t) {
    const e = t.next;
    e !== t && (t.face.merge_with_next_edge(t), this.edges.delete(e));
  }
  /**
   * Cut polygon with multiline and return a new polygon
   * @param {Multiline} multiline
   * @returns {Polygon}
   */
  cut(t) {
    let e = this.clone(), n = {
      int_points1: [],
      int_points2: [],
      int_points1_sorted: [],
      int_points2_sorted: []
    };
    for (let o of t.edges)
      for (let a of e.edges) {
        let u = Je(o, a);
        for (let h of u)
          Tt(o, h, n.int_points1), Tt(a, h, n.int_points2);
      }
    if (n.int_points1.length === 0)
      return e;
    n.int_points1_sorted = tt(n.int_points1), n.int_points2_sorted = tt(n.int_points2), vt(t, n.int_points1_sorted), vt(e, n.int_points2_sorted), xe(n), n.int_points1_sorted = tt(n.int_points1), n.int_points2_sorted = tt(n.int_points2), ie(n.int_points1), re(n.int_points1, e);
    for (let o of n.int_points1_sorted)
      o.edge_before && o.edge_after && o.edge_before.bv === o.edge_after.bv && (n.int_points2[o.id] = -1, o.id = -1);
    if (n.int_points1 = n.int_points1.filter((o) => o.id >= 0), n.int_points2 = n.int_points2.filter((o) => o.id >= 0), n.int_points1.forEach((o, a) => {
      o.id = a;
    }), n.int_points2.forEach((o, a) => {
      o.id = a;
    }), n.int_points1.length === 0)
      return e;
    n.int_points1_sorted = tt(n.int_points1), n.int_points2_sorted = tt(n.int_points2);
    let s, l;
    for (let o = 1; o < n.int_points1_sorted.length; o++)
      if (l = n.int_points1_sorted[o], s = n.int_points1_sorted[o - 1], l.edge_before && l.edge_before.bv === Wt) {
        let a = s.edge_after, u = l.edge_before, h = t.getChain(a, u);
        Pe(n.int_points2[s.id], n.int_points2[l.id], h), h.forEach((f) => e.edges.add(f)), h = h.reverse().map((f) => new i.Edge(f.shape.reverse()));
        for (let f = 0; f < h.length - 1; f++)
          h[f].next = h[f + 1], h[f + 1].prev = h[f];
        Pe(n.int_points2[l.id], n.int_points2[s.id], h), h.forEach((f) => e.edges.add(f));
      }
    return e.recreateFaces(), e;
  }
  /**
   * A special case of cut() function
   * The return is a polygon cut with line
   * @param {Line} line - cutting line
   * @returns {Polygon} newPoly - resulted polygon
   */
  cutWithLine(t) {
    let e = new at([t]);
    return this.cut(e);
  }
  /**
   * Returns the first found edge of polygon that contains given point
   * If point is a vertex, return the edge where the point is an end vertex, not a start one
   * @param {Point} pt
   * @returns {Edge}
   */
  findEdgeByPoint(t) {
    let e;
    for (let n of this.faces)
      if (e = n.findEdgeByPoint(t), e !== void 0)
        break;
    return e;
  }
  /**
   * Split polygon into array of polygons, where each polygon is an outer face with all
   * containing inner faces
   * @returns {Flatten.Polygon[]}
   */
  splitToIslands() {
    if (this.isEmpty()) return [];
    let t = this.toArray();
    t.sort((s, l) => l.area() - s.area());
    let e = [...t[0].faces][0].orientation(), n = t.filter((s) => [...s.faces][0].orientation() === e);
    for (let s of t) {
      let l = [...s.faces][0];
      if (l.orientation() !== e) {
        for (let o of n)
          if (l.shapes.every((a) => o.contains(a))) {
            o.addFace(l.shapes);
            break;
          }
      }
    }
    return n;
  }
  /**
   * Reverse orientation of all faces to opposite
   * @returns {Polygon}
   */
  reverse() {
    for (let t of this.faces)
      t.reverse();
    return this;
  }
  /**
   * Returns true if polygon contains shape: no point of shape lay outside of the polygon,
   * false otherwise
   * @param {Shape} shape - test shape
   * @returns {boolean}
   */
  contains(t) {
    if (t instanceof i.Point) {
      let e = Ot(this, t);
      return e === Wt || e === D;
    } else
      return gn(this, t);
  }
  /**
   * Return distance and shortest segment between polygon and other shape as array [distance, shortest_segment]
   * @param {Shape} shape Shape of one of the types Point, Circle, Line, Segment, Arc or Polygon
   * @returns {Number | Segment}
   */
  distanceTo(t) {
    if (t instanceof i.Point) {
      let [e, n] = i.Distance.point2polygon(t, this);
      return n = n.reverse(), [e, n];
    }
    if (t instanceof i.Circle || t instanceof i.Line || t instanceof i.Segment || t instanceof i.Arc) {
      let [e, n] = i.Distance.shape2polygon(t, this);
      return n = n.reverse(), [e, n];
    }
    if (t instanceof i.Polygon) {
      let e = [Number.POSITIVE_INFINITY, new i.Segment()], n, s;
      for (let l of this.edges) {
        let o = e[0];
        [n, s] = i.Distance.shape2planarSet(l.shape, t.edges, o), i.Utils.LT(n, o) && (e = [n, s]);
      }
      return e;
    }
  }
  /**
   * Return array of intersection points between polygon and other shape
   * @param shape Shape of the one of supported types <br/>
   * @returns {Point[]}
   */
  intersect(t) {
    if (t instanceof i.Point)
      return this.contains(t) ? [t] : [];
    if (t instanceof i.Line)
      return kt(t, this);
    if (t instanceof i.Ray)
      return sn(t, this);
    if (t instanceof i.Circle)
      return Ke(t, this);
    if (t instanceof i.Segment)
      return pe(t, this);
    if (t instanceof i.Arc)
      return _e(t, this);
    if (t instanceof i.Polygon)
      return Xn(t, this);
    if (t instanceof i.Multiline)
      return Zn(t, this);
  }
  /**
   * Returns new polygon translated by vector vec
   * @param {Vector} vec
   * @returns {Polygon}
   */
  translate(t) {
    let e = new dt();
    for (let n of this.faces)
      e.addFace(n.shapes.map((s) => s.translate(t)));
    return e;
  }
  /**
   * Return new polygon rotated by given angle around given point
   * If point omitted, rotate around origin (0,0)
   * Positive value of angle defines rotation counterclockwise, negative - clockwise
   * @param {number} angle - rotation angle in radians
   * @param {Point} center - rotation center, default is (0,0)
   * @returns {Polygon} - new rotated polygon
   */
  rotate(t = 0, e = new i.Point()) {
    let n = new dt();
    for (let s of this.faces)
      n.addFace(s.shapes.map((l) => l.rotate(t, e)));
    return n;
  }
  /**
   * Return new polygon with coordinates multiplied by scaling factor
   * @param {number} sx - x-axis scaling factor
   * @param {number} sy - y-axis scaling factor
   * @returns {Polygon}
   */
  scale(t, e) {
    let n = new dt();
    for (let s of this.faces)
      n.addFace(s.shapes.map((l) => l.scale(t, e)));
    return n;
  }
  /**
   * Return new polygon transformed using affine transformation matrix
   * @param {Matrix} matrix - affine transformation matrix
   * @returns {Polygon} - new polygon
   */
  transform(t = new i.Matrix()) {
    let e = new dt();
    for (let n of this.faces)
      e.addFace(n.shapes.map((s) => s.transform(t)));
    return e;
  }
  /**
   * This method returns an object that defines how data will be
   * serialized when called JSON.stringify() method
   * @returns {Object}
   */
  toJSON() {
    return [...this.faces].map((t) => t.toJSON());
  }
  /**
   * Transform all faces into array of polygons
   * @returns {Flatten.Polygon[]}
   */
  toArray() {
    return [...this.faces].map((t) => t.toPolygon());
  }
  /**
   * Return string to be assigned to 'd' attribute of <path> element
   * @returns {*}
   */
  dpath() {
    return [...this.faces].reduce((t, e) => t + e.svg(), "");
  }
  /**
   * Return string to draw polygon in svg
   * @param attrs  - an object with attributes for svg path element
   * @returns {string}
   */
  svg(t = {}) {
    let e = `
<path ${ot({ fillRule: "evenodd", fill: "lightcyan", ...t })} d="`;
    for (let n of this.faces)
      e += `
${n.svg()}`;
    return e += `" >
</path>`, e;
  }
};
i.Polygon = zi;
const Yi = (...r) => new i.Polygon(...r);
i.polygon = Yi;
const { Circle: Jt, Line: Re, Point: Me, Vector: Gt, Utils: te } = i;
class Rt {
  /**
   * Inversion constructor
   * @param {Circle} inversion_circle inversion circle
   */
  constructor(t) {
    this.circle = t;
  }
  get inversion_circle() {
    return this.circle;
  }
  static inversePoint(t, e) {
    const n = new Gt(t.pc, e), s = t.r * t.r, l = n.dot(n);
    return te.EQ_0(l) ? new Me(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY) : t.pc.translate(n.multiply(s / l));
  }
  static inverseCircle(t, e) {
    const n = t.pc.distanceTo(e.pc)[0];
    if (te.EQ(n, e.r)) {
      let s = t.r * t.r / (2 * e.r), l = new Gt(t.pc, e.pc);
      l = l.normalize();
      let o = t.pc.translate(l.multiply(s));
      return new Re(o, l);
    } else {
      let s = new Gt(t.pc, e.pc), l = t.r * t.r / (s.dot(s) - e.r * e.r), o = t.pc.translate(s.multiply(l)), a = Math.abs(l) * e.r;
      return new Jt(o, a);
    }
  }
  static inverseLine(t, e) {
    const [n, s] = t.pc.distanceTo(e);
    if (te.EQ_0(n))
      return e.clone();
    {
      let l = t.r * t.r / (2 * n), o = new Gt(t.pc, s.end);
      return o = o.multiply(l / n), new Jt(t.pc.translate(o), l);
    }
  }
  inverse(t) {
    if (t instanceof Me)
      return Rt.inversePoint(this.circle, t);
    if (t instanceof Jt)
      return Rt.inverseCircle(this.circle, t);
    if (t instanceof Re)
      return Rt.inverseLine(this.circle, t);
  }
}
i.Inversion = Rt;
const Qi = (r) => new i.Inversion(r);
i.inversion = Qi;
class d {
  /**
   * Calculate distance and shortest segment between points
   * @param pt1
   * @param pt2
   * @returns {[number, Flatten.Segment]} - distance and shortest segment
   */
  static point2point(t, e) {
    return t.distanceTo(e);
  }
  /**
   * Calculate distance and shortest segment between point and line
   * @param pt
   * @param line
   * @returns {[number, Flatten.Segment]} - distance and shortest segment
   */
  static point2line(t, e) {
    let n = t.projectionOn(e);
    return [new i.Vector(t, n).length, new i.Segment(t, n)];
  }
  /**
   * Calculate distance and shortest segment between point and circle
   * @param pt
   * @param circle
   * @returns {[number, Flatten.Segment]} - distance and shortest segment
   */
  static point2circle(t, e) {
    let [n, s] = t.distanceTo(e.center);
    if (i.Utils.EQ_0(n))
      return [e.r, new i.Segment(t, e.toArc().start)];
    {
      let l = Math.abs(n - e.r), o = new i.Vector(e.pc, t).normalize().multiply(e.r), a = e.pc.translate(o);
      return [l, new i.Segment(t, a)];
    }
  }
  /**
   * Calculate distance and shortest segment between point and segment
   * @param pt
   * @param segment
   * @returns {[number, Flatten.Segment]} - distance and shortest segment
   */
  static point2segment(t, e) {
    if (e.start.equalTo(e.end))
      return d.point2point(t, e.start);
    let n = new i.Vector(e.start, e.end), s = new i.Vector(e.start, t), l = new i.Vector(e.end, t), o = n.dot(s), a = -n.dot(l), u, h;
    if (i.Utils.GE(o, 0) && i.Utils.GE(a, 0)) {
      let f = e.tangentInStart();
      return u = Math.abs(f.cross(s)), h = e.start.translate(f.multiply(f.dot(s))), [u, new i.Segment(t, h)];
    } else return o < 0 ? t.distanceTo(e.start) : t.distanceTo(e.end);
  }
  /**
   * Calculate distance and shortest segment between point and arc
   * @param pt
   * @param arc
   * @returns {[number, Flatten.Segment]} - distance and shortest segment
   */
  static point2arc(t, e) {
    let n = new i.Circle(e.pc, e.r), s = [], l, o;
    return [l, o] = d.point2circle(t, n), o.end.on(e) && s.push(d.point2circle(t, n)), s.push(d.point2point(t, e.start)), s.push(d.point2point(t, e.end)), d.sort(s), s[0];
  }
  /**
   * Calculate distance and shortest segment between point and edge
   * @param pt
   * @param edge
   * @returns {[number, Flatten.Segment]}
   */
  static point2edge(t, e) {
    return e.shape instanceof i.Segment ? d.point2segment(t, e.shape) : d.point2arc(t, e.shape);
  }
  /**
   * Calculate distance and shortest segment between segment and line
   * @param seg
   * @param line
   * @returns {[number, Flatten.Segment]}
   */
  static segment2line(t, e) {
    let n = t.intersect(e);
    if (n.length > 0)
      return [0, new i.Segment(n[0], n[0])];
    let s = [];
    return s.push(d.point2line(t.start, e)), s.push(d.point2line(t.end, e)), d.sort(s), s[0];
  }
  /**
   * Calculate distance and shortest segment between two segments
   * @param seg1
   * @param seg2
   * @returns {[number, Flatten.Segment]} - distance and shortest segment
   */
  static segment2segment(t, e) {
    let n = jt(t, e);
    if (n.length > 0)
      return [0, new i.Segment(n[0], n[0])];
    let s = [], l, o;
    return [l, o] = d.point2segment(e.start, t), s.push([l, o.reverse()]), [l, o] = d.point2segment(e.end, t), s.push([l, o.reverse()]), s.push(d.point2segment(t.start, e)), s.push(d.point2segment(t.end, e)), d.sort(s), s[0];
  }
  /**
   * Calculate distance and shortest segment between segment and circle
   * @param seg
   * @param circle
   * @returns {[number, Flatten.Segment]} - distance and shortest segment
   */
  static segment2circle(t, e) {
    let n = t.intersect(e);
    if (n.length > 0)
      return [0, new i.Segment(n[0], n[0])];
    let s = new i.Line(t.ps, t.pe), [l, o] = d.point2line(e.center, s);
    if (i.Utils.GE(l, e.r) && o.end.on(t))
      return d.point2circle(o.end, e);
    {
      let [a, u] = d.point2circle(t.start, e), [h, f] = d.point2circle(t.end, e);
      return i.Utils.LT(a, h) ? [a, u] : [h, f];
    }
  }
  /**
   * Calculate distance and shortest segment between segment and arc
   * @param seg
   * @param arc
   * @returns {[number, Flatten.Segment]} - distance and shortest segment
   */
  static segment2arc(t, e) {
    let n = t.intersect(e);
    if (n.length > 0)
      return [0, new i.Segment(n[0], n[0])];
    let s = new i.Line(t.ps, t.pe), l = new i.Circle(e.pc, e.r), [o, a] = d.point2line(l.center, s);
    if (i.Utils.GE(o, l.r) && a.end.on(t)) {
      let [g, _] = d.point2circle(a.end, l);
      if (_.end.on(e))
        return [g, _];
    }
    let u = [];
    u.push(d.point2arc(t.start, e)), u.push(d.point2arc(t.end, e));
    let h, f;
    return [h, f] = d.point2segment(e.start, t), u.push([h, f.reverse()]), [h, f] = d.point2segment(e.end, t), u.push([h, f.reverse()]), d.sort(u), u[0];
  }
  /**
   * Calculate distance and shortest segment between two circles
   * @param circle1
   * @param circle2
   * @returns {[number, Flatten.Segment]} - distance and shortest segment
   */
  static circle2circle(t, e) {
    let n = t.intersect(e);
    if (n.length > 0)
      return [0, new i.Segment(n[0], n[0])];
    if (t.center.equalTo(e.center)) {
      let s = t.toArc(), l = e.toArc();
      return d.point2point(s.start, l.start);
    } else {
      let s = new i.Line(t.center, e.center), l = s.intersect(t), o = s.intersect(e), a = [];
      return a.push(d.point2point(l[0], o[0])), a.push(d.point2point(l[0], o[1])), a.push(d.point2point(l[1], o[0])), a.push(d.point2point(l[1], o[1])), d.sort(a), a[0];
    }
  }
  /**
   * Calculate distance and shortest segment between two circles
   * @param circle
   * @param line
   * @returns {[number, Flatten.Segment]} - distance and shortest segment
   */
  static circle2line(t, e) {
    let n = t.intersect(e);
    if (n.length > 0)
      return [0, new i.Segment(n[0], n[0])];
    let [s, l] = d.point2line(t.center, e), [o, a] = d.point2circle(l.end, t);
    return a = a.reverse(), [o, a];
  }
  /**
   * Calculate distance and shortest segment between arc and line
   * @param arc
   * @param line
   * @returns {[number, Flatten.Segment]} - distance and shortest segment
   */
  static arc2line(t, e) {
    let n = e.intersect(t);
    if (n.length > 0)
      return [0, new i.Segment(n[0], n[0])];
    let s = new i.Circle(t.center, t.r), [l, o] = d.point2line(s.center, e);
    if (i.Utils.GE(l, s.r)) {
      let [a, u] = d.point2circle(o.end, s);
      if (u.end.on(t))
        return [a, u];
    } else {
      let a = [];
      return a.push(d.point2line(t.start, e)), a.push(d.point2line(t.end, e)), d.sort(a), a[0];
    }
  }
  /**
   * Calculate distance and shortest segment between arc and circle
   * @param arc
   * @param circle2
   * @returns {[number, Flatten.Segment]} - distance and shortest segment
   */
  static arc2circle(t, e) {
    let n = t.intersect(e);
    if (n.length > 0)
      return [0, new i.Segment(n[0], n[0])];
    let s = new i.Circle(t.center, t.r), [l, o] = d.circle2circle(s, e);
    if (o.start.on(t))
      return [l, o];
    {
      let a = [];
      return a.push(d.point2circle(t.start, e)), a.push(d.point2circle(t.end, e)), d.sort(a), a[0];
    }
  }
  /**
   * Calculate distance and shortest segment between two arcs
   * @param arc1
   * @param arc2
   * @returns {[number, Flatten.Segment]} - distance and shortest segment
   */
  static arc2arc(t, e) {
    let n = t.intersect(e);
    if (n.length > 0)
      return [0, new i.Segment(n[0], n[0])];
    let s = new i.Circle(t.center, t.r), l = new i.Circle(e.center, e.r), [o, a] = d.circle2circle(s, l);
    if (a.start.on(t) && a.end.on(e))
      return [o, a];
    {
      let u = [], h, f;
      return [h, f] = d.point2arc(t.start, e), f.end.on(e) && u.push([h, f]), [h, f] = d.point2arc(t.end, e), f.end.on(e) && u.push([h, f]), [h, f] = d.point2arc(e.start, t), f.end.on(t) && u.push([h, f.reverse()]), [h, f] = d.point2arc(e.end, t), f.end.on(t) && u.push([h, f.reverse()]), [h, f] = d.point2point(t.start, e.start), u.push([h, f]), [h, f] = d.point2point(t.start, e.end), u.push([h, f]), [h, f] = d.point2point(t.end, e.start), u.push([h, f]), [h, f] = d.point2point(t.end, e.end), u.push([h, f]), d.sort(u), u[0];
    }
  }
  /**
   * Calculate distance and shortest segment between point and polygon
   * @param point
   * @param polygon
   * @returns {[number, Flatten.Segment]} - distance and shortest segment
   */
  static point2polygon(t, e) {
    let n = [Number.POSITIVE_INFINITY, new i.Segment()];
    for (let s of e.edges) {
      let [l, o] = d.point2edge(t, s);
      i.Utils.LT(l, n[0]) && (n = [l, o]);
    }
    return n;
  }
  static shape2polygon(t, e) {
    let n = [Number.POSITIVE_INFINITY, new i.Segment()];
    for (let s of e.edges) {
      let [l, o] = t.distanceTo(s.shape);
      i.Utils.LT(l, n[0]) && (n = [l, o]);
    }
    return n;
  }
  /**
   * Calculate distance and shortest segment between two polygons
   * @param polygon1
   * @param polygon2
   * @returns {[number, Flatten.Segment]} - distance and shortest segment
   */
  static polygon2polygon(t, e) {
    let n = [Number.POSITIVE_INFINITY, new i.Segment()];
    for (let s of t.edges)
      for (let l of e.edges) {
        let [o, a] = s.shape.distanceTo(l.shape);
        i.Utils.LT(o, n[0]) && (n = [o, a]);
      }
    return n;
  }
  /**
   * Returns [mindist, maxdist] array of squared minimal and maximal distance between boxes
   * Minimal distance by x is
   *    (box2.xmin - box1.xmax), if box1 is left to box2
   *    (box1.xmin - box2.xmax), if box2 is left to box1
   *    0,                       if box1 and box2 are intersected by x
   * Minimal distance by y is defined in the same way
   *
   * Maximal distance is estimated as a sum of squared dimensions of the merged box
   *
   * @param box1
   * @param box2
   * @returns {Number | Number} - minimal and maximal distance
   */
  static box2box_minmax(t, e) {
    let n = Math.max(Math.max(t.xmin - e.xmax, 0), Math.max(e.xmin - t.xmax, 0)), s = Math.max(Math.max(t.ymin - e.ymax, 0), Math.max(e.ymin - t.ymax, 0)), l = n * n + s * s, o = t.merge(e), a = o.xmax - o.xmin, u = o.ymax - o.ymin, h = a * a + u * u;
    return [l, h];
  }
  static minmax_tree_process_level(t, e, n, s) {
    let l, o;
    for (let f of e)
      [l, o] = d.box2box_minmax(t.box, f.item.key), f.item.value instanceof i.Edge ? s.insert([l, o], f.item.value.shape) : s.insert([l, o], f.item.value), i.Utils.LT(o, n) && (n = o);
    if (e.length === 0)
      return n;
    let a = e.map((f) => f.left.isNil() ? void 0 : f.left).filter((f) => f !== void 0), u = e.map((f) => f.right.isNil() ? void 0 : f.right).filter((f) => f !== void 0), h = [...a, ...u].filter((f) => {
      let [g, _] = d.box2box_minmax(t.box, f.max);
      return i.Utils.LE(g, n);
    });
    return n = d.minmax_tree_process_level(t, h, n, s), n;
  }
  /**
   * Calculates sorted tree of [mindist, maxdist] intervals between query shape
   * and shapes of the planar set.
   * @param shape
   * @param set
   */
  static minmax_tree(t, e, n) {
    let s = new Ut(), l = [e.index.root], o = n < Number.POSITIVE_INFINITY ? n * n : Number.POSITIVE_INFINITY;
    return o = d.minmax_tree_process_level(t, l, o, s), s;
  }
  static minmax_tree_calc_distance(t, e, n) {
    let s, l;
    if (e != null && !e.isNil()) {
      if ([s, l] = d.minmax_tree_calc_distance(t, e.left, n), l)
        return [s, l];
      if (i.Utils.LT(s[0], Math.sqrt(e.item.key.low)))
        return [s, !0];
      let [o, a] = d.distance(t, e.item.value);
      return i.Utils.LT(o, s[0]) && (s = [o, a]), [s, l] = d.minmax_tree_calc_distance(t, e.right, s), [s, l];
    }
    return [n, !1];
  }
  /**
   * Calculates distance between shape and Planar Set of shapes
   * @param shape
   * @param {PlanarSet} set
   * @param {Number} min_stop
   * @returns {*}
   */
  static shape2planarSet(t, e, n = Number.POSITIVE_INFINITY) {
    let s = [n, new i.Segment()], l = !1;
    if (e instanceof i.PlanarSet) {
      let o = d.minmax_tree(t, e, n);
      [s, l] = d.minmax_tree_calc_distance(t, o.root, s);
    }
    return s;
  }
  static sort(t) {
    t.sort((e, n) => i.Utils.LT(e[0], n[0]) ? -1 : i.Utils.GT(e[0], n[0]) ? 1 : 0);
  }
  static distance(t, e) {
    return t.distanceTo(e);
  }
  /**
   * Calculate distance and shortest segment any shape and multiline
   * @param shape
   * @param multiline
   * @returns {[number, Flatten.Segment]}
   */
  static shape2multiline(t, e) {
    let n = [Number.POSITIVE_INFINITY, new i.Segment()];
    for (let s of e) {
      let [l, o] = d.distance(t, s.shape);
      i.Utils.LT(l, n[0]) && (n = [l, o]);
    }
    return n;
  }
  /**
   * Calculate distance and shortest segment between two multilines
   * @param multiline1
   * @param multiline2
   * @returns {[number, Flatten.Segment]}
   */
  static multiline2multiline(t, e) {
    let n = [Number.POSITIVE_INFINITY, new i.Segment()];
    for (let s of t)
      for (let l of e) {
        let [o, a] = d.distance(s.shape, l.shape);
        i.Utils.LT(o, n[0]) && (n = [o, a]);
      }
    return n;
  }
}
i.Distance = d;
const { Multiline: ji, Point: En, Segment: Zi, Polygon: xn } = i;
function Ie(r) {
  return new En(r.split(" ").map(Number));
}
function Tn(r) {
  return r.split(", ").map(Ie);
}
function ve(r) {
  const t = Tn(r);
  let e = [];
  for (let n = 0; n < t.length - 1; n++)
    e.push(new Zi(t[n], t[n + 1]));
  return new ji(e);
}
function Xi(r) {
  return r.replace(/\(\(/, "").replace(/\)\)$/, "").split("), (").map(ve);
}
function In(r) {
  const t = r.replace(/\(\(/, "").replace(/\)\)$/, "").split("), ("), e = new xn();
  let n;
  return t.forEach((s, l) => {
    let o = s.split(", ").map((u) => new En(u.split(" ").map(Number)));
    const a = e.addFace(o);
    l === 0 ? n = a.orientation() : a.orientation() === n && a.reverse();
  }), e;
}
function Ki(r) {
  const e = r.split(/\)\), \(\(/).map((l) => "((" + l + "))").map(In), n = new xn();
  return e.reduce((l, o) => [...l, ...o == null ? void 0 : o.faces], []).forEach((l) => n.addFace([...l == null ? void 0 : l.shapes])), n;
}
function Ji(r) {
  if (r.startsWith("POLYGON")) {
    const t = r.replace(/^POLYGON /, "");
    return In(t);
  } else {
    const t = r.replace(/^MULTIPOLYGON \(\(\((.*)\)\)\)$/, "$1");
    return Ki(t);
  }
}
function tr(r) {
  return r.split(`
`).map((e) => e.match(/\(([^)]+)\)/)[1]).map(Ie);
}
function er(r) {
  return r.split(`
`).map((e) => e.match(/\(([^)]+)\)/)[1]).map(ve).reduce((e, n) => [...e, ...n], []);
}
function vn(r) {
  if (r.startsWith("POINT")) {
    const t = r.replace(/^POINT \(/, "").replace(/\)$/, "");
    return Ie(t);
  } else if (r.startsWith("MULTIPOINT")) {
    const t = r.replace(/^MULTIPOINT \(/, "").replace(/\)$/, "");
    return Tn(t);
  } else if (r.startsWith("LINESTRING")) {
    const t = r.replace(/^LINESTRING \(/, "").replace(/\)$/, "");
    return ve(t);
  } else if (r.startsWith("MULTILINESTRING")) {
    const t = r.replace(/^MULTILINESTRING /, "");
    return Xi(t);
  } else {
    if (r.startsWith("POLYGON") || r.startsWith("MULTIPOLYGON"))
      return Ji(r);
    if (r.startsWith("GEOMETRYCOLLECTION")) {
      const t = /(?<type>POINT|LINESTRING|POLYGON|MULTIPOINT|MULTILINESTRING|MULTIPOLYGON) \((?:[^\(\)]|\([^\)]*\))*\)/g, e = r.match(t);
      return e[0].startsWith("GEOMETRYCOLLECTION") && (e[0] = e[0].replace("GEOMETRYCOLLECTION (", "")), e.map(vn).map((s) => s instanceof Array ? s : [s]).reduce((s, l) => [...s, ...l], []);
    } else {
      if (wn(r))
        return tr(r);
      if (Sn(r))
        return er(r);
    }
  }
  return [];
}
function wn(r) {
  var t;
  return (t = r.split(`
`)) == null ? void 0 : t.every((e) => e.includes("POINT"));
}
function Sn(r) {
  var t;
  return (t = r.split(`
`)) == null ? void 0 : t.every((e) => e.includes("LINESTRING"));
}
function nr(r) {
  return r.startsWith("POINT") || wn(r) || r.startsWith("LINESTRING") || Sn(r) || r.startsWith("MULTILINESTRING") || r.startsWith("POLYGON") || r.startsWith("MULTIPOINT") || r.startsWith("MULTIPOLYGON") || r.startsWith("GEOMETRYCOLLECTION");
}
i.isWktString = nr;
i.parseWKT = vn;
i.BooleanOperations = di;
i.Relations = Li;
const Ue = i.Matrix, qt = 24, ee = 60, y = class y extends bn {
  /**
   * TrackSymbol constructor.
   *
   * @param latLng - Initial location.
   * @param options - Options.
   */
  constructor(t, e) {
    if (super(), $e.setOptions(this, e), t == null)
      throw Error("latLng required");
    e = e || {}, this._latLng = Et.latLng(t), this._heading = e.heading, this._course = e.course, this._speed = e.speed, this._shapeOptions = e.shapeOptions || {
      leaderTime: ee,
      defaultShapeSet: y.DEFAULT_SHAPE_SET
    }, this._setShapeOptions(e.shapeOptions);
  }
  // ---- Leaflet
  /**
   * Project to layer.
   *
   * [Leaflet internal]
   */
  _project() {
    this._currentShapePoints = this._getProjectedShapePoints(), this._currentLeaderPoints = this._getLeaderShapePoints();
    const t = new On();
    for (let e = 0; e < this._currentShapePoints.length; e++) {
      const n = this._currentShapePoints[e];
      t.extend(n);
    }
    if (this._currentLeaderPoints !== void 0)
      for (let e = 0; e < this._currentLeaderPoints.length; e++) {
        const n = this._currentShapePoints[e];
        t.extend(n);
      }
    this._currentBounds = t, this._currentLatLngBounds = new Nn(
      this._map.layerPointToLatLng(t.getBottomLeft()),
      this._map.layerPointToLatLng(t.getTopRight())
    );
  }
  /**
   * Update element.
   *
   * [Leaflet internal]
   */
  _update() {
    if (!this._map)
      return;
    const t = this.getElement();
    if (t === void 0)
      return;
    const e = [];
    this._currentShapePoints !== void 0 && e.push(y._toSVGPath(this._currentShapePoints, !0)), this._currentLeaderPoints !== void 0 && e.push(y._toSVGPath(this._currentLeaderPoints, !1));
    const n = e.join(" ");
    t.setAttribute("d", n);
  }
  // ----
  /**
   * Set shape options.
   *
   * @param shapeOptions - Shape options.
   */
  _setShapeOptions(t) {
    this._shapeOptions = t || {
      leaderTime: ee,
      defaultShapeSet: y.DEFAULT_SHAPE_SET
    }, this._shapeOptions.leaderTime === void 0 && (this._shapeOptions.leaderTime = ee), this._shapeOptions.defaultShapeSet === void 0 && (this._shapeOptions.defaultShapeSet = y.DEFAULT_SHAPE_SET), this._shapeOptions.shapeSetEntries !== void 0 && this._shapeOptions.shapeSetEntries.sort((e, n) => n.minZoomLevel - e.minZoomLevel);
  }
  // ---
  /**
   * Sets the location.
   *
   * @param latLng - Location.
   * @returns this
   */
  setLatLng(t) {
    const e = this._latLng;
    return this._latLng = Et.latLng(t), this.fire("move", {
      oldLatLng: e,
      latlng: this._latLng
    }), this.redraw();
  }
  /**
   * Sets the heading.
   *
   * @param heading - Heading (unit: radians, from north, clockwise).
   * @returns this
   */
  setHeading(t) {
    return this._heading = t, this.redraw();
  }
  /**
   * Sets the course over ground.
   *
   * @param course - Course over ground (unit: radians, from north, clockwise).
   * @returns this
   */
  setCourse(t) {
    return this._course = t, this.redraw();
  }
  /**
   * Sets the speed.
   *
   * @param speed - Speed (unit: m/s).
   * @returns this
   */
  setSpeed(t) {
    return this._speed = t, this.redraw();
  }
  /**
   * Sets the shape options.
   *
   * @param shapeOptions - Shape options.
   * @returns this
   */
  setShapeOptions(t) {
    return this._setShapeOptions(t), this.redraw();
  }
  /**
   * Returns the bounding box.
   *
   * @returns The bounding box.
   */
  getBounds() {
    return this._currentLatLngBounds;
  }
  /**
   * Returns the location.
   *
   * @returns The location.
   */
  getLatLng() {
    return this._latLng;
  }
  /**
   * Returns the speed.
   *
   * @returns The speed (m/s).
   */
  getSpeed() {
    return this._speed;
  }
  /**
   * Returns the heading.
   *
   * @returns The heading (radians, from north, clockwise).
   */
  getHeading() {
    return this._heading;
  }
  /**
   * Returns the course.
   *
   * @returns The course (radians, from north, clockwise).
   */
  getCourse() {
    return this._course;
  }
  /**
   * Creates a shape.
   *
   * @param points - Points.
   * @param size - Size (units: pixels).
   * @returns The new shape.
   */
  static createShape(t, e) {
    return {
      points: t,
      length: e,
      breadth: e,
      units: "pixels"
    };
  }
  /**
   * Creates a shape set.
   *
   * @param size - Size (units: pixels).
   * @returns The new shape set.
   */
  static createShapeSet(t) {
    return {
      withHeading: y.createShape(y.DEFAULT_HEADING_SHAPE_POINTS, t),
      withoutHeading: y.createShape(y.DEFAULT_NOHEADING_SHAPE_POINTS, t)
    };
  }
  /**
   * Get latitude size of y-distance.
   *
   * @param value - Y distance (m).
   * @returns dLat
   */
  _getLatSizeOf(t) {
    return t / 40075017 * 360;
  }
  /**
   * Get longitude size of x-distance.
   *
   * @param value - X distance (m).
   * @returns dLng
   */
  _getLngSizeOf(t) {
    return t / 40075017 * 360 / Math.cos(Math.PI / 180 * this._latLng.lat);
  }
  /**
   * Get view angle from model.
   *
   * @param modelAngle - Model angle (radians).
   * @returns View angle from model (radians).
   */
  _getViewAngleFromModel(t) {
    return t - Math.PI / 2;
  }
  /**
   * Get leader shape points.
   *
   * @returns Points.
   */
  _getLeaderShapePoints() {
    if (this._course === void 0 || this._speed === void 0 || this._shapeOptions === void 0 || this._shapeOptions.leaderTime === void 0)
      return;
    const t = this._getViewAngleFromModel(this._course), e = this._speed * this._shapeOptions.leaderTime, n = this._calcRelativeLatLng(this._latLng, e, t);
    return this._latLngsToLayerPoints(this._latLng, n);
  }
  /**
   * Calculate relative lat/lng.
   *
   * @param latLng - LatLng.
   * @param distance - Distance (meters).
   * @param angle - Angle (radians).
   * @returns Calculated LatLng.
   */
  _calcRelativeLatLng(t, e, n) {
    return new we(
      t.lat - this._getLatSizeOf(e * Math.sin(n)),
      t.lng + this._getLngSizeOf(e * Math.cos(n))
    );
  }
  /**
   * Convert LatLngs to map layer points.
   *
   * @param latLngs - LatLngs.
   * @returns Points.
   */
  _latLngsToLayerPoints(...t) {
    return t.map((e) => this._map.latLngToLayerPoint(e));
  }
  /**
   * Gets the shape set.
   *
   * @returns The shape set.
   */
  _getShapeSet() {
    if (this._shapeOptions.shapeSetEntries === void 0 || this._shapeOptions.shapeSetEntries.length == 0)
      return this._shapeOptions.defaultShapeSet ? this._shapeOptions.defaultShapeSet : y.DEFAULT_SHAPE_SET;
    const t = this._map.getZoom(), e = this._shapeOptions.shapeSetEntries.sort((n, s) => s.minZoomLevel - n.minZoomLevel).filter((n) => t >= n.minZoomLevel);
    return e.length > 0 ? e[0].shapeSet : this._shapeOptions.defaultShapeSet ? this._shapeOptions.defaultShapeSet : y.DEFAULT_SHAPE_SET;
  }
  /**
   * Gets the shape.
   *
   * @returns The shape.
   */
  _getShape() {
    const t = this._getShapeSet();
    return this._heading !== void 0 ? t.withHeading : t.withoutHeading;
  }
  /**
   * Get transformed shape points.
   *
   * @returns Transformed points and units.
   */
  _getTransformedShapePoints() {
    const t = this._getShape();
    let e = new Ue();
    if (this._heading !== void 0) {
      const s = this._getViewAngleFromModel(this._heading);
      e = e.rotate(s);
    }
    return t.center !== void 0 && (e = e.translate(-t.center[0], -t.center[1])), e = e.scale(t.length, t.breadth), [t.points.map((s) => e.transform(s)), t.units];
  }
  /**
   * Get projected shape points.
   *
   * @returns Points projected to map layer.
   */
  _getProjectedShapePoints() {
    const [t, e] = this._getTransformedShapePoints();
    switch (e) {
      case "pixels": {
        const n = this._map.latLngToLayerPoint(this._latLng), s = new Ue().translate(n.x, n.y);
        return t.map((l) => {
          const o = s.transform(l);
          return new Cn(o[0], o[1]);
        });
      }
      case "meters":
        return t.map((n) => this._map.latLngToLayerPoint(
          new we(
            this._latLng.lat - this._getLatSizeOf(n[1]),
            this._latLng.lng + this._getLngSizeOf(n[0])
          )
        ));
      default:
        throw `unsupported units: ${e}`;
    }
  }
  /**
   * Converts points to an SVG path string.
   *
   * @param points - Points.
   * @param close - Close path.
   * @returns SVG path string.
   */
  static _toSVGPath(t, e) {
    let n = "";
    for (let s = 0; s < t.length; s++) {
      const l = t[s];
      n === "" ? n = `M ${l.x} ${l.y} ` : n += `L ${l.x} ${l.y} `;
    }
    return e && (n += "Z"), n;
  }
};
y.DEFAULT_HEADING_SHAPE_POINTS = [[0.75, 0], [-0.25, 0.3], [-0.25, -0.3]], y.DEFAULT_NOHEADING_SHAPE_POINTS = [[0.3, 0], [0, 0.3], [-0.3, 0], [0, -0.3]], y.DEFAULT_SHAPE_SET = {
  withHeading: {
    points: y.DEFAULT_HEADING_SHAPE_POINTS,
    length: qt,
    breadth: qt,
    units: "pixels"
  },
  withoutHeading: {
    points: y.DEFAULT_NOHEADING_SHAPE_POINTS,
    length: qt,
    breadth: qt,
    units: "pixels"
  }
};
let et = y;
const ir = 24, rr = 14, sr = 60, or = 1.944, Fe = 102.3, lr = 360, ar = 360, yn = "#000000", Pn = "#d3d3d3", N = "#000000", C = "#d3d3d3", K = "#8b008b", J = "#ff00ff", M = "#00008b", U = "#ffff00", Q = "#008b8b", j = "#00ffff", F = "#00008b", k = "#0000ff", B = "#006400", V = "#90ee90", $ = "#8b0000", H = "#ff0000", G = "#008b8b", q = "#00ffff", ke = {
  0: c("Not available", N, C),
  20: c("Wing in ground (WIG), all ships of this type", N, C),
  21: c("Wing in ground (WIG), Hazardous category A", N, C),
  22: c("Wing in ground (WIG), Hazardous category B", N, C),
  23: c("Wing in ground (WIG), Hazardous category C", N, C),
  24: c("Wing in ground (WIG), Hazardous category D", N, C),
  25: c("Wing in ground (WIG), Reserved for future use", N, C),
  26: c("Wing in ground (WIG), Reserved for future use", N, C),
  27: c("Wing in ground (WIG), Reserved for future use", N, C),
  28: c("Wing in ground (WIG), Reserved for future use", N, C),
  29: c("Wing in ground (WIG), Reserved for future use", N, C),
  30: c("Fishing", K, J),
  31: c("Towing", K, J),
  32: c("Towing: length exceeds 200m or breadth exceeds 25m", K, J),
  33: c("Dredging or underwater ops", K, J),
  34: c("Diving ops", K, J),
  35: c("Military ops", K, J),
  36: c("Sailing", K, J),
  37: c("Pleasure Craft", K, J),
  40: c("High speed craft (HSC), all ships of this type", M, U),
  41: c("High speed craft (HSC), Hazardous category A", M, U),
  42: c("High speed craft (HSC), Hazardous category B", M, U),
  43: c("High speed craft (HSC), Hazardous category C", M, U),
  44: c("High speed craft (HSC), Hazardous category D", M, U),
  45: c("High speed craft (HSC), Reserved for future use", M, U),
  46: c("High speed craft (HSC), Reserved for future use", M, U),
  47: c("High speed craft (HSC), Reserved for future use", M, U),
  48: c("High speed craft (HSC), Reserved for future use", M, U),
  49: c("High speed craft (HSC), No additional information", M, U),
  50: c("Pilot Vessel", Q, j),
  51: c("Search and Rescue vessel", Q, j),
  52: c("Tug", Q, j),
  53: c("Port Tender", Q, j),
  54: c("Anti-pollution equipment", Q, j),
  55: c("Law Enforcement", Q, j),
  56: c("Spare - Local Vessel", Q, j),
  57: c("Spare - Local Vessel", Q, j),
  58: c("Medical Transport", Q, j),
  59: c("Noncombatant ship according to RR Resolution No. 18", "", ""),
  60: c("Passenger, all ships of this type", F, k),
  61: c("Passenger, Hazardous category A", F, k),
  62: c("Passenger, Hazardous category B", F, k),
  63: c("Passenger, Hazardous category C", F, k),
  64: c("Passenger, Hazardous category D", F, k),
  65: c("Passenger, Reserved for future use", F, k),
  66: c("Passenger, Reserved for future use", F, k),
  67: c("Passenger, Reserved for future use", F, k),
  68: c("Passenger, Reserved for future use", F, k),
  69: c("Passenger, No additional information", F, k),
  70: c("Cargo, all ships of this type", B, V),
  71: c("Cargo, Hazardous category A", B, V),
  72: c("Cargo, Hazardous category B", B, V),
  73: c("Cargo, Hazardous category C", B, V),
  74: c("Cargo, Hazardous category D", B, V),
  75: c("Cargo, Reserved for future use", B, V),
  76: c("Cargo, Reserved for future use", B, V),
  77: c("Cargo, Reserved for future use", B, V),
  78: c("Cargo, Reserved for future use", B, V),
  79: c("Cargo, No additional information", B, V),
  80: c("Tanker, all ships of this type", $, H),
  81: c("Tanker, Hazardous category A", $, H),
  82: c("Tanker, Hazardous category B", $, H),
  83: c("Tanker, Hazardous category C", $, H),
  84: c("Tanker, Hazardous category D", $, H),
  85: c("Tanker, Reserved for future use", $, H),
  86: c("Tanker, Reserved for future use", $, H),
  87: c("Tanker, Reserved for future use", $, H),
  88: c("Tanker, Reserved for future use", $, H),
  89: c("Tanker, No additional information", $, H),
  90: c("Other Type, all ships of this type", G, q),
  91: c("Other Type, Hazardous category A", G, q),
  92: c("Other Type, Hazardous category B", G, q),
  93: c("Other Type, Hazardous category C", G, q),
  94: c("Other Type, Hazardous category D", G, q),
  95: c("Other Type, Reserved for future use", G, q),
  96: c("Other Type, Reserved for future use", G, q),
  97: c("Other Type, Reserved for future use", G, q),
  98: c("Other Type, Reserved for future use", G, q),
  99: c("Other Type, no additional information", G, q)
}, fr = c("Reserved", yn, Pn), ur = c("Unknown", yn, Pn), _t = class _t extends et {
  /**
   * AISTrackSymbol constructor.
   *
   * @param positionReport - Position report.
   * @param options - Options.
   */
  constructor(t, e) {
    super([t.latitude, t.longitude], e), $e.setOptions(this, e), e = e || {}, this._leaderTime = e.leaderTime || sr, this._minZoomLevel = e.minZoomLevel || rr, this._size = e.size || ir, this._positionReport = t, this.setPositionReport(t), this.setShipStaticData(e.shipStaticData);
  }
  /**
   * Get ETA from Date.
   *
   * @param date - Date.
   * @returns ETA
   */
  static etaFromDate(t) {
    if (t != null)
      return {
        month: t.getMonth() + 1,
        day: t.getDate(),
        hour: t.getHours(),
        minute: t.getMinutes()
      };
  }
  /**
   * Sets the position report.
   *
   * @param positionReport - Position report.
   * @returns this
   */
  setPositionReport(t) {
    return this._positionReport = t, this.setLatLng([t.latitude, t.longitude]), t.trueHeading !== null && t.trueHeading !== void 0 && t.trueHeading < ar ? this.setHeading(Be(t.trueHeading)) : this.setHeading(void 0), t.cog !== null && t.cog !== void 0 && t.cog < lr ? this.setCourse(Be(t.cog)) : this.setCourse(void 0), t.sog !== null && t.sog !== void 0 && t.sog < Fe ? this.setSpeed(t.sog / or) : this.setSpeed(void 0), this.bindPopup(this._getPopupContent(this._positionReport, this._shipStaticData)), this.redraw();
  }
  /**
   * Sets the ship static data.
   *
   * @param shipStaticData - Ship static data.
   * @returns this
   */
  setShipStaticData(t) {
    this._shipStaticData = t;
    const e = Ln(t != null ? t.type : void 0);
    return this.setStyle({
      color: e.color,
      fill: !0,
      fillOpacity: 1,
      fillColor: e.fillColor
    }), this.bindPopup(this._getPopupContent(this._positionReport, this._shipStaticData)), this.setShapeOptions(_t._getShapeOptions(
      this._leaderTime,
      this._minZoomLevel,
      this._size,
      t
    ));
  }
  static _getShapeOptions(t, e, n, s) {
    const l = {
      leaderTime: t,
      defaultShapeSet: et.createShapeSet(n)
    }, o = _t._getShapeSet(n, s);
    return o !== null && (l.shapeSetEntries = [{
      shapeSet: o,
      minZoomLevel: e
    }]), l;
  }
  static _getShapeSet(t, e) {
    return e == null || e.dimension === null || e.dimension === void 0 || !Ve(e.dimension) ? null : {
      withHeading: {
        points: _t.DEFAULT_SILHOUETTE_SHAPE_POINTS,
        center: [e.dimension.B, e.dimension.D],
        length: e.dimension.A + e.dimension.B,
        breadth: e.dimension.C + e.dimension.D,
        units: "meters"
      },
      withoutHeading: et.createShape(et.DEFAULT_NOHEADING_SHAPE_POINTS, t)
    };
  }
  _getPopupContent(t, e) {
    let n = "<table>";
    e != null && (n += A("User ID", e.userId), n += A("IMO Number", e.imoNumber), n += A("Call sign", e.callSign), n += A("Name", e.name)), t != null && (n += A("Location", `${ht(t.latitude, 5)}, ${ht(t.longitude, 5)}`), n += A(
      "SOG",
      ht(t.sog, 2, (l) => l < Fe),
      "knots"
    ), n += A(
      "COG",
      ht(t.cog, 1),
      "°"
    ), n += A(
      "Heading",
      ht(t.trueHeading, 1),
      "°"
    ), n += A(
      "Navigation status",
      dr(t.navigationalStatus)
    )), e != null && (n += A("Type", hr(e.type)), e.dimension !== null && e.dimension !== void 0 && Ve(e.dimension) && (n += A(
      "Ship length",
      e.dimension.A + e.dimension.B,
      "m"
    ), n += A(
      "Ship width",
      e.dimension.C + e.dimension.D,
      "m"
    )), n += A("Fix type", cr(e.fixType)), n += A("ETA", gr(e.eta)), n += A(
      "Maximum static draught",
      ht(e.maximumStaticDraught, 1),
      "m"
    ), n += A("Destination", e.destination), n += A("DTE", e.dte)), n += "</table>";
    const s = Rn.create("div");
    return s.innerHTML = n, s;
  }
};
_t.DEFAULT_SILHOUETTE_SHAPE_POINTS = [[1, 0.5], [0.75, 1], [0, 1], [0, 0], [0.75, 0]];
let Yt = _t;
function ht(r, t, e) {
  if (r != null && !(e && !e(r)))
    return r.toFixed(t);
}
function hr(r) {
  return r == null ? void 0 : Ln(r).name;
}
function cr(r) {
  if (r != null)
    switch (r) {
      case 0:
        return;
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
        return `not used (${r})`;
      case 15:
        return "internal GNSS";
      default:
        return `unknown (${r})`;
    }
}
function dr(r) {
  if (r != null)
    switch (r) {
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
        return `unknown (${r})`;
    }
}
function gr(r) {
  if (r == null)
    return;
  const t = [];
  if (!pt(r.month) && !pt(r.day) && t.push(`${r.month.toString().padStart(2, "0")}/${r.day.toString().padStart(2, "0")}`), !pt(r.hour) && !pt(r.minute) && t.push(`${r.hour.toString().padStart(2, "0")}:${r.minute.toString().padStart(2, "0")}`), t.length !== 0)
    return `${t.join(" ")} UTC`;
}
function Be(r) {
  if (r != null)
    return r * Math.PI / 180;
}
function pt(r) {
  return r == null;
}
function Ve(r) {
  return r != null && r.A > 0 && r.B > 0 && r.C > 0 && r.D > 0;
}
function A(r, t, e) {
  if (t == null)
    return "";
  const n = String(t);
  return `<tr><td>${r}</td><td>${n} ${pt(e) ? "" : e}</td></tr>`;
}
function c(r, t, e) {
  return {
    name: r,
    color: t,
    fillColor: e
  };
}
function Ln(r) {
  if (r == null)
    return ke[0];
  if (r < 0 || r > 99)
    return ur;
  const t = ke[r];
  return pt(t) ? fr : t;
}
Et.trackSymbol = function(r, t) {
  return new et(r, t);
};
Et.TrackSymbol = et;
Et.aisTrackSymbol = function(r, t) {
  return new Yt(r, t);
};
Et.AISTrackSymbol = Yt;
export {
  Yt as AISTrackSymbol,
  et as TrackSymbol,
  et as default
};
//# sourceMappingURL=leaflet-tracksymbol2.es.js.map
