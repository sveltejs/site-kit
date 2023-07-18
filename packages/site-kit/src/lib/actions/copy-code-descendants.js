import DocsCopyCodeButton from '../docs/DocsCopyCodeButton.svelte';
import { page } from '$app/stores';

const map = new WeakMap();

/** @type {import('svelte/action').Action} */
export const copy_code_descendants = (node) => {
	/** @type {NodeListOf<Element>} */
	let code_blocks;

	function update() {
		code_blocks = node.querySelectorAll('.shiki');

		// Add a button to each code block
		for (const block of code_blocks) {
			const parent_class = block.parentElement?.classList.toString() ?? '';

			// Exclude the ts-block properties and stuff
			if (/ts-block/.test(parent_class)) continue;

			const code = block.querySelector('code')?.innerText ?? '';
			if (!code) continue;

			// This is to make sure that snippets with title get the button on their heading area
			const target = /code-block/.test(parent_class) ? block.parentElement : block;
			if (!target) continue;

			map.set(
				block,
				new DocsCopyCodeButton({
					target: target,
					props: {
						code
					}
				})
			);
		}
	}

	function destroy() {
		for (const block of code_blocks) {
			map.get(block)?.$destroy();
			map.delete(block);
		}
	}

	// Page changed. Update again
	const unsubscribe = page.subscribe(update);

	return {
		update,
		destroy() {
			destroy();
			unsubscribe();
		}
	};
};
