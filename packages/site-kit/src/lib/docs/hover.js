import { onMount } from 'svelte';
import Tooltip from './Tooltip.svelte';

export function setupDocsHovers() {
	onMount(() => {
		/** @type {Tooltip | null} */
		let tooltip;

		/** @type {NodeJS.Timeout} */
		let timeout;

		/** @param {MouseEvent} event */
		function over(event) {
			const target = /** @type {HTMLElement} */ (event.target);

			if (target.tagName === 'DATA-LSP') {
				clearTimeout(timeout);

				if (!tooltip) {
					tooltip = new Tooltip({
						target: document.body
					});

					tooltip.$on('mouseenter', () => {
						clearTimeout(timeout);
					});

					tooltip.$on('mouseleave', () => {
						clearTimeout(timeout);
						tooltip?.$destroy();
						tooltip = null;
					});
				}

				const rect = target?.getBoundingClientRect();
				const html = target?.getAttribute('lsp');

				const x = (rect.left + rect.right) / 2 + window.scrollX;
				const y = rect.top + window.scrollY;

				if (html) {
					tooltip.$set({
						html,
						x,
						y
					});
				}
			}
		}

		/** @param {MouseEvent} event */
		function out(event) {
			const target = /** @type {HTMLElement} */ (event.target);
			if (target.tagName === 'DATA-LSP') {
				timeout = setTimeout(() => {
					tooltip?.$destroy();
					tooltip = null;
				}, 200);
			}
		}

		window.addEventListener('mouseover', over);
		window.addEventListener('mouseout', out);

		return () => {
			window.removeEventListener('mouseover', over);
			window.removeEventListener('mouseout', out);
		};
	});
}
