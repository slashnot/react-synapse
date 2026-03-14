import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { Signal, useReactiveSignal, computed, effect } from "react-set-signal";
import { GlobalStore } from "./globalStore";

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
     * @param {Function} selector - A function that receives the store and returns an object of signals or a single signal
     * @returns {Object|*} An object containing the unwrapped values of the selected signals, or a single unwrapped value if a single signal is returned
     * @throws {Error} If selector is not a function
     * @throws {Error} If selector does not return a Signal or object of Signals
     */
    return (selector) => {
        if (typeof selector !== 'function')
            throw new Error('useSelector expects a function as the selector argument')

        const effectFn = useCallback(() => {
            const $states = selector(store)
            const states = {}

            if (typeof $states === 'object' && $states !== null) {
                if ($states instanceof Signal) {
                    return $states.value
                }
                
                for (const key in $states) {
                    if (!($states[key] instanceof Signal)) {
                        throw new Error(`Selector function must return an object of Signals. Key "${key}" is not a Signal.`)
                    }
                    states[key] = $states[key].value
                }
                return states
            }
            throw new Error('Selector function must return an object of Signals.')
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
 * Create a typed useSetter hook bound to a specific store.
 * The returned hook allows getting setter functions for multiple signals at once.
 *
 * This is useful when you need to:
 * - Get multiple setters in a single hook call
 * - Update signals from event handlers without subscribing to their changes
 * - Avoid re-renders when only setters are needed (not values)
 *
 * @param {Object} store - The store object containing signals (from createSignalStore)
 * @returns {Function} A typed useSetter hook that accepts a selector function
 *
 * @example
 * // Create a store with multiple signals
 * const { store, useSetter } = createSignalStore({
 *   user: { name: 'John', age: 30 },
 *   theme: 'light',
 *   notifications: []
 * })
 *
 * // Get setters without subscribing to value changes
 * function UpdateButton() {
 *   const { setUser, setTheme } = useSetter(s => ({
 *     setUser: s.user,
 *     setTheme: s.theme
 *   }))
 *
 *   return (
 *     <button onClick={() => setUser(draft => { draft.name = 'Jane' })}>
 *       Update User
 *     </button>
 *   )
 * }
 *
 * @example
 * // Getting a single setter
 * const setUser = useSetter(s => s.user)
 * setUser(draft => { draft.name = 'Jane' })
 */
const createUseSetter = (store) => {
    /**
     * Typed setter hook for getting setter functions for multiple signals.
     *
     * @param {Function} selector - A function that receives the store and returns an object of signals or a single signal
     * @returns {Object|Function} An object containing the setter functions, or a single setter function if a single signal is returned
     * @throws {Error} If selector is not a function
     * @throws {Error} If selector does not return a Signal or object of Signals
     */
    return (selector) => {
        if (typeof selector !== 'function')
            throw new Error('useSetter expects a function as the selector argument')

        const setters = useMemo(() => {
            const $states = selector(store)
            const setters = {}

            if (typeof $states === 'object' && $states !== null) {
                if ($states instanceof Signal) {
                    return $states.set
                }

                for (const key in $states) {
                    if (!($states[key] instanceof Signal)) {
                        throw new Error(`Selector function must return an object of Signals. Key "${key}" is not a Signal.`)
                    }
                    setters[key] = $states[key].set
                }
                return setters
            }

            throw new Error('Selector function must return an object of Signals.')
        }, [selector, store])

        return setters
    }
}

/**
 * Create multiple signal stores from an initial states object.
 * Returns a typed store and hooks for full type inference.
 * 
 * @param {Object} initialStates - Object containing initial values for each store
 * @returns {{ store: Object, useStore: Function, useSelector: Function, useSetter: Function }} An object with the typed store and hooks
 * 
 * @example
 * const { store, useStore, useSelector, useSetter } = createSignalStore({
 *   user: { name: 'John', age: 30 },
 *   theme: 'light'
 * })
 * 
 * // String key pattern - returns [value, setter]
 * const [user, setUser] = useStore('user')
 * 
 * // Function selector pattern - returns just the value
 * const theme = useStore(s => s.theme)
 * 
 * // Select multiple values at once
 * const { user, theme } = useSelector(s => ({
 *   user: s.user,
 *   theme: s.theme
 * }))
 * 
 * // Get setters without subscribing to changes
 * const { setUser, setTheme } = useSetter(s => ({
 *   setUser: s.user,
 *   setTheme: s.theme
 * }))
 */
const createSignalStore = (initialStates) => {
    if (typeof initialStates !== 'object' || initialStates === null) {
        throw new Error("createSignalStore expects an object as initialStates")
    }
    const localStore = new GlobalStore()

    // Create all signals in the local store
    for (const key in initialStates) {
        localStore.setStoreState(key, initialStates[key])
    }

    const store = localStore.getStore()
    const useStore = createUseStoreHook(store)
    const useSelector = createUseSelectorHook(store)
    const useSetter = createUseSetter(store)

    // Return both the store and a typed useStore hook
    return Object.assign([store, useStore, useSelector, useSetter], { store, useStore, useSelector, useSetter })
}

export { createSignalStore }
export default createSignalStore;