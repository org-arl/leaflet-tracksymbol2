import ut, { Path as Xe, Util as Ae, Bounds as Je, LatLngBounds as Ke, LatLng as pe, Point as tn, DomUtil as en } from "leaflet";
const nn = !0, rn = !1, sn = { CCW: -1, CW: 1, NOT_ORIENTABLE: 0 }, on = 2 * Math.PI, xt = 1, Le = 0, D = 2, ln = 3, an = 4, fn = 1, hn = 2, ne = 0, kt = 1, ht = 2;
var Ut = /* @__PURE__ */ Object.freeze({
  CCW: nn,
  CW: rn,
  ORIENTATION: sn,
  PIx2: on,
  INSIDE: xt,
  OUTSIDE: Le,
  BOUNDARY: D,
  CONTAINS: ln,
  INTERLACE: an,
  OVERLAP_SAME: fn,
  OVERLAP_OPPOSITE: hn,
  NOT_VERTEX: ne,
  START_VERTEX: kt,
  END_VERTEX: ht
});
let Y = 1e-6;
function Oe(r) {
  Y = r;
}
function Ne() {
  return Y;
}
const un = 3;
function Qt(r) {
  return r < Y && r > -Y;
}
function nt(r, t) {
  return r - t < Y && r - t > -Y;
}
function Ce(r, t) {
  return r - t > Y;
}
function cn(r, t) {
  return r - t > -Y;
}
function Re(r, t) {
  return r - t < -Y;
}
function dn(r, t) {
  return r - t < Y;
}
var pn = /* @__PURE__ */ Object.freeze({
  setTolerance: Oe,
  getTolerance: Ne,
  DECIMALS: un,
  EQ_0: Qt,
  EQ: nt,
  GT: Ce,
  GE: cn,
  LT: Re,
  LE: dn
});
class Wt {
  static get ILLEGAL_PARAMETERS() {
    return new ReferenceError("Illegal Parameters");
  }
  static get ZERO_DIVISION() {
    return new Error("Zero division");
  }
  static get UNRESOLVED_BOUNDARY_CONFLICT() {
    return new Error("Unresolved boundary conflict in boolean operation");
  }
  static get INFINITE_LOOP() {
    return new Error("Infinite loop");
  }
}
let i = {
  Utils: pn,
  Errors: Wt,
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
for (let r in Ut)
  i[r] = Ut[r];
Object.defineProperty(i, "DP_TOL", {
  get: function() {
    return Ne();
  },
  set: function(r) {
    Oe(r);
  }
});
class ie {
  constructor(t, e) {
    this.first = t, this.last = e || this.first;
  }
  static testInfiniteLoop(t) {
    let e = t, n = t;
    do {
      if (e != t && e === n)
        throw i.Errors.INFINITE_LOOP;
      e = e.next, n = n.next.next;
    } while (e != t);
  }
  get size() {
    let t = 0;
    for (let e of this)
      t++;
    return t;
  }
  toArray(t = void 0, e = void 0) {
    let n = [], s = t || this.first, l = e || this.last, o = s;
    if (o === void 0)
      return n;
    do
      n.push(o), o = o.next;
    while (o !== l.next);
    return n;
  }
  append(t) {
    return this.isEmpty() ? this.first = t : (t.prev = this.last, this.last.next = t), this.last = t, this.last.next = void 0, this.first.prev = void 0, this;
  }
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
  remove(t) {
    return t === this.first && t === this.last ? (this.first = void 0, this.last = void 0) : (t.prev && (t.prev.next = t.next), t.next && (t.next.prev = t.prev), t === this.first && (this.first = t.next), t === this.last && (this.last = t.prev)), this;
  }
  isEmpty() {
    return this.first === void 0;
  }
  [Symbol.iterator]() {
    let t;
    return {
      next: () => (t = t ? t.next : this.first, { value: t, done: t === void 0 })
    };
  }
}
function ct(r, t, e) {
  let n = e.length, s = r.shape.split(t);
  if (s.length === 0)
    return;
  let l = 0;
  s[0] === null ? l = 0 : s[1] === null ? l = r.shape.length : l = s[0].length;
  let o = ne;
  nt(l, 0) && (o |= kt), nt(l, r.shape.length) && (o |= ht);
  let a = o & ht && r.next.arc_length === 0 ? 0 : r.arc_length + l;
  e.push({
    id: n,
    pt: t,
    arc_length: a,
    edge_before: r,
    edge_after: void 0,
    face: r.face,
    is_vertex: o
  });
}
function It(r) {
  r.int_points1_sorted = Et(r.int_points1), r.int_points2_sorted = Et(r.int_points2);
}
function Et(r) {
  let t = /* @__PURE__ */ new Map(), e = 0;
  for (let s of r)
    t.has(s.face) || (t.set(s.face, e), e++);
  for (let s of r)
    s.faceId = t.get(s.face);
  return r.slice().sort(gn);
}
function gn(r, t) {
  return r.faceId < t.faceId ? -1 : r.faceId > t.faceId ? 1 : r.arc_length < t.arc_length ? -1 : r.arc_length > t.arc_length ? 1 : 0;
}
function Gt(r, t) {
  return t.slice().sort((e, n) => r.coord(e.pt) < r.coord(n.pt) ? -1 : r.coord(e.pt) > r.coord(n.pt) ? 1 : 0);
}
function re(r) {
  if (r.int_points1.length < 2)
    return;
  let t = !1, e, n, s, l;
  for (let o = 0; o < r.int_points1_sorted.length; o++)
    if (r.int_points1_sorted[o].id !== -1) {
      e = r.int_points1_sorted[o], n = r.int_points2[e.id];
      for (let a = o + 1; a < r.int_points1_sorted.length && (s = r.int_points1_sorted[a], !!nt(s.arc_length, e.arc_length)); a++)
        s.id !== -1 && (l = r.int_points2[s.id], l.id !== -1 && s.edge_before === e.edge_before && s.edge_after === e.edge_after && l.edge_before === n.edge_before && l.edge_after === n.edge_after && (s.id = -1, l.id = -1, t = !0));
    }
  n = r.int_points2_sorted[0], e = r.int_points1[n.id];
  for (let o = 1; o < r.int_points2_sorted.length; o++) {
    let a = r.int_points2_sorted[o];
    if (a.id == -1)
      continue;
    if (n.id == -1 || !nt(a.arc_length, n.arc_length)) {
      n = a, e = r.int_points1[n.id];
      continue;
    }
    let h = r.int_points1[a.id];
    h.edge_before === e.edge_before && h.edge_after === e.edge_after && a.edge_before === n.edge_before && a.edge_after === n.edge_after && (h.id = -1, a.id = -1, t = !0);
  }
  t && (r.int_points1 = r.int_points1.filter((o) => o.id >= 0), r.int_points2 = r.int_points2.filter((o) => o.id >= 0), r.int_points1.forEach((o, a) => o.id = a), r.int_points2.forEach((o, a) => o.id = a));
}
function Yt(r) {
  for (let t of r)
    t.edge_before.bvStart = void 0, t.edge_before.bvEnd = void 0, t.edge_before.bv = void 0, t.edge_before.overlap = void 0, t.edge_after.bvStart = void 0, t.edge_after.bvEnd = void 0, t.edge_after.bv = void 0, t.edge_after.overlap = void 0;
  for (let t of r)
    t.edge_before.bvEnd = D, t.edge_after.bvStart = D;
}
function jt(r, t) {
  for (let e of r)
    e.edge_before.setInclusion(t), e.edge_after.setInclusion(t);
}
function _n(r) {
  let t, e, n, s = r.int_points1.length;
  for (let l = 0; l < s; l++) {
    let o = r.int_points1_sorted[l];
    o.face !== t && (e = l, t = o.face);
    let a = l, h = dt(r.int_points1_sorted, l, t), f;
    a + h < s && r.int_points1_sorted[a + h].face === t ? f = a + h : f = e;
    let u = dt(r.int_points1_sorted, f, t);
    n = null;
    for (let x = f; x < f + u; x++) {
      let I = r.int_points1_sorted[x];
      if (I.face === t && r.int_points2[I.id].face === r.int_points2[o.id].face) {
        n = I;
        break;
      }
    }
    if (n === null)
      continue;
    let p = o.edge_after, _ = n.edge_before;
    if (!(p.bv === D && _.bv === D) || p !== _)
      continue;
    let S = r.int_points2[o.id], v = r.int_points2[n.id], E = S.edge_after, y = v.edge_before;
    E.bv === D && y.bv === D && E === y || (S = r.int_points2[n.id], v = r.int_points2[o.id], E = S.edge_after, y = v.edge_before), E.bv === D && y.bv === D && E === y && p.setOverlap(E);
  }
}
function dt(r, t, e) {
  let n, s, l = 1;
  if (r.length == 1)
    return 1;
  n = r[t];
  for (let o = t + 1; o < r.length && !(n.face != e || (s = r[o], !(s.pt.equalTo(n.pt) && s.edge_before === n.edge_before && s.edge_after === n.edge_after))); o++)
    l++;
  return l;
}
function pt(r, t) {
  if (t) {
    for (let e of t) {
      let n = e.edge_before;
      if (e.is_vertex = ne, n.shape.start && n.shape.start.equalTo(e.pt) && (e.is_vertex |= kt), n.shape.end && n.shape.end.equalTo(e.pt) && (e.is_vertex |= ht), e.is_vertex & kt) {
        e.edge_before = n.prev, e.is_vertex = ht;
        continue;
      }
      if (e.is_vertex & ht)
        continue;
      let s = r.addVertex(e.pt, n);
      e.edge_before = s;
    }
    for (let e of t)
      e.edge_after = e.edge_before.next;
  }
}
function ge(r, t, e) {
  let n = r.edge_before, s = t.edge_after;
  n.next = e, e.prev = n, e.next = s, s.prev = e;
}
const { INSIDE: Q, OUTSIDE: W, BOUNDARY: T, OVERLAP_SAME: mn, OVERLAP_OPPOSITE: xn } = Ut, { NOT_VERTEX: bi, START_VERTEX: _e, END_VERTEX: me } = Ut, $t = 1, bt = 2, it = 3;
function En(r, t) {
  let [e, n] = Pt(r, t, $t, !0);
  return e;
}
function Zt(r, t) {
  let n = t.clone().reverse(), [s, l] = Pt(r, n, it, !0);
  return s;
}
function ke(r, t) {
  let [e, n] = Pt(r, t, bt, !0);
  return e;
}
function Ue(r, t) {
  let [e, n] = Pt(r, t, bt, !1), s = [];
  for (let o of e.faces)
    s = [...s, ...[...o.edges].map((a) => a.shape)];
  let l = [];
  for (let o of n.faces)
    l = [...l, ...[...o.edges].map((a) => a.shape)];
  return [s, l];
}
function Xt(r, t) {
  let [e, n] = Pt(r, t, it, !1), s = [];
  for (let l of e.faces)
    s = [...s, ...[...l.edges].map((o) => o.shape)];
  return s;
}
function Me(r, t) {
  let e = r.clone(), n = t.clone(), s = $e(e, n);
  It(s), pt(e, s.int_points1_sorted), pt(n, s.int_points2_sorted), re(s), It(s);
  let l = s.int_points1_sorted.map((a) => a.pt), o = s.int_points2_sorted.map((a) => a.pt);
  return [l, o];
}
function wn(r, t, e, n) {
  let s = xe(r, e.int_points1), l = xe(t, e.int_points2);
  for (Ee(s, t), Ee(l, r), Yt(e.int_points1), Yt(e.int_points2), jt(e.int_points1, t), jt(e.int_points2, r); yn(r, t, e.int_points1, e.int_points1_sorted, e.int_points2, e); )
    ;
  _n(e), Jt(r, n, e.int_points1_sorted, !0), Jt(t, n, e.int_points2_sorted, !1), we(r, s, n, !0), we(t, l, n, !1);
}
function vn(r, t, e, n) {
  In(r, t, n, e.int_points2), Sn(r, t, e), Kt(r, e.int_points1), Kt(t, e.int_points2), te(r, e.int_points1, e.int_points2), te(r, e.int_points2, e.int_points1);
}
function Pt(r, t, e, n) {
  let s = r.clone(), l = t.clone(), o = $e(s, l);
  return It(o), pt(s, o.int_points1_sorted), pt(l, o.int_points2_sorted), re(o), It(o), wn(s, l, o, e), n && vn(s, l, o, e), [s, l];
}
function $e(r, t) {
  let e = {
    int_points1: [],
    int_points2: []
  };
  for (let n of r.edges) {
    let s = t.edges.search(n.box);
    for (let l of s) {
      let o = n.shape.intersect(l.shape);
      for (let a of o)
        ct(n, a, e.int_points1), ct(l, a, e.int_points2);
    }
  }
  return e;
}
function xe(r, t) {
  let e = [];
  for (let n of r.faces)
    t.find((s) => s.face === n) || e.push(n);
  return e;
}
function Ee(r, t) {
  for (let e of r)
    e.first.bv = e.first.bvStart = e.first.bvEnd = void 0, e.first.setInclusion(t);
}
function yn(r, t, e, n, s, l) {
  let o, a, h, f = n.length, u = !1;
  for (let p = 0; p < f; p++) {
    let _ = n[p];
    _.face !== o && (a = p, o = _.face);
    let S = p, v = dt(n, p, o), E;
    S + v < f && n[S + v].face === o ? E = S + v : E = a;
    let y = dt(n, E, o);
    h = null;
    for (let g = E; g < E + y; g++) {
      let A = n[g];
      if (A.face === o && s[A.id].face === s[_.id].face) {
        h = A;
        break;
      }
    }
    if (h === null)
      continue;
    let x = _.edge_after, I = h.edge_before;
    if (x.bv === T && I.bv != T) {
      x.bv = I.bv;
      continue;
    }
    if (x.bv != T && I.bv === T) {
      I.bv = x.bv;
      continue;
    }
    if (x.bv === T && I.bv === T && x != I || x.bv === Q && I.bv === W || x.bv === W && I.bv === Q) {
      let g = x.next;
      for (; g != I; )
        g.bvStart = void 0, g.bvEnd = void 0, g.bv = void 0, g.setInclusion(t), g = g.next;
    }
    if (x.bv === T && I.bv === T && x != I) {
      let g = x.next, A;
      for (; g != I; ) {
        if (g.bv != T) {
          if (A === void 0)
            A = g.bv;
          else if (g.bv != A)
            throw Wt.UNRESOLVED_BOUNDARY_CONFLICT;
        }
        g = g.next;
      }
      A != null && (x.bv = A, I.bv = A);
      continue;
    }
    if (x.bv === Q && I.bv === W || x.bv === W && I.bv === Q) {
      let g = x;
      for (; g != I; ) {
        if (g.bvStart === x.bv && g.bvEnd === I.bv) {
          let [A, qt] = g.shape.distanceTo(t);
          if (A < 10 * i.DP_TOL) {
            ct(g, qt.ps, e);
            let J = e[e.length - 1];
            if (J.is_vertex & _e)
              J.edge_after = g, J.edge_before = g.prev, g.bvStart = T, g.bv = void 0, g.setInclusion(t);
            else if (J.is_vertex & me)
              J.edge_after = g.next, g.bvEnd = T, g.bv = void 0, g.setInclusion(t);
            else {
              let k = t.addVertex(J.pt, g);
              J.edge_before = k, J.edge_after = k.next, k.setInclusion(t), k.next.bvStart = T, k.next.bvEnd = void 0, k.next.bv = void 0, k.next.setInclusion(t);
            }
            let st = t.findEdgeByPoint(qt.pe);
            ct(st, qt.pe, s);
            let K = s[s.length - 1];
            if (K.is_vertex & _e)
              K.edge_after = st, K.edge_before = st.prev;
            else if (K.is_vertex & me)
              K.edge_after = st.next;
            else {
              let k = s.find((Ze) => Ze.edge_after === st), L = t.addVertex(K.pt, st);
              K.edge_before = L, K.edge_after = L.next, k && (k.edge_after = L), L.bvStart = void 0, L.bvEnd = T, L.bv = void 0, L.setInclusion(r), L.next.bvStart = T, L.next.bvEnd = void 0, L.next.bv = void 0, L.next.setInclusion(r);
            }
            It(l), u = !0;
            break;
          }
        }
        g = g.next;
      }
      if (u)
        break;
      throw Wt.UNRESOLVED_BOUNDARY_CONFLICT;
    }
  }
  return u;
}
function Jt(r, t, e, n) {
  if (!e)
    return;
  let s, l, o, a;
  for (let h = 0; h < e.length; h++) {
    if (o = e[h], o.face !== s && (l = h, s = o.face), s.isEmpty())
      continue;
    let f = h, u = dt(e, h, s), p;
    f + u < e.length && e[f + u].face === o.face ? p = f + u : p = l, a = e[p];
    let _ = p, S = dt(e, _, s), v = o.edge_after, E = a.edge_before;
    if (v.bv === Q && E.bv === Q && t === $t || v.bv === W && E.bv === W && t === bt || (v.bv === W || E.bv === W) && t === it && !n || (v.bv === Q || E.bv === Q) && t === it && n || v.bv === T && E.bv === T && v.overlap & mn && n || v.bv === T && E.bv === T && v.overlap & xn) {
      r.removeChain(s, v, E);
      for (let y = f; y < f + u; y++)
        e[y].edge_after = void 0;
      for (let y = _; y < _ + S; y++)
        e[y].edge_before = void 0;
    }
    h += u - 1;
  }
}
function In(r, t, e, n) {
  for (let s of t.faces) {
    for (let l of s)
      r.edges.add(l);
    n.find((l) => l.face === s) === void 0 && r.addFace(s.first, s.last);
  }
}
function Sn(r, t, e) {
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
function Kt(r, t) {
  for (let e of t)
    r.faces.delete(e.face), e.face = void 0, e.edge_before && (e.edge_before.face = void 0), e.edge_after && (e.edge_after.face = void 0);
}
function te(r, t, e) {
  for (let n of t) {
    if (n.edge_before === void 0 || n.edge_after === void 0 || n.face || n.edge_after.face || n.edge_before.face)
      continue;
    let s = n.edge_after, l = n.edge_before;
    ie.testInfiniteLoop(s);
    let o = r.addFace(s, l);
    for (let a of t)
      a.edge_before && a.edge_after && a.edge_before.face === o && a.edge_after.face === o && (a.face = o);
    for (let a of e)
      a.edge_before && a.edge_after && a.edge_before.face === o && a.edge_after.face === o && (a.face = o);
  }
}
function we(r, t, e, n) {
  for (let s of t) {
    let l = s.first.bv;
    (e === $t && l === Q || e === it && l === Q && n || e === it && l === W && !n || e === bt && l === W) && r.deleteFace(s);
  }
}
var Tn = /* @__PURE__ */ Object.freeze({
  BOOLEAN_UNION: $t,
  BOOLEAN_INTERSECT: bt,
  BOOLEAN_SUBTRACT: it,
  unify: En,
  subtract: Zt,
  intersect: ke,
  innerClip: Ue,
  outerClip: Xt,
  calculateIntersections: Me,
  removeNotRelevantChains: Jt,
  removeOldFaces: Kt,
  restoreFaces: te
});
const bn = RegExp("T.F..FFF.|T.F...F.."), Pn = RegExp("T........|.T.......|...T.....|....T...."), An = RegExp("FT.......|F..T.....|F...T...."), Ln = RegExp("T.F..F..."), On = RegExp("T.F..F...|.TF..F...|..FT.F...|..F.TF...");
class gt {
  constructor() {
    this.m = new Array(9).fill(void 0);
  }
  get I2I() {
    return this.m[0];
  }
  set I2I(t) {
    this.m[0] = t;
  }
  get I2B() {
    return this.m[1];
  }
  set I2B(t) {
    this.m[1] = t;
  }
  get I2E() {
    return this.m[2];
  }
  set I2E(t) {
    this.m[2] = t;
  }
  get B2I() {
    return this.m[3];
  }
  set B2I(t) {
    this.m[3] = t;
  }
  get B2B() {
    return this.m[4];
  }
  set B2B(t) {
    this.m[4] = t;
  }
  get B2E() {
    return this.m[5];
  }
  set B2E(t) {
    this.m[5] = t;
  }
  get E2I() {
    return this.m[6];
  }
  set E2I(t) {
    this.m[6] = t;
  }
  get E2B() {
    return this.m[7];
  }
  set E2B(t) {
    this.m[7] = t;
  }
  get E2E() {
    return this.m[8];
  }
  set E2E(t) {
    this.m[8] = t;
  }
  toString() {
    return this.m.map((t) => t instanceof Array && t.length > 0 ? "T" : t instanceof Array && t.length === 0 ? "F" : "*").join("");
  }
  equal() {
    return bn.test(this.toString());
  }
  intersect() {
    return Pn.test(this.toString());
  }
  touch() {
    return An.test(this.toString());
  }
  inside() {
    return Ln.test(this.toString());
  }
  covered() {
    return On.test(this.toString());
  }
}
function Bt(r, t) {
  let e = [], [n, s, l] = r.standard, [o, a, h] = t.standard, f = n * a - s * o, u = l * a - s * h, p = n * h - l * o;
  if (!i.Utils.EQ_0(f)) {
    let _, S;
    s === 0 ? (_ = l / n, S = p / f) : a === 0 ? (_ = h / o, S = p / f) : n === 0 ? (_ = u / f, S = l / s) : o === 0 ? (_ = u / f, S = h / a) : (_ = u / f, S = p / f), e.push(new i.Point(_, S));
  }
  return e;
}
function _t(r, t) {
  let e = [], n = t.pc.projectionOn(r), s = t.pc.distanceTo(n)[0];
  if (i.Utils.EQ(s, t.r))
    e.push(n);
  else if (i.Utils.LT(s, t.r)) {
    let l = Math.sqrt(t.r * t.r - s * s), o, a;
    o = r.norm.rotate90CCW().multiply(l), a = n.translate(o), e.push(a), o = r.norm.rotate90CW().multiply(l), a = n.translate(o), e.push(a);
  }
  return e;
}
function St(r, t) {
  let e = [];
  for (let n of t.toSegments()) {
    let s = Ft(n, r);
    for (let l of s)
      He(l, e) || e.push(l);
  }
  return e;
}
function se(r, t) {
  let e = [];
  if (St(r, t.box).length === 0)
    return e;
  let n = new i.Circle(t.pc, t.r), s = _t(r, n);
  for (let l of s)
    l.on(t) && e.push(l);
  return e;
}
function Ft(r, t) {
  let e = [];
  if (r.ps.on(t) && e.push(r.ps), r.pe.on(t) && !r.isZeroLength() && e.push(r.pe), e.length > 0 || r.isZeroLength() || r.ps.leftTo(t) && r.pe.leftTo(t) || !r.ps.leftTo(t) && !r.pe.leftTo(t))
    return e;
  let n = new i.Line(r.ps, r.pe);
  return Bt(n, t);
}
function At(r, t) {
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
    let l = Bt(n, s);
    l.length > 0 && l[0].on(r) && l[0].on(t) && e.push(l[0]);
  }
  return e;
}
function Vt(r, t) {
  let e = [];
  if (r.box.not_intersect(t.box))
    return e;
  if (r.isZeroLength()) {
    let [l, o] = r.ps.distanceTo(t.pc);
    return i.Utils.EQ(l, t.r) && e.push(r.ps), e;
  }
  let n = new i.Line(r.ps, r.pe), s = _t(n, t);
  for (let l of s)
    l.on(r) && e.push(l);
  return e;
}
function rt(r, t) {
  let e = [];
  if (r.box.not_intersect(t.box))
    return e;
  if (r.isZeroLength())
    return r.ps.on(t) && e.push(r.ps), e;
  let n = new i.Line(r.ps, r.pe), s = new i.Circle(t.pc, t.r), l = _t(n, s);
  for (let o of l)
    o.on(r) && o.on(t) && e.push(o);
  return e;
}
function Nn(r, t) {
  let e = [];
  for (let n of t.toSegments()) {
    let s = At(n, r);
    for (let l of s)
      e.push(l);
  }
  return e;
}
function Be(r, t) {
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
  let h = s * s / (2 * o) - l * l / (2 * o) + o / 2, f = r.pc.translate(h * n.x, h * n.y), u = Math.sqrt(s * s - h * h);
  return a = f.translate(n.rotate90CCW().multiply(u)), e.push(a), a = f.translate(n.rotate90CW().multiply(u)), e.push(a), e;
}
function Cn(r, t) {
  let e = [];
  for (let n of t.toSegments()) {
    let s = Vt(n, r);
    for (let l of s)
      e.push(l);
  }
  return e;
}
function oe(r, t) {
  var e = [];
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
function le(r, t) {
  let e = [];
  if (r.box.not_intersect(t.box))
    return e;
  if (t.pc.equalTo(r.pc) && i.Utils.EQ(t.r, r.r))
    return e.push(r.start), e.push(r.end), e;
  let n = t, s = new i.Circle(r.pc, r.r), l = Be(n, s);
  for (let o of l)
    o.on(r) && e.push(o);
  return e;
}
function Rn(r, t) {
  let e = [];
  for (let n of t.toSegments()) {
    let s = rt(n, r);
    for (let l of s)
      e.push(l);
  }
  return e;
}
function kn(r, t) {
  return r.isSegment() ? At(r.shape, t) : rt(t, r.shape);
}
function Un(r, t) {
  return r.isSegment() ? rt(r.shape, t) : oe(r.shape, t);
}
function Fe(r, t) {
  return r.isSegment() ? Ft(r.shape, t) : se(t, r.shape);
}
function Mn(r, t) {
  return r.isSegment() ? Vt(r.shape, t) : le(r.shape, t);
}
function ae(r, t) {
  let e = [];
  for (let n of t.edges)
    for (let s of kn(n, r))
      e.push(s);
  return e;
}
function fe(r, t) {
  let e = [];
  for (let n of t.edges)
    for (let s of Un(n, r))
      e.push(s);
  return e;
}
function Ht(r, t) {
  let e = [];
  if (t.isEmpty())
    return e;
  for (let n of t.edges)
    for (let s of Fe(n, r))
      He(s, e) || e.push(s);
  return r.sortPoints(e);
}
function Ve(r, t) {
  let e = [];
  if (t.isEmpty())
    return e;
  for (let n of t.edges)
    for (let s of Mn(n, r))
      e.push(s);
  return e;
}
function $n(r, t) {
  const e = r.shape, n = t.shape;
  return r.isSegment() ? t.isSegment() ? At(e, n) : rt(e, n) : t.isSegment() ? rt(n, e) : oe(e, n);
}
function Bn(r, t) {
  let e = [];
  if (t.isEmpty() || r.shape.box.not_intersect(t.box))
    return e;
  let n = t.edges.search(r.shape.box);
  for (let s of n)
    for (let l of $n(r, s))
      e.push(l);
  return e;
}
function Fn(r, t) {
  let e = [];
  if (r.isEmpty() || t.isEmpty() || r.box.not_intersect(t.box))
    return e;
  for (let n of r.edges)
    for (let s of Bn(n, t))
      e.push(s);
  return e;
}
function Vn(r, t) {
  return r instanceof i.Line ? Ht(r, t) : r instanceof i.Segment ? ae(r, t) : r instanceof i.Arc ? fe(r, t) : [];
}
function He(r, t) {
  return t.some((e) => e.equalTo(r));
}
class R extends ie {
  constructor(...t) {
    if (super(), t.length !== 0 && t.length == 1 && t[0] instanceof Array) {
      let e = t[0];
      if (e.length == 0)
        return;
      e.every((n) => n instanceof i.Segment || n instanceof i.Arc || n instanceof i.Ray || n instanceof i.Line);
      for (let n of e) {
        let s = new i.Edge(n);
        this.append(s);
      }
    }
  }
  get edges() {
    return [...this];
  }
  get box() {
    return this.edges.reduce((t, e) => t = t.merge(e.box), new i.Box());
  }
  get vertices() {
    let t = this.edges.map((e) => e.start);
    return t.push(this.last.end), t;
  }
  clone() {
    return new R(this.toShapes());
  }
  addVertex(t, e) {
    let n = e.shape.split(t);
    if (n[0] === null)
      return e.prev;
    if (n[1] === null)
      return e;
    let s = new i.Edge(n[0]), l = e.prev;
    return this.insert(s, l), e.shape = n[1], s;
  }
  split(t) {
    for (let e of t) {
      let n = this.findEdgeByPoint(e);
      this.addVertex(e, n);
    }
    return this;
  }
  findEdgeByPoint(t) {
    let e;
    for (let n of this)
      if (n.shape.contains(t)) {
        e = n;
        break;
      }
    return e;
  }
  translate(t) {
    return new R(this.edges.map((e) => e.shape.translate(t)));
  }
  rotate(t = 0, e = new i.Point()) {
    return new R(this.edges.map((n) => n.shape.rotate(t, e)));
  }
  transform(t = new i.Matrix()) {
    return new R(this.edges.map((e) => e.shape.transform(t)));
  }
  toShapes() {
    return this.edges.map((t) => t.shape.clone());
  }
  toJSON() {
    return this.edges.map((t) => t.toJSON());
  }
  svg(t = {}) {
    let { stroke: e, strokeWidth: n, fill: s, fillRule: l, fillOpacity: o, id: a, className: h } = t, f = a && a.length > 0 ? `id="${a}"` : "", u = h && h.length > 0 ? `class="${h}"` : "", p = `
<path stroke="${e || "black"}" stroke-width="${n || 1}" fill="${s || "none"}" fill-opacity="${o || 1}" ${f} ${u} d="`;
    p += `
M${this.first.start.x},${this.first.start.y}`;
    for (let _ of this)
      p += _.svg();
    return p += `" >
</path>`, p;
  }
}
i.Multiline = R;
const Hn = (...r) => new i.Multiline(...r);
i.multiline = Hn;
function wt(r, t) {
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
  if (o.length == 0)
    return i.OUTSIDE;
  for (let f of o)
    if (f.shape.contains(t))
      return i.BOUNDARY;
  let a = [];
  for (let f of o)
    for (let u of n.intersect(f.shape)) {
      if (u.equalTo(t))
        return i.BOUNDARY;
      a.push({
        pt: u,
        edge: f
      });
    }
  a.sort((f, u) => Re(f.pt.x, u.pt.x) ? -1 : Ce(f.pt.x, u.pt.x) ? 1 : 0);
  let h = 0;
  for (let f = 0; f < a.length; f++) {
    let u = a[f];
    if (u.pt.equalTo(u.edge.shape.start)) {
      if (f > 0 && u.pt.equalTo(a[f - 1].pt) && u.edge.prev === a[f - 1].edge)
        continue;
      let p = u.edge.prev;
      for (; Qt(p.length); )
        p = p.prev;
      let _ = p.shape.tangentInEnd(), S = u.pt.translate(_), v = u.edge.shape.tangentInStart(), E = u.pt.translate(v), y = S.leftTo(s), x = E.leftTo(s);
      (y && !x || !y && x) && h++;
    } else if (u.pt.equalTo(u.edge.shape.end)) {
      if (f > 0 && u.pt.equalTo(a[f - 1].pt) && u.edge.next === a[f - 1].edge)
        continue;
      let p = u.edge.next;
      for (; Qt(p.length); )
        p = p.next;
      let _ = p.shape.tangentInStart(), S = u.pt.translate(_), v = u.edge.shape.tangentInEnd(), E = u.pt.translate(v), y = S.leftTo(s), x = E.leftTo(s);
      (y && !x || !y && x) && h++;
    } else if (u.edge.shape instanceof i.Segment)
      h++;
    else {
      let p = u.edge.shape.box;
      nt(u.pt.y, p.ymin) || nt(u.pt.y, p.ymax) || h++;
    }
  }
  return e = h % 2 == 1 ? xt : Le, e;
}
function qn(r, t) {
  return mt(r, t).equal();
}
function qe(r, t) {
  return mt(r, t).intersect();
}
function Gn(r, t) {
  return mt(r, t).touch();
}
function zn(r, t) {
  return !qe(r, t);
}
function Ge(r, t) {
  return mt(r, t).inside();
}
function ze(r, t) {
  return mt(r, t).covered();
}
function Dn(r, t) {
  return Ge(t, r);
}
function De(r, t) {
  return ze(t, r);
}
function mt(r, t) {
  if (r instanceof i.Line && t instanceof i.Line)
    return Qn(r, t);
  if (r instanceof i.Line && t instanceof i.Circle)
    return Wn(r, t);
  if (r instanceof i.Line && t instanceof i.Box)
    return Yn(r, t);
  if (r instanceof i.Line && t instanceof i.Polygon)
    return jn(r, t);
  if ((r instanceof i.Segment || r instanceof i.Arc) && t instanceof i.Polygon)
    return ve(r, t);
  if ((r instanceof i.Segment || r instanceof i.Arc) && (t instanceof i.Circle || t instanceof i.Box))
    return ve(r, new i.Polygon(t));
  if (r instanceof i.Polygon && t instanceof i.Polygon)
    return Lt(r, t);
  if ((r instanceof i.Circle || r instanceof i.Box) && (t instanceof i.Circle || t instanceof i.Box))
    return Lt(new i.Polygon(r), new i.Polygon(t));
  if ((r instanceof i.Circle || r instanceof i.Box) && t instanceof i.Polygon)
    return Lt(new i.Polygon(r), t);
  if (r instanceof i.Polygon && (t instanceof i.Circle || t instanceof i.Box))
    return Lt(r, new i.Polygon(t));
}
function Qn(r, t) {
  let e = new gt(), n = Bt(r, t);
  return n.length === 0 ? r.contains(t.pt) && t.contains(r.pt) ? (e.I2I = [r], e.I2E = [], e.E2I = []) : (e.I2I = [], e.I2E = [r], e.E2I = [t]) : (e.I2I = n, e.I2E = r.split(n), e.E2I = t.split(n)), e;
}
function Wn(r, t) {
  let e = new gt(), n = _t(r, t);
  if (n.length === 0)
    e.I2I = [], e.I2B = [], e.I2E = [r], e.E2I = [t];
  else if (n.length === 1)
    e.I2I = [], e.I2B = n, e.I2E = r.split(n), e.E2I = [t];
  else {
    let s = new R([r]), l = r.sortPoints(n);
    s.split(l);
    let o = s.toShapes();
    e.I2I = [o[1]], e.I2B = l, e.I2E = [o[0], o[2]], e.E2I = new i.Polygon([t.toArc()]).cut(s);
  }
  return e;
}
function Yn(r, t) {
  let e = new gt(), n = St(r, t);
  if (n.length === 0)
    e.I2I = [], e.I2B = [], e.I2E = [r], e.E2I = [t];
  else if (n.length === 1)
    e.I2I = [], e.I2B = n, e.I2E = r.split(n), e.E2I = [t];
  else {
    let s = new R([r]), l = r.sortPoints(n);
    s.split(l);
    let o = s.toShapes();
    t.toSegments().some((a) => a.contains(n[0]) && a.contains(n[1])) ? (e.I2I = [], e.I2B = [o[1]], e.I2E = [o[0], o[2]], e.E2I = [t]) : (e.I2I = [o[1]], e.I2B = l, e.I2E = [o[0], o[2]], e.E2I = new i.Polygon(t.toSegments()).cut(s));
  }
  return e;
}
function jn(r, t) {
  let e = new gt(), n = Ht(r, t), s = new R([r]), l = n.length > 0 ? n.slice() : r.sortPoints(n);
  return s.split(l), [...s].forEach((o) => o.setInclusion(t)), e.I2I = [...s].filter((o) => o.bv === i.INSIDE).map((o) => o.shape), e.I2B = [...s].slice(1).map((o) => o.bv === i.BOUNDARY ? o.shape : o.shape.start), e.I2E = [...s].filter((o) => o.bv === i.OUTSIDE).map((o) => o.shape), e.E2I = t.cut(s), e;
}
function ve(r, t) {
  let e = new gt(), n = Vn(r, t), s = n.length > 0 ? n.slice() : r.sortPoints(n), l = new R([r]);
  l.split(s), [...l].forEach((o) => o.setInclusion(t)), e.I2I = [...l].filter((o) => o.bv === i.INSIDE).map((o) => o.shape), e.I2B = [...l].slice(1).map((o) => o.bv === i.BOUNDARY ? o.shape : o.shape.start), e.I2E = [...l].filter((o) => o.bv === i.OUTSIDE).map((o) => o.shape), e.B2I = [], e.B2B = [], e.B2E = [];
  for (let o of [r.start, r.end])
    switch (wt(t, o)) {
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
function Lt(r, t) {
  let e = new gt(), [n, s] = Me(r, t), l = ke(r, t), o = Zt(r, t), a = Zt(t, r), [h, f] = Ue(r, t), u = Xt(r, t), p = Xt(t, r);
  return e.I2I = l.isEmpty() ? [] : [l], e.I2B = f, e.I2E = o.isEmpty() ? [] : [o], e.B2I = h, e.B2B = n, e.B2E = u, e.E2I = a.isEmpty() ? [] : [a], e.E2B = p, e;
}
var Zn = /* @__PURE__ */ Object.freeze({
  equal: qn,
  intersect: qe,
  touch: Gn,
  disjoint: zn,
  inside: Ge,
  covered: ze,
  contain: Dn,
  cover: De,
  relate: mt
});
let lt = class {
  constructor(t = 1, e = 0, n = 0, s = 1, l = 0, o = 0) {
    this.a = t, this.b = e, this.c = n, this.d = s, this.tx = l, this.ty = o;
  }
  clone() {
    return new lt(this.a, this.b, this.c, this.d, this.tx, this.ty);
  }
  transform(t) {
    return [
      t[0] * this.a + t[1] * this.c + this.tx,
      t[0] * this.b + t[1] * this.d + this.ty
    ];
  }
  multiply(t) {
    return new lt(
      this.a * t.a + this.c * t.b,
      this.b * t.a + this.d * t.b,
      this.a * t.c + this.c * t.d,
      this.b * t.c + this.d * t.d,
      this.a * t.tx + this.c * t.ty + this.tx,
      this.b * t.tx + this.d * t.ty + this.ty
    );
  }
  translate(...t) {
    let e, n;
    if (t.length == 1 && t[0] instanceof i.Vector)
      e = t[0].x, n = t[0].y;
    else if (t.length == 2 && typeof t[0] == "number" && typeof t[1] == "number")
      e = t[0], n = t[1];
    else
      throw i.Errors.ILLEGAL_PARAMETERS;
    return this.multiply(new lt(1, 0, 0, 1, e, n));
  }
  rotate(t) {
    let e = Math.cos(t), n = Math.sin(t);
    return this.multiply(new lt(e, n, -n, e, 0, 0));
  }
  scale(t, e) {
    return this.multiply(new lt(t, 0, 0, e, 0, 0));
  }
  equalTo(t) {
    return !(!i.Utils.EQ(this.tx, t.tx) || !i.Utils.EQ(this.ty, t.ty) || !i.Utils.EQ(this.a, t.a) || !i.Utils.EQ(this.b, t.b) || !i.Utils.EQ(this.c, t.c) || !i.Utils.EQ(this.d, t.d));
  }
};
i.Matrix = lt;
const Xn = (...r) => new i.Matrix(...r);
i.matrix = Xn;
const Jn = class ee {
  constructor(t, e) {
    this.low = t, this.high = e;
  }
  clone() {
    return new ee(this.low, this.high);
  }
  get max() {
    return this.clone();
  }
  less_than(t) {
    return this.low < t.low || this.low == t.low && this.high < t.high;
  }
  equal_to(t) {
    return this.low == t.low && this.high == t.high;
  }
  intersect(t) {
    return !this.not_intersect(t);
  }
  not_intersect(t) {
    return this.high < t.low || t.high < this.low;
  }
  merge(t) {
    return new ee(
      this.low === void 0 ? t.low : Math.min(this.low, t.low),
      this.high === void 0 ? t.high : Math.max(this.high, t.high)
    );
  }
  output() {
    return [this.low, this.high];
  }
  static comparable_max(t, e) {
    return t.merge(e);
  }
  static comparable_less_than(t, e) {
    return t < e;
  }
}, b = 0, m = 1;
class ot {
  constructor(t = void 0, e = void 0, n = null, s = null, l = null, o = m) {
    this.left = n, this.right = s, this.parent = l, this.color = o, this.item = { key: t, value: e }, t && t instanceof Array && t.length == 2 && !Number.isNaN(t[0]) && !Number.isNaN(t[1]) && (this.item.key = new Jn(Math.min(t[0], t[1]), Math.max(t[0], t[1]))), this.max = this.item.key ? this.item.key.max : void 0;
  }
  isNil() {
    return this.item.key === void 0 && this.item.value === void 0 && this.left === null && this.right === null && this.color === m;
  }
  less_than(t) {
    if (this.item.value === this.item.key && t.item.value === t.item.key)
      return this.item.key.less_than(t.item.key);
    {
      let e = this.item.value && t.item.value && this.item.value.less_than ? this.item.value.less_than(t.item.value) : this.item.value < t.item.value;
      return this.item.key.less_than(t.item.key) || this.item.key.equal_to(t.item.key) && e;
    }
  }
  equal_to(t) {
    if (this.item.value === this.item.key && t.item.value === t.item.key)
      return this.item.key.equal_to(t.item.key);
    {
      let e = this.item.value && t.item.value && this.item.value.equal_to ? this.item.value.equal_to(t.item.value) : this.item.value == t.item.value;
      return this.item.key.equal_to(t.item.key) && e;
    }
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
  not_intersect_left_subtree(t) {
    const e = this.item.key.constructor.comparable_less_than;
    let n = this.left.max.high !== void 0 ? this.left.max.high : this.left.max;
    return e(n, t.item.key.low);
  }
  not_intersect_right_subtree(t) {
    const e = this.item.key.constructor.comparable_less_than;
    let n = this.right.max.low !== void 0 ? this.right.max.low : this.right.item.key.low;
    return e(t.item.key.high, n);
  }
}
class Tt {
  constructor() {
    this.root = null, this.nil_node = new ot();
  }
  get size() {
    let t = 0;
    return this.tree_walk(this.root, () => t++), t;
  }
  get keys() {
    let t = [];
    return this.tree_walk(this.root, (e) => t.push(
      e.item.key.output ? e.item.key.output() : e.item.key
    )), t;
  }
  get values() {
    let t = [];
    return this.tree_walk(this.root, (e) => t.push(e.item.value)), t;
  }
  get items() {
    let t = [];
    return this.tree_walk(this.root, (e) => t.push({
      key: e.item.key.output ? e.item.key.output() : e.item.key,
      value: e.item.value
    })), t;
  }
  isEmpty() {
    return this.root == null || this.root == this.nil_node;
  }
  clear() {
    this.root = null;
  }
  insert(t, e = t) {
    if (t === void 0)
      return;
    let n = new ot(t, e, this.nil_node, this.nil_node, null, b);
    return this.tree_insert(n), this.recalc_max(n), n;
  }
  exist(t, e = t) {
    let n = new ot(t, e);
    return !!this.tree_search(this.root, n);
  }
  remove(t, e = t) {
    let n = new ot(t, e), s = this.tree_search(this.root, n);
    return s && this.tree_delete(s), s;
  }
  search(t, e = (n, s) => n === s ? s.output() : n) {
    let n = new ot(t), s = [];
    return this.tree_search_interval(this.root, n, s), s.map((l) => e(l.item.value, l.item.key));
  }
  intersect_any(t) {
    let e = new ot(t);
    return this.tree_find_any_interval(this.root, e);
  }
  forEach(t) {
    this.tree_walk(this.root, (e) => t(e.item.key, e.item.value));
  }
  map(t) {
    const e = new Tt();
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
  insert_fixup(t) {
    let e, n;
    for (e = t; e != this.root && e.parent.color == b; )
      e.parent == e.parent.parent.left ? (n = e.parent.parent.right, n.color == b ? (e.parent.color = m, n.color = m, e.parent.parent.color = b, e = e.parent.parent) : (e == e.parent.right && (e = e.parent, this.rotate_left(e)), e.parent.color = m, e.parent.parent.color = b, this.rotate_right(e.parent.parent))) : (n = e.parent.parent.left, n.color == b ? (e.parent.color = m, n.color = m, e.parent.parent.color = b, e = e.parent.parent) : (e == e.parent.left && (e = e.parent, this.rotate_right(e)), e.parent.color = m, e.parent.parent.color = b, this.rotate_left(e.parent.parent)));
    this.root.color = m;
  }
  tree_delete(t) {
    let e, n;
    t.left == this.nil_node || t.right == this.nil_node ? e = t : e = this.tree_successor(t), e.left != this.nil_node ? n = e.left : n = e.right, n.parent = e.parent, e == this.root ? this.root = n : (e == e.parent.left ? e.parent.left = n : e.parent.right = n, e.parent.update_max()), this.recalc_max(n), e != t && (t.copy_data(e), t.update_max(), this.recalc_max(t)), e.color == m && this.delete_fixup(n);
  }
  delete_fixup(t) {
    let e = t, n;
    for (; e != this.root && e.parent != null && e.color == m; )
      e == e.parent.left ? (n = e.parent.right, n.color == b && (n.color = m, e.parent.color = b, this.rotate_left(e.parent), n = e.parent.right), n.left.color == m && n.right.color == m ? (n.color = b, e = e.parent) : (n.right.color == m && (n.color = b, n.left.color = m, this.rotate_right(n), n = e.parent.right), n.color = e.parent.color, e.parent.color = m, n.right.color = m, this.rotate_left(e.parent), e = this.root)) : (n = e.parent.left, n.color == b && (n.color = m, e.parent.color = b, this.rotate_right(e.parent), n = e.parent.left), n.left.color == m && n.right.color == m ? (n.color = b, e = e.parent) : (n.left.color == m && (n.color = b, n.right.color = m, this.rotate_left(n), n = e.parent.left), n.color = e.parent.color, e.parent.color = m, n.left.color = m, this.rotate_right(e.parent), e = this.root));
    e.color = m;
  }
  tree_search(t, e) {
    if (!(t == null || t == this.nil_node))
      return e.equal_to(t) ? t : e.less_than(t) ? this.tree_search(t.left, e) : this.tree_search(t.right, e);
  }
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
  testRedBlackProperty() {
    let t = !0;
    return this.tree_walk(this.root, function(e) {
      e.color == b && (e.left.color == m && e.right.color == m || (t = !1));
    }), t;
  }
  testBlackHeightProperty(t) {
    let e = 0, n = 0, s = 0;
    if (t.color == m && e++, t.left != this.nil_node ? n = this.testBlackHeightProperty(t.left) : n = 1, t.right != this.nil_node ? s = this.testBlackHeightProperty(t.right) : s = 1, n != s)
      throw new Error("Red-black height property violated");
    return e += n, e;
  }
}
class Kn extends Set {
  constructor(t) {
    super(t), this.index = new Tt(), this.forEach((e) => this.index.insert(e));
  }
  add(t) {
    let e = this.size;
    return super.add(t), this.size > e && this.index.insert(t.box, t), this;
  }
  delete(t) {
    let e = super.delete(t);
    return e && this.index.remove(t.box, t), e;
  }
  clear() {
    super.clear(), this.index = new Tt();
  }
  search(t) {
    return this.index.search(t);
  }
  hit(t) {
    let e = new i.Box(t.x - 1, t.y - 1, t.x + 1, t.y + 1);
    return this.index.search(e).filter((s) => t.on(s));
  }
  svg() {
    return [...this].reduce((e, n) => e + n.svg(), "");
  }
}
i.PlanarSet = Kn;
class he {
  constructor(...t) {
    if (this.x = 0, this.y = 0, t.length !== 0) {
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
      throw i.Errors.ILLEGAL_PARAMETERS;
    }
  }
  get box() {
    return new i.Box(this.x, this.y, this.x, this.y);
  }
  clone() {
    return new i.Point(this.x, this.y);
  }
  get vertices() {
    return [this.clone()];
  }
  equalTo(t) {
    return i.Utils.EQ(this.x, t.x) && i.Utils.EQ(this.y, t.y);
  }
  lessThan(t) {
    return !!(i.Utils.LT(this.y, t.y) || i.Utils.EQ(this.y, t.y) && i.Utils.LT(this.x, t.x));
  }
  rotate(t, e = { x: 0, y: 0 }) {
    var n = e.x + (this.x - e.x) * Math.cos(t) - (this.y - e.y) * Math.sin(t), s = e.y + (this.x - e.x) * Math.sin(t) + (this.y - e.y) * Math.cos(t);
    return new i.Point(n, s);
  }
  translate(...t) {
    if (t.length == 1 && (t[0] instanceof i.Vector || !isNaN(t[0].x) && !isNaN(t[0].y)))
      return new i.Point(this.x + t[0].x, this.y + t[0].y);
    if (t.length == 2 && typeof t[0] == "number" && typeof t[1] == "number")
      return new i.Point(this.x + t[0], this.y + t[1]);
    throw i.Errors.ILLEGAL_PARAMETERS;
  }
  transform(t) {
    return new i.Point(t.transform([this.x, this.y]));
  }
  projectionOn(t) {
    if (this.equalTo(t.pt))
      return this.clone();
    let e = new i.Vector(this, t.pt);
    if (i.Utils.EQ_0(e.cross(t.norm)))
      return t.pt.clone();
    let n = e.dot(t.norm), s = t.norm.multiply(n);
    return this.translate(s);
  }
  leftTo(t) {
    let e = new i.Vector(t.pt, this);
    return i.Utils.GT(e.dot(t.norm), 0);
  }
  distanceTo(t) {
    if (t instanceof he) {
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
  }
  on(t) {
    if (t instanceof i.Point)
      return this.equalTo(t);
    if (t instanceof i.Line)
      return t.contains(this);
    if (t instanceof i.Circle)
      return t.contains(this);
    if (t instanceof i.Segment)
      return t.contains(this);
    if (t instanceof i.Arc)
      return t.contains(this);
    if (t instanceof i.Polygon)
      return t.contains(this);
  }
  toJSON() {
    return Object.assign({}, this, { name: "point" });
  }
  svg(t = {}) {
    let { r: e, stroke: n, strokeWidth: s, fill: l, id: o, className: a } = t, h = o && o.length > 0 ? `id="${o}"` : "", f = a && a.length > 0 ? `class="${a}"` : "";
    return `
<circle cx="${this.x}" cy="${this.y}" r="${e || 3}" stroke="${n || "black"}" stroke-width="${s || 1}" fill="${l || "red"}" ${h} ${f} />`;
  }
}
i.Point = he;
const ti = (...r) => new i.Point(...r);
i.point = ti;
class ei {
  constructor(...t) {
    if (this.x = 0, this.y = 0, t.length !== 0) {
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
      throw i.Errors.ILLEGAL_PARAMETERS;
    }
  }
  clone() {
    return new i.Vector(this.x, this.y);
  }
  get slope() {
    let t = Math.atan2(this.y, this.x);
    return t < 0 && (t = 2 * Math.PI + t), t;
  }
  get length() {
    return Math.sqrt(this.dot(this));
  }
  equalTo(t) {
    return i.Utils.EQ(this.x, t.x) && i.Utils.EQ(this.y, t.y);
  }
  multiply(t) {
    return new i.Vector(t * this.x, t * this.y);
  }
  dot(t) {
    return this.x * t.x + this.y * t.y;
  }
  cross(t) {
    return this.x * t.y - this.y * t.x;
  }
  normalize() {
    if (!i.Utils.EQ_0(this.length))
      return new i.Vector(this.x / this.length, this.y / this.length);
    throw i.Errors.ZERO_DIVISION;
  }
  rotate(t) {
    let n = new i.Point(this.x, this.y).rotate(t);
    return new i.Vector(n.x, n.y);
  }
  rotate90CCW() {
    return new i.Vector(-this.y, this.x);
  }
  rotate90CW() {
    return new i.Vector(this.y, -this.x);
  }
  invert() {
    return new i.Vector(-this.x, -this.y);
  }
  add(t) {
    return new i.Vector(this.x + t.x, this.y + t.y);
  }
  subtract(t) {
    return new i.Vector(this.x - t.x, this.y - t.y);
  }
  angleTo(t) {
    let e = this.normalize(), n = t.normalize(), s = Math.atan2(e.cross(n), e.dot(n));
    return s < 0 && (s += 2 * Math.PI), s;
  }
  projectionOn(t) {
    let e = t.normalize(), n = this.dot(e);
    return e.multiply(n);
  }
  toJSON() {
    return Object.assign({}, this, { name: "vector" });
  }
}
i.Vector = ei;
const ni = (...r) => new i.Vector(...r);
i.vector = ni;
class vt {
  constructor(...t) {
    if (this.ps = new i.Point(), this.pe = new i.Point(), t.length !== 0) {
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
      throw i.Errors.ILLEGAL_PARAMETERS;
    }
  }
  clone() {
    return new i.Segment(this.start, this.end);
  }
  get start() {
    return this.ps;
  }
  get end() {
    return this.pe;
  }
  get vertices() {
    return [this.ps.clone(), this.pe.clone()];
  }
  get length() {
    return this.start.distanceTo(this.end)[0];
  }
  get slope() {
    return new i.Vector(this.start, this.end).slope;
  }
  get box() {
    return new i.Box(
      Math.min(this.start.x, this.end.x),
      Math.min(this.start.y, this.end.y),
      Math.max(this.start.x, this.end.x),
      Math.max(this.start.y, this.end.y)
    );
  }
  equalTo(t) {
    return this.ps.equalTo(t.ps) && this.pe.equalTo(t.pe);
  }
  contains(t) {
    return i.Utils.EQ_0(this.distanceToPoint(t));
  }
  intersect(t) {
    if (t instanceof i.Point)
      return this.contains(t) ? [t] : [];
    if (t instanceof i.Line)
      return Ft(this, t);
    if (t instanceof i.Segment)
      return At(this, t);
    if (t instanceof i.Circle)
      return Vt(this, t);
    if (t instanceof i.Box)
      return Nn(this, t);
    if (t instanceof i.Arc)
      return rt(this, t);
    if (t instanceof i.Polygon)
      return ae(this, t);
  }
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
  }
  tangentInStart() {
    return new i.Vector(this.start, this.end).normalize();
  }
  tangentInEnd() {
    return new i.Vector(this.end, this.start).normalize();
  }
  reverse() {
    return new vt(this.end, this.start);
  }
  split(t) {
    return this.start.equalTo(t) ? [null, this.clone()] : this.end.equalTo(t) ? [this.clone(), null] : [
      new i.Segment(this.start, t),
      new i.Segment(t, this.end)
    ];
  }
  middle() {
    return new i.Point((this.start.x + this.end.x) / 2, (this.start.y + this.end.y) / 2);
  }
  pointAtLength(t) {
    if (t > this.length || t < 0)
      return null;
    if (t == 0)
      return this.start;
    if (t == this.length)
      return this.end;
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
  translate(...t) {
    return new vt(this.ps.translate(...t), this.pe.translate(...t));
  }
  rotate(t = 0, e = new i.Point()) {
    let n = new i.Matrix();
    return n = n.translate(e.x, e.y).rotate(t).translate(-e.x, -e.y), this.transform(n);
  }
  transform(t = new i.Matrix()) {
    return new vt(this.ps.transform(t), this.pe.transform(t));
  }
  isZeroLength() {
    return this.ps.equalTo(this.pe);
  }
  sortPoints(t) {
    return new i.Line(this.start, this.end).sortPoints(t);
  }
  toJSON() {
    return Object.assign({}, this, { name: "segment" });
  }
  svg(t = {}) {
    let { stroke: e, strokeWidth: n, id: s, className: l } = t, o = s && s.length > 0 ? `id="${s}"` : "", a = l && l.length > 0 ? `class="${l}"` : "";
    return `
<line x1="${this.start.x}" y1="${this.start.y}" x2="${this.end.x}" y2="${this.end.y}" stroke="${e || "black"}" stroke-width="${n || 1}" ${o} ${a} />`;
  }
}
i.Segment = vt;
const ii = (...r) => new i.Segment(...r);
i.segment = ii;
let { vector: Ot } = i;
class ue {
  constructor(...t) {
    if (this.pt = new i.Point(), this.norm = new i.Vector(0, 1), t.length != 0) {
      if (t.length == 1 && t[0] instanceof Object && t[0].name === "line") {
        let { pt: e, norm: n } = t[0];
        this.pt = new i.Point(e), this.norm = new i.Vector(n);
        return;
      }
      if (t.length == 2) {
        let e = t[0], n = t[1];
        if (e instanceof i.Point && n instanceof i.Point) {
          this.pt = e, this.norm = ue.points2norm(e, n), this.norm.dot(Ot(this.pt.x, this.pt.y)) >= 0 && this.norm.invert();
          return;
        }
        if (e instanceof i.Point && n instanceof i.Vector) {
          if (i.Utils.EQ_0(n.x) && i.Utils.EQ_0(n.y))
            throw i.Errors.ILLEGAL_PARAMETERS;
          this.pt = e.clone(), this.norm = n.clone(), this.norm = this.norm.normalize(), this.norm.dot(Ot(this.pt.x, this.pt.y)) >= 0 && this.norm.invert();
          return;
        }
        if (e instanceof i.Vector && n instanceof i.Point) {
          if (i.Utils.EQ_0(e.x) && i.Utils.EQ_0(e.y))
            throw i.Errors.ILLEGAL_PARAMETERS;
          this.pt = n.clone(), this.norm = e.clone(), this.norm = this.norm.normalize(), this.norm.dot(Ot(this.pt.x, this.pt.y)) >= 0 && this.norm.invert();
          return;
        }
      }
      throw i.Errors.ILLEGAL_PARAMETERS;
    }
  }
  clone() {
    return new i.Line(this.pt, this.norm);
  }
  get start() {
  }
  get end() {
  }
  get length() {
    return Number.POSITIVE_INFINITY;
  }
  get box() {
    return new i.Box(
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY
    );
  }
  get middle() {
  }
  get slope() {
    return new i.Vector(this.norm.y, -this.norm.x).slope;
  }
  get standard() {
    let t = this.norm.x, e = this.norm.y, n = this.norm.dot(this.pt);
    return [t, e, n];
  }
  parallelTo(t) {
    return i.Utils.EQ_0(this.norm.cross(t.norm));
  }
  incidentTo(t) {
    return this.parallelTo(t) && this.pt.on(t);
  }
  contains(t) {
    if (this.pt.equalTo(t))
      return !0;
    let e = new i.Vector(this.pt, t);
    return i.Utils.EQ_0(this.norm.dot(e));
  }
  coord(t) {
    return Ot(t.x, t.y).cross(this.norm);
  }
  intersect(t) {
    if (t instanceof i.Point)
      return this.contains(t) ? [t] : [];
    if (t instanceof i.Line)
      return Bt(this, t);
    if (t instanceof i.Circle)
      return _t(this, t);
    if (t instanceof i.Box)
      return St(this, t);
    if (t instanceof i.Segment)
      return Ft(t, this);
    if (t instanceof i.Arc)
      return se(this, t);
    if (t instanceof i.Polygon)
      return Ht(this, t);
  }
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
  split(t) {
    if (t instanceof i.Point)
      return [new i.Ray(t, this.norm.invert()), new i.Ray(t, this.norm)];
    {
      let e = new i.Multiline([this]), n = this.sortPoints(t);
      return e.split(n), e.toShapes();
    }
  }
  sortPoints(t) {
    return t.slice().sort((e, n) => this.coord(e) < this.coord(n) ? -1 : this.coord(e) > this.coord(n) ? 1 : 0);
  }
  toJSON() {
    return Object.assign({}, this, { name: "line" });
  }
  svg(t, e = {}) {
    let n = St(this, t);
    if (n.length === 0)
      return "";
    let s = n[0], l = n.length == 2 ? n[1] : n.find((a) => !a.equalTo(s));
    return l === void 0 && (l = s), new i.Segment(s, l).svg(e);
  }
  static points2norm(t, e) {
    if (t.equalTo(e))
      throw i.Errors.ILLEGAL_PARAMETERS;
    return new i.Vector(t, e).normalize().rotate90CCW();
  }
}
i.Line = ue;
const ri = (...r) => new i.Line(...r);
i.line = ri;
class si {
  constructor(...t) {
    if (this.pc = new i.Point(), this.r = 1, t.length == 1 && t[0] instanceof Object && t[0].name === "circle") {
      let { pc: e, r: n } = t[0];
      this.pc = new i.Point(e), this.r = n;
      return;
    } else {
      let [e, n] = [...t];
      e && e instanceof i.Point && (this.pc = e.clone()), n !== void 0 && (this.r = n);
      return;
    }
  }
  clone() {
    return new i.Circle(this.pc.clone(), this.r);
  }
  get center() {
    return this.pc;
  }
  get box() {
    return new i.Box(
      this.pc.x - this.r,
      this.pc.y - this.r,
      this.pc.x + this.r,
      this.pc.y + this.r
    );
  }
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
  toArc(t = !0) {
    return new i.Arc(this.center, this.r, Math.PI, -Math.PI, t);
  }
  intersect(t) {
    if (t instanceof i.Point)
      return this.contains(t) ? [t] : [];
    if (t instanceof i.Line)
      return _t(t, this);
    if (t instanceof i.Segment)
      return Vt(t, this);
    if (t instanceof i.Circle)
      return Be(t, this);
    if (t instanceof i.Box)
      return Cn(this, t);
    if (t instanceof i.Arc)
      return le(t, this);
    if (t instanceof i.Polygon)
      return Ve(this, t);
  }
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
  }
  toJSON() {
    return Object.assign({}, this, { name: "circle" });
  }
  svg(t = {}) {
    let { stroke: e, strokeWidth: n, fill: s, fillOpacity: l, id: o, className: a } = t, h = o && o.length > 0 ? `id="${o}"` : "", f = a && a.length > 0 ? `class="${a}"` : "";
    return `
<circle cx="${this.pc.x}" cy="${this.pc.y}" r="${this.r}" stroke="${e || "black"}" stroke-width="${n || 1}" fill="${s || "none"}" fill-opacity="${l || 1}" ${h} ${f} />`;
  }
}
i.Circle = si;
const oi = (...r) => new i.Circle(...r);
i.circle = oi;
class li {
  constructor(...t) {
    if (this.pc = new i.Point(), this.r = 1, this.startAngle = 0, this.endAngle = 2 * Math.PI, this.counterClockwise = i.CCW, t.length != 0)
      if (t.length == 1 && t[0] instanceof Object && t[0].name === "arc") {
        let { pc: e, r: n, startAngle: s, endAngle: l, counterClockwise: o } = t[0];
        this.pc = new i.Point(e.x, e.y), this.r = n, this.startAngle = s, this.endAngle = l, this.counterClockwise = o;
        return;
      } else {
        let [e, n, s, l, o] = [...t];
        e && e instanceof i.Point && (this.pc = e.clone()), n !== void 0 && (this.r = n), s !== void 0 && (this.startAngle = s), l !== void 0 && (this.endAngle = l), o !== void 0 && (this.counterClockwise = o);
        return;
      }
  }
  clone() {
    return new i.Arc(this.pc.clone(), this.r, this.startAngle, this.endAngle, this.counterClockwise);
  }
  get sweep() {
    if (i.Utils.EQ(this.startAngle, this.endAngle))
      return 0;
    if (i.Utils.EQ(Math.abs(this.startAngle - this.endAngle), i.PIx2))
      return i.PIx2;
    let t;
    return this.counterClockwise ? t = i.Utils.GT(this.endAngle, this.startAngle) ? this.endAngle - this.startAngle : this.endAngle - this.startAngle + i.PIx2 : t = i.Utils.GT(this.startAngle, this.endAngle) ? this.startAngle - this.endAngle : this.startAngle - this.endAngle + i.PIx2, i.Utils.GT(t, i.PIx2) && (t -= i.PIx2), i.Utils.LT(t, 0) && (t += i.PIx2), t;
  }
  get start() {
    return new i.Point(this.pc.x + this.r, this.pc.y).rotate(this.startAngle, this.pc);
  }
  get end() {
    return new i.Point(this.pc.x + this.r, this.pc.y).rotate(this.endAngle, this.pc);
  }
  get center() {
    return this.pc.clone();
  }
  get vertices() {
    return [this.start.clone(), this.end.clone()];
  }
  get length() {
    return Math.abs(this.sweep * this.r);
  }
  get box() {
    let e = this.breakToFunctional().reduce((n, s) => n.merge(s.start.box), new i.Box());
    return e = e.merge(this.end.box), e;
  }
  contains(t) {
    if (!i.Utils.EQ(this.pc.distanceTo(t)[0], this.r))
      return !1;
    if (t.equalTo(this.start))
      return !0;
    let e = new i.Vector(this.pc, t).slope, n = new i.Arc(this.pc, this.r, this.startAngle, e, this.counterClockwise);
    return i.Utils.LE(n.length, this.length);
  }
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
  middle() {
    let t = this.counterClockwise ? this.startAngle + this.sweep / 2 : this.startAngle - this.sweep / 2;
    return new i.Arc(this.pc, this.r, this.startAngle, t, this.counterClockwise).end;
  }
  pointAtLength(t) {
    if (t > this.length || t < 0)
      return null;
    if (t == 0)
      return this.start;
    if (t == this.length)
      return this.end;
    let e = t / this.length, n = this.counterClockwise ? this.startAngle + this.sweep * e : this.startAngle - this.sweep * e;
    return new i.Arc(this.pc, this.r, this.startAngle, n, this.counterClockwise).end;
  }
  chordHeight() {
    return (1 - Math.cos(Math.abs(this.sweep / 2))) * this.r;
  }
  intersect(t) {
    if (t instanceof i.Point)
      return this.contains(t) ? [t] : [];
    if (t instanceof i.Line)
      return se(t, this);
    if (t instanceof i.Circle)
      return le(this, t);
    if (t instanceof i.Segment)
      return rt(t, this);
    if (t instanceof i.Box)
      return Rn(this, t);
    if (t instanceof i.Arc)
      return oe(this, t);
    if (t instanceof i.Polygon)
      return fe(this, t);
  }
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
  }
  breakToFunctional() {
    let t = [], e = [0, Math.PI / 2, 2 * Math.PI / 2, 3 * Math.PI / 2], n = [
      this.pc.translate(this.r, 0),
      this.pc.translate(0, this.r),
      this.pc.translate(-this.r, 0),
      this.pc.translate(0, -this.r)
    ], s = [];
    for (let l = 0; l < 4; l++)
      n[l].on(this) && s.push(new i.Arc(this.pc, this.r, this.startAngle, e[l], this.counterClockwise));
    if (s.length == 0)
      t.push(this.clone());
    else {
      s.sort((a, h) => a.length - h.length);
      for (let a = 0; a < s.length; a++) {
        let h = t.length > 0 ? t[t.length - 1] : void 0, f;
        h ? f = new i.Arc(this.pc, this.r, h.endAngle, s[a].endAngle, this.counterClockwise) : f = new i.Arc(this.pc, this.r, this.startAngle, s[a].endAngle, this.counterClockwise), i.Utils.EQ_0(f.length) || t.push(f.clone());
      }
      let l = t.length > 0 ? t[t.length - 1] : void 0, o;
      l ? o = new i.Arc(this.pc, this.r, l.endAngle, this.endAngle, this.counterClockwise) : o = new i.Arc(this.pc, this.r, this.startAngle, this.endAngle, this.counterClockwise), !i.Utils.EQ_0(o.length) && !i.Utils.EQ(o.sweep, 2 * Math.PI) && t.push(o.clone());
    }
    return t;
  }
  tangentInStart() {
    let t = new i.Vector(this.pc, this.start), e = this.counterClockwise ? Math.PI / 2 : -Math.PI / 2;
    return t.rotate(e).normalize();
  }
  tangentInEnd() {
    let t = new i.Vector(this.pc, this.end), e = this.counterClockwise ? -Math.PI / 2 : Math.PI / 2;
    return t.rotate(e).normalize();
  }
  reverse() {
    return new i.Arc(this.pc, this.r, this.endAngle, this.startAngle, !this.counterClockwise);
  }
  translate(...t) {
    let e = this.clone();
    return e.pc = this.pc.translate(...t), e;
  }
  rotate(t = 0, e = new i.Point()) {
    let n = new i.Matrix();
    return n = n.translate(e.x, e.y).rotate(t).translate(-e.x, -e.y), this.transform(n);
  }
  scale(t = 1, e = 1) {
    let n = new i.Matrix();
    return n = n.scale(t, e), this.transform(n);
  }
  transform(t = new i.Matrix()) {
    let e = this.start.transform(t), n = this.end.transform(t), s = this.pc.transform(t), l = this.counterClockwise;
    return t.a * t.d < 0 && (l = !l), i.Arc.arcSE(s, e, n, l);
  }
  static arcSE(t, e, n, s) {
    let { vector: l } = i, o = l(t, e).slope, a = l(t, n).slope;
    i.Utils.EQ(o, a) && (a += 2 * Math.PI, s = !0);
    let h = l(t, e).length;
    return new i.Arc(t, h, o, a, s);
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
  sortPoints(t) {
    let { vector: e } = i;
    return t.slice().sort((n, s) => {
      let l = e(this.pc, n).slope, o = e(this.pc, s).slope;
      return l < o ? -1 : l > o ? 1 : 0;
    });
  }
  toJSON() {
    return Object.assign({}, this, { name: "arc" });
  }
  svg(t = {}) {
    let e = this.sweep <= Math.PI ? "0" : "1", n = this.counterClockwise ? "1" : "0", { stroke: s, strokeWidth: l, fill: o, id: a, className: h } = t, f = a && a.length > 0 ? `id="${a}"` : "", u = h && h.length > 0 ? `class="${h}"` : "";
    return i.Utils.EQ(this.sweep, 2 * Math.PI) ? new i.Circle(this.pc, this.r).svg(t) : `
<path d="M${this.start.x},${this.start.y}
                             A${this.r},${this.r} 0 ${e},${n} ${this.end.x},${this.end.y}"
                    stroke="${s || "black"}" stroke-width="${l || 1}" fill="${o || "none"}" ${f} ${u} />`;
  }
}
i.Arc = li;
const ai = (...r) => new i.Arc(...r);
i.arc = ai;
class Mt {
  constructor(t = void 0, e = void 0, n = void 0, s = void 0) {
    this.xmin = t, this.ymin = e, this.xmax = n, this.ymax = s;
  }
  clone() {
    return new Mt(this.xmin, this.ymin, this.xmax, this.ymax);
  }
  get low() {
    return new i.Point(this.xmin, this.ymin);
  }
  get high() {
    return new i.Point(this.xmax, this.ymax);
  }
  get max() {
    return this.clone();
  }
  get center() {
    return new i.Point((this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2);
  }
  get width() {
    return Math.abs(this.xmax - this.xmin);
  }
  get height() {
    return Math.abs(this.ymax - this.ymin);
  }
  get box() {
    return this.clone();
  }
  not_intersect(t) {
    return this.xmax < t.xmin || this.xmin > t.xmax || this.ymax < t.ymin || this.ymin > t.ymax;
  }
  intersect(t) {
    return !this.not_intersect(t);
  }
  merge(t) {
    return new Mt(
      this.xmin === void 0 ? t.xmin : Math.min(this.xmin, t.xmin),
      this.ymin === void 0 ? t.ymin : Math.min(this.ymin, t.ymin),
      this.xmax === void 0 ? t.xmax : Math.max(this.xmax, t.xmax),
      this.ymax === void 0 ? t.ymax : Math.max(this.ymax, t.ymax)
    );
  }
  less_than(t) {
    return !!(this.low.lessThan(t.low) || this.low.equalTo(t.low) && this.high.lessThan(t.high));
  }
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
  set(t, e, n, s) {
    this.xmin = t, this.ymin = e, this.xmax = n, this.ymax = s;
  }
  toPoints() {
    return [
      new i.Point(this.xmin, this.ymin),
      new i.Point(this.xmax, this.ymin),
      new i.Point(this.xmax, this.ymax),
      new i.Point(this.xmin, this.ymax)
    ];
  }
  toSegments() {
    let t = this.toPoints();
    return [
      new i.Segment(t[0], t[1]),
      new i.Segment(t[1], t[2]),
      new i.Segment(t[2], t[3]),
      new i.Segment(t[3], t[0])
    ];
  }
  svg(t = {}) {
    let { stroke: e, strokeWidth: n, fill: s, id: l, className: o } = t, a = l && l.length > 0 ? `id="${l}"` : "", h = o && o.length > 0 ? `class="${o}"` : "", f = this.xmax - this.xmin, u = this.ymax - this.ymin;
    return `
<rect x="${this.xmin}" y="${this.ymin}" width=${f} height=${u} stroke="${e || "black"}" stroke-width="${n || 1}" fill="${s || "none"}" ${a} ${h} />`;
  }
}
i.Box = Mt;
const fi = (...r) => new i.Box(...r);
i.box = fi;
class hi {
  constructor(t) {
    this.shape = t, this.next = void 0, this.prev = void 0, this.face = void 0, this.arc_length = 0, this.bvStart = void 0, this.bvEnd = void 0, this.bv = void 0, this.overlap = void 0;
  }
  get start() {
    return this.shape.start;
  }
  get end() {
    return this.shape.end;
  }
  get length() {
    return this.shape.length;
  }
  get box() {
    return this.shape.box;
  }
  isSegment() {
    return this.shape instanceof i.Segment;
  }
  isArc() {
    return this.shape instanceof i.Arc;
  }
  middle() {
    return this.shape.middle();
  }
  pointAtLength(t) {
    return this.shape.pointAtLength(t);
  }
  contains(t) {
    return this.shape.contains(t);
  }
  setInclusion(t) {
    if (this.bv !== void 0)
      return this.bv;
    if (this.shape instanceof i.Line || this.shape instanceof i.Ray)
      return this.bv = i.OUTSIDE, this.bv;
    if (this.bvStart === void 0 && (this.bvStart = wt(t, this.start)), this.bvEnd === void 0 && (this.bvEnd = wt(t, this.end)), this.bvStart === i.OUTSIDE || this.bvEnd == i.OUTSIDE)
      this.bv = i.OUTSIDE;
    else if (this.bvStart === i.INSIDE || this.bvEnd == i.INSIDE)
      this.bv = i.INSIDE;
    else {
      let e = wt(t, this.middle());
      this.bv = e;
    }
    return this.bv;
  }
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
i.Edge = hi;
class ui extends ie {
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
  append(t) {
    return super.append(t), this.setCircularLinks(), this;
  }
  insert(t, e) {
    return super.insert(t, e), this.setCircularLinks(), this;
  }
  remove(t) {
    return super.remove(t), this;
  }
}
class at extends ui {
  constructor(t, ...e) {
    if (super(), this._box = void 0, this._orientation = void 0, e.length != 0) {
      if (e.length == 1) {
        if (e[0] instanceof Array) {
          let n = e[0];
          if (n.length == 0)
            return;
          if (n.every((s) => s instanceof i.Point)) {
            let s = at.points2segments(n);
            this.shapes2face(t.edges, s);
          } else if (n.every((s) => s instanceof Array && s.length === 2)) {
            let s = n.map((o) => new i.Point(o[0], o[1])), l = at.points2segments(s);
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
        } else if (e[0] instanceof at) {
          let n = e[0];
          this.first = n.first, this.last = n.last;
          for (let s of n)
            t.edges.add(s);
        } else if (e[0] instanceof i.Circle)
          this.shapes2face(t.edges, [e[0].toArc(i.CCW)]);
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
      e.length == 2 && e[0] instanceof i.Edge && e[1] instanceof i.Edge && (this.first = e[0], this.last = e[1], this.last.next = this.first, this.first.prev = this.last, this.setArcLength());
    }
  }
  get edges() {
    return this.toArray();
  }
  get shapes() {
    return this.edges.map((t) => t.shape.clone());
  }
  get box() {
    if (this._box === void 0) {
      let t = new i.Box();
      for (let e of this)
        t = t.merge(e.box);
      this._box = t;
    }
    return this._box;
  }
  get perimeter() {
    return this.last.arc_length + this.last.length;
  }
  pointAtLength(t) {
    if (t > this.perimeter || t < 0)
      return null;
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
  append(t) {
    return super.append(t), this.setOneEdgeArcLength(t), t.face = this, this;
  }
  insert(t, e) {
    return super.insert(t, e), this.setOneEdgeArcLength(t), t.face = this, this;
  }
  remove(t) {
    return super.remove(t), this.setArcLength(), this;
  }
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
  setArcLength() {
    for (let t of this)
      this.setOneEdgeArcLength(t), t.face = this;
  }
  setOneEdgeArcLength(t) {
    t === this.first ? t.arc_length = 0 : t.arc_length = t.prev.arc_length + t.prev.length;
  }
  area() {
    return Math.abs(this.signedArea());
  }
  signedArea() {
    let t = 0, e = this.box.ymin;
    for (let n of this)
      t += n.shape.definiteIntegral(e);
    return t;
  }
  orientation() {
    if (this._orientation === void 0) {
      let t = this.signedArea();
      i.Utils.EQ_0(t) ? this._orientation = i.ORIENTATION.NOT_ORIENTABLE : i.Utils.LT(t, 0) ? this._orientation = i.ORIENTATION.CCW : this._orientation = i.ORIENTATION.CW;
    }
    return this._orientation;
  }
  isSimple(t) {
    return at.getSelfIntersections(this, t, !0).length == 0;
  }
  static getSelfIntersections(t, e, n = !1) {
    let s = [];
    for (let l of t) {
      let o = e.search(l.box);
      for (let a of o) {
        if (l === a || a.face !== t || l.shape instanceof i.Segment && a.shape instanceof i.Segment && (l.next === a || l.prev === a))
          continue;
        let h = l.shape.intersect(a.shape);
        for (let f of h)
          if (!(f.equalTo(l.start) && f.equalTo(a.end) && a === l.prev) && !(f.equalTo(l.end) && f.equalTo(a.start) && a === l.next) && (s.push(f), n))
            break;
        if (s.length > 0 && n)
          break;
      }
      if (s.length > 0 && n)
        break;
    }
    return s;
  }
  findEdgeByPoint(t) {
    let e;
    for (let n of this)
      if (n.shape.contains(t)) {
        e = n;
        break;
      }
    return e;
  }
  toPolygon() {
    return new i.Polygon(this.shapes);
  }
  toJSON() {
    return this.edges.map((t) => t.toJSON());
  }
  svg() {
    let t = `
M${this.first.start.x},${this.first.start.y}`;
    for (let e of this)
      t += e.svg();
    return t += " z", t;
  }
}
i.Face = at;
class ce {
  constructor(...t) {
    if (this.pt = new i.Point(), this.norm = new i.Vector(0, 1), t.length != 0 && (t.length >= 1 && t[0] instanceof i.Point && (this.pt = t[0].clone()), t.length !== 1)) {
      if (t.length === 2 && t[1] instanceof i.Vector) {
        this.norm = t[1].clone();
        return;
      }
      throw i.Errors.ILLEGAL_PARAMETERS;
    }
  }
  clone() {
    return new ce(this.pt, this.norm);
  }
  get slope() {
    return new i.Vector(this.norm.y, -this.norm.x).slope;
  }
  get box() {
    let t = this.slope;
    return new i.Box(
      t > Math.PI / 2 && t < 3 * Math.PI / 2 ? Number.NEGATIVE_INFINITY : this.pt.x,
      t >= 0 && t <= Math.PI ? this.pt.y : Number.NEGATIVE_INFINITY,
      t >= Math.PI / 2 && t <= 3 * Math.PI / 2 ? this.pt.x : Number.POSITIVE_INFINITY,
      t >= Math.PI && t <= 2 * Math.PI || t == 0 ? this.pt.y : Number.POSITIVE_INFINITY
    );
  }
  get start() {
    return this.pt;
  }
  get end() {
  }
  get length() {
    return Number.POSITIVE_INFINITY;
  }
  contains(t) {
    if (this.pt.equalTo(t))
      return !0;
    let e = new i.Vector(this.pt, t);
    return i.Utils.EQ_0(this.norm.dot(e)) && i.Utils.GE(e.cross(this.norm), 0);
  }
  split(t) {
    return this.contains(t) ? this.pt.equalTo(t) ? [this] : [
      new i.Segment(this.pt, t),
      new i.Ray(t, this.norm)
    ] : [];
  }
  intersect(t) {
    if (t instanceof i.Segment)
      return this.intersectRay2Segment(this, t);
    if (t instanceof i.Arc)
      return this.intersectRay2Arc(this, t);
  }
  intersectRay2Segment(t, e) {
    let n = [], s = new i.Line(t.start, t.norm), l = s.intersect(e);
    for (let o of l)
      t.contains(o) && n.push(o);
    return l.length == 2 && n.length == 1 && t.start.on(s) && n.push(t.start), n;
  }
  intersectRay2Arc(t, e) {
    let n = [], l = new i.Line(t.start, t.norm).intersect(e);
    for (let o of l)
      t.contains(o) && n.push(o);
    return n;
  }
  svg(t, e = {}) {
    let n = new i.Line(this.pt, this.norm), s = St(n, t);
    return s = s.filter((o) => this.contains(o)), s.length === 0 || s.length === 2 ? "" : new i.Segment(this.pt, s[0]).svg(e);
  }
}
i.Ray = ce;
const ci = (...r) => new i.Ray(...r);
i.ray = ci;
class ft {
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
  get box() {
    return [...this.faces].reduce((t, e) => t.merge(e.box), new i.Box());
  }
  get vertices() {
    return [...this.edges].map((t) => t.start);
  }
  clone() {
    let t = new ft();
    for (let e of this.faces)
      t.addFace(e.shapes);
    return t;
  }
  isEmpty() {
    return this.edges.size === 0;
  }
  isValid() {
    let t = !0;
    for (let e of this.faces)
      if (!e.isSimple(this.edges)) {
        t = !1;
        break;
      }
    return t;
  }
  area() {
    let t = [...this.faces].reduce((e, n) => e + n.signedArea(), 0);
    return Math.abs(t);
  }
  addFace(...t) {
    let e = new i.Face(this, ...t);
    return this.faces.add(e), e;
  }
  deleteFace(t) {
    for (let e of t)
      this.edges.delete(e);
    return this.faces.delete(t);
  }
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
  addVertex(t, e) {
    let n = e.shape.split(t);
    if (n[0] === null)
      return e.prev;
    if (n[1] === null)
      return e;
    let s = new i.Edge(n[0]), l = e.prev;
    return e.face.insert(s, l), this.edges.delete(e), this.edges.add(s), e.shape = n[1], this.edges.add(e), s;
  }
  cut(t) {
    let e = [this.clone()];
    for (let n of t) {
      if (n.setInclusion(this) !== xt)
        continue;
      let s = n.shape.start, l = n.shape.end, o = [];
      for (let a of e)
        if (a.findEdgeByPoint(s) === void 0)
          o.push(a);
        else {
          let [h, f] = a.cutFace(s, l);
          o.push(h, f);
        }
      e = o;
    }
    return e;
  }
  cutFace(t, e) {
    let n = this.findEdgeByPoint(t), s = this.findEdgeByPoint(e);
    if (n.face !== s.face)
      return [];
    let l = this.addVertex(t, n);
    s = this.findEdgeByPoint(e);
    let o = this.addVertex(e, s), a = l.face, h = new i.Edge(
      new i.Segment(l.end, o.end)
    ), f = new i.Edge(
      new i.Segment(o.end, l.end)
    );
    l.next.prev = f, f.next = l.next, l.next = h, h.prev = l, o.next.prev = h, h.next = o.next, o.next = f, f.prev = o, this.edges.add(h), this.edges.add(f);
    let u = this.addFace(h, l), p = this.addFace(f, o);
    return this.faces.delete(a), [u.toPolygon(), p.toPolygon()];
  }
  cutWithLine(t) {
    let e = this.clone(), n = new R([t]), s = {
      int_points1: [],
      int_points2: [],
      int_points1_sorted: [],
      int_points2_sorted: []
    };
    for (let a of e.edges) {
      let h = Fe(a, t);
      for (let f of h)
        ct(n.first, f, s.int_points1), ct(a, f, s.int_points2);
    }
    if (s.int_points1.length === 0)
      return e;
    s.int_points1_sorted = Gt(t, s.int_points1), s.int_points2_sorted = Et(s.int_points2), pt(n, s.int_points1_sorted), pt(e, s.int_points2_sorted), re(s), s.int_points1_sorted = Gt(t, s.int_points1), s.int_points2_sorted = Et(s.int_points2), Yt(s.int_points1), jt(s.int_points1, e);
    for (let a of s.int_points1_sorted)
      a.edge_before.bv === a.edge_after.bv && (s.int_points2[a.id] = -1, a.id = -1);
    if (s.int_points1 = s.int_points1.filter((a) => a.id >= 0), s.int_points2 = s.int_points2.filter((a) => a.id >= 0), s.int_points1.length === 0)
      return e;
    s.int_points1_sorted = Gt(t, s.int_points1), s.int_points2_sorted = Et(s.int_points2);
    let l = s.int_points1[0], o;
    for (let a of s.int_points1_sorted)
      a.edge_before.bv === xt && (o = new i.Edge(new i.Segment(l.pt, a.pt)), ge(s.int_points2[l.id], s.int_points2[a.id], o), e.edges.add(o), o = new i.Edge(new i.Segment(a.pt, l.pt)), ge(s.int_points2[a.id], s.int_points2[l.id], o), e.edges.add(o)), l = a;
    return e.recreateFaces(), e;
  }
  findEdgeByPoint(t) {
    let e;
    for (let n of this.faces)
      if (e = n.findEdgeByPoint(t), e !== void 0)
        break;
    return e;
  }
  splitToIslands() {
    if (this.isEmpty())
      return [];
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
  reverse() {
    for (let t of this.faces)
      t.reverse();
    return this;
  }
  contains(t) {
    if (t instanceof i.Point) {
      let e = wt(this, t);
      return e === xt || e === D;
    } else
      return De(this, t);
  }
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
  intersect(t) {
    if (t instanceof i.Point)
      return this.contains(t) ? [t] : [];
    if (t instanceof i.Line)
      return Ht(t, this);
    if (t instanceof i.Circle)
      return Ve(t, this);
    if (t instanceof i.Segment)
      return ae(t, this);
    if (t instanceof i.Arc)
      return fe(t, this);
    if (t instanceof i.Polygon)
      return Fn(t, this);
  }
  translate(t) {
    let e = new ft();
    for (let n of this.faces)
      e.addFace(n.shapes.map((s) => s.translate(t)));
    return e;
  }
  rotate(t = 0, e = new i.Point()) {
    let n = new ft();
    for (let s of this.faces)
      n.addFace(s.shapes.map((l) => l.rotate(t, e)));
    return n;
  }
  transform(t = new i.Matrix()) {
    let e = new ft();
    for (let n of this.faces)
      e.addFace(n.shapes.map((s) => s.transform(t)));
    return e;
  }
  toJSON() {
    return [...this.faces].map((t) => t.toJSON());
  }
  toArray() {
    return [...this.faces].map((t) => t.toPolygon());
  }
  svg(t = {}) {
    let { stroke: e, strokeWidth: n, fill: s, fillRule: l, fillOpacity: o, id: a, className: h } = t, f = a && a.length > 0 ? `id="${a}"` : "", u = h && h.length > 0 ? `class="${h}"` : "", p = `
<path stroke="${e || "black"}" stroke-width="${n || 1}" fill="${s || "lightcyan"}" fill-rule="${l || "evenodd"}" fill-opacity="${o || 1}" ${f} ${u} d="`;
    for (let _ of this.faces)
      p += _.svg();
    return p += `" >
</path>`, p;
  }
}
i.Polygon = ft;
const di = (...r) => new i.Polygon(...r);
i.polygon = di;
const { Circle: zt, Line: ye, Point: Ie, Vector: Nt, Utils: Dt } = i;
class yt {
  constructor(t) {
    this.circle = t;
  }
  get inversion_circle() {
    return this.circle;
  }
  static inversePoint(t, e) {
    const n = new Nt(t.pc, e), s = t.r * t.r, l = n.dot(n);
    return Dt.EQ_0(l) ? new Ie(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY) : t.pc.translate(n.multiply(s / l));
  }
  static inverseCircle(t, e) {
    const n = t.pc.distanceTo(e.pc)[0];
    if (Dt.EQ(n, e.r)) {
      let s = t.r * t.r / (2 * e.r), l = new Nt(t.pc, e.pc);
      l = l.normalize();
      let o = t.pc.translate(l.multiply(s));
      return new ye(o, l);
    } else {
      let s = new Nt(t.pc, e.pc), l = t.r * t.r / (s.dot(s) - e.r * e.r), o = t.pc.translate(s.multiply(l)), a = Math.abs(l) * e.r;
      return new zt(o, a);
    }
  }
  static inverseLine(t, e) {
    const [n, s] = t.pc.distanceTo(e);
    if (Dt.EQ_0(n))
      return e.clone();
    {
      let l = t.r * t.r / (2 * n), o = new Nt(t.pc, s.end);
      return o = o.multiply(l / n), new zt(t.pc.translate(o), l);
    }
  }
  inverse(t) {
    if (t instanceof Ie)
      return yt.inversePoint(this.circle, t);
    if (t instanceof zt)
      return yt.inverseCircle(this.circle, t);
    if (t instanceof ye)
      return yt.inverseLine(this.circle, t);
  }
}
i.Inversion = yt;
const pi = (r) => new i.Inversion(r);
i.inversion = pi;
class d {
  static point2point(t, e) {
    return t.distanceTo(e);
  }
  static point2line(t, e) {
    let n = t.projectionOn(e);
    return [new i.Vector(t, n).length, new i.Segment(t, n)];
  }
  static point2circle(t, e) {
    let [n, s] = t.distanceTo(e.center);
    if (i.Utils.EQ_0(n))
      return [e.r, new i.Segment(t, e.toArc().start)];
    {
      let l = Math.abs(n - e.r), o = new i.Vector(e.pc, t).normalize().multiply(e.r), a = e.pc.translate(o);
      return [l, new i.Segment(t, a)];
    }
  }
  static point2segment(t, e) {
    if (e.start.equalTo(e.end))
      return d.point2point(t, e.start);
    let n = new i.Vector(e.start, e.end), s = new i.Vector(e.start, t), l = new i.Vector(e.end, t), o = n.dot(s), a = -n.dot(l), h, f;
    if (i.Utils.GE(o, 0) && i.Utils.GE(a, 0)) {
      let u = e.tangentInStart();
      return h = Math.abs(u.cross(s)), f = e.start.translate(u.multiply(u.dot(s))), [h, new i.Segment(t, f)];
    } else
      return o < 0 ? t.distanceTo(e.start) : t.distanceTo(e.end);
  }
  static point2arc(t, e) {
    let n = new i.Circle(e.pc, e.r), s = [], l, o;
    return [l, o] = d.point2circle(t, n), o.end.on(e) && s.push(d.point2circle(t, n)), s.push(d.point2point(t, e.start)), s.push(d.point2point(t, e.end)), d.sort(s), s[0];
  }
  static segment2line(t, e) {
    let n = t.intersect(e);
    if (n.length > 0)
      return [0, new i.Segment(n[0], n[0])];
    let s = [];
    return s.push(d.point2line(t.start, e)), s.push(d.point2line(t.end, e)), d.sort(s), s[0];
  }
  static segment2segment(t, e) {
    let n = At(t, e);
    if (n.length > 0)
      return [0, new i.Segment(n[0], n[0])];
    let s = [], l, o;
    return [l, o] = d.point2segment(e.start, t), s.push([l, o.reverse()]), [l, o] = d.point2segment(e.end, t), s.push([l, o.reverse()]), s.push(d.point2segment(t.start, e)), s.push(d.point2segment(t.end, e)), d.sort(s), s[0];
  }
  static segment2circle(t, e) {
    let n = t.intersect(e);
    if (n.length > 0)
      return [0, new i.Segment(n[0], n[0])];
    let s = new i.Line(t.ps, t.pe), [l, o] = d.point2line(e.center, s);
    if (i.Utils.GE(l, e.r) && o.end.on(t))
      return d.point2circle(o.end, e);
    {
      let [a, h] = d.point2circle(t.start, e), [f, u] = d.point2circle(t.end, e);
      return i.Utils.LT(a, f) ? [a, h] : [f, u];
    }
  }
  static segment2arc(t, e) {
    let n = t.intersect(e);
    if (n.length > 0)
      return [0, new i.Segment(n[0], n[0])];
    let s = new i.Line(t.ps, t.pe), l = new i.Circle(e.pc, e.r), [o, a] = d.point2line(l.center, s);
    if (i.Utils.GE(o, l.r) && a.end.on(t)) {
      let [p, _] = d.point2circle(a.end, l);
      if (_.end.on(e))
        return [p, _];
    }
    let h = [];
    h.push(d.point2arc(t.start, e)), h.push(d.point2arc(t.end, e));
    let f, u;
    return [f, u] = d.point2segment(e.start, t), h.push([f, u.reverse()]), [f, u] = d.point2segment(e.end, t), h.push([f, u.reverse()]), d.sort(h), h[0];
  }
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
  static circle2line(t, e) {
    let n = t.intersect(e);
    if (n.length > 0)
      return [0, new i.Segment(n[0], n[0])];
    let [s, l] = d.point2line(t.center, e), [o, a] = d.point2circle(l.end, t);
    return a = a.reverse(), [o, a];
  }
  static arc2line(t, e) {
    let n = e.intersect(t);
    if (n.length > 0)
      return [0, new i.Segment(n[0], n[0])];
    let s = new i.Circle(t.center, t.r), [l, o] = d.point2line(s.center, e);
    if (i.Utils.GE(l, s.r)) {
      let [a, h] = d.point2circle(o.end, s);
      if (h.end.on(t))
        return [a, h];
    } else {
      let a = [];
      return a.push(d.point2line(t.start, e)), a.push(d.point2line(t.end, e)), d.sort(a), a[0];
    }
  }
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
  static arc2arc(t, e) {
    let n = t.intersect(e);
    if (n.length > 0)
      return [0, new i.Segment(n[0], n[0])];
    let s = new i.Circle(t.center, t.r), l = new i.Circle(e.center, e.r), [o, a] = d.circle2circle(s, l);
    if (a.start.on(t) && a.end.on(e))
      return [o, a];
    {
      let h = [], f, u;
      return [f, u] = d.point2arc(t.start, e), u.end.on(e) && h.push([f, u]), [f, u] = d.point2arc(t.end, e), u.end.on(e) && h.push([f, u]), [f, u] = d.point2arc(e.start, t), u.end.on(t) && h.push([f, u.reverse()]), [f, u] = d.point2arc(e.end, t), u.end.on(t) && h.push([f, u.reverse()]), [f, u] = d.point2point(t.start, e.start), h.push([f, u]), [f, u] = d.point2point(t.start, e.end), h.push([f, u]), [f, u] = d.point2point(t.end, e.start), h.push([f, u]), [f, u] = d.point2point(t.end, e.end), h.push([f, u]), d.sort(h), h[0];
    }
  }
  static point2polygon(t, e) {
    let n = [Number.POSITIVE_INFINITY, new i.Segment()];
    for (let s of e.edges) {
      let [l, o] = s.shape instanceof i.Segment ? d.point2segment(t, s.shape) : d.point2arc(t, s.shape);
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
  static polygon2polygon(t, e) {
    let n = [Number.POSITIVE_INFINITY, new i.Segment()];
    for (let s of t.edges)
      for (let l of e.edges) {
        let [o, a] = s.shape.distanceTo(l.shape);
        i.Utils.LT(o, n[0]) && (n = [o, a]);
      }
    return n;
  }
  static box2box_minmax(t, e) {
    let n = Math.max(Math.max(t.xmin - e.xmax, 0), Math.max(e.xmin - t.xmax, 0)), s = Math.max(Math.max(t.ymin - e.ymax, 0), Math.max(e.ymin - t.ymax, 0)), l = n * n + s * s, o = t.merge(e), a = o.xmax - o.xmin, h = o.ymax - o.ymin, f = a * a + h * h;
    return [l, f];
  }
  static minmax_tree_process_level(t, e, n, s) {
    let l, o;
    for (let u of e)
      [l, o] = d.box2box_minmax(t.box, u.item.key), u.item.value instanceof i.Edge ? s.insert([l, o], u.item.value.shape) : s.insert([l, o], u.item.value), i.Utils.LT(o, n) && (n = o);
    if (e.length === 0)
      return n;
    let a = e.map((u) => u.left.isNil() ? void 0 : u.left).filter((u) => u !== void 0), h = e.map((u) => u.right.isNil() ? void 0 : u.right).filter((u) => u !== void 0), f = [...a, ...h].filter((u) => {
      let [p, _] = d.box2box_minmax(t.box, u.max);
      return i.Utils.LE(p, n);
    });
    return n = d.minmax_tree_process_level(t, f, n, s), n;
  }
  static minmax_tree(t, e, n) {
    let s = new Tt(), l = [e.index.root], o = n < Number.POSITIVE_INFINITY ? n * n : Number.POSITIVE_INFINITY;
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
}
i.Distance = d;
i.BooleanOperations = Tn;
i.Relations = Zn;
const Se = i.Matrix, Ct = 24, Te = 60, C = class extends Xe {
  constructor(r, t) {
    if (super(), Ae.setOptions(this, t), r == null)
      throw Error("latLng required");
    t = t || {}, this._latLng = ut.latLng(r), this._heading = t.heading, this._course = t.course, this._speed = t.speed, this._setShapeOptions(t.shapeOptions);
  }
  _project() {
    this._currentShapePoints = this._getProjectedShapePoints(), this._currentLeaderPoints = this._getLeaderShapePoints();
    const r = new Je();
    for (let t = 0; t < this._currentShapePoints.length; t++) {
      const e = this._currentShapePoints[t];
      r.extend(e);
    }
    if (this._currentLeaderPoints !== void 0)
      for (let t = 0; t < this._currentLeaderPoints.length; t++) {
        const e = this._currentShapePoints[t];
        r.extend(e);
      }
    this._currentBounds = r, this._currentLatLngBounds = new Ke(
      this._map.layerPointToLatLng(r.getBottomLeft()),
      this._map.layerPointToLatLng(r.getTopRight())
    );
  }
  _update() {
    if (!this._map)
      return;
    let r = C._toSVGPath(this._currentShapePoints, !0);
    this._currentLeaderPoints !== void 0 && (r += " " + C._toSVGPath(this._currentLeaderPoints, !1)), this.getElement().setAttribute("d", r);
  }
  _setShapeOptions(r) {
    this._shapeOptions = r || {
      leaderTime: Te,
      defaultShapeSet: C.DEFAULT_SHAPE_SET
    }, this._shapeOptions.leaderTime === void 0 && (this._shapeOptions.leaderTime = Te), this._shapeOptions.defaultShapeSet === void 0 && (this._shapeOptions.defaultShapeSet = C.DEFAULT_SHAPE_SET), this._shapeOptions.shapeSetEntries !== void 0 && this._shapeOptions.shapeSetEntries.sort((t, e) => e.minZoomLevel - t.minZoomLevel);
  }
  setLatLng(r) {
    const t = this._latLng;
    return this._latLng = ut.latLng(r), this.fire("move", {
      oldLatLng: t,
      latlng: this._latLng
    }), this.redraw();
  }
  setHeading(r) {
    return this._heading = r, this.redraw();
  }
  setCourse(r) {
    return this._course = r, this.redraw();
  }
  setSpeed(r) {
    return this._speed = r, this.redraw();
  }
  setShapeOptions(r) {
    return this._setShapeOptions(r), this.redraw();
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
  static createShape(r, t) {
    return {
      points: r,
      length: t,
      breadth: t,
      units: "pixels"
    };
  }
  static createShapeSet(r) {
    return {
      withHeading: C.createShape(C.DEFAULT_HEADING_SHAPE_POINTS, r),
      withoutHeading: C.createShape(C.DEFAULT_NOHEADING_SHAPE_POINTS, r)
    };
  }
  _getLatSizeOf(r) {
    return r / 40075017 * 360;
  }
  _getLngSizeOf(r) {
    return r / 40075017 * 360 / Math.cos(Math.PI / 180 * this._latLng.lat);
  }
  _getViewAngleFromModel(r) {
    return r - Math.PI / 2;
  }
  _getLeaderShapePoints() {
    if (this._course === void 0 || this._speed === void 0)
      return;
    const r = this._getViewAngleFromModel(this._course), t = this._speed * this._shapeOptions.leaderTime, e = this._calcRelativeLatLng(this._latLng, t, r);
    return this._latLngsToLayerPoints(this._latLng, e);
  }
  _calcRelativeLatLng(r, t, e) {
    return new pe(
      r.lat - this._getLatSizeOf(t * Math.sin(e)),
      r.lng + this._getLngSizeOf(t * Math.cos(e))
    );
  }
  _latLngsToLayerPoints(...r) {
    return r.map((t) => this._map.latLngToLayerPoint(t));
  }
  _getShapeSet() {
    if (this._shapeOptions.shapeSetEntries === void 0 || this._shapeOptions.shapeSetEntries.length == 0)
      return this._shapeOptions.defaultShapeSet;
    const r = this._map.getZoom(), t = this._shapeOptions.shapeSetEntries.sort((e, n) => n.minZoomLevel - e.minZoomLevel).filter((e) => r >= e.minZoomLevel);
    return t.length > 0 ? t[0].shapeSet : this._shapeOptions.defaultShapeSet;
  }
  _getShape() {
    const r = this._getShapeSet();
    return this._heading !== void 0 ? r.withHeading : r.withoutHeading;
  }
  _getTransformedShapePoints() {
    const r = this._getShape();
    let t = new Se();
    if (this._heading !== void 0) {
      const n = this._getViewAngleFromModel(this._heading);
      t = t.rotate(n);
    }
    return r.center !== void 0 && (t = t.translate(-r.center[0], -r.center[1])), t = t.scale(r.length, r.breadth), [r.points.map((n) => t.transform(n)), r.units];
  }
  _getProjectedShapePoints() {
    const [r, t] = this._getTransformedShapePoints();
    switch (t) {
      case "pixels": {
        const e = this._map.latLngToLayerPoint(this._latLng), n = new Se().translate(e.x, e.y);
        return r.map((s) => {
          const l = n.transform(s);
          return new tn(l[0], l[1]);
        });
      }
      case "meters":
        return r.map((e) => this._map.latLngToLayerPoint(
          new pe(
            this._latLng.lat - this._getLatSizeOf(e[1]),
            this._latLng.lng + this._getLngSizeOf(e[0])
          )
        ));
    }
  }
  static _toSVGPath(r, t) {
    let e = "";
    for (let n = 0; n < r.length; n++) {
      const s = r[n];
      e === "" ? e = `M ${s.x} ${s.y} ` : e += `L ${s.x} ${s.y} `;
    }
    return t && (e += "Z"), e;
  }
};
let X = C;
X.DEFAULT_HEADING_SHAPE_POINTS = [[0.75, 0], [-0.25, 0.3], [-0.25, -0.3]];
X.DEFAULT_NOHEADING_SHAPE_POINTS = [[0.3, 0], [0, 0.3], [-0.3, 0], [0, -0.3]];
X.DEFAULT_SHAPE_SET = {
  withHeading: {
    points: C.DEFAULT_HEADING_SHAPE_POINTS,
    length: Ct,
    breadth: Ct,
    units: "pixels"
  },
  withoutHeading: {
    points: C.DEFAULT_NOHEADING_SHAPE_POINTS,
    length: Ct,
    breadth: Ct,
    units: "pixels"
  }
};
const gi = 24, _i = 14, mi = 60, xi = 1.944, Qe = "#000000", We = "#d3d3d3", O = "#000000", N = "#d3d3d3", tt = "#8b008b", et = "#ff00ff", U = "#00008b", M = "#ffff00", j = "#008b8b", Z = "#00ffff", $ = "#00008b", B = "#0000ff", F = "#006400", V = "#90ee90", H = "#8b0000", q = "#ff0000", G = "#008b8b", z = "#00ffff", Ye = {
  0: c("Not available", O, N),
  20: c("Wing in ground (WIG), all ships of this type", O, N),
  21: c("Wing in ground (WIG), Hazardous category A", O, N),
  22: c("Wing in ground (WIG), Hazardous category B", O, N),
  23: c("Wing in ground (WIG), Hazardous category C", O, N),
  24: c("Wing in ground (WIG), Hazardous category D", O, N),
  25: c("Wing in ground (WIG), Reserved for future use", O, N),
  26: c("Wing in ground (WIG), Reserved for future use", O, N),
  27: c("Wing in ground (WIG), Reserved for future use", O, N),
  28: c("Wing in ground (WIG), Reserved for future use", O, N),
  29: c("Wing in ground (WIG), Reserved for future use", O, N),
  30: c("Fishing", tt, et),
  31: c("Towing", tt, et),
  32: c("Towing: length exceeds 200m or breadth exceeds 25m", tt, et),
  33: c("Dredging or underwater ops", tt, et),
  34: c("Diving ops", tt, et),
  35: c("Military ops", tt, et),
  36: c("Sailing", tt, et),
  37: c("Pleasure Craft", tt, et),
  40: c("High speed craft (HSC), all ships of this type", U, M),
  41: c("High speed craft (HSC), Hazardous category A", U, M),
  42: c("High speed craft (HSC), Hazardous category B", U, M),
  43: c("High speed craft (HSC), Hazardous category C", U, M),
  44: c("High speed craft (HSC), Hazardous category D", U, M),
  45: c("High speed craft (HSC), Reserved for future use", U, M),
  46: c("High speed craft (HSC), Reserved for future use", U, M),
  47: c("High speed craft (HSC), Reserved for future use", U, M),
  48: c("High speed craft (HSC), Reserved for future use", U, M),
  49: c("High speed craft (HSC), No additional information", U, M),
  50: c("Pilot Vessel", j, Z),
  51: c("Search and Rescue vessel", j, Z),
  52: c("Tug", j, Z),
  53: c("Port Tender", j, Z),
  54: c("Anti-pollution equipment", j, Z),
  55: c("Law Enforcement", j, Z),
  56: c("Spare - Local Vessel", j, Z),
  57: c("Spare - Local Vessel", j, Z),
  58: c("Medical Transport", j, Z),
  59: c("Noncombatant ship according to RR Resolution No. 18", "", ""),
  60: c("Passenger, all ships of this type", $, B),
  61: c("Passenger, Hazardous category A", $, B),
  62: c("Passenger, Hazardous category B", $, B),
  63: c("Passenger, Hazardous category C", $, B),
  64: c("Passenger, Hazardous category D", $, B),
  65: c("Passenger, Reserved for future use", $, B),
  66: c("Passenger, Reserved for future use", $, B),
  67: c("Passenger, Reserved for future use", $, B),
  68: c("Passenger, Reserved for future use", $, B),
  69: c("Passenger, No additional information", $, B),
  70: c("Cargo, all ships of this type", F, V),
  71: c("Cargo, Hazardous category A", F, V),
  72: c("Cargo, Hazardous category B", F, V),
  73: c("Cargo, Hazardous category C", F, V),
  74: c("Cargo, Hazardous category D", F, V),
  75: c("Cargo, Reserved for future use", F, V),
  76: c("Cargo, Reserved for future use", F, V),
  77: c("Cargo, Reserved for future use", F, V),
  78: c("Cargo, Reserved for future use", F, V),
  79: c("Cargo, No additional information", F, V),
  80: c("Tanker, all ships of this type", H, q),
  81: c("Tanker, Hazardous category A", H, q),
  82: c("Tanker, Hazardous category B", H, q),
  83: c("Tanker, Hazardous category C", H, q),
  84: c("Tanker, Hazardous category D", H, q),
  85: c("Tanker, Reserved for future use", H, q),
  86: c("Tanker, Reserved for future use", H, q),
  87: c("Tanker, Reserved for future use", H, q),
  88: c("Tanker, Reserved for future use", H, q),
  89: c("Tanker, No additional information", H, q),
  90: c("Other Type, all ships of this type", G, z),
  91: c("Other Type, Hazardous category A", G, z),
  92: c("Other Type, Hazardous category B", G, z),
  93: c("Other Type, Hazardous category C", G, z),
  94: c("Other Type, Hazardous category D", G, z),
  95: c("Other Type, Reserved for future use", G, z),
  96: c("Other Type, Reserved for future use", G, z),
  97: c("Other Type, Reserved for future use", G, z),
  98: c("Other Type, Reserved for future use", G, z),
  99: c("Other Type, no additional information", G, z)
}, Ei = c("Reserved", Qe, We), wi = c("Unknown", Qe, We), Rt = class extends X {
  constructor(r, t) {
    super([r.latitude, r.longitude], t), Ae.setOptions(this, t), t = t || {}, this._leaderTime = t.leaderTime || mi, this._minZoomLevel = t.minZoomLevel || _i, this._size = t.size || gi, this.setPositionReport(r), this.setShipStaticData(t.shipStaticData);
  }
  setPositionReport(r) {
    return this._positionReport = r, this.setLatLng([r.latitude, r.longitude]), !w(r.trueHeading) && r.trueHeading != 511 ? this.setHeading(be(r.trueHeading)) : this.setHeading(void 0), !w(r.cog) && r.cog < 360 ? this.setCourse(be(r.cog)) : this.setCourse(void 0), !w(r.sog) && r.sog < 102.3 ? this.setSpeed(r.sog / xi) : this.setSpeed(void 0), this.redraw();
  }
  setShipStaticData(r) {
    this._shipStaticData = r;
    const t = !w(r) && !w(r.type) ? je(r.type) : Ye[0];
    return this.setStyle({
      color: t.color,
      fill: !0,
      fillOpacity: 1,
      fillColor: t.fillColor
    }), this.bindPopup(this._getPopupContent(this._positionReport, r)), this.setShapeOptions(Rt._getShapeOptions(
      this._leaderTime,
      this._minZoomLevel,
      this._size,
      r
    ));
  }
  static _getShapeOptions(r, t, e, n) {
    const s = {
      leaderTime: r,
      defaultShapeSet: X.createShapeSet(e)
    }, l = Rt._getShapeSet(e, n);
    return l !== null && (s.shapeSetEntries = [{
      shapeSet: l,
      minZoomLevel: t
    }]), s;
  }
  static _getShapeSet(r, t) {
    return w(t) || w(t.dimension) || !Pe(t.dimension) ? null : {
      withHeading: {
        points: Rt.DEFAULT_SILHOUETTE_SHAPE_POINTS,
        center: [t.dimension.B, t.dimension.D],
        length: t.dimension.A + t.dimension.B,
        breadth: t.dimension.C + t.dimension.D,
        units: "meters"
      },
      withoutHeading: X.createShape(X.DEFAULT_NOHEADING_SHAPE_POINTS, r)
    };
  }
  _getPopupContent(r, t) {
    let e = "<table>";
    w(t) || (e += P("User ID", t.userId), e += P("IMO Number", t.imoNumber), e += P("Call sign", t.callSign), e += P("Name", t.name)), w(r) || (e += P("Location", `${r.latitude.toFixed(5)}, ${r.longitude.toFixed(5)}`), e += P("SOG", w(r.sog) ? void 0 : r.sog.toFixed(2), "knots"), e += P("COG", w(r.cog) ? void 0 : r.cog.toFixed(1), "°"), e += P("Heading", w(r.trueHeading) ? void 0 : r.trueHeading.toFixed(1), "°"), e += P(
      "Navigation status",
      Ii(r.navigationalStatus)
    )), w(t) || (e += P("Type", vi(t.type)), !w(t.dimension) && Pe(t.dimension) && (e += P(
      "Ship length",
      t.dimension.A + t.dimension.B,
      "m"
    ), e += P(
      "Ship width",
      t.dimension.C + t.dimension.D,
      "m"
    )), e += P("Fix type", yi(t.fixType)), e += P("ETA", Si(t.eta)), e += P(
      "Maximum static draught",
      w(t.maximumStaticDraught) ? void 0 : t.maximumStaticDraught.toFixed(1),
      "m"
    ), e += P("Destination", t.destination), e += P("DTE", t.dte)), e += "</table>";
    const n = en.create("div");
    return n.innerHTML = e, n;
  }
};
let de = Rt;
de.DEFAULT_SILHOUETTE_SHAPE_POINTS = [[1, 0.5], [0.75, 1], [0, 1], [0, 0], [0.75, 0]];
function vi(r) {
  return w(r) ? void 0 : je(r).name;
}
function yi(r) {
  if (!w(r))
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
function Ii(r) {
  if (!w(r))
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
function Si(r) {
  if (!w(r))
    return `${r.month.toString().padStart(2, "0")}/${r.day.toString().padStart(2, "0")} ${r.hour.toString().padStart(2, "0")}:${r.minute.toString().padStart(2, "0")} UTC`;
}
function be(r) {
  if (r != null)
    return r * Math.PI / 180;
}
function w(r) {
  return r == null;
}
function Pe(r) {
  return !w(r) && r.A > 0 && r.B > 0 && r.C > 0 && r.D > 0;
}
function P(r, t, e) {
  if (w(t))
    return "";
  const n = String(t);
  return `<tr><td>${r}</td><td>${n} ${w(e) ? "" : e}</td></tr>`;
}
function c(r, t, e) {
  return {
    name: r,
    color: t,
    fillColor: e
  };
}
function je(r) {
  if (r < 0 || r > 99)
    return wi;
  const t = Ye[r];
  return w(t) ? Ei : t;
}
ut.trackSymbol = function(r, t) {
  return new X(r, t);
};
ut.TrackSymbol = X;
ut.aisTrackSymbol = function(r, t) {
  return new de(r, t);
};
ut.AISTrackSymbol = de;
export {
  de as AISTrackSymbol,
  X as TrackSymbol,
  X as default
};
//# sourceMappingURL=leaflet-tracksymbol2.es.js.map
