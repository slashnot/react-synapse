import { Computed, createSignal, Signal } from "react-set-signal"

class GlobalStore {
    store = {}
    // --------------

    getStore() {
        return this.store
    }
    // --------------

    getStoreValues() {
        const storeValues = {}
        for (const key in this.store) {
            storeValues[key] = this.store[key].value
        }
        return storeValues
    }
    // --------------

    getStoreState(id) {
        return this.store[id]
    }
    // --------------

    setStoreState(key, value, isSignal = false) {
        if (!(key in this.store)) {
            if (isSignal && !(value instanceof Computed))
                throw new Error(`When creating a derived signal store value for key "${key}" must be a Computed function.`)

            this.store[key] = isSignal ? value : createSignal(value)
            this.store[key].id = key
        }
        else {
            console.warn(`Signal with id "${key}" already exists in the global store. Skipping creation.`)
        }
        return this.store[key]
    }
    // --------------

    hasState(key) {
        return key in this.store
    }
    // --------------

    clearStore() {
        this.store = {}
        return this.store
    }
}
const globalStore = new GlobalStore()

export { globalStore, GlobalStore }
export default globalStore;