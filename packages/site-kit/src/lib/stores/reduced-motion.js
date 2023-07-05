import { mql } from './mql';

/** @type {import('svelte/store').Readable<boolean>} */
export const reduced_motion = mql('(prefers-reduced-motion: reduce)');
