import { ReactSetSignal, Computed } from 'react-set-signal'

/**
 * Type-safe global store mapping keys to their signal types
 */
export type TypedGlobalStore<T extends Record<string, any>> = {
  [K in keyof T]: ReactSetSignal<T[K]> & { id?: string }
}

/**
 * Setter function type for signal store values
 * Accepts either a new value or a function that receives a draft and returns a value or void
 */
export type SignalSetter<T> = (fnOrValue: T | ((draft: T) => T | void)) => T

/**
 * Return type for useStore hook when using string key pattern
 * A tuple with additional convenience properties
 */
export type UseStoreResult<T> = [T, SignalSetter<T>] & {
  /** The current signal value */
  signal: T
  /** The setter function for the signal */
  setSignal: SignalSetter<T>
}

/**
 * Helper type to unwrap a single signal
 */
export type UnwrapSignal<T> = T extends ReactSetSignal<infer V> ? V : T

/**
 * Helper type to unwrap signals in an object (one level deep)
 * If T is a signal, unwrap it. If T is an object, unwrap each property that is a signal.
 */
export type UnwrapSignals<T> = T extends ReactSetSignal<infer V>
  ? V
  : T extends object
    ? { [K in keyof T]: UnwrapSignal<T[K]> }
    : T

/**
 * Selector function type for accessing store values
 */
export type StoreSelector<T extends Record<string, any>, R> = (store: TypedGlobalStore<T>) => R

/**
 * Options for useStore hook
 */
export interface UseStoreOptions {
  /**
   * When false, returns raw signals instead of unwrapped values.
   * This allows fine-grained control over reactivity by letting consumers
   * access .value on signals individually.
   * @default true
   */
  unwrap?: boolean
}

/**
 * Typed hook for accessing store values with full type inference
 * Supports string key pattern only.
 */
export interface TypedUseStore<T extends Record<string, any>> {
  /**
   * Access a store value by key with full type inference
   * @param key - The key of the store entry
   * @returns A tuple with [value, setter] and additional convenience properties
   *
   * @example
   * ```tsx
   * const [user, setUser] = useStore('user')
   * // user is typed, setUser accepts typed value or draft function
   * 
   * // Or use convenience properties:
   * const result = useStore('user')
   * result.signal    // the current value
   * result.setSignal // the setter function
   * ```
   */
  <K extends keyof T & string>(key: K): UseStoreResult<T[K]>
}

/**
 * Selector function type for useSelector hook.
 * Receives the typed store and returns an object of signals.
 */
export type UseSelectorFunction<T extends Record<string, any>, R extends Record<string, ReactSetSignal<any>>> = (store: TypedGlobalStore<T>) => R

/**
 * Helper type to unwrap signals in an object for useSelector return type.
 * Takes an object of signals and returns an object with their unwrapped values.
 */
export type UnwrapSignalObject<T extends Record<string, ReactSetSignal<any>>> = {
  [K in keyof T]: T[K] extends ReactSetSignal<infer V> ? V : never
}

/**
 * Typed hook for selecting multiple signals at once.
 * Subscribes to changes in all selected signals and returns their unwrapped values.
 */
export interface TypedUseSelector<T extends Record<string, any>> {
  /**
   * Select multiple signals from the store and subscribe to their changes.
   * @param selector - Function that receives the typed store and returns an object of signals or a single signal
   * @returns An object containing the unwrapped values of the selected signals, or a single unwrapped value
   *
   * @example
   * ```tsx
   * const { store, useSelector } = createSignalStore({
   *   user: { name: 'John', age: 30 },
   *   theme: 'light'
   * })
   *
   * // Subscribe to multiple signals at once
   * const { user, theme } = useSelector(s => ({
   *   user: s.user,
   *   theme: s.theme
   * }))
   *
   * // user is typed as { name: string, age: number }
   * // theme is typed as string
   *
   * // Or select a single signal
   * const user = useSelector(s => s.user)
   * // user is typed as { name: string, age: number }
   * ```
   */
  <R extends Record<string, ReactSetSignal<any>>>(selector: UseSelectorFunction<T, R>): UnwrapSignalObject<R>
  <R extends ReactSetSignal<any>>(selector: StoreSelector<T, R>): UnwrapSignal<R>
}

/**
 * Helper type to extract setter types from an object of signals.
 * Takes an object of signals and returns an object with their setter functions.
 */
export type SignalSetterObject<T extends Record<string, ReactSetSignal<any>>> = {
  [K in keyof T]: T[K] extends ReactSetSignal<infer V> ? SignalSetter<V> : never
}

/**
 * Typed hook for getting setter functions for multiple signals.
 * Does not subscribe to changes - only returns setter functions.
 */
