import { ReactSetSignal } from '../utils/createSignal'

/**
 * Individual store state entry with optional ID
 */
export interface StoreState<T = any> extends ReactSetSignal<T> {
  id?: string
}

/**
 * Generic store type mapping string keys to store states
 */
export interface GenericStoreType {
  [key: string]: StoreState<any>
}

/**
 * Global store class for managing application-wide state
 * Uses Preact Signals internally for reactive state management
 */
export interface GlobalStore {
  /**
   * Get the raw store object containing all signals
   */
  getStore(): GenericStoreType

  /**
   * Get all current values from the store as a plain object
   */
  getStoreValues<T extends Record<string, any> = Record<string, any>>(): T

  /**
   * Get a specific store state by ID
   * @param id - The identifier for the store state
   * @returns The store state signal or undefined if not found
   */
  getStoreState<T = any>(id: string): StoreState<T> | undefined

  /**
   * Set or update a store state by key
   * @param key - The identifier for the store state
   * @param value - The initial or new value for the store
   * @returns The created or updated store state signal
   */
  setStoreState<T>(key: string, value: T): StoreState<T>

  /**
   * Check if a store state exists for the given key
   * @param key - The identifier to check
   * @returns True if the store state exists
   */
  hasState(key: string): boolean

  /**
   * Clear all store states
   * @returns An empty store object
   */
  clearStore(): GenericStoreType
}

/**
 * Singleton instance of the global store
 */
export const globalStore: GlobalStore

/**
 * @deprecated Use GenericStoreType instead
 */
export type GlobalStoreType = GenericStoreType