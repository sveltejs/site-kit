import { browser } from '$app/environment';
import { persisted } from 'svelte-local-storage-store';

/**
 * @typedef {{ preference: 'light' | 'dark' | 'system', current: 'light' | 'dark' }} Theme
 */

/** @type {import('svelte/store').Writable<Theme>} */
export const theme = persisted('svelte:theme', {
	preference: 'system',
	current: browser
		? window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light'
		: 'light'
});

theme.subscribe(($theme) => {
	if (!browser) return;

	document.body.classList.remove('light', 'dark');
	document.body.classList.add($theme.current);
});