export interface TypedUseSetter<T extends Record<string, any>> {
  /**
   * Get setter functions for multiple signals without subscribing to their changes.
   * @param selector - Function that receives the typed store and returns an object of signals or a single signal
   * @returns An object containing the setter functions, or a single setter function
   *
   * @example
   * ```tsx
   * const { store, useSetter } = createSignalStore({
   *   user: { name: 'John', age: 30 },
   *   theme: 'light'
   * })
   *
   * // Get multiple setters without subscribing to value changes
   * const { setUser, setTheme } = useSetter(s => ({
   *   setUser: s.user,
   *   setTheme: s.theme
   * }))
   *
   * // setUser is typed as (fnOrValue) => T
   * // setTheme is typed as (fnOrValue) => T
   *
   * // Or get a single setter
   * const setUser = useSetter(s => s.user)
   * // setUser is typed as SignalSetter<{ name: string, age: number }>
   * ```
   */
  <R extends Record<string, ReactSetSignal<any>>>(selector: UseSelectorFunction<T, R>): SignalSetterObject<R>
  <R extends ReactSetSignal<any>>(selector: StoreSelector<T, R>): R extends ReactSetSignal<infer V> ? SignalSetter<V> : never
}

/**
 * Return type of createSignalStore with typed useStore hook
 * Returns an array that can also be accessed as an object
 */
export type TypedSignalStore<T extends Record<string, any>> = [TypedGlobalStore<T>, TypedUseStore<T>, TypedUseSelector<T>, TypedUseSetter<T>] & {
  /**
   * The raw store object containing all signals
   */
  store: TypedGlobalStore<T>
  
  /**
   * Typed hook for accessing store values
   * Supports both string key pattern and function selector pattern.
   * 
   * @example
   * ```tsx
   * const { useStore } = createSignalStore({
   *   user: { name: 'John', age: 30 },
   *   theme: 'light'
   * })
   * 
   * // String key pattern - returns [value, setter]
   * const [user, setUser] = useStore('user')
   * user.name  // ✓ autocomplete works
   * 
   * // Function selector pattern - returns just the value
   * const theme = useStore(s => s.theme)
   * // theme is string
   * ```
   */
  useStore: TypedUseStore<T>

  /**
   * Typed hook for selecting multiple signals at once.
   * Subscribes to changes in all selected signals and returns their unwrapped values.
   * 
   * @example
   * ```tsx
   * const { useSelector } = createSignalStore({
   *   user: { name: 'John', age: 30 },
   *   theme: 'light'
   * })
   * 
   * // Subscribe to multiple signals at once
   * const { user, theme } = useSelector(s => ({
   *   user: s.user,
   *   theme: s.theme
   * }))
   * ```
   */
  useSelector: TypedUseSelector<T>

  /**
   * Typed hook for getting setter functions without subscribing to value changes.
   * Useful when you only need to update signals, not read them.
   * 
   * @example
   * ```tsx
   * const { useSetter } = createSignalStore({
   *   user: { name: 'John', age: 30 },
   *   theme: 'light'
   * })
   * 
   * // Get setters without subscribing to value changes
   * const { setUser, setTheme } = useSetter(s => ({
   *   setUser: s.user,
   *   setTheme: s.theme
   * }))
   * ```
   */
  useSetter: TypedUseSetter<T>
}

/**
 * Return type of createDerivedSignalStore with typed useSelector hook
 * Derived signal stores only expose store and useSelector (read-only, computed values)
 * Returns an array that can also be accessed as an object
 */
export type TypedDerivedSignalStore<T extends Record<string, any>> = [TypedGlobalStore<T>, TypedUseSelector<T>] & {
  /**
   * The raw store object containing all derived signals
   */
  store: TypedGlobalStore<T>

  /**
   * Typed hook for selecting multiple derived signals at once.
   * Subscribes to changes in all selected signals and returns their unwrapped values.
   * 
   * @example
   * ```tsx
   * const { store, useSelector } = createDerivedSignalStore({
   *   count: 0,
   *   doubleCount: (get) => get(store.count) * 2
   * })
   * 
   * // Subscribe to multiple derived signals at once
   * const { count, doubleCount } = useSelector(s => ({
   *   count: s.count,
   *   doubleCount: s.doubleCount
   * }))
   * ```
   */
  useSelector: TypedUseSelector<T>
}

/**
 * Create multiple signal stores from an initial states object.
 * Returns a typed store and hooks for full type inference.
 * 
 * @template T - The shape of the initial state object
 * @param initialStates - Object containing initial values for each store
 * @returns An object with the typed store, useStore, useSelector, and useSetter hooks
 * 
 * @example
 * ```tsx
 * // Create store with initial state
 * const { store, useStore, useSelector, useSetter } = createSignalStore({
 *   user: { name: 'John', age: 30 },
 *   theme: 'light',
 *   notifications: [] as string[]
 * })
 * 
 * // String key pattern - full autocompletion!
 * const [user, setUser] = useStore('user')
 * user.name  // ✓ autocomplete works
 * user.age   // ✓ autocomplete works
 * 
 * // Function selector pattern
 * const theme = useStore(s => s.theme)  // theme: string
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
 * 
 * setUser(draft => {
 *   draft.name = 'Jane'  // ✓ autocomplete works
 * })
 * ```
 */
