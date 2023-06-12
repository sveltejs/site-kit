/**
 * @typedef {{
 *   current_menu_view: import("svelte/store").Writable<string | null>
 *   page_selected: import("svelte/store").Writable<string | null>
 * }} NavContext
 */

import { getContext, setContext } from 'svelte';

const symbol = Symbol('NavContext');

/**
 * @param {NavContext} value
 */
export function set_nav_context(value) {
	setContext(symbol, value);
}

/**
 * @returns {NavContext}
 */
export function get_nav_context() {
	return getContext(symbol);
}
