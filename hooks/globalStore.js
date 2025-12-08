import { createSignal } from "react-set-signal"

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

    setStoreState(key, value) {
        if (!(key in this.store)) {
            this.store[key] = createSignal(value)
            this.store[key].id = key
            console.log(`Created signal with id "${key}" in the global store with value:`, value)
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