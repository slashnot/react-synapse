import { useMemo as g } from "react";
import { b as h, x as f, u as c, w as l } from "./_shared.js";
class u {
  store = {};
  // --------------
  getStore() {
    return this.store;
  }
  // --------------
  getStoreValues() {
    const t = {};
    for (const r in this.store)
      t[r] = this.store[r].value;
    return t;
  }
  // --------------
  getStoreState(t) {
    return this.store[t];
  }
  // --------------
  setStoreState(t, r) {
    return t in this.store ? console.warn(`Signal with id "${t}" already exists in the global store. Skipping creation.`) : (this.store[t] = h(r), this.store[t].id = t, console.log(`Created signal with id "${t}" in the global store with value:`, r)), this.store[t];
  }
  // --------------
  hasState(t) {
    return t in this.store;
  }
  // --------------
  clearStore() {
    return this.store = {}, this.store;
  }
}
const s = new u(), p = (e, t) => {
  if (typeof e == "string") {
    if (e.length === 0)
      throw new Error("Store ID cannot be an empty string");
    return s.hasState(e) ? s.getStoreState(e) : s.setStoreState(e, t);
  }
  if (typeof e == "function")
    return e(s.getStore());
  throw new Error("useSignalStore expects either a string ID or a function");
}, w = (e) => (t) => {
  const r = g(() => {
    if (typeof t == "string") {
      if (!(t in e))
        throw new Error(`Store key "${t}" does not exist. Make sure it was defined in createSignalStore.`);
      return e[t];
    }
    if (typeof t == "function") {
      const a = t(e);
      return a instanceof c ? a : Array.isArray(a) ? l(() => t(e).map((n) => n.value)) : l(() => {
        const i = {}, n = t(e);
        for (const S in n)
          i[S] = n[S].value;
        return i;
      });
    }
    throw new Error("useStore expects either a string key or a selector function");
  }, [t]), o = f(r);
  return typeof t == "string" ? [o, r.set] : o;
}, x = (e) => {
  if (typeof e != "object" || e === null)
    throw new Error("createSignalStore expects an object as initialStates");
  for (const r in e)
    s.setStoreState(r, e[r]);
  const t = s.getStore();
  return {
    store: t,
    useStore: w(t)
  };
}, E = (e, t) => {
  const r = g(() => p(e, t), [
    e,
    t
  ]), o = f(r);
  return typeof e == "string" ? [o, r.set] : o;
};
export {
  u as G,
  x as c,
  s as g,
  E as u
};
