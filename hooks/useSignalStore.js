import { useMemo } from "react";
import { useReactiveSignal } from "./useReactiveSignal";
import { globalStore } from "./globalStore";

/**
 * Internal function to get or create a store signal
 */
const getStoreSignal = (idOrFunction, initialState) => {
    // String ID based store retrieval/creation
    if (typeof idOrFunction === 'string') {
        if (idOrFunction.length === 0) {
            throw new Error('Store ID cannot be an empty string')
        }
        return globalStore.hasState(idOrFunction)
            ? globalStore.getStoreState(idOrFunction)
            : globalStore.setStoreState(idOrFunction, initialState)
    }

    // Function based store retrieval/creation
    if (typeof idOrFunction === 'function') {
        return idOrFunction(globalStore.getStore())
    }
    throw new Error('useSignalStore expects either a string ID or a function')
}

/**
 * Create a typed useStore hook bound to a specific store
 * Supports both string key pattern and function selector pattern.
 * 
 * @param {Object} store - The store object containing signals
 * @returns {Function} A typed useStore hook
 */
const createUseStoreHook = (store) => {
    return (keyOrFunction) => {
        // String key pattern
        if (typeof keyOrFunction === 'string') {
            const $signal = useMemo(() => {
                if (!(keyOrFunction in store)) {
                    throw new Error(`Store key "${keyOrFunction}" does not exist. Make sure it was defined in createSignalStore.`)
                }
                return store[keyOrFunction]
            }, [keyOrFunction])
            
            const signal = useReactiveSignal($signal)
            return [signal, $signal.set]
        }
        
        // Function selector pattern
        if (typeof keyOrFunction === 'function') {
            const $signal = useMemo(() => {
                return keyOrFunction(store)
            }, [keyOrFunction])
            
            const signal = useReactiveSignal($signal)
            return signal
        }
        
        throw new Error('useStore expects either a string key or a selector function')
    }
}

/**
 * Create multiple signal stores from an initial states object.
 * Returns a typed store and useStore hook for full type inference.
 * 
 * @param {Object} initialStates - Object containing initial values for each store
 * @returns {{ store: Object, useStore: Function }} An object with the typed store and useStore hook
 * 
 * @example
 * const { store, useStore } = createSignalStore({
 *   user: { name: 'John', age: 30 },
 *   theme: 'light'
 * })
 * 
 * // String key pattern - returns [value, setter]
 * const [user, setUser] = useStore('user')
 * 
 * // Function selector pattern - returns just the value
 * const theme = useStore(s => s.theme)
 */
const createSignalStore = (initialStates) => {
    if (typeof initialStates !== 'object' || initialStates === null) {
        throw new Error("createSignalStore expects an object as initialStates")
    }
    
    // Create all signals in the global store
    for (const key in initialStates) {
        globalStore.setStoreState(key, initialStates[key])
    }
    
    const store = globalStore.getStore()
    
    // Return both the store and a typed useStore hook
    return {
        store,
        useStore: createUseStoreHook(store)
    }
}

// -----------------------------
// useSignalStore hook (legacy/generic)
// -----------------------------
/**
 * A React hook for managing global state using Preact Signals.
 * For full type inference, use the useStore hook returned from createSignalStore instead.
 * 
 * @param {string|Function} idOrFunction - Either a string ID or a function that receives the store
 * @param {*} initialState - The initial state value (required for string ID pattern)
 * @returns {[*, Function]|*} For string ID: [state, setter]. For function: the state value.
 */
const useSignalStore = (idOrFunction, initialState) => {
    const $signal = useMemo(() => getStoreSignal(idOrFunction, initialState), [
        idOrFunction,
        initialState
    ])
    const signal = useReactiveSignal($signal)
    
    // For string pattern: return tuple [state, setter]
    // For function pattern: return just the state value
    if (typeof idOrFunction === 'string') {
        return [signal, $signal.set]
    } else {
        // Function pattern returns just the state
        return signal
    }
}

// --------------
window.globalStore = globalStore

export { useSignalStore, createSignalStore }
export default useSignalStore;