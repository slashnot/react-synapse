import { useMemo as n } from "react";
import { b as i, k as a } from "./reactSetSignal-DfWVTlFz.mjs";
class l {
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
const s = new l(), g = (e, t) => {
  if (typeof e == "string") {
    if (e.length === 0)
      throw new Error("Store ID cannot be an empty string");
    return s.hasState(e) ? s.getStoreState(e) : s.setStoreState(e, t);
  }
  if (typeof e == "function")
    return e(s.getStore());
  throw new Error("useSignalStore expects either a string ID or a function");
}, S = (e) => (t) => {
  if (typeof t == "string") {
    const r = n(() => {
      if (!(t in e))
        throw new Error(`Store key "${t}" does not exist. Make sure it was defined in createSignalStore.`);
      return e[t];
    }, [t]);
    return [a(r), r.set];
  }
  if (typeof t == "function") {
    const r = n(() => t(e), [t]);
    return a(r);
  }
  throw new Error("useStore expects either a string key or a selector function");
}, c = (e) => {
  if (typeof e != "object" || e === null)
    throw new Error("createSignalStore expects an object as initialStates");
  for (const r in e)
    s.setStoreState(r, e[r]);
  const t = s.getStore();
  return {
    store: t,
    useStore: S(t)
  };
}, w = (e, t) => {
  const r = n(() => g(e, t), [
    e,
    t
  ]), o = a(r);
  return typeof e == "string" ? [o, r.set] : o;
};
window.globalStore = s;
export {
  l as G,
  c,
  s as g,
  w as u
};
//# sourceMappingURL=useSignalStore-CYYLdjWk.mjs.map
