import { useCallback as yt, useSyncExternalStore as It, useMemo as St } from "react";
var Ut = Symbol.for("preact-signals");
function st() {
  if (W > 1)
    W--;
  else {
    for (var t, e = !1; Z !== void 0; ) {
      var r = Z;
      for (Z = void 0, tt++; r !== void 0; ) {
        var o = r.o;
        if (r.o = void 0, r.f &= -3, !(8 & r.f) && jt(r)) try {
          r.c();
        } catch (n) {
          e || (t = n, e = !0);
        }
        r = o;
      }
    }
    if (tt = 0, W--, e) throw t;
  }
}
var p = void 0;
function mt(t) {
  var e = p;
  p = void 0;
  try {
    return t();
  } finally {
    p = e;
  }
}
var Z = void 0, W = 0, tt = 0, X = 0;
function Mt(t) {
  if (p !== void 0) {
    var e = t.n;
    if (e === void 0 || e.t !== p)
      return e = { i: 0, S: t, p: p.s, n: void 0, t: p, e: void 0, x: void 0, r: e }, p.s !== void 0 && (p.s.n = e), p.s = e, t.n = e, 32 & p.f && t.S(e), e;
    if (e.i === -1)
      return e.i = 0, e.n !== void 0 && (e.n.p = e.p, e.p !== void 0 && (e.p.n = e.n), e.p = p.s, e.n = void 0, p.s.n = e, p.s = e), e;
  }
}
function v(t, e) {
  this.v = t, this.i = 0, this.n = void 0, this.t = void 0, this.W = e?.watched, this.Z = e?.unwatched, this.name = e?.name;
}
v.prototype.brand = Ut;
v.prototype.h = function() {
  return !0;
};
v.prototype.S = function(t) {
  var e = this, r = this.t;
  r !== t && t.e === void 0 && (t.x = r, this.t = t, r !== void 0 ? r.e = t : mt(function() {
    var o;
    (o = e.W) == null || o.call(e);
  }));
};
v.prototype.U = function(t) {
  var e = this;
  if (this.t !== void 0) {
    var r = t.e, o = t.x;
    r !== void 0 && (r.x = o, t.e = void 0), o !== void 0 && (o.e = r, t.x = void 0), t === this.t && (this.t = o, o === void 0 && mt(function() {
      var n;
      (n = e.Z) == null || n.call(e);
    }));
  }
};
v.prototype.subscribe = function(t) {
  var e = this;
  return Rt(function() {
    var r = e.value, o = p;
    p = void 0;
    try {
      t(r);
    } finally {
      p = o;
    }
  }, { name: "sub" });
};
v.prototype.valueOf = function() {
  return this.value;
};
v.prototype.toString = function() {
  return this.value + "";
};
v.prototype.toJSON = function() {
  return this.value;
};
v.prototype.peek = function() {
  var t = p;
  p = void 0;
  try {
    return this.value;
  } finally {
    p = t;
  }
};
Object.defineProperty(v.prototype, "value", { get: function() {
  var t = Mt(this);
  return t !== void 0 && (t.i = this.i), this.v;
}, set: function(t) {
  if (t !== this.v) {
    if (tt > 100) throw new Error("Cycle detected");
    this.v = t, this.i++, X++, W++;
    try {
      for (var e = this.t; e !== void 0; e = e.x) e.t.N();
    } finally {
      st();
    }
  }
} });
function Wt(t, e) {
  return new v(t, e);
}
function jt(t) {
  for (var e = t.s; e !== void 0; e = e.n) if (e.S.i !== e.i || !e.S.h() || e.S.i !== e.i) return !0;
  return !1;
}
function Ot(t) {
  for (var e = t.s; e !== void 0; e = e.n) {
    var r = e.S.n;
    if (r !== void 0 && (e.r = r), e.S.n = e, e.i = -1, e.n === void 0) {
      t.s = e;
      break;
    }
  }
}
function kt(t) {
  for (var e = t.s, r = void 0; e !== void 0; ) {
    var o = e.p;
    e.i === -1 ? (e.S.U(e), o !== void 0 && (o.n = e.n), e.n !== void 0 && (e.n.p = o)) : r = e, e.S.n = e.r, e.r !== void 0 && (e.r = void 0), e = o;
  }
  t.s = r;
}
function $(t, e) {
  v.call(this, void 0), this.x = t, this.s = void 0, this.g = X - 1, this.f = 4, this.W = e?.watched, this.Z = e?.unwatched, this.name = e?.name;
}
$.prototype = new v();
$.prototype.h = function() {
  if (this.f &= -3, 1 & this.f) return !1;
  if ((36 & this.f) == 32 || (this.f &= -5, this.g === X)) return !0;
  if (this.g = X, this.f |= 1, this.i > 0 && !jt(this))
    return this.f &= -2, !0;
  var t = p;
  try {
    Ot(this), p = this;
    var e = this.x();
    (16 & this.f || this.v !== e || this.i === 0) && (this.v = e, this.f &= -17, this.i++);
  } catch (r) {
    this.v = r, this.f |= 16, this.i++;
  }
  return p = t, kt(this), this.f &= -2, !0;
};
$.prototype.S = function(t) {
  if (this.t === void 0) {
    this.f |= 36;
    for (var e = this.s; e !== void 0; e = e.n) e.S.S(e);
  }
  v.prototype.S.call(this, t);
};
$.prototype.U = function(t) {
  if (this.t !== void 0 && (v.prototype.U.call(this, t), this.t === void 0)) {
    this.f &= -33;
    for (var e = this.s; e !== void 0; e = e.n) e.S.U(e);
  }
};
$.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 6;
    for (var t = this.t; t !== void 0; t = t.x) t.t.N();
  }
};
Object.defineProperty($.prototype, "value", { get: function() {
  if (1 & this.f) throw new Error("Cycle detected");
  var t = Mt(this);
  if (this.h(), t !== void 0 && (t.i = this.i), 16 & this.f) throw this.v;
  return this.v;
} });
function Nt(t, e) {
  return new $(t, e);
}
function Et(t) {
  var e = t.u;
  if (t.u = void 0, typeof e == "function") {
    W++;
    var r = p;
    p = void 0;
    try {
      e();
    } catch (o) {
      throw t.f &= -2, t.f |= 8, at(t), o;
    } finally {
      p = r, st();
    }
  }
}
function at(t) {
  for (var e = t.s; e !== void 0; e = e.n) e.S.U(e);
  t.x = void 0, t.s = void 0, Et(t);
}
function Tt(t) {
  if (p !== this) throw new Error("Out-of-order effect");
  kt(this), p = t, this.f &= -2, 8 & this.f && at(this), st();
}
function N(t, e) {
  this.x = t, this.u = void 0, this.s = void 0, this.o = void 0, this.f = 32, this.name = e?.name;
}
N.prototype.c = function() {
  var t = this.S();
  try {
    if (8 & this.f || this.x === void 0) return;
    var e = this.x();
    typeof e == "function" && (this.u = e);
  } finally {
    t();
  }
};
N.prototype.S = function() {
  if (1 & this.f) throw new Error("Cycle detected");
  this.f |= 1, this.f &= -9, Et(this), Ot(this), W++;
  var t = p;
  return p = this, Tt.bind(this, t);
};
N.prototype.N = function() {
  2 & this.f || (this.f |= 2, this.o = Z, Z = this);
};
N.prototype.d = function() {
  this.f |= 8, 1 & this.f || at(this);
};
N.prototype.dispose = function() {
  this.d();
};
function Rt(t, e) {
  var r = new N(t, e);
  try {
    r.c();
  } catch (n) {
    throw r.d(), n;
  }
  var o = r.d.bind(r);
  return o[Symbol.dispose] = o, o;
}
const y = {
  Remove: "remove",
  Replace: "replace",
  Add: "add"
}, xt = Symbol.for("__MUTATIVE_PROXY_DRAFT__"), Pt = Symbol("__MUTATIVE_RAW_RETURN_SYMBOL__"), H = Symbol.iterator, w = {
  mutable: "mutable",
  immutable: "immutable"
}, ct = {};
function G(t, e) {
  return t instanceof Map ? t.has(e) : Object.prototype.hasOwnProperty.call(t, e);
}
function vt(t, e) {
  if (e in t) {
    let r = Reflect.getPrototypeOf(t);
    for (; r; ) {
      const o = Reflect.getOwnPropertyDescriptor(r, e);
      if (o)
        return o;
      r = Reflect.getPrototypeOf(r);
    }
  }
}
function lt(t) {
  return Object.getPrototypeOf(t) === Set.prototype;
}
function ft(t) {
  return Object.getPrototypeOf(t) === Map.prototype;
}
function b(t) {
  var e;
  return (e = t.copy) !== null && e !== void 0 ? e : t.original;
}
function E(t) {
  return !!u(t);
}
function u(t) {
  return typeof t != "object" ? null : t?.[xt];
}
function ut(t) {
  var e;
  const r = u(t);
  return r ? (e = r.copy) !== null && e !== void 0 ? e : r.original : t;
}
function M(t, e) {
  if (!t || typeof t != "object")
    return !1;
  let r;
  return Object.getPrototypeOf(t) === Object.prototype || Array.isArray(t) || t instanceof Map || t instanceof Set || !!e?.mark && ((r = e.mark(t, w)) === w.immutable || typeof r == "function");
}
function At(t, e = []) {
  if (Object.hasOwnProperty.call(t, "key")) {
    const r = t.parent.copy, o = u(P(r, t.key));
    if (o !== null && o?.original !== t.original)
      return null;
    const n = t.parent.type === 3, a = n ? Array.from(t.parent.setMap.keys()).indexOf(t.key) : t.key;
    if (!(n && r.size > a || G(r, a)))
      return null;
    e.push(a);
  }
  if (t.parent)
    return At(t.parent, e);
  e.reverse();
  try {
    Kt(t.copy, e);
  } catch {
    return null;
  }
  return e;
}
function _(t) {
  return Array.isArray(t) ? 1 : t instanceof Map ? 2 : t instanceof Set ? 3 : 0;
}
function P(t, e) {
  return _(t) === 2 ? t.get(e) : t[e];
}
function B(t, e, r) {
  _(t) === 2 ? t.set(e, r) : t[e] = r;
}
function F(t, e) {
  const r = u(t);
  return (r ? b(r) : t)[e];
}
function x(t, e) {
  return t === e ? t !== 0 || 1 / t === 1 / e : t !== t && e !== e;
}
function et(t) {
  if (t)
    for (; t.finalities.revoke.length > 0; )
      t.finalities.revoke.pop()();
}
function V(t, e) {
  return e ? t : [""].concat(t).map((r) => {
    const o = `${r}`;
    return o.indexOf("/") === -1 && o.indexOf("~") === -1 ? o : o.replace(/~/g, "~0").replace(/\//g, "~1");
  }).join("/");
}
function Kt(t, e) {
  for (let r = 0; r < e.length - 1; r += 1) {
    const o = e[r];
    if (t = P(_(t) === 3 ? Array.from(t) : t, o), typeof t != "object")
      throw new Error(`Cannot resolve patch at '${e.join("/")}'.`);
  }
  return t;
}
function Yt(t) {
  const e = Object.create(Object.getPrototypeOf(t));
  return Reflect.ownKeys(t).forEach((r) => {
    let o = Reflect.getOwnPropertyDescriptor(t, r);
    if (o.enumerable && o.configurable && o.writable) {
      e[r] = t[r];
      return;
    }
    o.writable || (o.writable = !0, o.configurable = !0), (o.get || o.set) && (o = {
      configurable: !0,
      writable: !0,
      enumerable: o.enumerable,
      value: t[r]
    }), Reflect.defineProperty(e, r, o);
  }), e;
}
const Zt = Object.prototype.propertyIsEnumerable;
function zt(t, e) {
  let r;
  if (Array.isArray(t))
    return Array.prototype.concat.call(t);
  if (t instanceof Set) {
    if (!lt(t)) {
      const o = Object.getPrototypeOf(t).constructor;
      return new o(t.values());
    }
    return Set.prototype.difference ? Set.prototype.difference.call(t, /* @__PURE__ */ new Set()) : new Set(t.values());
  } else if (t instanceof Map) {
    if (!ft(t)) {
      const o = Object.getPrototypeOf(t).constructor;
      return new o(t);
    }
    return new Map(t);
  } else if (e?.mark && (r = e.mark(t, w), r !== void 0) && r !== w.mutable) {
    if (r === w.immutable)
      return Yt(t);
    if (typeof r == "function") {
      if (e.enablePatches || e.enableAutoFreeze)
        throw new Error("You can't use mark and patches or auto freeze together.");
      return r();
    }
    throw new Error(`Unsupported mark result: ${r}`);
  } else if (typeof t == "object" && Object.getPrototypeOf(t) === Object.prototype) {
    const o = {};
    return Object.keys(t).forEach((n) => {
      o[n] = t[n];
    }), Object.getOwnPropertySymbols(t).forEach((n) => {
      Zt.call(t, n) && (o[n] = t[n]);
    }), o;
  } else
    throw new Error("Please check mark() to ensure that it is a stable marker draftable function.");
}
function g(t) {
  t.copy || (t.copy = zt(t.original, t.options));
}
function Y(t) {
  if (!M(t))
    return ut(t);
  if (Array.isArray(t))
    return t.map(Y);
  if (t instanceof Map) {
    const r = Array.from(t.entries()).map(([o, n]) => [
      o,
      Y(n)
    ]);
    if (!ft(t)) {
      const o = Object.getPrototypeOf(t).constructor;
      return new o(r);
    }
    return new Map(r);
  }
  if (t instanceof Set) {
    const r = Array.from(t).map(Y);
    if (!lt(t)) {
      const o = Object.getPrototypeOf(t).constructor;
      return new o(r);
    }
    return new Set(r);
  }
  const e = Object.create(Object.getPrototypeOf(t));
  for (const r in t)
    e[r] = Y(t[r]);
  return e;
}
function J(t) {
  return E(t) ? Y(t) : t;
}
function k(t) {
  var e;
  t.assignedMap = (e = t.assignedMap) !== null && e !== void 0 ? e : /* @__PURE__ */ new Map(), t.operated || (t.operated = !0, t.parent && k(t.parent));
}
function gt() {
  throw new Error("Cannot modify frozen object");
}
function I(t, e, r, o, n) {
  {
    r = r ?? /* @__PURE__ */ new WeakMap(), o = o ?? [], n = n ?? [];
    const a = r.has(t) ? r.get(t) : t;
    if (o.length > 0) {
      const i = o.indexOf(a);
      if (a && typeof a == "object" && i !== -1)
        throw o[0] === a ? new Error("Forbids circular reference") : new Error(`Forbids circular reference: ~/${n.slice(0, i).map((s, c) => {
          if (typeof s == "symbol")
            return `[${s.toString()}]`;
          const l = o[c];
          return typeof s == "object" && (l instanceof Map || l instanceof Set) ? Array.from(l.keys()).indexOf(s) : s;
        }).join("/")}`);
      o.push(a), n.push(e);
    } else
      o.push(a);
  }
  if (Object.isFrozen(t) || E(t)) {
    o.pop(), n.pop();
    return;
  }
  switch (_(t)) {
    case 2:
      for (const [i, s] of t)
        I(i, i, r, o, n), I(s, i, r, o, n);
      t.set = t.clear = t.delete = gt;
      break;
    case 3:
      for (const i of t)
        I(i, i, r, o, n);
      t.add = t.clear = t.delete = gt;
      break;
    case 1:
      Object.freeze(t);
      let a = 0;
      for (const i of t)
        I(i, a, r, o, n), a += 1;
      break;
    default:
      Object.freeze(t), Object.keys(t).forEach((i) => {
        const s = t[i];
        I(s, i, r, o, n);
      });
  }
  o.pop(), n.pop();
}
function pt(t, e) {
  const r = _(t);
  if (r === 0)
    Reflect.ownKeys(t).forEach((o) => {
      e(o, t[o], t);
    });
  else if (r === 1) {
    let o = 0;
    for (const n of t)
      e(o, n, t), o += 1;
  } else
    t.forEach((o, n) => e(n, o, t));
}
function Dt(t, e, r) {
  if (E(t) || !M(t, r) || e.has(t) || Object.isFrozen(t))
    return;
  const o = t instanceof Set, n = o ? /* @__PURE__ */ new Map() : void 0;
  if (e.add(t), pt(t, (a, i) => {
    var s;
    if (E(i)) {
      const c = u(i);
      g(c);
      const l = !((s = c.assignedMap) === null || s === void 0) && s.size || c.operated ? c.copy : c.original;
      B(o ? n : t, a, l);
    } else
      Dt(i, e, r);
  }), n) {
    const a = t, i = Array.from(a);
    a.clear(), i.forEach((s) => {
      a.add(n.has(s) ? n.get(s) : s);
    });
  }
}
function Gt(t, e) {
  const r = t.type === 3 ? t.setMap : t.copy;
  t.finalities.revoke.length > 1 && t.assignedMap.get(e) && r && Dt(P(r, e), t.finalities.handledSet, t.options);
}
function rt(t) {
  t.type === 3 && t.copy && (t.copy.clear(), t.setMap.forEach((e) => {
    t.copy.add(ut(e));
  }));
}
function ot(t, e, r, o) {
  if (t.operated && t.assignedMap && t.assignedMap.size > 0 && !t.finalized) {
    if (r && o) {
      const n = At(t);
      n && e(t, n, r, o);
    }
    t.finalized = !0;
  }
}
function ht(t, e, r, o) {
  const n = u(r);
  n && (n.callbacks || (n.callbacks = []), n.callbacks.push((a, i) => {
    var s;
    const c = t.type === 3 ? t.setMap : t.copy;
    if (x(P(c, e), r)) {
      let l = n.original;
      n.copy && (l = n.copy), rt(t), ot(t, o, a, i), t.options.enableAutoFreeze && (t.options.updatedValues = (s = t.options.updatedValues) !== null && s !== void 0 ? s : /* @__PURE__ */ new WeakMap(), t.options.updatedValues.set(l, n.original)), B(c, e, l);
    }
  }), t.options.enableAutoFreeze && n.finalities !== t.finalities && (t.options.enableAutoFreeze = !1)), M(r, t.options) && t.finalities.draft.push(() => {
    const a = t.type === 3 ? t.setMap : t.copy;
    x(P(a, e), r) && Gt(t, e);
  });
}
function Lt(t, e, r, o, n) {
  let { original: a, assignedMap: i, options: s } = t, c = t.copy;
  c.length < a.length && ([a, c] = [c, a], [r, o] = [o, r]);
  for (let l = 0; l < a.length; l += 1)
    if (i.get(l.toString()) && c[l] !== a[l]) {
      const f = e.concat([l]), h = V(f, n);
      r.push({
        op: y.Replace,
        path: h,
        // If it is a draft, it needs to be deep cloned, and it may also be non-draft.
        value: J(c[l])
      }), o.push({
        op: y.Replace,
        path: h,
        // If it is a draft, it needs to be deep cloned, and it may also be non-draft.
        value: J(a[l])
      });
    }
  for (let l = a.length; l < c.length; l += 1) {
    const f = e.concat([l]), h = V(f, n);
    r.push({
      op: y.Add,
      path: h,
      // If it is a draft, it needs to be deep cloned, and it may also be non-draft.
      value: J(c[l])
    });
  }
  if (a.length < c.length) {
    const { arrayLengthAssignment: l = !0 } = s.enablePatches;
    if (l) {
      const f = e.concat(["length"]), h = V(f, n);
      o.push({
        op: y.Replace,
        path: h,
        value: a.length
      });
    } else
      for (let f = c.length; a.length < f; f -= 1) {
        const h = e.concat([f - 1]), j = V(h, n);
        o.push({
          op: y.Remove,
          path: j
        });
      }
  }
}
function Bt({ original: t, copy: e, assignedMap: r }, o, n, a, i) {
  r.forEach((s, c) => {
    const l = P(t, c), f = J(P(e, c)), h = s ? G(t, c) ? y.Replace : y.Add : y.Remove;
    if (x(l, f) && h === y.Replace)
      return;
    const j = o.concat(c), S = V(j, i);
    n.push(h === y.Remove ? { op: h, path: S } : { op: h, path: S, value: f }), a.push(h === y.Add ? { op: y.Remove, path: S } : h === y.Remove ? { op: y.Add, path: S, value: l } : { op: y.Replace, path: S, value: l });
  });
}
function Ht({ original: t, copy: e }, r, o, n, a) {
  let i = 0;
  t.forEach((s) => {
    if (!e.has(s)) {
      const c = r.concat([i]), l = V(c, a);
      o.push({
        op: y.Remove,
        path: l,
        value: s
      }), n.unshift({
        op: y.Add,
        path: l,
        value: s
      });
    }
    i += 1;
  }), i = 0, e.forEach((s) => {
    if (!t.has(s)) {
      const c = r.concat([i]), l = V(c, a);
      o.push({
        op: y.Add,
        path: l,
        value: s
      }), n.unshift({
        op: y.Remove,
        path: l,
        value: s
      });
    }
    i += 1;
  });
}
function L(t, e, r, o) {
  const { pathAsArray: n = !0 } = t.options.enablePatches;
  switch (t.type) {
    case 0:
    case 2:
      return Bt(t, e, r, o, n);
    case 1:
      return Lt(t, e, r, o, n);
    case 3:
      return Ht(t, e, r, o, n);
  }
}
const Q = (t, e, r = !1) => {
  if (typeof t == "object" && t !== null && (!M(t, e) || r))
    throw new Error("Strict mode: Mutable data cannot be accessed directly, please use 'unsafe(callback)' wrap.");
}, nt = {
  get size() {
    return b(u(this)).size;
  },
  has(t) {
    return b(u(this)).has(t);
  },
  set(t, e) {
    const r = u(this), o = b(r);
    return (!o.has(t) || !x(o.get(t), e)) && (g(r), k(r), r.assignedMap.set(t, !0), r.copy.set(t, e), ht(r, t, e, L)), this;
  },
  delete(t) {
    if (!this.has(t))
      return !1;
    const e = u(this);
    return g(e), k(e), e.original.has(t) ? e.assignedMap.set(t, !1) : e.assignedMap.delete(t), e.copy.delete(t), !0;
  },
  clear() {
    const t = u(this);
    if (this.size) {
      g(t), k(t), t.assignedMap = /* @__PURE__ */ new Map();
      for (const [e] of t.original)
        t.assignedMap.set(e, !1);
      t.copy.clear();
    }
  },
  forEach(t, e) {
    const r = u(this);
    b(r).forEach((o, n) => {
      t.call(e, this.get(n), n, this);
    });
  },
  get(t) {
    var e, r;
    const o = u(this), n = b(o).get(t), a = ((r = (e = o.options).mark) === null || r === void 0 ? void 0 : r.call(e, n, w)) === w.mutable;
    if (o.options.strict && Q(n, o.options, a), a || o.finalized || !M(n, o.options) || n !== o.original.get(t))
      return n;
    const i = ct.createDraft({
      original: n,
      parentDraft: o,
      key: t,
      finalities: o.finalities,
      options: o.options
    });
    return g(o), o.copy.set(t, i), i;
  },
  keys() {
    return b(u(this)).keys();
  },
  values() {
    const t = this.keys();
    return {
      [H]: () => this.values(),
      next: () => {
        const e = t.next();
        return e.done ? e : {
          done: !1,
          value: this.get(e.value)
        };
      }
    };
  },
  entries() {
    const t = this.keys();
    return {
      [H]: () => this.entries(),
      next: () => {
        const e = t.next();
        if (e.done)
          return e;
        const r = this.get(e.value);
        return {
          done: !1,
          value: [e.value, r]
        };
      }
    };
  },
  [H]() {
    return this.entries();
  }
}, Jt = Reflect.ownKeys(nt), bt = (t, e, { isValuesIterator: r }) => () => {
  var o, n;
  const a = e.next();
  if (a.done)
    return a;
  const i = a.value;
  let s = t.setMap.get(i);
  const c = u(s), l = ((n = (o = t.options).mark) === null || n === void 0 ? void 0 : n.call(o, s, w)) === w.mutable;
  if (t.options.strict && Q(i, t.options, l), !l && !c && M(i, t.options) && !t.finalized && t.original.has(i)) {
    const f = ct.createDraft({
      original: i,
      parentDraft: t,
      key: i,
      finalities: t.finalities,
      options: t.options
    });
    t.setMap.set(i, f), s = f;
  } else c && (s = c.proxy);
  return {
    done: !1,
    value: r ? s : [s, s]
  };
}, q = {
  get size() {
    return u(this).setMap.size;
  },
  has(t) {
    const e = u(this);
    if (e.setMap.has(t))
      return !0;
    g(e);
    const r = u(t);
    return !!(r && e.setMap.has(r.original));
  },
  add(t) {
    const e = u(this);
    return this.has(t) || (g(e), k(e), e.assignedMap.set(t, !0), e.setMap.set(t, t), ht(e, t, t, L)), this;
  },
  delete(t) {
    if (!this.has(t))
      return !1;
    const e = u(this);
    g(e), k(e);
    const r = u(t);
    return r && e.setMap.has(r.original) ? (e.assignedMap.set(r.original, !1), e.setMap.delete(r.original)) : (!r && e.setMap.has(t) ? e.assignedMap.set(t, !1) : e.assignedMap.delete(t), e.setMap.delete(t));
  },
  clear() {
    if (!this.size)
      return;
    const t = u(this);
    g(t), k(t);
    for (const e of t.original)
      t.assignedMap.set(e, !1);
    t.setMap.clear();
  },
  values() {
    const t = u(this);
    g(t);
    const e = t.setMap.keys();
    return {
      [Symbol.iterator]: () => this.values(),
      next: bt(t, e, { isValuesIterator: !0 })
    };
  },
  entries() {
    const t = u(this);
    g(t);
    const e = t.setMap.keys();
    return {
      [Symbol.iterator]: () => this.entries(),
      next: bt(t, e, {
        isValuesIterator: !1
      })
    };
  },
  keys() {
    return this.values();
  },
  [H]() {
    return this.values();
  },
  forEach(t, e) {
    const r = this.values();
    let o = r.next();
    for (; !o.done; )
      t.call(e, o.value, o.value, this), o = r.next();
  }
};
Set.prototype.difference && Object.assign(q, {
  intersection(t) {
    return Set.prototype.intersection.call(new Set(this.values()), t);
  },
  union(t) {
    return Set.prototype.union.call(new Set(this.values()), t);
  },
  difference(t) {
    return Set.prototype.difference.call(new Set(this.values()), t);
  },
  symmetricDifference(t) {
    return Set.prototype.symmetricDifference.call(new Set(this.values()), t);
  },
  isSubsetOf(t) {
    return Set.prototype.isSubsetOf.call(new Set(this.values()), t);
  },
  isSupersetOf(t) {
    return Set.prototype.isSupersetOf.call(new Set(this.values()), t);
  },
  isDisjointFrom(t) {
    return Set.prototype.isDisjointFrom.call(new Set(this.values()), t);
  }
});
const Xt = Reflect.ownKeys(q), Ct = {
  get(t, e, r) {
    var o, n;
    const a = (o = t.copy) === null || o === void 0 ? void 0 : o[e];
    if (a && t.finalities.draftsCache.has(a))
      return a;
    if (e === xt)
      return t;
    let i;
    if (t.options.mark) {
      const l = e === "size" && (t.original instanceof Map || t.original instanceof Set) ? Reflect.get(t.original, e) : Reflect.get(t.original, e, r);
      if (i = t.options.mark(l, w), i === w.mutable)
        return t.options.strict && Q(l, t.options, !0), l;
    }
    const s = b(t);
    if (s instanceof Map && Jt.includes(e))
      return e === "size" ? Object.getOwnPropertyDescriptor(nt, "size").get.call(t.proxy) : nt[e].bind(t.proxy);
    if (s instanceof Set && Xt.includes(e))
      return e === "size" ? Object.getOwnPropertyDescriptor(q, "size").get.call(t.proxy) : q[e].bind(t.proxy);
    if (!G(s, e)) {
      const l = vt(s, e);
      return l ? "value" in l ? l.value : (
        // !case: support for getter
        (n = l.get) === null || n === void 0 ? void 0 : n.call(t.proxy)
      ) : void 0;
    }
    const c = s[e];
    if (t.options.strict && Q(c, t.options), t.finalized || !M(c, t.options))
      return c;
    if (c === F(t.original, e)) {
      if (g(t), t.copy[e] = dt({
        original: t.original[e],
        parentDraft: t,
        key: t.type === 1 ? Number(e) : e,
        finalities: t.finalities,
        options: t.options
      }), typeof i == "function") {
        const l = u(t.copy[e]);
        return g(l), k(l), l.copy;
      }
      return t.copy[e];
    }
    return E(c) && t.finalities.draftsCache.add(c), c;
  },
  set(t, e, r) {
    var o;
    if (t.type === 3 || t.type === 2)
      throw new Error("Map/Set draft does not support any property assignment.");
    let n;
    if (t.type === 1 && e !== "length" && !(Number.isInteger(n = Number(e)) && n >= 0 && (e === 0 || n === 0 || String(n) === String(e))))
      throw new Error("Only supports setting array indices and the 'length' property.");
    const a = vt(b(t), e);
    if (a?.set)
      return a.set.call(t.proxy, r), !0;
    const i = F(b(t), e), s = u(i);
    return s && x(s.original, r) ? (t.copy[e] = r, t.assignedMap = (o = t.assignedMap) !== null && o !== void 0 ? o : /* @__PURE__ */ new Map(), t.assignedMap.set(e, !1), !0) : (x(r, i) && (r !== void 0 || G(t.original, e)) || (g(t), k(t), G(t.original, e) && x(r, t.original[e]) ? t.assignedMap.delete(e) : t.assignedMap.set(e, !0), t.copy[e] = r, ht(t, e, r, L)), !0);
  },
  has(t, e) {
    return e in b(t);
  },
  ownKeys(t) {
    return Reflect.ownKeys(b(t));
  },
  getOwnPropertyDescriptor(t, e) {
    const r = b(t), o = Reflect.getOwnPropertyDescriptor(r, e);
    return o && {
      writable: !0,
      configurable: t.type !== 1 || e !== "length",
      enumerable: o.enumerable,
      value: r[e]
    };
  },
  getPrototypeOf(t) {
    return Reflect.getPrototypeOf(t.original);
  },
  setPrototypeOf() {
    throw new Error("Cannot call 'setPrototypeOf()' on drafts");
  },
  defineProperty() {
    throw new Error("Cannot call 'defineProperty()' on drafts");
  },
  deleteProperty(t, e) {
    var r;
    return t.type === 1 ? Ct.set.call(this, t, e, void 0, t.proxy) : (F(t.original, e) !== void 0 || e in t.original ? (g(t), k(t), t.assignedMap.set(e, !1)) : (t.assignedMap = (r = t.assignedMap) !== null && r !== void 0 ? r : /* @__PURE__ */ new Map(), t.assignedMap.delete(e)), t.copy && delete t.copy[e], !0);
  }
};
function dt(t) {
  const { original: e, parentDraft: r, key: o, finalities: n, options: a } = t, i = _(e), s = {
    type: i,
    finalized: !1,
    parent: r,
    original: e,
    copy: null,
    proxy: null,
    finalities: n,
    options: a,
    // Mapping of draft Set items to their corresponding draft values.
    setMap: i === 3 ? new Map(e.entries()) : void 0
  };
  (o || "key" in t) && (s.key = o);
  const { proxy: c, revoke: l } = Proxy.revocable(i === 1 ? Object.assign([], s) : s, Ct);
  if (n.revoke.push(l), s.proxy = c, r) {
    const f = r;
    f.finalities.draft.push((h, j) => {
      var S, T;
      const D = u(c);
      let O = f.type === 3 ? f.setMap : f.copy;
      const R = P(O, o), m = u(R);
      if (m) {
        let A = m.original;
        m.operated && (A = ut(R)), rt(m), ot(m, L, h, j), f.options.enableAutoFreeze && (f.options.updatedValues = (S = f.options.updatedValues) !== null && S !== void 0 ? S : /* @__PURE__ */ new WeakMap(), f.options.updatedValues.set(A, m.original)), B(O, o, A);
      }
      (T = D.callbacks) === null || T === void 0 || T.forEach((A) => {
        A(h, j);
      });
    });
  } else {
    const f = u(c);
    f.finalities.draft.push((h, j) => {
      rt(f), ot(f, L, h, j);
    });
  }
  return c;
}
ct.createDraft = dt;
function Qt(t, e, r, o, n) {
  var a;
  const i = u(t), s = (a = i?.original) !== null && a !== void 0 ? a : t, c = !!e.length;
  if (i?.operated)
    for (; i.finalities.draft.length > 0; )
      i.finalities.draft.pop()(r, o);
  const l = c ? e[0] : i ? i.operated ? i.copy : i.original : t;
  return i && et(i), n && I(l, l, i?.options.updatedValues), [
    l,
    r && c ? [{ op: y.Replace, path: [], value: e[0] }] : r,
    o && c ? [{ op: y.Replace, path: [], value: s }] : o
  ];
}
function qt(t, e) {
  var r;
  const o = {
    draft: [],
    revoke: [],
    handledSet: /* @__PURE__ */ new WeakSet(),
    draftsCache: /* @__PURE__ */ new WeakSet()
  };
  let n, a;
  e.enablePatches && (n = [], a = []);
  const i = ((r = e.mark) === null || r === void 0 ? void 0 : r.call(e, t, w)) === w.mutable || !M(t, e) ? t : dt({
    original: t,
    parentDraft: null,
    finalities: o,
    options: e
  });
  return [
    i,
    (s = []) => {
      const [c, l, f] = Qt(i, s, n, a, e.enableAutoFreeze);
      return e.enablePatches ? [c, l, f] : c;
    }
  ];
}
function it(t) {
  const { rootDraft: e, value: r, useRawReturn: o = !1, isRoot: n = !0 } = t;
  pt(r, (a, i, s) => {
    const c = u(i);
    if (c && e && c.finalities === e.finalities) {
      t.isContainDraft = !0;
      const l = c.original;
      if (s instanceof Set) {
        const f = Array.from(s);
        s.clear(), f.forEach((h) => s.add(a === h ? l : h));
      } else
        B(s, a, l);
    } else typeof i == "object" && i !== null && (t.value = i, t.isRoot = !1, it(t));
  }), n && (t.isContainDraft || console.warn("The return value does not contain any draft, please use 'rawReturn()' to wrap the return value to improve performance."), o && console.warn("The return value contains drafts, please don't use 'rawReturn()' to wrap the return value."));
}
function Vt(t) {
  var e;
  const r = u(t);
  if (!M(t, r?.options))
    return t;
  const o = _(t);
  if (r && !r.operated)
    return r.original;
  let n;
  function a() {
    n = o === 2 ? ft(t) ? new Map(t) : new (Object.getPrototypeOf(t)).constructor(t) : o === 3 ? Array.from(r.setMap.values()) : zt(t, r?.options);
  }
  if (r) {
    r.finalized = !0;
    try {
      a();
    } finally {
      r.finalized = !1;
    }
  } else
    n = t;
  if (pt(n, (i, s) => {
    if (r && x(P(r.original, i), s))
      return;
    const c = Vt(s);
    c !== s && (n === t && a(), B(n, i, c));
  }), o === 3) {
    const i = (e = r?.original) !== null && e !== void 0 ? e : n;
    return lt(i) ? new Set(n) : new (Object.getPrototypeOf(i)).constructor(n);
  }
  return n;
}
function wt(t) {
  if (!E(t))
    throw new Error(`current() is only used for Draft, parameter: ${t}`);
  return Vt(t);
}
const Ft = (t) => function e(r, o, n) {
  var a, i, s;
  if (typeof r == "function" && typeof o != "function")
    return function(d, ...C) {
      return e(d, (z) => r.call(this, z, ...C), o);
    };
  const c = r, l = o;
  let f = n;
  if (typeof o != "function" && (f = o), f !== void 0 && Object.prototype.toString.call(f) !== "[object Object]")
    throw new Error(`Invalid options: ${f}, 'options' should be an object.`);
  f = Object.assign(Object.assign({}, t), f);
  const h = E(c) ? wt(c) : c, j = Array.isArray(f.mark) ? ((d, C) => {
    for (const z of f.mark) {
      if (typeof z != "function")
        throw new Error(`Invalid mark: ${z}, 'mark' should be a function.`);
      const K = z(d, C);
      if (K)
        return K;
    }
  }) : f.mark, S = (a = f.enablePatches) !== null && a !== void 0 ? a : !1, T = (i = f.strict) !== null && i !== void 0 ? i : !1, D = {
    enableAutoFreeze: (s = f.enableAutoFreeze) !== null && s !== void 0 ? s : !1,
    mark: j,
    strict: T,
    enablePatches: S
  };
  if (!M(h, D) && typeof h == "object" && h !== null)
    throw new Error("Invalid base state: create() only supports plain objects, arrays, Set, Map or using mark() to mark the state as immutable.");
  const [O, R] = qt(h, D);
  if (typeof o != "function") {
    if (!M(h, D))
      throw new Error("Invalid base state: create() only supports plain objects, arrays, Set, Map or using mark() to mark the state as immutable.");
    return [O, R];
  }
  let m;
  try {
    m = l(O);
  } catch (d) {
    throw et(u(O)), d;
  }
  const A = (d) => {
    const C = u(O);
    if (!E(d)) {
      if (d !== void 0 && !x(d, O) && C?.operated)
        throw new Error("Either the value is returned as a new non-draft value, or only the draft is modified without returning any value.");
      const K = d?.[Pt];
      if (K) {
        const _t = K[0];
        return D.strict && typeof d == "object" && d !== null && it({
          rootDraft: C,
          value: d,
          useRawReturn: !0
        }), R([_t]);
      }
      if (d !== void 0)
        return typeof d == "object" && d !== null && it({ rootDraft: C, value: d }), R([d]);
    }
    if (d === O || d === void 0)
      return R([]);
    const z = u(d);
    if (D === z.options) {
      if (z.operated)
        throw new Error("Cannot return a modified child draft.");
      return R([wt(d)]);
    }
    return R([d]);
  };
  return m instanceof Promise ? m.then(A, (d) => {
    throw et(u(O)), d;
  }) : A(m);
}, te = Ft();
function ee(t) {
  if (arguments.length === 0)
    throw new Error("rawReturn() must be called with a value.");
  if (arguments.length > 1)
    throw new Error("rawReturn() must be called with one argument.");
  return t !== void 0 && (typeof t != "object" || t === null) && console.warn("rawReturn() must be called with an object(including plain object, arrays, Set, Map, etc.) or `undefined`, other types do not need to be returned via rawReturn()."), {
    [Pt]: [t]
  };
}
Object.prototype.constructor.toString();
const re = (t, e) => typeof e == "function" ? te(t.value, (r) => {
  const o = e(r);
  return E(o) ? r : typeof o == "object" && !E(o) ? ee(o) : o;
}) : e, oe = (t, e) => (t.value = re(t, e), t.value), ne = (t) => {
  const e = Wt(t);
  return e.set = (r) => oe(e, r), e;
}, $t = (t) => {
  const e = yt(() => t.value, [t]), r = () => t.peek(), o = yt((n) => Rt(() => {
    n(t.value);
  }), [t]);
  return It(
    o,
    e,
    r
  );
};
class ie {
  store = {};
  // --------------
  getStore() {
    return this.store;
  }
  // --------------
  getStoreValues() {
    const e = {};
    for (const r in this.store)
      e[r] = this.store[r].value;
    return e;
  }
  // --------------
  getStoreState(e) {
    return this.store[e];
  }
  // --------------
  setStoreState(e, r) {
    return e in this.store ? console.warn(`Signal with id "${e}" already exists in the global store. Skipping creation.`) : (this.store[e] = ne(r), this.store[e].id = e, console.log(`Created signal with id "${e}" in the global store with value:`, r)), this.store[e];
  }
  // --------------
  hasState(e) {
    return e in this.store;
  }
  // --------------
  clearStore() {
    return this.store = {}, this.store;
  }
}
const U = new ie(), se = (t, e) => {
  if (typeof t == "string") {
    if (t.length === 0)
      throw new Error("Store ID cannot be an empty string");
    return U.hasState(t) ? U.getStoreState(t) : U.setStoreState(t, e);
  }
  if (typeof t == "function")
    return t(U.getStore());
  throw new Error("useSignalStore expects either a string ID or a function");
}, ae = (t) => (e) => {
  const r = St(() => {
    if (typeof e == "string") {
      if (!(e in t))
        throw new Error(`Store key "${e}" does not exist. Make sure it was defined in createSignalStore.`);
      return t[e];
    }
    if (typeof e == "function") {
      const n = e(t);
      return n instanceof v ? n : Nt(() => {
        const a = {}, i = e(t);
        for (const s in i)
          a[s] = i[s].value;
        return a;
      });
    }
    throw new Error("useStore expects either a string key or a selector function");
  }, [e]), o = $t(r);
  return typeof e == "string" ? [o, r.set] : o;
}, le = (t) => {
  if (typeof t != "object" || t === null)
    throw new Error("createSignalStore expects an object as initialStates");
  for (const r in t)
    U.setStoreState(r, t[r]);
  const e = U.getStore();
  return {
    store: e,
    useStore: ae(e)
  };
}, fe = (t, e) => {
  const r = St(() => se(t, e), [
    t,
    e
  ]), o = $t(r);
  return typeof t == "string" ? [o, r.set] : o;
};
export {
  ie as G,
  le as c,
  U as g,
  fe as u
};
