// Main exports
export { useSignalStore, createSignalStore } from './hooks/useSignalStore'

// Global Store
export { globalStore } from "./hooks/globalStore";

// Store types for full type inference
export type {
  TypedGlobalStore,
  TypedSignalStore,
  TypedUseStore,
  SignalSetter,
  StoreSelector
} from './hooks/useSignalStore'

// Re-export from react-set-signal
export { useReactive, useReactiveSignal, createSignal } from "react-set-signal";
export { Computed, Effect, Signal, batch, computed, effect, signal, untracked } from "react-set-signal";
export type { Draft, DraftedObject, Immutable, Options, Patch, Patches, PatchesOptions } from "react-set-signal";
export type { Signal, ReadonlySignal, Computed, Effect, EffectOptions, SignalOptions, ReactSetSignal } from 'react-set-signal'