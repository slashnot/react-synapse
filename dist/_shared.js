import { useMemo as Ne, useCallback as q, useSyncExternalStore as Me } from "react";
var Te = Symbol.for("preact-signals");
function g() {
  if (F > 1)
    F--;
  else {
    for (var e, n = !1; H !== void 0; ) {
      var t = H;
      for (H = void 0, ee++; t !== void 0; ) {
        var o = t.o;
        if (t.o = void 0, t.f &= -3, !(8 & t.f) && Re(t)) try {
          t.c();
        } catch (i) {
          n || (e = i, n = !0);
        }
        t = o;
      }
    }
    if (ee = 0, F--, n) throw e;
  }
}
function rn(e) {
  if (F > 0) return e();
  F++;
  try {
    return e();
  } finally {
    g();
  }
}
var d = void 0;
function Oe(e) {
  var n = d;
  d = void 0;
  try {
    return e();
  } finally {
    d = n;
  }
}
var H = void 0, F = 0, ee = 0, J = 0;
function je(e) {
  if (d !== void 0) {
    var n = e.n;
    if (n === void 0 || n.t !== d)
      return n = { i: 0, S: e, p: d.s, n: void 0, t: d, e: void 0, x: void 0, r: n }, d.s !== void 0 && (d.s.n = n), d.s = n, e.n = n, 32 & d.f && e.S(n), n;
    if (n.i === -1)
      return n.i = 0, n.n !== void 0 && (n.n.p = n.p, n.p !== void 0 && (n.p.n = n.n), n.p = d.s, n.n = void 0, d.s.n = n, d.s = n), n;
  }
}
function b(e, n) {
  this.v = e, this.i = 0, this.n = void 0, this.t = void 0, this.W = n?.watched, this.Z = n?.unwatched, this.name = n?.name;
}
b.prototype.brand = Te;
b.prototype.h = function() {
  return !0;
};
b.prototype.S = function(e) {
  var n = this, t = this.t;
  t !== e && e.e === void 0 && (e.x = t, this.t = e, t !== void 0 ? t.e = e : Oe(function() {
    var o;
    (o = n.W) == null || o.call(n);
  }));
};
b.prototype.U = function(e) {
  var n = this;
  if (this.t !== void 0) {
    var t = e.e, o = e.x;
    t !== void 0 && (t.x = o, e.e = void 0), o !== void 0 && (o.e = t, e.x = void 0), e === this.t && (this.t = o, o === void 0 && Oe(function() {
      var i;
      (i = n.Z) == null || i.call(n);
    }));
  }
};
b.prototype.subscribe = function(e) {
  var n = this;
  return fe(function() {
    var t = n.value, o = d;
    d = void 0;
    try {
      e(t);
    } finally {
      d = o;
    }
  }, { name: "sub" });
};
b.prototype.valueOf = function() {
  return this.value;
};
b.prototype.toString = function() {
  return this.value + "";
};
b.prototype.toJSON = function() {
  return this.value;
};
b.prototype.peek = function() {
  var e = d;
  d = void 0;
  try {
    return this.value;
  } finally {
    d = e;
  }
};
Object.defineProperty(b.prototype, "value", { get: function() {
  var e = je(this);
  return e !== void 0 && (e.i = this.i), this.v;
}, set: function(e) {
  if (e !== this.v) {
    if (ee > 100) throw new Error("Cycle detected");
    this.v = e, this.i++, J++, F++;
    try {
      for (var n = this.t; n !== void 0; n = n.x) n.t.N();
    } finally {
      g();
    }
  }
} });
function Ue(e, n) {
  return new b(e, n);
}
function Re(e) {
  for (var n = e.s; n !== void 0; n = n.n) if (n.S.i !== n.i || !n.S.h() || n.S.i !== n.i) return !0;
  return !1;
}
function Ee(e) {
  for (var n = e.s; n !== void 0; n = n.n) {
    var t = n.S.n;
    if (t !== void 0 && (n.r = t), n.S.n = n, n.i = -1, n.n === void 0) {
      e.s = n;
      break;
    }
  }
}
function ze(e) {
  for (var n = e.s, t = void 0; n !== void 0; ) {
    var o = n.p;
    n.i === -1 ? (n.S.U(n), o !== void 0 && (o.n = n.n), n.n !== void 0 && (n.n.p = o)) : t = n, n.S.n = n.r, n.r !== void 0 && (n.r = void 0), n = o;
  }
  e.s = t;
}
function V(e, n) {
  b.call(this, void 0), this.x = e, this.s = void 0, this.g = J - 1, this.f = 4, this.W = n?.watched, this.Z = n?.unwatched, this.name = n?.name;
}
V.prototype = new b();
V.prototype.h = function() {
  if (this.f &= -3, 1 & this.f) return !1;
  if ((36 & this.f) == 32 || (this.f &= -5, this.g === J)) return !0;
  if (this.g = J, this.f |= 1, this.i > 0 && !Re(this))
    return this.f &= -2, !0;
  var e = d;
  try {
    Ee(this), d = this;
    var n = this.x();
    (16 & this.f || this.v !== n || this.i === 0) && (this.v = n, this.f &= -17, this.i++);
  } catch (t) {
    this.v = t, this.f |= 16, this.i++;
  }
  return d = e, ze(this), this.f &= -2, !0;
};
V.prototype.S = function(e) {
  if (this.t === void 0) {
    this.f |= 36;
    for (var n = this.s; n !== void 0; n = n.n) n.S.S(n);
  }
  b.prototype.S.call(this, e);
};
V.prototype.U = function(e) {
  if (this.t !== void 0 && (b.prototype.U.call(this, e), this.t === void 0)) {
    this.f &= -33;
    for (var n = this.s; n !== void 0; n = n.n) n.S.U(n);
  }
};
V.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 6;
    for (var e = this.t; e !== void 0; e = e.x) e.t.N();
  }
};
Object.defineProperty(V.prototype, "value", { get: function() {
  if (1 & this.f) throw new Error("Cycle detected");
  var e = je(this);
  if (this.h(), e !== void 0 && (e.i = this.i), 16 & this.f) throw this.v;
  return this.v;
} });
function sn(e, n) {
  return new V(e, n);
}
function xe(e) {
  var n = e.u;
  if (e.u = void 0, typeof n == "function") {
    F++;
    var t = d;
    d = void 0;
    try {
      n();
    } catch (o) {
      throw e.f &= -2, e.f |= 8, se(e), o;
    } finally {
      d = t, g();
    }
  }
}
function se(e) {
  for (var n = e.s; n !== void 0; n = n.n) n.S.U(n);
  e.x = void 0, e.s = void 0, xe(e);
}
function We(e) {
  if (d !== this) throw new Error("Out-of-order effect");
  ze(this), d = e, this.f &= -2, 8 & this.f && se(this), g();
}
function U(e, n) {
  this.x = e, this.u = void 0, this.s = void 0, this.o = void 0, this.f = 32, this.name = n?.name;
}
U.prototype.c = function() {
  var e = this.S();
  try {
    if (8 & this.f || this.x === void 0) return;
    var n = this.x();
    typeof n == "function" && (this.u = n);
  } finally {
    e();
  }
};
U.prototype.S = function() {
  if (1 & this.f) throw new Error("Cycle detected");
  this.f |= 1, this.f &= -9, xe(this), Ee(this), F++;
  var e = d;
  return d = this, We.bind(this, e);
};
U.prototype.N = function() {
  2 & this.f || (this.f |= 2, this.o = H, H = this);
};
U.prototype.d = function() {
  this.f |= 8, 1 & this.f || se(this);
};
U.prototype.dispose = function() {
  this.d();
};
function fe(e, n) {
  var t = new U(e, n);
  try {
    t.c();
  } catch (i) {
    throw t.d(), i;
  }
  var o = t.d.bind(t);
  return o[Symbol.dispose] = o, o;
}
const v = {
  Remove: "remove",
  Replace: "replace",
  Add: "add"
}, Pe = Symbol.for("__MUTATIVE_PROXY_DRAFT__"), _e = Symbol("__MUTATIVE_RAW_RETURN_SYMBOL__"), Z = Symbol.iterator, S = {
  mutable: "mutable",
  immutable: "immutable"
}, ce = {};
function Y(e, n) {
  return e instanceof Map ? e.has(n) : Object.prototype.hasOwnProperty.call(e, n);
}
function be(e, n) {
  if (n in e) {
    let t = Reflect.getPrototypeOf(e);
    for (; t; ) {
      const o = Reflect.getOwnPropertyDescriptor(t, n);
      if (o)
        return o;
      t = Reflect.getPrototypeOf(t);
    }
  }
}
function le(e) {
  return Object.getPrototypeOf(e) === Set.prototype;
}
function ae(e) {
  return Object.getPrototypeOf(e) === Map.prototype;
}
function m(e) {
  var n;
  return (n = e.copy) !== null && n !== void 0 ? n : e.original;
}
function x(e) {
  return !!u(e);
}
function u(e) {
  return typeof e != "object" ? null : e?.[Pe];
}
function ue(e) {
  var n;
  const t = u(e);
  return t ? (n = t.copy) !== null && n !== void 0 ? n : t.original : e;
}
function O(e, n) {
  if (!e || typeof e != "object")
    return !1;
  let t;
  return Object.getPrototypeOf(e) === Object.prototype || Array.isArray(e) || e instanceof Map || e instanceof Set || !!n?.mark && ((t = n.mark(e, S)) === S.immutable || typeof t == "function");
}
function Ae(e, n = []) {
  if (Object.hasOwnProperty.call(e, "key")) {
    const t = e.parent.copy, o = u(A(t, e.key));
    if (o !== null && o?.original !== e.original)
      return null;
    const i = e.parent.type === 3, c = i ? Array.from(e.parent.setMap.keys()).indexOf(e.key) : e.key;
    if (!(i && t.size > c || Y(t, c)))
      return null;
    n.push(c);
  }
  if (e.parent)
    return Ae(e.parent, n);
  n.reverse();
  try {
    $e(e.copy, n);
  } catch {
    return null;
  }
  return n;
}
function N(e) {
  return Array.isArray(e) ? 1 : e instanceof Map ? 2 : e instanceof Set ? 3 : 0;
}
function A(e, n) {
  return N(e) === 2 ? e.get(n) : e[n];
}
function L(e, n, t) {
  N(e) === 2 ? e.set(n, t) : e[n] = t;
}
function k(e, n) {
  const t = u(e);
  return (t ? m(t) : e)[n];
}
function _(e, n) {
  return e === n ? e !== 0 || 1 / e === 1 / n : e !== e && n !== n;
}
function ne(e) {
  if (e)
    for (; e.finalities.revoke.length > 0; )
      e.finalities.revoke.pop()();
}
function I(e, n) {
  return n ? e : [""].concat(e).map((t) => {
    const o = `${t}`;
    return o.indexOf("/") === -1 && o.indexOf("~") === -1 ? o : o.replace(/~/g, "~0").replace(/\//g, "~1");
  }).join("/");
}
function $e(e, n) {
  for (let t = 0; t < n.length - 1; t += 1) {
    const o = n[t];
    if (e = A(N(e) === 3 ? Array.from(e) : e, o), typeof e != "object")
      throw new Error(`Cannot resolve patch at '${n.join("/")}'.`);
  }
  return e;
}
function Ke(e) {
  const n = Object.create(Object.getPrototypeOf(e));
  return Reflect.ownKeys(e).forEach((t) => {
    let o = Reflect.getOwnPropertyDescriptor(e, t);
    if (o.enumerable && o.configurable && o.writable) {
      n[t] = e[t];
      return;
    }
    o.writable || (o.writable = !0, o.configurable = !0), (o.get || o.set) && (o = {
      configurable: !0,
      writable: !0,
      enumerable: o.enumerable,
      value: e[t]
    }), Reflect.defineProperty(n, t, o);
  }), n;
}
const He = Object.prototype.propertyIsEnumerable;
function De(e, n) {
  let t;
  if (Array.isArray(e))
    return Array.prototype.concat.call(e);
  if (e instanceof Set) {
    if (!le(e)) {
      const o = Object.getPrototypeOf(e).constructor;
      return new o(e.values());
    }
    return Set.prototype.difference ? Set.prototype.difference.call(e, /* @__PURE__ */ new Set()) : new Set(e.values());
  } else if (e instanceof Map) {
    if (!ae(e)) {
      const o = Object.getPrototypeOf(e).constructor;
      return new o(e);
    }
    return new Map(e);
  } else if (n?.mark && (t = n.mark(e, S), t !== void 0) && t !== S.mutable) {
    if (t === S.immutable)
      return Ke(e);
    if (typeof t == "function") {
      if (n.enablePatches || n.enableAutoFreeze)
        throw new Error("You can't use mark and patches or auto freeze together.");
      return t();
    }
    throw new Error(`Unsupported mark result: ${t}`);
  } else if (typeof e == "object" && Object.getPrototypeOf(e) === Object.prototype) {
    const o = {};
    return Object.keys(e).forEach((i) => {
      o[i] = e[i];
    }), Object.getOwnPropertySymbols(e).forEach((i) => {
      He.call(e, i) && (o[i] = e[i]);
    }), o;
  } else
    throw new Error("Please check mark() to ensure that it is a stable marker draftable function.");
}
function y(e) {
  e.copy || (e.copy = De(e.original, e.options));
}
function K(e) {
  if (!O(e))
    return ue(e);
  if (Array.isArray(e))
    return e.map(K);
  if (e instanceof Map) {
    const t = Array.from(e.entries()).map(([o, i]) => [
      o,
      K(i)
    ]);
    if (!ae(e)) {
      const o = Object.getPrototypeOf(e).constructor;
      return new o(t);
    }
    return new Map(t);
  }
  if (e instanceof Set) {
    const t = Array.from(e).map(K);
    if (!le(e)) {
      const o = Object.getPrototypeOf(e).constructor;
      return new o(t);
    }
    return new Set(t);
  }
  const n = Object.create(Object.getPrototypeOf(e));
  for (const t in e)
    n[t] = K(e[t]);
  return n;
}
function X(e) {
  return x(e) ? K(e) : e;
}
function z(e) {
  var n;
  e.assignedMap = (n = e.assignedMap) !== null && n !== void 0 ? n : /* @__PURE__ */ new Map(), e.operated || (e.operated = !0, e.parent && z(e.parent));
}
function we() {
  throw new Error("Cannot modify frozen object");
}
function T(e, n, t, o, i) {
  {
    t = t ?? /* @__PURE__ */ new WeakMap(), o = o ?? [], i = i ?? [];
    const r = t.has(e) ? t.get(e) : e;
    if (o.length > 0) {
      const s = o.indexOf(r);
      if (r && typeof r == "object" && s !== -1)
        throw o[0] === r ? new Error("Forbids circular reference") : new Error(`Forbids circular reference: ~/${i.slice(0, s).map((f, l) => {
          if (typeof f == "symbol")
            return `[${f.toString()}]`;
          const a = o[l];
          return typeof f == "object" && (a instanceof Map || a instanceof Set) ? Array.from(a.keys()).indexOf(f) : f;
        }).join("/")}`);
      o.push(r), i.push(n);
    } else
      o.push(r);
  }
  if (Object.isFrozen(e) || x(e)) {
    o.pop(), i.pop();
    return;
  }
  switch (N(e)) {
    case 2:
      for (const [s, f] of e)
        T(s, s, t, o, i), T(f, s, t, o, i);
      e.set = e.clear = e.delete = we;
      break;
    case 3:
      for (const s of e)
        T(s, s, t, o, i);
      e.add = e.clear = e.delete = we;
      break;
    case 1:
      Object.freeze(e);
      let r = 0;
      for (const s of e)
        T(s, r, t, o, i), r += 1;
      break;
    default:
      Object.freeze(e), Object.keys(e).forEach((s) => {
        const f = e[s];
        T(f, s, t, o, i);
      });
  }
  o.pop(), i.pop();
}
function pe(e, n) {
  const t = N(e);
  if (t === 0)
    Reflect.ownKeys(e).forEach((o) => {
      n(o, e[o], e);
    });
  else if (t === 1) {
    let o = 0;
    for (const i of e)
      n(o, i, e), o += 1;
  } else
    e.forEach((o, i) => n(i, o, e));
}
function Ce(e, n, t) {
  if (x(e) || !O(e, t) || n.has(e) || Object.isFrozen(e))
    return;
  const o = e instanceof Set, i = o ? /* @__PURE__ */ new Map() : void 0;
  if (n.add(e), pe(e, (c, r) => {
    var s;
    if (x(r)) {
      const f = u(r);
      y(f);
      const l = !((s = f.assignedMap) === null || s === void 0) && s.size || f.operated ? f.copy : f.original;
      L(o ? i : e, c, l);
    } else
      Ce(r, n, t);
  }), i) {
    const c = e, r = Array.from(c);
    c.clear(), r.forEach((s) => {
      c.add(i.has(s) ? i.get(s) : s);
    });
  }
}
function Ye(e, n) {
  const t = e.type === 3 ? e.setMap : e.copy;
  e.finalities.revoke.length > 1 && e.assignedMap.get(n) && t && Ce(A(t, n), e.finalities.handledSet, e.options);
}
function te(e) {
  e.type === 3 && e.copy && (e.copy.clear(), e.setMap.forEach((n) => {
    e.copy.add(ue(n));
  }));
}
function oe(e, n, t, o) {
  if (e.operated && e.assignedMap && e.assignedMap.size > 0 && !e.finalized) {
    if (t && o) {
      const c = Ae(e);
      c && n(e, c, t, o);
    }
    e.finalized = !0;
  }
}
function de(e, n, t, o) {
  const i = u(t);
  i && (i.callbacks || (i.callbacks = []), i.callbacks.push((c, r) => {
    var s;
    const f = e.type === 3 ? e.setMap : e.copy;
    if (_(A(f, n), t)) {
      let l = i.original;
      i.copy && (l = i.copy), te(e), oe(e, o, c, r), e.options.enableAutoFreeze && (e.options.updatedValues = (s = e.options.updatedValues) !== null && s !== void 0 ? s : /* @__PURE__ */ new WeakMap(), e.options.updatedValues.set(l, i.original)), L(f, n, l);
    }
  }), e.options.enableAutoFreeze && i.finalities !== e.finalities && (e.options.enableAutoFreeze = !1)), O(t, e.options) && e.finalities.draft.push(() => {
    const c = e.type === 3 ? e.setMap : e.copy;
    _(A(c, n), t) && Ye(e, n);
  });
}
function Be(e, n, t, o, i) {
  let { original: c, assignedMap: r, options: s } = e, f = e.copy;
  f.length < c.length && ([c, f] = [f, c], [t, o] = [o, t]);
  for (let l = 0; l < c.length; l += 1)
    if (r.get(l.toString()) && f[l] !== c[l]) {
      const a = n.concat([l]), p = I(a, i);
      t.push({
        op: v.Replace,
        path: p,
        // If it is a draft, it needs to be deep cloned, and it may also be non-draft.
        value: X(f[l])
      }), o.push({
        op: v.Replace,
        path: p,
        // If it is a draft, it needs to be deep cloned, and it may also be non-draft.
        value: X(c[l])
      });
    }
  for (let l = c.length; l < f.length; l += 1) {
    const a = n.concat([l]), p = I(a, i);
    t.push({
      op: v.Add,
      path: p,
      // If it is a draft, it needs to be deep cloned, and it may also be non-draft.
      value: X(f[l])
    });
  }
  if (c.length < f.length) {
    const { arrayLengthAssignment: l = !0 } = s.enablePatches;
    if (l) {
      const a = n.concat(["length"]), p = I(a, i);
      o.push({
        op: v.Replace,
        path: p,
        value: c.length
      });
    } else
      for (let a = f.length; c.length < a; a -= 1) {
        const p = n.concat([a - 1]), j = I(p, i);
        o.push({
          op: v.Remove,
          path: j
        });
      }
  }
}
function Le({ original: e, copy: n, assignedMap: t }, o, i, c, r) {
  t.forEach((s, f) => {
    const l = A(e, f), a = X(A(n, f)), p = s ? Y(e, f) ? v.Replace : v.Add : v.Remove;
    if (_(l, a) && p === v.Replace)
      return;
    const j = o.concat(f), M = I(j, r);
    i.push(p === v.Remove ? { op: p, path: M } : { op: p, path: M, value: a }), c.push(p === v.Add ? { op: v.Remove, path: M } : p === v.Remove ? { op: v.Add, path: M, value: l } : { op: v.Replace, path: M, value: l });
  });
}
function Ze({ original: e, copy: n }, t, o, i, c) {
  let r = 0;
  e.forEach((s) => {
    if (!n.has(s)) {
      const f = t.concat([r]), l = I(f, c);
      o.push({
        op: v.Remove,
        path: l,
        value: s
      }), i.unshift({
        op: v.Add,
        path: l,
        value: s
      });
    }
    r += 1;
  }), r = 0, n.forEach((s) => {
    if (!e.has(s)) {
      const f = t.concat([r]), l = I(f, c);
      o.push({
        op: v.Add,
        path: l,
        value: s
      }), i.unshift({
        op: v.Remove,
        path: l,
        value: s
      });
    }
    r += 1;
  });
}
function B(e, n, t, o) {
  const { pathAsArray: i = !0 } = e.options.enablePatches;
  switch (e.type) {
    case 0:
    case 2:
      return Le(e, n, t, o, i);
    case 1:
      return Be(e, n, t, o, i);
    case 3:
      return Ze(e, n, t, o, i);
  }
}
const G = (e, n, t = !1) => {
  if (typeof e == "object" && e !== null && (!O(e, n) || t))
    throw new Error("Strict mode: Mutable data cannot be accessed directly, please use 'unsafe(callback)' wrap.");
}, ie = {
  get size() {
    return m(u(this)).size;
  },
  has(e) {
    return m(u(this)).has(e);
  },
  set(e, n) {
    const t = u(this), o = m(t);
    return (!o.has(e) || !_(o.get(e), n)) && (y(t), z(t), t.assignedMap.set(e, !0), t.copy.set(e, n), de(t, e, n, B)), this;
  },
  delete(e) {
    if (!this.has(e))
      return !1;
    const n = u(this);
    return y(n), z(n), n.original.has(e) ? n.assignedMap.set(e, !1) : n.assignedMap.delete(e), n.copy.delete(e), !0;
  },
  clear() {
    const e = u(this);
    if (this.size) {
      y(e), z(e), e.assignedMap = /* @__PURE__ */ new Map();
      for (const [n] of e.original)
        e.assignedMap.set(n, !1);
      e.copy.clear();
    }
  },
  forEach(e, n) {
    const t = u(this);
    m(t).forEach((o, i) => {
      e.call(n, this.get(i), i, this);
    });
  },
  get(e) {
    var n, t;
    const o = u(this), i = m(o).get(e), c = ((t = (n = o.options).mark) === null || t === void 0 ? void 0 : t.call(n, i, S)) === S.mutable;
    if (o.options.strict && G(i, o.options, c), c || o.finalized || !O(i, o.options) || i !== o.original.get(e))
      return i;
    const r = ce.createDraft({
      original: i,
      parentDraft: o,
      key: e,
      finalities: o.finalities,
      options: o.options
    });
    return y(o), o.copy.set(e, r), r;
  },
  keys() {
    return m(u(this)).keys();
  },
  values() {
    const e = this.keys();
    return {
      [Z]: () => this.values(),
      next: () => {
        const n = e.next();
        return n.done ? n : {
          done: !1,
          value: this.get(n.value)
        };
      }
    };
  },
  entries() {
    const e = this.keys();
    return {
      [Z]: () => this.entries(),
      next: () => {
        const n = e.next();
        if (n.done)
          return n;
        const t = this.get(n.value);
        return {
          done: !1,
          value: [n.value, t]
        };
      }
    };
  },
  [Z]() {
    return this.entries();
  }
}, Xe = Reflect.ownKeys(ie), me = (e, n, { isValuesIterator: t }) => () => {
  var o, i;
  const c = n.next();
  if (c.done)
    return c;
  const r = c.value;
  let s = e.setMap.get(r);
  const f = u(s), l = ((i = (o = e.options).mark) === null || i === void 0 ? void 0 : i.call(o, s, S)) === S.mutable;
  if (e.options.strict && G(r, e.options, l), !l && !f && O(r, e.options) && !e.finalized && e.original.has(r)) {
    const a = ce.createDraft({
      original: r,
      parentDraft: e,
      key: r,
      finalities: e.finalities,
      options: e.options
    });
    e.setMap.set(r, a), s = a;
  } else f && (s = f.proxy);
  return {
    done: !1,
    value: t ? s : [s, s]
  };
}, Q = {
  get size() {
    return u(this).setMap.size;
  },
  has(e) {
    const n = u(this);
    if (n.setMap.has(e))
      return !0;
    y(n);
    const t = u(e);
    return !!(t && n.setMap.has(t.original));
  },
  add(e) {
    const n = u(this);
    return this.has(e) || (y(n), z(n), n.assignedMap.set(e, !0), n.setMap.set(e, e), de(n, e, e, B)), this;
  },
  delete(e) {
    if (!this.has(e))
      return !1;
    const n = u(this);
    y(n), z(n);
    const t = u(e);
    return t && n.setMap.has(t.original) ? (n.assignedMap.set(t.original, !1), n.setMap.delete(t.original)) : (!t && n.setMap.has(e) ? n.assignedMap.set(e, !1) : n.assignedMap.delete(e), n.setMap.delete(e));
  },
  clear() {
    if (!this.size)
      return;
    const e = u(this);
    y(e), z(e);
    for (const n of e.original)
      e.assignedMap.set(n, !1);
    e.setMap.clear();
  },
  values() {
    const e = u(this);
    y(e);
    const n = e.setMap.keys();
    return {
      [Symbol.iterator]: () => this.values(),
      next: me(e, n, { isValuesIterator: !0 })
    };
  },
  entries() {
    const e = u(this);
    y(e);
    const n = e.setMap.keys();
    return {
      [Symbol.iterator]: () => this.entries(),
      next: me(e, n, {
        isValuesIterator: !1
      })
    };
  },
  keys() {
    return this.values();
  },
  [Z]() {
    return this.values();
  },
  forEach(e, n) {
    const t = this.values();
    let o = t.next();
    for (; !o.done; )
      e.call(n, o.value, o.value, this), o = t.next();
  }
};
Set.prototype.difference && Object.assign(Q, {
  intersection(e) {
    return Set.prototype.intersection.call(new Set(this.values()), e);
  },
  union(e) {
    return Set.prototype.union.call(new Set(this.values()), e);
  },
  difference(e) {
    return Set.prototype.difference.call(new Set(this.values()), e);
  },
  symmetricDifference(e) {
    return Set.prototype.symmetricDifference.call(new Set(this.values()), e);
  },
  isSubsetOf(e) {
    return Set.prototype.isSubsetOf.call(new Set(this.values()), e);
  },
  isSupersetOf(e) {
    return Set.prototype.isSupersetOf.call(new Set(this.values()), e);
  },
  isDisjointFrom(e) {
    return Set.prototype.isDisjointFrom.call(new Set(this.values()), e);
  }
});
const qe = Reflect.ownKeys(Q), Fe = {
  get(e, n, t) {
    var o, i;
    const c = (o = e.copy) === null || o === void 0 ? void 0 : o[n];
    if (c && e.finalities.draftsCache.has(c))
      return c;
    if (n === Pe)
      return e;
    let r;
    if (e.options.mark) {
      const l = n === "size" && (e.original instanceof Map || e.original instanceof Set) ? Reflect.get(e.original, n) : Reflect.get(e.original, n, t);
      if (r = e.options.mark(l, S), r === S.mutable)
        return e.options.strict && G(l, e.options, !0), l;
    }
    const s = m(e);
    if (s instanceof Map && Xe.includes(n))
      return n === "size" ? Object.getOwnPropertyDescriptor(ie, "size").get.call(e.proxy) : ie[n].bind(e.proxy);
    if (s instanceof Set && qe.includes(n))
      return n === "size" ? Object.getOwnPropertyDescriptor(Q, "size").get.call(e.proxy) : Q[n].bind(e.proxy);
    if (!Y(s, n)) {
      const l = be(s, n);
      return l ? "value" in l ? l.value : (
        // !case: support for getter
        (i = l.get) === null || i === void 0 ? void 0 : i.call(e.proxy)
      ) : void 0;
    }
    const f = s[n];
    if (e.options.strict && G(f, e.options), e.finalized || !O(f, e.options))
      return f;
    if (f === k(e.original, n)) {
      if (y(e), e.copy[n] = he({
        original: e.original[n],
        parentDraft: e,
        key: e.type === 1 ? Number(n) : n,
        finalities: e.finalities,
        options: e.options
      }), typeof r == "function") {
        const l = u(e.copy[n]);
        return y(l), z(l), l.copy;
      }
      return e.copy[n];
    }
    return x(f) && e.finalities.draftsCache.add(f), f;
  },
  set(e, n, t) {
    var o;
    if (e.type === 3 || e.type === 2)
      throw new Error("Map/Set draft does not support any property assignment.");
    let i;
    if (e.type === 1 && n !== "length" && !(Number.isInteger(i = Number(n)) && i >= 0 && (n === 0 || i === 0 || String(i) === String(n))))
      throw new Error("Only supports setting array indices and the 'length' property.");
    const c = be(m(e), n);
    if (c?.set)
      return c.set.call(e.proxy, t), !0;
    const r = k(m(e), n), s = u(r);
    return s && _(s.original, t) ? (e.copy[n] = t, e.assignedMap = (o = e.assignedMap) !== null && o !== void 0 ? o : /* @__PURE__ */ new Map(), e.assignedMap.set(n, !1), !0) : (_(t, r) && (t !== void 0 || Y(e.original, n)) || (y(e), z(e), Y(e.original, n) && _(t, e.original[n]) ? e.assignedMap.delete(n) : e.assignedMap.set(n, !0), e.copy[n] = t, de(e, n, t, B)), !0);
  },
  has(e, n) {
    return n in m(e);
  },
  ownKeys(e) {
    return Reflect.ownKeys(m(e));
  },
  getOwnPropertyDescriptor(e, n) {
    const t = m(e), o = Reflect.getOwnPropertyDescriptor(t, n);
    return o && {
      writable: !0,
      configurable: e.type !== 1 || n !== "length",
      enumerable: o.enumerable,
      value: t[n]
    };
  },
  getPrototypeOf(e) {
    return Reflect.getPrototypeOf(e.original);
  },
  setPrototypeOf() {
    throw new Error("Cannot call 'setPrototypeOf()' on drafts");
  },
  defineProperty() {
    throw new Error("Cannot call 'defineProperty()' on drafts");
  },
  deleteProperty(e, n) {
    var t;
    return e.type === 1 ? Fe.set.call(this, e, n, void 0, e.proxy) : (k(e.original, n) !== void 0 || n in e.original ? (y(e), z(e), e.assignedMap.set(n, !1)) : (e.assignedMap = (t = e.assignedMap) !== null && t !== void 0 ? t : /* @__PURE__ */ new Map(), e.assignedMap.delete(n)), e.copy && delete e.copy[n], !0);
  }
};
function he(e) {
  const { original: n, parentDraft: t, key: o, finalities: i, options: c } = e, r = N(n), s = {
    type: r,
    finalized: !1,
    parent: t,
    original: n,
    copy: null,
    proxy: null,
    finalities: i,
    options: c,
    // Mapping of draft Set items to their corresponding draft values.
    setMap: r === 3 ? new Map(n.entries()) : void 0
  };
  (o || "key" in e) && (s.key = o);
  const { proxy: f, revoke: l } = Proxy.revocable(r === 1 ? Object.assign([], s) : s, Fe);
  if (i.revoke.push(l), s.proxy = f, t) {
    const a = t;
    a.finalities.draft.push((p, j) => {
      var M, W;
      const ve = u(f);
      let D = a.type === 3 ? a.setMap : a.copy;
      const R = A(D, o), w = u(R);
      if (w) {
        let E = w.original;
        w.operated && (E = ue(R)), te(w), oe(w, B, p, j), a.options.enableAutoFreeze && (a.options.updatedValues = (M = a.options.updatedValues) !== null && M !== void 0 ? M : /* @__PURE__ */ new WeakMap(), a.options.updatedValues.set(E, w.original)), L(D, o, E);
      }
      (W = ve.callbacks) === null || W === void 0 || W.forEach((E) => {
        E(p, j);
      });
    });
  } else {
    const a = u(f);
    a.finalities.draft.push((p, j) => {
      te(a), oe(a, B, p, j);
    });
  }
  return f;
}
ce.createDraft = he;
function Je(e, n, t, o, i) {
  var c;
  const r = u(e), s = (c = r?.original) !== null && c !== void 0 ? c : e, f = !!n.length;
  if (r?.operated)
    for (; r.finalities.draft.length > 0; )
      r.finalities.draft.pop()(t, o);
  const l = f ? n[0] : r ? r.operated ? r.copy : r.original : e;
  return r && ne(r), i && T(l, l, r?.options.updatedValues), [
    l,
    t && f ? [{ op: v.Replace, path: [], value: n[0] }] : t,
    o && f ? [{ op: v.Replace, path: [], value: s }] : o
  ];
}
function Ge(e, n) {
  var t;
  const o = {
    draft: [],
    revoke: [],
    handledSet: /* @__PURE__ */ new WeakSet(),
    draftsCache: /* @__PURE__ */ new WeakSet()
  };
  let i, c;
  n.enablePatches && (i = [], c = []);
  const s = ((t = n.mark) === null || t === void 0 ? void 0 : t.call(n, e, S)) === S.mutable || !O(e, n) ? e : he({
    original: e,
    parentDraft: null,
    finalities: o,
    options: n
  });
  return [
    s,
    (f = []) => {
      const [l, a, p] = Je(s, f, i, c, n.enableAutoFreeze);
      return n.enablePatches ? [l, a, p] : l;
    }
  ];
}
function re(e) {
  const { rootDraft: n, value: t, useRawReturn: o = !1, isRoot: i = !0 } = e;
  pe(t, (c, r, s) => {
    const f = u(r);
    if (f && n && f.finalities === n.finalities) {
      e.isContainDraft = !0;
      const l = f.original;
      if (s instanceof Set) {
        const a = Array.from(s);
        s.clear(), a.forEach((p) => s.add(c === p ? l : p));
      } else
        L(s, c, l);
    } else typeof r == "object" && r !== null && (e.value = r, e.isRoot = !1, re(e));
  }), i && (e.isContainDraft || console.warn("The return value does not contain any draft, please use 'rawReturn()' to wrap the return value to improve performance."), o && console.warn("The return value contains drafts, please don't use 'rawReturn()' to wrap the return value."));
}
function Ie(e) {
  var n;
  const t = u(e);
  if (!O(e, t?.options))
    return e;
  const o = N(e);
  if (t && !t.operated)
    return t.original;
  let i;
  function c() {
    i = o === 2 ? ae(e) ? new Map(e) : new (Object.getPrototypeOf(e)).constructor(e) : o === 3 ? Array.from(t.setMap.values()) : De(e, t?.options);
  }
  if (t) {
    t.finalized = !0;
    try {
      c();
    } finally {
      t.finalized = !1;
    }
  } else
    i = e;
  if (pe(i, (r, s) => {
    if (t && _(A(t.original, r), s))
      return;
    const f = Ie(s);
    f !== s && (i === e && c(), L(i, r, f));
  }), o === 3) {
    const r = (n = t?.original) !== null && n !== void 0 ? n : i;
    return le(r) ? new Set(i) : new (Object.getPrototypeOf(r)).constructor(i);
  }
  return i;
}
function Se(e) {
  if (!x(e))
    throw new Error(`current() is only used for Draft, parameter: ${e}`);
  return Ie(e);
}
const Qe = (e) => function n(t, o, i) {
  var c, r, s;
  if (typeof t == "function" && typeof o != "function")
    return function(h, ...P) {
      return n(h, (C) => t.call(this, C, ...P), o);
    };
  const f = t, l = o;
  let a = i;
  if (typeof o != "function" && (a = o), a !== void 0 && Object.prototype.toString.call(a) !== "[object Object]")
    throw new Error(`Invalid options: ${a}, 'options' should be an object.`);
  a = Object.assign(Object.assign({}, e), a);
  const p = x(f) ? Se(f) : f, j = Array.isArray(a.mark) ? ((h, P) => {
    for (const C of a.mark) {
      if (typeof C != "function")
        throw new Error(`Invalid mark: ${C}, 'mark' should be a function.`);
      const $ = C(h, P);
      if ($)
        return $;
    }
  }) : a.mark, M = (c = a.enablePatches) !== null && c !== void 0 ? c : !1, W = (r = a.strict) !== null && r !== void 0 ? r : !1, D = {
    enableAutoFreeze: (s = a.enableAutoFreeze) !== null && s !== void 0 ? s : !1,
    mark: j,
    strict: W,
    enablePatches: M
  };
  if (!O(p, D) && typeof p == "object" && p !== null)
    throw new Error("Invalid base state: create() only supports plain objects, arrays, Set, Map or using mark() to mark the state as immutable.");
  const [R, w] = Ge(p, D);
  if (typeof o != "function") {
    if (!O(p, D))
      throw new Error("Invalid base state: create() only supports plain objects, arrays, Set, Map or using mark() to mark the state as immutable.");
    return [R, w];
  }
  let E;
  try {
    E = l(R);
  } catch (h) {
    throw ne(u(R)), h;
  }
  const ye = (h) => {
    const P = u(R);
    if (!x(h)) {
      if (h !== void 0 && !_(h, R) && P?.operated)
        throw new Error("Either the value is returned as a new non-draft value, or only the draft is modified without returning any value.");
      const $ = h?.[_e];
      if ($) {
        const Ve = $[0];
        return D.strict && typeof h == "object" && h !== null && re({
          rootDraft: P,
          value: h,
          useRawReturn: !0
        }), w([Ve]);
      }
      if (h !== void 0)
        return typeof h == "object" && h !== null && re({ rootDraft: P, value: h }), w([h]);
    }
    if (h === R || h === void 0)
      return w([]);
    const C = u(h);
    if (D === C.options) {
      if (C.operated)
        throw new Error("Cannot return a modified child draft.");
      return w([Se(h)]);
    }
    return w([h]);
  };
  return E instanceof Promise ? E.then(ye, (h) => {
    throw ne(u(R)), h;
  }) : ye(E);
}, ge = Qe();
function ke(e) {
  if (arguments.length === 0)
    throw new Error("rawReturn() must be called with a value.");
  if (arguments.length > 1)
    throw new Error("rawReturn() must be called with one argument.");
  return e !== void 0 && (typeof e != "object" || e === null) && console.warn("rawReturn() must be called with an object(including plain object, arrays, Set, Map, etc.) or `undefined`, other types do not need to be returned via rawReturn()."), {
    [_e]: [e]
  };
}
Object.prototype.constructor.toString();
const en = (e, n) => typeof n == "function" ? ge(e.value, (t) => {
  const o = n(t);
  return x(o) ? t : typeof o == "object" && !x(o) ? ke(o) : o;
}) : n, nn = (e, n) => (e.value = en(e, n), e.value), tn = (e) => {
  const n = Ue(e);
  return n.set = (t) => nn(n, t), n;
}, fn = (e) => {
  const n = Ne(() => tn(e), []), t = q(() => n.value, [n]), o = () => n.peek(), i = q((c) => fe(() => {
    c(n.value);
  }), [n]);
  return [Me(
    i,
    t,
    o
  ), n.set];
}, cn = (e) => {
  const n = q(() => e.value, [e]), t = () => e.peek(), o = q((i) => fe(() => {
    i(e.value);
  }), [e]);
  return Me(
    o,
    n,
    t
  );
};
export {
  fe as E,
  tn as b,
  Ue as d,
  fn as k,
  Oe as n,
  U as p,
  rn as r,
  b as u,
  sn as w,
  cn as x,
  V as y
};