export function createSignalStore<T extends Record<string, any>>(
  initialStates: T
): TypedSignalStore<T>

/**
 * Create a signal store with derived signals.
 *
 * This is a pre-configured instance of storeFactory with isSignal=true.
 * Creates a local store where each key in the initial states object becomes a derived signal,
 * which can compute values based on other signals.
 *
 * Note: Derived signal stores only expose `store` and `useSelector`. They do not include
 * `useStore` or `useSetter` because derived signals are read-only and computed from other signals.
 *
 * Important: All values in the initialStates object must be Computed functions. Regular values
 * will throw an error. Use `computed()` from react-set-signal to create computed values.
 *
 * @template T - The shape of the initial state object
 * @param initialStates - Object containing Computed functions for each store entry
 * @returns A typed signal store with store and useSelector only
 *
 * @throws Error when any value in initialStates is not a Computed function
 *
 * @example
 * ```tsx
 * import { computed } from 'react-set-signal'
 *
 * const { store, useSelector } = createDerivedSignalStore({
 *   count: computed(() => 0),
 *   doubleCount: computed((get) => get(store.count) * 2)
 * })
 *
 * // Select values from the derived store
 * const { count, doubleCount } = useSelector(s => ({
 *   count: s.count,
 *   doubleCount: s.doubleCount
 * }))
 * ```
 */
export function createDerivedSignalStore<T extends Record<string, Computed<any>>>(
  initialStates: T
): TypedDerivedSignalStore<{ [K in keyof T]: T[K] extends Computed<infer V> ? V : never }>

/**
 * Factory function for creating typed signal stores with associated React hooks.
 *
 * This is a curried function that first takes a boolean flag indicating whether the store
 * should use derived signals, then returns a function that accepts the initial states object.
 *
 * @template T - The shape of the initial state object, mapping keys to their value types
 * @param isSignal - When true, creates derived signals; when false, creates regular signals
 * @returns A function that accepts initial states and returns a typed signal store with hooks
 *
 * @example
 * ```tsx
 * // Create a factory for regular signals
 * const createSignalStore = storeFactory(false)
 *
 * // Create a store with typed initial states
 * const { store, useStore, useSelector, useSetter } = createSignalStore({
 *   user: { name: 'John', age: 30 },
 *   theme: 'light'
 * })
 * ```
 */
/**
 * Factory function overload for creating regular signal stores (isSignal=false)
 */
export function storeFactory<T extends Record<string, any>>(
  isSignal: false
): (initialStates: T) => TypedSignalStore<T>

/**
 * Factory function overload for creating derived signal stores (isSignal=true)
 * Note: Values must be Computed functions
 */
export function storeFactory<T extends Record<string, Computed<any>>>(
  isSignal: true
): (initialStates: T) => TypedDerivedSignalStore<{ [K in keyof T]: T[K] extends Computed<infer V> ? V : never }>

/**
 * Factory function general signature for boolean isSignal
 */
export function storeFactory<T extends Record<string, any>>(
  isSignal: boolean
): (initialStates: T) => TypedSignalStore<T> | TypedDerivedSignalStore<T>

/**
 * Legacy global store type (for backward compatibility)
 */
export interface GlobalStoreType {
  [key: string]: ReactSetSignal<any> & { id?: string }
}

/**
 * A React hook for managing global state using Preact Signals.
 * 
 * NOTE: For full type inference, use the `useStore` hook returned from `createSignalStore` instead.
 * 
 * @template T - The type of the state value
 * @param id - String ID for the named store entry
 * @param initialState - The initial state value (used if store entry doesn't exist)
 * @returns A tuple with [state, setter]
 * 
 * @example
 * ```tsx
 * // Generic usage (no type inference from store)
 * const [count, setCount] = useSignalStore('count', 0)
 * ```
 */
export function useSignalStore<T>(
  id: string,
  initialState: T
): [T, SignalSetter<T>]

/**
 * Function pattern for accessing store signals directly
 * 
 * @template T - The type of the state value
 * @param fn - Function that receives the global store and returns a signal
 * @returns The current value of the selected signal
 */
export function useSignalStore<R>(
  fn: (store: GlobalStoreType) => R
): UnwrapSignals<R>

/**
 * Combined overload signature
 */
export function useSignalStore<T, R = any>(
  idOrFunction: string | ((store: GlobalStoreType) => R),
  initialState?: T
): [T, SignalSetter<T>] | UnwrapSignals<R>

export default useSignalStore