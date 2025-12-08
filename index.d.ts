// Main exports
export { useSignalStore, createSignalStore } from './hooks/useSignalStore'

// Store types for full type inference
export type {
  TypedGlobalStore,
  TypedSignalStore,
  TypedUseStore,
  SignalSetter,
  StoreSelector
} from './hooks/useSignalStore'

// Re-export from react-synapse
export type { Draft, DraftedObject, Immutable, Options, Patch, Patches, PatchesOptions } from "react-synapse";
export type { Signal, ReadonlySignal, Computed, Effect, EffectOptions, SignalOptions, ReactSetSignal } from 'react-synapse'
