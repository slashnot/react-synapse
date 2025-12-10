import { useMemo } from "react";
import { Signal, useReactiveSignal, computed } from "react-set-signal";
import { globalStore } from "./globalStore";

/**
 * Shallow equality comparison for arrays
 */
const shallowArrayEqual = (arr1, arr2) => {
    if (!arr1 || !arr2) return false;
    if (arr1.length !== arr2.length) return false;
    return arr1.every((v, i) => Object.is(v, arr2[i]));
};

/**
 * Shallow equality comparison for objects
 */
const shallowObjectEqual = (obj1, obj2) => {
    if (!obj1 || !obj2) return false;
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    return keys1.every(key => key in obj2 && Object.is(obj1[key], obj2[key]));
};

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
    /**
     * @param {string|Function} keyOrFunction - Either a string key or a selector function
     * @param {Object} [options] - Options for the hook
     * @param {boolean} [options.unwrap=true] - When false, returns raw signals instead of unwrapped values (for fine-grained control)
     */
    return (keyOrFunction, options = {}) => {
        const { unwrap = true } = options;
        
        const $signal = useMemo(() => {
            // String key pattern
            if (typeof keyOrFunction === 'string') {
                if (!(keyOrFunction in store)) {
                    throw new Error(`Store key "${keyOrFunction}" does not exist. Make sure it was defined in createSignalStore.`)
                }
                return store[keyOrFunction]
            }

            // Function selector pattern
            if (typeof keyOrFunction === 'function') {
                const result = keyOrFunction(store)
                // If the selector returns a Signal, use it directly
                if (result instanceof Signal) {
                    return result
                }

                // If unwrap is false, return signals directly for fine-grained control
                if (!unwrap) {
                    return result
                }

                // If it returns an Array, wrap it in a memoized computed to make it reactive
                if (Array.isArray(result)) {
                    // Memoization state stored in closure (lives with the computed)
                    let prevValues = null;
                    let prevResult = null;
                    
                    const $computed = computed(() => {
                        const states = keyOrFunction(store);
                        const newValues = states.map(state => state.value);
                        
                        // Shallow equality check - return same reference if unchanged
                        if (shallowArrayEqual(prevValues, newValues)) {
                            return prevResult;
                        }
                        
                        prevValues = newValues;
                        prevResult = [...newValues];  // Create new array only when values change
                        return prevResult;
                    });
                    
                    return $computed;
                }

                // If it returns a plain object, wrap it in a memoized computed to make it reactive
                // Memoization state stored in closure (lives with the computed)
                let prevValues = null;
                let prevResult = null;
                
                const $computed = computed(() => {
                    const states = keyOrFunction(store);
                    const computedStates = {};
                    for (const key in states) {
                        computedStates[key] = states[key].value;
                    }
                    
                    // Shallow equality check - return same reference if unchanged
                    if (shallowObjectEqual(prevValues, computedStates)) {
                        return prevResult;
                    }
                    
                    prevValues = computedStates;
                    prevResult = { ...computedStates };  // Create new object only when values change
                    return prevResult;
                });
                
                return $computed;
            }

            throw new Error('useStore expects either a string key or a selector function')
        }, [keyOrFunction, unwrap])

        // When unwrap is false and result is array/object, return directly without useReactiveSignal
        if (!unwrap && typeof keyOrFunction === 'function') {
            const result = keyOrFunction(store);
            if (!(result instanceof Signal)) {
                return result;
            }
        }

        const signal = useReactiveSignal($signal)
        if (typeof keyOrFunction === 'string') {
            return [signal, $signal.set]
        }
        // Function selector pattern returns just the value
        return signal
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

export { useSignalStore, createSignalStore }
export default useSignalStore;