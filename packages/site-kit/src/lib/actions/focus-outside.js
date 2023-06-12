/**
 * Dispatch event on click outside of node
 *
 * @param {HTMLElement} node
 * @param {() => void } callback
 */
export function focus_outside(node, callback) {
	/** @param {FocusEvent} e */
	function handleFocus(e) {
		if (!node?.contains(/** @type {HTMLElement} */ (e.target))) callback();
	}

	document.addEventListener('focus', handleFocus, true);

	return {
		destroy() {
			document.removeEventListener('focus', handleFocus, true);
		}
	};
}
