import { persisted } from 'svelte-persisted-store';
import { writable } from 'svelte/store';

export const searching = writable(false);
export const search_query = writable('');
export const search_recent = persisted('svelte:recent-searches', []);
