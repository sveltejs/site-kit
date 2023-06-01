import { browser } from '$app/environment';
import { readable } from 'svelte/store';

/**
 * @param {string} query
 */
export const mql = (query) =>
	readable(browser ? window.matchMedia(query).matches : false, (set) => {
		if (!browser) return set(false);

		const mediaQueryList = window.matchMedia(query);

		/** @param {MediaQueryListEvent} event  */
		const listener = (event) => set(event.matches);

		mediaQueryList.addEventListener('change', listener);

		return () => mediaQueryList.removeEventListener('change', listener);
	});
