// Store-specific exports
export { useSignalStore, createSignalStore } from "./hooks/useSignalStore";
export { globalStore, GlobalStore } from "./hooks/globalStore";

// Store-specific types
export type { GlobalStore, GenericStoreType, StoreState } from "./hooks/globalStore";
export type {
  TypedGlobalStore,
  TypedSignalStore,
  TypedUseStore,
  SignalSetter,
  StoreSelector,
  GlobalStoreType
} from "./hooks/useSignalStore";

// Mutative types (for Immer-style draft mutations)
export type { Draft, DraftedObject, Immutable, Options, Patch, Patches, PatchesOptions } from "mutative";