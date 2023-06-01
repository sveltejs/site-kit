import { persisted } from 'svelte-local-storage-store';
import { writable } from 'svelte/store';

export const searching = writable(false);
export const query = writable('');
export const recent = persisted('svelte:recent-searches', []);
