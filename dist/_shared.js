import { useMemo as n } from "react";
import { createSignal as i, useReactiveSignal as a } from "react-set-signal";
class S {
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
    return e in this.store ? console.warn(`Signal with id "${e}" already exists in the global store. Skipping creation.`) : (this.store[e] = i(r), this.store[e].id = e, console.log(`Created signal with id "${e}" in the global store with value:`, r)), this.store[e];
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
const s = new S(), g = (t, e) => {
  if (typeof t == "string") {
    if (t.length === 0)
      throw new Error("Store ID cannot be an empty string");
    return s.hasState(t) ? s.getStoreState(t) : s.setStoreState(t, e);
  }
  if (typeof t == "function")
    return t(s.getStore());
  throw new Error("useSignalStore expects either a string ID or a function");
}, l = (t) => (e) => {
  const r = n(() => {
    if (typeof e == "string") {
      if (!(e in t))
        throw new Error(`Store key "${e}" does not exist. Make sure it was defined in createSignalStore.`);
      return t[e];
    }
    if (typeof e == "function")
      return e(t);
    throw new Error("useStore expects either a string key or a selector function");
  }, [e]), o = a(r);
  return typeof e == "string" ? [o, r.set] : o;
}, c = (t) => {
  if (typeof t != "object" || t === null)
    throw new Error("createSignalStore expects an object as initialStates");
  for (const r in t)
    s.setStoreState(r, t[r]);
  const e = s.getStore();
  return {
    store: e,
    useStore: l(e)
  };
}, u = (t, e) => {
  const r = n(() => g(t, e), [
    t,
    e
  ]), o = a(r);
  return typeof t == "string" ? [o, r.set] : o;
};
export {
  S as G,
  c,
  s as g,
  u
};
