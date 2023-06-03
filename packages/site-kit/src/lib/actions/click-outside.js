/**
 * Dispatch event on click outside of node
 *
 * @param {HTMLElement} node
 * @param {() => void} callback
 */
export function click_outside(node, callback) {
	/** @param {MouseEvent} e */
	const handleClick = async (e) => {
		if (!node.contains(/** @type {HTMLElement} */ (e.target))) callback();
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}
