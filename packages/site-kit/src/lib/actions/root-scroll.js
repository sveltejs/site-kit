import { browser } from '$app/environment';

/**
 * @type {import("svelte/action").Action<HTMLElement, (e: Event) => void>}
 */
export function root_scroll(_, callback = () => {}) {
	const root_el = /** @type {HTMLElement} */ (document.querySelector('main#main'));

	root_el?.addEventListener('scroll', callback);

	return {
		destroy() {
			root_el?.removeEventListener('scroll', callback);
		}
	};
}

export const root_scroll_element = browser ? document.querySelector('main#main') : null;
