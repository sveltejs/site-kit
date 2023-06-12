import { BROWSER } from 'esm-env';
import { persisted } from 'svelte-local-storage-store';

/**
 * @typedef {{ preference: 'system' | 'user', current: boolean }} ReducedMotion
 */

/** @type {import('svelte/store').Writable<ReducedMotion>} */
export const reduced_motion = persisted('svelte:reduced-motion', {
	preference: 'system',
	current: BROWSER ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
});
