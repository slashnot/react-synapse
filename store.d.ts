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
  GlobalStoreType,
  UseStoreOptions
} from "./hooks/useSignalStore";

