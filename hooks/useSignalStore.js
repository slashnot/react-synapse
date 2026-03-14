import { useMemo, useEffect, useState, useCallback } from "react";
import { Signal, effect, useReactiveSignal } from "react-set-signal";
import { GlobalStore } from "./globalStore";


/**
 * Create a typed useStore hook bound to a specific store
 * Uses string key pattern to access store signals.
 *
 * @param {Object} store - The store object containing signals
 * @returns {Function} A typed useStore hook
 */
const createUseStoreHook = (store) => {
    /**
     * @param {string} key - A string key to access the store signal
     */
    return (key) => {
        if (typeof key !== 'string')
            throw new Error('useStore expects a string key')

        const $signal = useMemo(() => {
            if (!(key in store)) {
                throw new Error(`Store key "${key}" does not exist. Make sure it was defined in createSignalStore.`)
            }
            return store[key]
        }, [key])

        const signal = useReactiveSignal($signal)
        return Object.assign([signal, $signal.set], { signal, setSignal: $signal.set })
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