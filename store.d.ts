// Store-specific exports
export { useSignalStore } from "./hooks/useSignalStore";
export { globalStore } from "./hooks/globalStore";

// Store-specific types
export type { GlobalStore, GenericStoreType, StoreState } from "./hooks/globalStore";
export type {
  TypedGlobalStore,
  TypedSignalStore,
  TypedUseStore,
  SignalSetter,
  StoreSelector,
  GlobalStoreType,
  UseStoreOptions
} from "./hooks/useSignalStore";

/**
 * Factory function type for creating typed signal stores with associated React hooks.
 *
 * This is a curried function that first takes a boolean flag indicating whether the store
 * should use derived signals, then returns a function that accepts the initial states object.
 *
 * @template T - The shape of the initial state object, mapping keys to their value types
 * @param isSignal - When true, creates derived signals; when false, creates regular signals
 * @returns A function that accepts initial states and returns a typed signal store with hooks
 *
 * @example
 * // Create a factory for regular signals
 * const createSignalStore = storeFactory(false)
 *
 * // Create a store with typed initial states
 * const { store, useStore, useSelector, useSetter } = createSignalStore({
 *   user: { name: 'John', age: 30 },
 *   theme: 'light'
 * })
 */
export declare function storeFactory<T extends Record<string, any>>(
  isSignal: false
): (initialStates: T) => import("./hooks/useSignalStore").TypedSignalStore<T>;

export declare function storeFactory<T extends Record<string, import("react-set-signal").ReadonlySignal<any>>>(
  isSignal: true
): (initialStates: T) => import("./hooks/useSignalStore").TypedDerivedSignalStore<{ [K in keyof T]: T[K] extends import("react-set-signal").ReadonlySignal<infer V> ? V : T[K] }>;

export declare function storeFactory<T extends Record<string, any>>(
  isSignal: boolean
): (initialStates: T) => import("./hooks/useSignalStore").TypedSignalStore<T> | import("./hooks/useSignalStore").TypedDerivedSignalStore<T>;

/**
 * Create a signal store with regular (non-derived) signals.
 *
 * This is a pre-configured instance of storeFactory with isSignal=false.
 * Creates a local store where each key in the initial states object becomes a regular signal.
 *
 * @template T - The shape of the initial state object
 * @param initialStates - Object containing initial values for each store entry
 * @returns A typed signal store with store, useStore, useSelector, and useSetter
 *
 * @example
 * const { store, useStore, useSelector, useSetter } = createSignalStore({
 *   user: { name: 'John', age: 30 },
 *   theme: 'light'
 * })
 */
export declare function createSignalStore<T extends Record<string, any>>(
  initialStates: T
): import("./hooks/useSignalStore").TypedSignalStore<T>;

/**
 * Create a signal store with derived signals.
 *
 * This is a pre-configured instance of storeFactory with isSignal=true.
 * Creates a local store where each key in the initial states object becomes a derived signal,
 * which can compute values based on other signals.
 *
 * @template T - The shape of the initial state object
 * @param initialStates - Object containing initial values for each store entry
 * @returns A typed signal store with store, useStore, useSelector, and useSetter
 *
 * @example
 * const { store, useSelector } = createDerivedSignalStore({
 *   count: computed(() => 0),
 *   doubleCount: computed(() => store.count.value * 2)
 * })
 */
export declare function createDerivedSignalStore<T extends Record<string, import("react-set-signal").ReadonlySignal<any>>>(
  initialStates: T
): import("./hooks/useSignalStore").TypedDerivedSignalStore<{ [K in keyof T]: T[K] extends import("react-set-signal").ReadonlySignal<infer V> ? V : T[K] }>;

