import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { Signal, useReactiveSignal, computed, effect } from "react-set-signal";
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

        // Use refs to maintain stable references across renders
        const selectorRef = useRef(keyOrFunction);
        const memoRef = useRef({ prevValues: null, prevResult: null, isArray: null });
        const computedRef = useRef(null);

        // Cleanup on unmount to prevent memory leaks
        useEffect(() => {
            return () => {
                // Dispose of computed signal if it has a dispose method
                if (computedRef.current && typeof computedRef.current.dispose === 'function') {
                    computedRef.current.dispose();
                }
                // Clear refs to allow garbage collection
                computedRef.current = null;
                memoRef.current = { prevValues: null, prevResult: null, isArray: null };
            };
        }, []);

        // Update selector ref on each render (so computed always uses latest selector)
        selectorRef.current = keyOrFunction;

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

                // Track if result type is array for the memoization logic
                const isArray = Array.isArray(result);
                const memo = memoRef.current;

                // Reset memo if result type changed
                if (memo.isArray !== isArray) {
                    memo.prevValues = null;
                    memo.prevResult = null;
                    memo.isArray = isArray;
                }

                // Reuse existing computed if possible
                if (computedRef.current) {
                    return computedRef.current;
                }

                // Create computed that reads from refs for stable behavior
                const $computed = computed(() => {
                    const currentSelector = selectorRef.current;
                    const states = currentSelector(store);

                    if (isArray) {
                        const newValues = states.map(state => state.value);

                        // Shallow equality check - return same reference if unchanged
                        if (shallowArrayEqual(memo.prevValues, newValues)) {
                            return memo.prevResult;
                        }

                        memo.prevValues = newValues;
                        memo.prevResult = [...newValues];
                        return memo.prevResult;
                    } else {
                        const computedStates = {};
                        for (const key in states) {
                            computedStates[key] = states[key].value;
                        }

                        // Shallow equality check - return same reference if unchanged
                        if (shallowObjectEqual(memo.prevValues, computedStates)) {
                            return memo.prevResult;
                        }

                        memo.prevValues = computedStates;
                        memo.prevResult = { ...computedStates };
                        return memo.prevResult;
                    }
                });

                computedRef.current = $computed;
                return $computed;
            }

            throw new Error('useStore expects either a string key or a selector function')
            // Only depend on unwrap and whether it's a string/function (not the function reference itself)
        }, [typeof keyOrFunction === 'string' ? keyOrFunction : 'function', unwrap])

        // When unwrap is false and result is array/object, return directly without useReactiveSignal
        if (!unwrap && typeof keyOrFunction === 'function') {
            const result = keyOrFunction(store);
            if (!(result instanceof Signal)) {
                return result;
            }
        }

        const signal = useReactiveSignal($signal)
        if (typeof keyOrFunction === 'string') {
            return Object.assign([signal, $signal.set], { signal, setSignal: $signal.set }) // Return tuple with additional properties for convenience
        }
        // Function selector pattern returns just the value
        return signal
    }
}


/**
 * Create a typed useSelector hook bound to a specific store.
 * The returned hook allows selecting multiple signals at once and subscribing to their changes.
 *
 * This is useful when you need to:
 * - Subscribe to multiple signals in a single hook call
 * - Get a snapshot of multiple signal values at once
 * - Avoid multiple re-renders when multiple signals change
 *
 * @param {Object} store - The store object containing signals (from createSignalStore)
 * @returns {Function} A typed useSelector hook that accepts a selector function
 *
 * @example
 * // Create a store with multiple signals
 * const { store, useSelector } = createSignalStore({
 *   user: { name: 'John', age: 30 },
 *   theme: 'light',
 *   notifications: []
 * })
 *
 * // Use the selector hook to subscribe to multiple signals
 * function UserProfile() {
 *   const { user, theme } = useSelector(s => ({
 *     user: s.user,
 *     theme: s.theme
 *   }))
 *
 *   return (
 *     <div className={theme}>
 *       <h1>{user.name}</h1>
 *     </div>
 *   )
 * }
 *
 * @example
 * // Selecting a subset of signal values
 * const { name, age } = useSelector(s => ({
 *   name: s.user,
 *   age: s.userAge
 * }))
 */
const createUseSelectorHook = (store) => {
    /**
     * Typed selector hook for subscribing to multiple signals at once.
     *
     * @param {Function} selector - A function that receives the store and returns an object of signals
     * @returns {Object} An object containing the unwrapped values of the selected signals
     * @throws {Error} If selector is not a function
     * @throws {Error} If selector does not return an object of Signals
     */
    return (selector) => {
        const effectFn = useCallback(() => {
            if (typeof selector !== 'function') {
                throw new Error('useSelector expects a function as the selector argument')
            }

            const $states = selector(store)
            const states = {}

            for (const key in $states) {
                if (!($states[key] instanceof Signal)) {
                    throw new Error(`Selector function must return an object of Signals. Key "${key}" is not a Signal.`)
                }
                states[key] = $states[key].value
            }
            return states
        }, [selector])

        const [signal, setSignal] = useState(effectFn())
        useEffect(() => {
            const unsubscribe = effect(() => {
                const states = effectFn()
                setSignal(states)
            })
            return unsubscribe
        }, [])

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
    const useStore = createUseStoreHook(store)
    const useSelector = createUseSelectorHook(store)

    // Return both the store and a typed useStore hook
    return Object.assign([store, useStore, useSelector], { store, useStore, useSelector })
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
 * 
 * WARNING: When using function selectors, avoid passing inline arrow functions as they
 * create new references on each render, causing unnecessary signal recreation. Instead,
 * define the selector function outside the component or use useMemo/useCallback to
 * stabilize the reference:
 * 
 * @example
 * // ❌ Bad: Inline function creates new reference each render
 * const state = useSignalStore(store => store.user)
 * 
 * // ✅ Good: Stable function reference
 * const selectUser = useCallback(store => store.user, [])
 * const state = useSignalStore(selectUser)
 * 
 * // ✅ Good: Define outside component
 * const selectUser = store => store.user
 * function MyComponent() {
 *   const state = useSignalStore(selectUser)
 * }
 */
const useSignalStore = (idOrFunction, initialState) => {
    // Use stable dependency key to prevent unnecessary signal recreation
    // For strings: use the string value itself (stable)
    // For functions: use 'function' as key to avoid recreation on reference change
    // This is a trade-off: inline functions won't cause recreation, but if you need
    // to change the selector, define it outside the component and use a stable reference
    const $signal = useMemo(() => getStoreSignal(idOrFunction, initialState), [
        typeof idOrFunction === 'string' ? idOrFunction : typeof idOrFunction,
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