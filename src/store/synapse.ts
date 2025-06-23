import { atom } from 'jotai';
import type { Synapse } from '@filoz/synapse-sdk';

// By deriving the types from the SDK's methods, we avoid making assumptions
// about the library's export structure and create a more robust solution.
type SynapseInstance = Awaited<ReturnType<typeof Synapse.create>>;
type StorageServiceInstance = Awaited<
  ReturnType<SynapseInstance['createStorage']>
>;

/**
 * Jotai atom to hold the global Synapse instance.
 * It is initialized to null and will be populated by the `useSynapse` hook.
 */
export const synapseAtom = atom<SynapseInstance | null>(null);

/**
 * Jotai atom to hold the global StorageService instance.
 * It is initialized to null and will be populated by the `useSynapse` hook
 * after the Synapse instance is created.
 */
export const storageServiceAtom = atom<StorageServiceInstance | null>(null);

/**
 * Jotai atom to hold the provider ID for the storage service.
 * It can be a string, or null if no existing proofset is found.
 */
export const providerIdAtom = atom<number | null>(null);
