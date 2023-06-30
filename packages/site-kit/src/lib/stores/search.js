import { persisted } from 'svelte-local-storage-store';
import { writable } from 'svelte/store';

export const searching = writable(false);
export const search_query = writable('');

/** @type {import('svelte/store').Writable<string[]>} */
export const search_recent = persisted('svelte:recent-searches', []);
