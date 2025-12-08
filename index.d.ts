// Main exports
export { useReactive } from './hooks/useReactive'
export { useReactiveSignal } from './hooks/useReactiveSignal'
export { useSignalStore, createSignalStore } from './hooks/useSignalStore'
export { createSignal, setSignal, getSignalValue } from './utils/createSignal'

// Re-export from @preact/signals-core
export { signal, effect, computed, batch, untracked } from '@preact/signals-core'
export type { Signal, ReadonlySignal, Computed, Effect, EffectOptions, SignalOptions } from '@preact/signals-core'

// Enhanced signal type
export type { ReactSetSignal } from './utils/createSignal'

// Store types for full type inference
export type {
  TypedGlobalStore,
  TypedSignalStore,
  TypedUseStore,
  SignalSetter,
  StoreSelector
} from './hooks/useSignalStore'

// Re-export from mutative
export * from 'mutative'
export type { Draft, DraftedObject, Immutable, Options, Patch, Patches, PatchesOptions } from "mutative";
