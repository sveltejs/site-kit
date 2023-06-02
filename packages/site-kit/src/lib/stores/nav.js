import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const nav_overlay_open = writable(false);
export const should_nav_autohide = writable(false);

nav_overlay_open.subscribe((value) => {
	if (!browser) return;

	if (value) {
		// Disable root from scrolling
		document.documentElement.style.overflow = 'hidden';
	} else {
		// Enable root to scroll
		document.documentElement.style.overflow = '';
	}
});
