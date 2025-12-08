import { useMemo as n } from "react";
import { b as i, x as a } from "./_shared.js";
class S {
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
    return t in this.store ? console.warn(`Signal with id "${t}" already exists in the global store. Skipping creation.`) : (this.store[t] = i(r), this.store[t].id = t, console.log(`Created signal with id "${t}" in the global store with value:`, r)), this.store[t];
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
const o = new S(), g = (e, t) => {
  if (typeof e == "string") {
    if (e.length === 0)
      throw new Error("Store ID cannot be an empty string");
    return o.hasState(e) ? o.getStoreState(e) : o.setStoreState(e, t);
  }
  if (typeof e == "function")
    return e(o.getStore());
  throw new Error("useSignalStore expects either a string ID or a function");
}, l = (e) => (t) => {
  const r = n(() => {
    if (typeof t == "string") {
      if (!(t in e))
        throw new Error(`Store key "${t}" does not exist. Make sure it was defined in createSignalStore.`);
      return e[t];
    }
    if (typeof t == "function")
      return t(e);
    throw new Error("useStore expects either a string key or a selector function");
  }, [t]), s = a(r);
  return typeof t == "string" ? [s, r.set] : s;
}, c = (e) => {
  if (typeof e != "object" || e === null)
    throw new Error("createSignalStore expects an object as initialStates");
  for (const r in e)
    o.setStoreState(r, e[r]);
  const t = o.getStore();
  return {
    store: t,
    useStore: l(t)
  };
}, p = (e, t) => {
  const r = n(() => g(e, t), [
    e,
    t
  ]), s = a(r);
  return typeof e == "string" ? [s, r.set] : s;
};
export {
  S as G,
  c,
  o as g,
  p as u
};
