import { useMemo as m, useRef as S } from "react";
import { b, x as R, u as w, w as x } from "./_shared.js";
class A {
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
    return e in this.store ? console.warn(`Signal with id "${e}" already exists in the global store. Skipping creation.`) : (this.store[e] = b(r), this.store[e].id = e), this.store[e];
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
const u = new A(), E = (t, e) => !t || !e || t.length !== e.length ? !1 : t.every((r, o) => Object.is(r, e[o])), $ = (t, e) => {
  if (!t || !e) return !1;
  const r = Object.keys(t), o = Object.keys(e);
  return r.length !== o.length ? !1 : r.every((a) => a in e && Object.is(t[a], e[a]));
}, j = (t, e) => {
  if (typeof t == "string") {
    if (t.length === 0)
      throw new Error("Store ID cannot be an empty string");
    return u.hasState(t) ? u.getStoreState(t) : u.setStoreState(t, e);
  }
  if (typeof t == "function")
    return t(u.getStore());
  throw new Error("useSignalStore expects either a string ID or a function");
}, q = (t) => (e, r = {}) => {
  const { unwrap: o = !0 } = r, a = S(e), y = S({ prevValues: null, prevResult: null, isArray: null }), i = S(null);
  a.current = e;
  const g = m(() => {
    if (typeof e == "string") {
      if (!(e in t))
        throw new Error(`Store key "${e}" does not exist. Make sure it was defined in createSignalStore.`);
      return t[e];
    }
    if (typeof e == "function") {
      const l = e(t);
      if (l instanceof w || !o)
        return l;
      const c = Array.isArray(l), s = y.current;
      if (s.isArray !== c && (s.prevValues = null, s.prevResult = null, s.isArray = c), i.current)
        return i.current;
      const v = x(() => {
        const V = a.current, p = V(t);
        if (c) {
          const n = p.map((f) => f.value);
          return E(s.prevValues, n) || (s.prevValues = n, s.prevResult = [...n]), s.prevResult;
        } else {
          const n = {};
          for (const f in p)
            n[f] = p[f].value;
          return $(s.prevValues, n) || (s.prevValues = n, s.prevResult = { ...n }), s.prevResult;
        }
      });
      return i.current = v, v;
    }
    throw new Error("useStore expects either a string key or a selector function");
  }, [typeof e == "string" ? e : "function", o]);
  if (!o && typeof e == "function") {
    const l = e(t);
    if (!(l instanceof w))
      return l;
  }
  const h = R(g);
  return typeof e == "string" ? [h, g.set] : h;
}, I = (t) => {
  if (typeof t != "object" || t === null)
    throw new Error("createSignalStore expects an object as initialStates");
  for (const r in t)
    u.setStoreState(r, t[r]);
  const e = u.getStore();
  return {
    store: e,
    useStore: q(e)
  };
}, M = (t, e) => {
  const r = m(() => j(t, e), [
    t,
    e
  ]), o = R(r);
  return typeof t == "string" ? [o, r.set] : o;
};
export {
  A as G,
  I as c,
  u as g,
  M as u
};
