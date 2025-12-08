import { useMemo as Me, useCallback as U, useSyncExternalStore as fe } from "react";
import { signal as Oe, effect as ue } from "@preact/signals-core";
const h = {
  Remove: "remove",
  Replace: "replace",
  Add: "add"
}, pe = Symbol.for("__MUTATIVE_PROXY_DRAFT__"), de = Symbol("__MUTATIVE_RAW_RETURN_SYMBOL__"), W = Symbol.iterator, m = {
  mutable: "mutable",
  immutable: "immutable"
}, Z = {};
function K(e, n) {
  return e instanceof Map ? e.has(n) : Object.prototype.hasOwnProperty.call(e, n);
}
function se(e, n) {
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
function g(e) {
  return Object.getPrototypeOf(e) === Set.prototype;
}
function k(e) {
  return Object.getPrototypeOf(e) === Map.prototype;
}
function w(e) {
  var n;
  return (n = e.copy) !== null && n !== void 0 ? n : e.original;
}
function P(e) {
  return !!u(e);
}
function u(e) {
  return typeof e != "object" ? null : e?.[pe];
}
function ee(e) {
  var n;
  const t = u(e);
  return t ? (n = t.copy) !== null && n !== void 0 ? n : t.original : e;
}
function M(e, n) {
  if (!e || typeof e != "object")
    return !1;
  let t;
  return Object.getPrototypeOf(e) === Object.prototype || Array.isArray(e) || e instanceof Map || e instanceof Set || !!n?.mark && ((t = n.mark(e, m)) === m.immutable || typeof t == "function");
}
function he(e, n = []) {
  if (Object.hasOwnProperty.call(e, "key")) {
    const t = e.parent.copy, o = u(_(t, e.key));
    if (o !== null && o?.original !== e.original)
      return null;
    const r = e.parent.type === 3, l = r ? Array.from(e.parent.setMap.keys()).indexOf(e.key) : e.key;
    if (!(r && t.size > l || K(t, l)))
      return null;
    n.push(l);
  }
  if (e.parent)
    return he(e.parent, n);
  n.reverse();
  try {
    Se(e.copy, n);
  } catch {
    return null;
  }
  return n;
}
function C(e) {
  return Array.isArray(e) ? 1 : e instanceof Map ? 2 : e instanceof Set ? 3 : 0;
}
function _(e, n) {
  return C(e) === 2 ? e.get(n) : e[n];
}
function N(e, n, t) {
  C(e) === 2 ? e.set(n, t) : e[n] = t;
}
function L(e, n) {
  const t = u(e);
  return (t ? w(t) : e)[n];
}
function E(e, n) {
  return e === n ? e !== 0 || 1 / e === 1 / n : e !== e && n !== n;
}
function X(e) {
  if (e)
    for (; e.finalities.revoke.length > 0; )
      e.finalities.revoke.pop()();
}
function D(e, n) {
  return n ? e : [""].concat(e).map((t) => {
    const o = `${t}`;
    return o.indexOf("/") === -1 && o.indexOf("~") === -1 ? o : o.replace(/~/g, "~0").replace(/\//g, "~1");
  }).join("/");
}
function Se(e, n) {
  for (let t = 0; t < n.length - 1; t += 1) {
    const o = n[t];
    if (e = _(C(e) === 3 ? Array.from(e) : e, o), typeof e != "object")
      throw new Error(`Cannot resolve patch at '${n.join("/")}'.`);
  }
  return e;
}
function Re(e) {
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
const je = Object.prototype.propertyIsEnumerable;
function ye(e, n) {
  let t;
  if (Array.isArray(e))
    return Array.prototype.concat.call(e);
  if (e instanceof Set) {
    if (!g(e)) {
      const o = Object.getPrototypeOf(e).constructor;
      return new o(e.values());
    }
    return Set.prototype.difference ? Set.prototype.difference.call(e, /* @__PURE__ */ new Set()) : new Set(e.values());
  } else if (e instanceof Map) {
    if (!k(e)) {
      const o = Object.getPrototypeOf(e).constructor;
      return new o(e);
    }
    return new Map(e);
  } else if (n?.mark && (t = n.mark(e, m), t !== void 0) && t !== m.mutable) {
    if (t === m.immutable)
      return Re(e);
    if (typeof t == "function") {
      if (n.enablePatches || n.enableAutoFreeze)
        throw new Error("You can't use mark and patches or auto freeze together.");
      return t();
    }
    throw new Error(`Unsupported mark result: ${t}`);
  } else if (typeof e == "object" && Object.getPrototypeOf(e) === Object.prototype) {
    const o = {};
    return Object.keys(e).forEach((r) => {
      o[r] = e[r];
    }), Object.getOwnPropertySymbols(e).forEach((r) => {
      je.call(e, r) && (o[r] = e[r]);
    }), o;
  } else
    throw new Error("Please check mark() to ensure that it is a stable marker draftable function.");
}
function y(e) {
  e.copy || (e.copy = ye(e.original, e.options));
}
function T(e) {
  if (!M(e))
    return ee(e);
  if (Array.isArray(e))
    return e.map(T);
  if (e instanceof Map) {
    const t = Array.from(e.entries()).map(([o, r]) => [
      o,
      T(r)
    ]);
    if (!k(e)) {
      const o = Object.getPrototypeOf(e).constructor;
      return new o(t);
    }
    return new Map(t);
  }
  if (e instanceof Set) {
    const t = Array.from(e).map(T);
    if (!g(e)) {
      const o = Object.getPrototypeOf(e).constructor;
      return new o(t);
    }
    return new Set(t);
  }
  const n = Object.create(Object.getPrototypeOf(e));
  for (const t in e)
    n[t] = T(e[t]);
  return n;
}
function H(e) {
  return P(e) ? T(e) : e;
}
function j(e) {
  var n;
  e.assignedMap = (n = e.assignedMap) !== null && n !== void 0 ? n : /* @__PURE__ */ new Map(), e.operated || (e.operated = !0, e.parent && j(e.parent));
}
function ce() {
  throw new Error("Cannot modify frozen object");
}
function F(e, n, t, o, r) {
  {
    t = t ?? /* @__PURE__ */ new WeakMap(), o = o ?? [], r = r ?? [];
    const i = t.has(e) ? t.get(e) : e;
    if (o.length > 0) {
      const s = o.indexOf(i);
      if (i && typeof i == "object" && s !== -1)
        throw o[0] === i ? new Error("Forbids circular reference") : new Error(`Forbids circular reference: ~/${r.slice(0, s).map((c, a) => {
          if (typeof c == "symbol")
            return `[${c.toString()}]`;
          const f = o[a];
          return typeof c == "object" && (f instanceof Map || f instanceof Set) ? Array.from(f.keys()).indexOf(c) : c;
        }).join("/")}`);
      o.push(i), r.push(n);
    } else
      o.push(i);
  }
  if (Object.isFrozen(e) || P(e)) {
    o.pop(), r.pop();
    return;
  }
  switch (C(e)) {
    case 2:
      for (const [s, c] of e)
        F(s, s, t, o, r), F(c, s, t, o, r);
      e.set = e.clear = e.delete = ce;
      break;
    case 3:
      for (const s of e)
        F(s, s, t, o, r);
      e.add = e.clear = e.delete = ce;
      break;
    case 1:
      Object.freeze(e);
      let i = 0;
      for (const s of e)
        F(s, i, t, o, r), i += 1;
      break;
    default:
      Object.freeze(e), Object.keys(e).forEach((s) => {
        const c = e[s];
        F(c, s, t, o, r);
      });
  }
  o.pop(), r.pop();
}
function ne(e, n) {
  const t = C(e);
  if (t === 0)
    Reflect.ownKeys(e).forEach((o) => {
      n(o, e[o], e);
    });
  else if (t === 1) {
    let o = 0;
    for (const r of e)
      n(o, r, e), o += 1;
  } else
    e.forEach((o, r) => n(r, o, e));
}
function be(e, n, t) {
  if (P(e) || !M(e, t) || n.has(e) || Object.isFrozen(e))
    return;
  const o = e instanceof Set, r = o ? /* @__PURE__ */ new Map() : void 0;
  if (n.add(e), ne(e, (l, i) => {
    var s;
    if (P(i)) {
      const c = u(i);
      y(c);
      const a = !((s = c.assignedMap) === null || s === void 0) && s.size || c.operated ? c.copy : c.original;
      N(o ? r : e, l, a);
    } else
      be(i, n, t);
  }), r) {
    const l = e, i = Array.from(l);
    l.clear(), i.forEach((s) => {
      l.add(r.has(s) ? r.get(s) : s);
    });
  }
}
function ze(e, n) {
  const t = e.type === 3 ? e.setMap : e.copy;
  e.finalities.revoke.length > 1 && e.assignedMap.get(n) && t && be(_(t, n), e.finalities.handledSet, e.options);
}
function q(e) {
  e.type === 3 && e.copy && (e.copy.clear(), e.setMap.forEach((n) => {
    e.copy.add(ee(n));
  }));
}
function G(e, n, t, o) {
  if (e.operated && e.assignedMap && e.assignedMap.size > 0 && !e.finalized) {
    if (t && o) {
      const l = he(e);
      l && n(e, l, t, o);
    }
    e.finalized = !0;
  }
}
function te(e, n, t, o) {
  const r = u(t);
  r && (r.callbacks || (r.callbacks = []), r.callbacks.push((l, i) => {
    var s;
    const c = e.type === 3 ? e.setMap : e.copy;
    if (E(_(c, n), t)) {
      let a = r.original;
      r.copy && (a = r.copy), q(e), G(e, o, l, i), e.options.enableAutoFreeze && (e.options.updatedValues = (s = e.options.updatedValues) !== null && s !== void 0 ? s : /* @__PURE__ */ new WeakMap(), e.options.updatedValues.set(a, r.original)), N(c, n, a);
    }
  }), e.options.enableAutoFreeze && r.finalities !== e.finalities && (e.options.enableAutoFreeze = !1)), M(t, e.options) && e.finalities.draft.push(() => {
    const l = e.type === 3 ? e.setMap : e.copy;
    E(_(l, n), t) && ze(e, n);
  });
}
function Ee(e, n, t, o, r) {
  let { original: l, assignedMap: i, options: s } = e, c = e.copy;
  c.length < l.length && ([l, c] = [c, l], [t, o] = [o, t]);
  for (let a = 0; a < l.length; a += 1)
    if (i.get(a.toString()) && c[a] !== l[a]) {
      const f = n.concat([a]), p = D(f, r);
      t.push({
        op: h.Replace,
        path: p,
        // If it is a draft, it needs to be deep cloned, and it may also be non-draft.
        value: H(c[a])
      }), o.push({
        op: h.Replace,
        path: p,
        // If it is a draft, it needs to be deep cloned, and it may also be non-draft.
        value: H(l[a])
      });
    }
  for (let a = l.length; a < c.length; a += 1) {
    const f = n.concat([a]), p = D(f, r);
    t.push({
      op: h.Add,
      path: p,
      // If it is a draft, it needs to be deep cloned, and it may also be non-draft.
      value: H(c[a])
    });
  }
  if (l.length < c.length) {
    const { arrayLengthAssignment: a = !0 } = s.enablePatches;
    if (a) {
      const f = n.concat(["length"]), p = D(f, r);
      o.push({
        op: h.Replace,
        path: p,
        value: l.length
      });
    } else
      for (let f = c.length; l.length < f; f -= 1) {
        const p = n.concat([f - 1]), O = D(p, r);
        o.push({
          op: h.Remove,
          path: O
        });
      }
  }
}
function Pe({ original: e, copy: n, assignedMap: t }, o, r, l, i) {
  t.forEach((s, c) => {
    const a = _(e, c), f = H(_(n, c)), p = s ? K(e, c) ? h.Replace : h.Add : h.Remove;
    if (E(a, f) && p === h.Replace)
      return;
    const O = o.concat(c), v = D(O, i);
    r.push(p === h.Remove ? { op: p, path: v } : { op: p, path: v, value: f }), l.push(p === h.Add ? { op: h.Remove, path: v } : p === h.Remove ? { op: h.Add, path: v, value: a } : { op: h.Replace, path: v, value: a });
  });
}
function _e({ original: e, copy: n }, t, o, r, l) {
  let i = 0;
  e.forEach((s) => {
    if (!n.has(s)) {
      const c = t.concat([i]), a = D(c, l);
      o.push({
        op: h.Remove,
        path: a,
        value: s
      }), r.unshift({
        op: h.Add,
        path: a,
        value: s
      });
    }
    i += 1;
  }), i = 0, n.forEach((s) => {
    if (!e.has(s)) {
      const c = t.concat([i]), a = D(c, l);
      o.push({
        op: h.Add,
        path: a,
        value: s
      }), r.unshift({
        op: h.Remove,
        path: a,
        value: s
      });
    }
    i += 1;
  });
}
function $(e, n, t, o) {
  const { pathAsArray: r = !0 } = e.options.enablePatches;
  switch (e.type) {
    case 0:
    case 2:
      return Pe(e, n, t, o, r);
    case 1:
      return Ee(e, n, t, o, r);
    case 3:
      return _e(e, n, t, o, r);
  }
}
const Y = (e, n, t = !1) => {
  if (typeof e == "object" && e !== null && (!M(e, n) || t))
    throw new Error("Strict mode: Mutable data cannot be accessed directly, please use 'unsafe(callback)' wrap.");
}, J = {
  get size() {
    return w(u(this)).size;
  },
  has(e) {
    return w(u(this)).has(e);
  },
  set(e, n) {
    const t = u(this), o = w(t);
    return (!o.has(e) || !E(o.get(e), n)) && (y(t), j(t), t.assignedMap.set(e, !0), t.copy.set(e, n), te(t, e, n, $)), this;
  },
  delete(e) {
    if (!this.has(e))
      return !1;
    const n = u(this);
    return y(n), j(n), n.original.has(e) ? n.assignedMap.set(e, !1) : n.assignedMap.delete(e), n.copy.delete(e), !0;
  },
  clear() {
    const e = u(this);
    if (this.size) {
      y(e), j(e), e.assignedMap = /* @__PURE__ */ new Map();
      for (const [n] of e.original)
        e.assignedMap.set(n, !1);
      e.copy.clear();
    }
  },
  forEach(e, n) {
    const t = u(this);
    w(t).forEach((o, r) => {
      e.call(n, this.get(r), r, this);
    });
  },
  get(e) {
    var n, t;
    const o = u(this), r = w(o).get(e), l = ((t = (n = o.options).mark) === null || t === void 0 ? void 0 : t.call(n, r, m)) === m.mutable;
    if (o.options.strict && Y(r, o.options, l), l || o.finalized || !M(r, o.options) || r !== o.original.get(e))
      return r;
    const i = Z.createDraft({
      original: r,
      parentDraft: o,
      key: e,
      finalities: o.finalities,
      options: o.options
    });
    return y(o), o.copy.set(e, i), i;
  },
  keys() {
    return w(u(this)).keys();
  },
  values() {
    const e = this.keys();
    return {
      [W]: () => this.values(),
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
      [W]: () => this.entries(),
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
  [W]() {
    return this.entries();
  }
}, Ae = Reflect.ownKeys(J), le = (e, n, { isValuesIterator: t }) => () => {
  var o, r;
  const l = n.next();
  if (l.done)
    return l;
  const i = l.value;
  let s = e.setMap.get(i);
  const c = u(s), a = ((r = (o = e.options).mark) === null || r === void 0 ? void 0 : r.call(o, s, m)) === m.mutable;
  if (e.options.strict && Y(i, e.options, a), !a && !c && M(i, e.options) && !e.finalized && e.original.has(i)) {
    const f = Z.createDraft({
      original: i,
      parentDraft: e,
      key: i,
      finalities: e.finalities,
      options: e.options
    });
    e.setMap.set(i, f), s = f;
  } else c && (s = c.proxy);
  return {
    done: !1,
    value: t ? s : [s, s]
  };
}, B = {
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
    return this.has(e) || (y(n), j(n), n.assignedMap.set(e, !0), n.setMap.set(e, e), te(n, e, e, $)), this;
  },
  delete(e) {
    if (!this.has(e))
      return !1;
    const n = u(this);
    y(n), j(n);
    const t = u(e);
    return t && n.setMap.has(t.original) ? (n.assignedMap.set(t.original, !1), n.setMap.delete(t.original)) : (!t && n.setMap.has(e) ? n.assignedMap.set(e, !1) : n.assignedMap.delete(e), n.setMap.delete(e));
  },
  clear() {
    if (!this.size)
      return;
    const e = u(this);
    y(e), j(e);
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
      next: le(e, n, { isValuesIterator: !0 })
    };
  },
  entries() {
    const e = u(this);
    y(e);
    const n = e.setMap.keys();
    return {
      [Symbol.iterator]: () => this.entries(),
      next: le(e, n, {
        isValuesIterator: !1
      })
    };
  },
  keys() {
    return this.values();
  },
  [W]() {
    return this.values();
  },
  forEach(e, n) {
    const t = this.values();
    let o = t.next();
    for (; !o.done; )
      e.call(n, o.value, o.value, this), o = t.next();
  }
};
Set.prototype.difference && Object.assign(B, {
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
const xe = Reflect.ownKeys(B), we = {
  get(e, n, t) {
    var o, r;
    const l = (o = e.copy) === null || o === void 0 ? void 0 : o[n];
    if (l && e.finalities.draftsCache.has(l))
      return l;
    if (n === pe)
      return e;
    let i;
    if (e.options.mark) {
      const a = n === "size" && (e.original instanceof Map || e.original instanceof Set) ? Reflect.get(e.original, n) : Reflect.get(e.original, n, t);
      if (i = e.options.mark(a, m), i === m.mutable)
        return e.options.strict && Y(a, e.options, !0), a;
    }
    const s = w(e);
    if (s instanceof Map && Ae.includes(n))
      return n === "size" ? Object.getOwnPropertyDescriptor(J, "size").get.call(e.proxy) : J[n].bind(e.proxy);
    if (s instanceof Set && xe.includes(n))
      return n === "size" ? Object.getOwnPropertyDescriptor(B, "size").get.call(e.proxy) : B[n].bind(e.proxy);
    if (!K(s, n)) {
      const a = se(s, n);
      return a ? "value" in a ? a.value : (
        // !case: support for getter
        (r = a.get) === null || r === void 0 ? void 0 : r.call(e.proxy)
      ) : void 0;
    }
    const c = s[n];
    if (e.options.strict && Y(c, e.options), e.finalized || !M(c, e.options))
      return c;
    if (c === L(e.original, n)) {
      if (y(e), e.copy[n] = oe({
        original: e.original[n],
        parentDraft: e,
        key: e.type === 1 ? Number(n) : n,
        finalities: e.finalities,
        options: e.options
      }), typeof i == "function") {
        const a = u(e.copy[n]);
        return y(a), j(a), a.copy;
      }
      return e.copy[n];
    }
    return P(c) && e.finalities.draftsCache.add(c), c;
  },
  set(e, n, t) {
    var o;
    if (e.type === 3 || e.type === 2)
      throw new Error("Map/Set draft does not support any property assignment.");
    let r;
    if (e.type === 1 && n !== "length" && !(Number.isInteger(r = Number(n)) && r >= 0 && (n === 0 || r === 0 || String(r) === String(n))))
      throw new Error("Only supports setting array indices and the 'length' property.");
    const l = se(w(e), n);
    if (l?.set)
      return l.set.call(e.proxy, t), !0;
    const i = L(w(e), n), s = u(i);
    return s && E(s.original, t) ? (e.copy[n] = t, e.assignedMap = (o = e.assignedMap) !== null && o !== void 0 ? o : /* @__PURE__ */ new Map(), e.assignedMap.set(n, !1), !0) : (E(t, i) && (t !== void 0 || K(e.original, n)) || (y(e), j(e), K(e.original, n) && E(t, e.original[n]) ? e.assignedMap.delete(n) : e.assignedMap.set(n, !0), e.copy[n] = t, te(e, n, t, $)), !0);
  },
  has(e, n) {
    return n in w(e);
  },
  ownKeys(e) {
    return Reflect.ownKeys(w(e));
  },
  getOwnPropertyDescriptor(e, n) {
    const t = w(e), o = Reflect.getOwnPropertyDescriptor(t, n);
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
    return e.type === 1 ? we.set.call(this, e, n, void 0, e.proxy) : (L(e.original, n) !== void 0 || n in e.original ? (y(e), j(e), e.assignedMap.set(n, !1)) : (e.assignedMap = (t = e.assignedMap) !== null && t !== void 0 ? t : /* @__PURE__ */ new Map(), e.assignedMap.delete(n)), e.copy && delete e.copy[n], !0);
  }
};
function oe(e) {
  const { original: n, parentDraft: t, key: o, finalities: r, options: l } = e, i = C(n), s = {
    type: i,
    finalized: !1,
    parent: t,
    original: n,
    copy: null,
    proxy: null,
    finalities: r,
    options: l,
    // Mapping of draft Set items to their corresponding draft values.
    setMap: i === 3 ? new Map(n.entries()) : void 0
  };
  (o || "key" in e) && (s.key = o);
  const { proxy: c, revoke: a } = Proxy.revocable(i === 1 ? Object.assign([], s) : s, we);
  if (r.revoke.push(a), s.proxy = c, t) {
    const f = t;
    f.finalities.draft.push((p, O) => {
      var v, I;
      const re = u(c);
      let A = f.type === 3 ? f.setMap : f.copy;
      const S = _(A, o), b = u(S);
      if (b) {
        let R = b.original;
        b.operated && (R = ee(S)), q(b), G(b, $, p, O), f.options.enableAutoFreeze && (f.options.updatedValues = (v = f.options.updatedValues) !== null && v !== void 0 ? v : /* @__PURE__ */ new WeakMap(), f.options.updatedValues.set(R, b.original)), N(A, o, R);
      }
      (I = re.callbacks) === null || I === void 0 || I.forEach((R) => {
        R(p, O);
      });
    });
  } else {
    const f = u(c);
    f.finalities.draft.push((p, O) => {
      q(f), G(f, $, p, O);
    });
  }
  return c;
}
Z.createDraft = oe;
function De(e, n, t, o, r) {
  var l;
  const i = u(e), s = (l = i?.original) !== null && l !== void 0 ? l : e, c = !!n.length;
  if (i?.operated)
    for (; i.finalities.draft.length > 0; )
      i.finalities.draft.pop()(t, o);
  const a = c ? n[0] : i ? i.operated ? i.copy : i.original : e;
  return i && X(i), r && F(a, a, i?.options.updatedValues), [
    a,
    t && c ? [{ op: h.Replace, path: [], value: n[0] }] : t,
    o && c ? [{ op: h.Replace, path: [], value: s }] : o
  ];
}
function Ce(e, n) {
  var t;
  const o = {
    draft: [],
    revoke: [],
    handledSet: /* @__PURE__ */ new WeakSet(),
    draftsCache: /* @__PURE__ */ new WeakSet()
  };
  let r, l;
  n.enablePatches && (r = [], l = []);
  const s = ((t = n.mark) === null || t === void 0 ? void 0 : t.call(n, e, m)) === m.mutable || !M(e, n) ? e : oe({
    original: e,
    parentDraft: null,
    finalities: o,
    options: n
  });
  return [
    s,
    (c = []) => {
      const [a, f, p] = De(s, c, r, l, n.enableAutoFreeze);
      return n.enablePatches ? [a, f, p] : a;
    }
  ];
}
function Q(e) {
  const { rootDraft: n, value: t, useRawReturn: o = !1, isRoot: r = !0 } = e;
  ne(t, (l, i, s) => {
    const c = u(i);
    if (c && n && c.finalities === n.finalities) {
      e.isContainDraft = !0;
      const a = c.original;
      if (s instanceof Set) {
        const f = Array.from(s);
        s.clear(), f.forEach((p) => s.add(l === p ? a : p));
      } else
        N(s, l, a);
    } else typeof i == "object" && i !== null && (e.value = i, e.isRoot = !1, Q(e));
  }), r && (e.isContainDraft || console.warn("The return value does not contain any draft, please use 'rawReturn()' to wrap the return value to improve performance."), o && console.warn("The return value contains drafts, please don't use 'rawReturn()' to wrap the return value."));
}
function me(e) {
  var n;
  const t = u(e);
  if (!M(e, t?.options))
    return e;
  const o = C(e);
  if (t && !t.operated)
    return t.original;
  let r;
  function l() {
    r = o === 2 ? k(e) ? new Map(e) : new (Object.getPrototypeOf(e)).constructor(e) : o === 3 ? Array.from(t.setMap.values()) : ye(e, t?.options);
  }
  if (t) {
    t.finalized = !0;
    try {
      l();
    } finally {
      t.finalized = !1;
    }
  } else
    r = e;
  if (ne(r, (i, s) => {
    if (t && E(_(t.original, i), s))
      return;
    const c = me(s);
    c !== s && (r === e && l(), N(r, i, c));
  }), o === 3) {
    const i = (n = t?.original) !== null && n !== void 0 ? n : r;
    return g(i) ? new Set(r) : new (Object.getPrototypeOf(i)).constructor(r);
  }
  return r;
}
function ae(e) {
  if (!P(e))
    throw new Error(`current() is only used for Draft, parameter: ${e}`);
  return me(e);
}
const Fe = (e) => function n(t, o, r) {
  var l, i, s;
  if (typeof t == "function" && typeof o != "function")
    return function(d, ...z) {
      return n(d, (x) => t.call(this, x, ...z), o);
    };
  const c = t, a = o;
  let f = r;
  if (typeof o != "function" && (f = o), f !== void 0 && Object.prototype.toString.call(f) !== "[object Object]")
    throw new Error(`Invalid options: ${f}, 'options' should be an object.`);
  f = Object.assign(Object.assign({}, e), f);
  const p = P(c) ? ae(c) : c, O = Array.isArray(f.mark) ? ((d, z) => {
    for (const x of f.mark) {
      if (typeof x != "function")
        throw new Error(`Invalid mark: ${x}, 'mark' should be a function.`);
      const V = x(d, z);
      if (V)
        return V;
    }
  }) : f.mark, v = (l = f.enablePatches) !== null && l !== void 0 ? l : !1, I = (i = f.strict) !== null && i !== void 0 ? i : !1, A = {
    enableAutoFreeze: (s = f.enableAutoFreeze) !== null && s !== void 0 ? s : !1,
    mark: O,
    strict: I,
    enablePatches: v
  };
  if (!M(p, A) && typeof p == "object" && p !== null)
    throw new Error("Invalid base state: create() only supports plain objects, arrays, Set, Map or using mark() to mark the state as immutable.");
  const [S, b] = Ce(p, A);
  if (typeof o != "function") {
    if (!M(p, A))
      throw new Error("Invalid base state: create() only supports plain objects, arrays, Set, Map or using mark() to mark the state as immutable.");
    return [S, b];
  }
  let R;
  try {
    R = a(S);
  } catch (d) {
    throw X(u(S)), d;
  }
  const ie = (d) => {
    const z = u(S);
    if (!P(d)) {
      if (d !== void 0 && !E(d, S) && z?.operated)
        throw new Error("Either the value is returned as a new non-draft value, or only the draft is modified without returning any value.");
      const V = d?.[de];
      if (V) {
        const ve = V[0];
        return A.strict && typeof d == "object" && d !== null && Q({
          rootDraft: z,
          value: d,
          useRawReturn: !0
        }), b([ve]);
      }
      if (d !== void 0)
        return typeof d == "object" && d !== null && Q({ rootDraft: z, value: d }), b([d]);
    }
    if (d === S || d === void 0)
      return b([]);
    const x = u(d);
    if (A === x.options) {
      if (x.operated)
        throw new Error("Cannot return a modified child draft.");
      return b([ae(d)]);
    }
    return b([d]);
  };
  return R instanceof Promise ? R.then(ie, (d) => {
    throw X(u(S)), d;
  }) : ie(R);
}, Ie = Fe();
function Ve(e) {
  if (arguments.length === 0)
    throw new Error("rawReturn() must be called with a value.");
  if (arguments.length > 1)
    throw new Error("rawReturn() must be called with one argument.");
  return e !== void 0 && (typeof e != "object" || e === null) && console.warn("rawReturn() must be called with an object(including plain object, arrays, Set, Map, etc.) or `undefined`, other types do not need to be returned via rawReturn()."), {
    [de]: [e]
  };
}
Object.prototype.constructor.toString();
const Te = (e, n) => typeof n == "function" ? Ie(e.value, (t) => {
  const o = n(t);
  return typeof o > "u" || P(o) ? t : typeof o == "object" ? Ve(o) : o;
}) : n, Ke = (e, n) => (e.value = Te(e, n), e.value), $e = (e) => {
  const n = Oe(e);
  return n.set = (t) => Ke(n, t), n;
}, He = (e) => {
  const n = Me(() => $e(e), []), t = U(() => n.value, [n]), o = () => n.peek(), r = U((l) => ue(() => {
    l(n.value);
  }), [n]);
  return [fe(
    r,
    t,
    o
  ), n.set];
}, Ue = (e) => {
  const n = U(() => e.value, [e]), t = () => e.peek(), o = U((r) => ue(() => {
    r(e.value);
  }), [e]);
  return fe(
    o,
    n,
    t
  );
};
export {
  $e as b,
  He as g,
  Ue as k
};
//# sourceMappingURL=reactSetSignal-DfWVTlFz.mjs.map
