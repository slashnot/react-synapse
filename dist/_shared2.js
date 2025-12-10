import { useMemo as w } from "react";
import { b as $, x as m, u as h, w as p } from "./_shared.js";
class b {
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
    return e in this.store ? console.warn(`Signal with id "${e}" already exists in the global store. Skipping creation.`) : (this.store[e] = $(r), this.store[e].id = e), this.store[e];
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
const l = new b(), x = (t, e) => !t || !e || t.length !== e.length ? !1 : t.every((r, s) => Object.is(r, e[s])), E = (t, e) => {
  if (!t || !e) return !1;
  const r = Object.keys(t), s = Object.keys(e);
  return r.length !== s.length ? !1 : r.every((a) => a in e && Object.is(t[a], e[a]));
}, y = (t, e) => {
  if (typeof t == "string") {
    if (t.length === 0)
      throw new Error("Store ID cannot be an empty string");
    return l.hasState(t) ? l.getStoreState(t) : l.setStoreState(t, e);
  }
  if (typeof t == "function")
    return t(l.getStore());
  throw new Error("useSignalStore expects either a string ID or a function");
}, V = (t) => (e, r = {}) => {
  const { unwrap: s = !0 } = r, a = w(() => {
    if (typeof e == "string") {
      if (!(e in t))
        throw new Error(`Store key "${e}" does not exist. Make sure it was defined in createSignalStore.`);
      return t[e];
    }
    if (typeof e == "function") {
      const n = e(t);
      if (n instanceof h || !s)
        return n;
      if (Array.isArray(n)) {
        let u = null, o = null;
        return p(() => {
          const c = e(t).map((v) => v.value);
          return x(u, c) || (u = c, o = [...c]), o;
        });
      }
      let g = null, i = null;
      return p(() => {
        const u = e(t), o = {};
        for (const f in u)
          o[f] = u[f].value;
        return E(g, o) || (g = o, i = { ...o }), i;
      });
    }
    throw new Error("useStore expects either a string key or a selector function");
  }, [e, s]);
  if (!s && typeof e == "function") {
    const n = e(t);
    if (!(n instanceof h))
      return n;
  }
  const S = m(a);
  return typeof e == "string" ? [S, a.set] : S;
}, D = (t) => {
  if (typeof t != "object" || t === null)
    throw new Error("createSignalStore expects an object as initialStates");
  for (const r in t)
    l.setStoreState(r, t[r]);
  const e = l.getStore();
  return {
    store: e,
    useStore: V(e)
  };
}, G = (t, e) => {
  const r = w(() => y(t, e), [
    t,
    e
  ]), s = m(r);
  return typeof t == "string" ? [s, r.set] : s;
};
export {
  b as G,
  D as c,
  l as g,
  G as u
};
