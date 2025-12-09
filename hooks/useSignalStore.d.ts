import { ReactSetSignal } from 'react-set-signal'

/**
 * Type-safe global store mapping keys to their signal types
 */
export type TypedGlobalStore<T extends Record<string, any>> = {
  [K in keyof T]: ReactSetSignal<T[K]> & { id?: string }
}

/**
 * Setter function type for signal store values
 */
export type SignalSetter<T> = (fnOrValue: T | ((draft: T) => T | void)) => T

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
 * Typed hook for accessing store values with full type inference
 * Supports both string key pattern and function selector pattern.
 */
export interface TypedUseStore<T extends Record<string, any>> {
  /**
   * Access a store value by key with full type inference
   * @param key - The key of the store entry
   * @returns A tuple with [value, setter] where value is typed based on the store
   * 
   * @example
   * ```tsx
   * const [user, setUser] = useStore('user')
   * // user is typed, setUser accepts typed value or draft function
   * ```
   */
  <K extends keyof T & string>(key: K): [T[K], SignalSetter<T[K]>]
  
  /**
   * Access a store value using a selector function
   * @param selector - Function that receives the typed store and returns a signal
   * @returns The current value of the selected signal
   * 
   * @example
   * ```tsx
   * const theme = useStore(s => s.theme)
   * // theme is typed based on the store definition
   * ```
   */
  <R>(selector: StoreSelector<T, R>): UnwrapSignals<R>
}

/**
 * Return type of createSignalStore with typed useStore hook
 */
export interface TypedSignalStore<T extends Record<string, any>> {
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
}

/**
 * Create multiple signal stores from an initial states object.
 * Returns a typed store and a typed useStore hook for full type inference.
 * 
 * @template T - The shape of the initial state object
 * @param initialStates - Object containing initial values for each store
 * @returns An object with the typed store and useStore hook
 * 
 * @example
 * ```tsx
 * // Create store with initial state
 * const { store, useStore } = createSignalStore({
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
 * setUser(draft => {
 *   draft.name = 'Jane'  // ✓ autocomplete works
 * })
 * ```
 */
export function createSignalStore<T extends Record<string, any>>(
  initialStates: T
): TypedSignalStore<T>

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