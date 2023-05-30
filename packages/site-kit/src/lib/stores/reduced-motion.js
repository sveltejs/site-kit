import { readable } from 'svelte/store';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

const getInitialMotionPreference = () =>
	globalThis.matchMedia?.(reducedMotionQuery)?.matches ?? false;

export const reduced_motion = readable(getInitialMotionPreference(), (set) => {
	/** @param {MediaQueryListEvent} event */
	const updateMotionPreference = (event) => set(event.matches);

	const mediaQueryList = window.matchMedia(reducedMotionQuery);
	mediaQueryList.addEventListener('change', updateMotionPreference);

	return () => {
		mediaQueryList.removeEventListener('change', updateMotionPreference);
	};
});
