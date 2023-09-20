<!-- @component
The main shell of the application. It provides a slot for the top navigation, the main content, and the bottom banner.
-->

<script>
	import { afterNavigate } from '$app/navigation';
	import { navigating } from '$app/stores';
	import { overlay_open } from '$lib/stores';
	import PreloadingIndicator from '../nav/PreloadingIndicator.svelte';
	import SkipLink from '../nav/SkipLink.svelte';
	import '../styles/index.css';
	import Icons from './Icons.svelte';

	/**
	 * Height of the bottom banner. If '0px', the banner is not visible.
	 */
	export let banner_bottom_height = '0px';
	/**
	 * Whether the navigation is visible.
	 */
	export let nav_visible = true;

	/** @type {HTMLElement} */
	let main_el;
	let scroll_restored = false;

	afterNavigate(() => {
		if (!scroll_restored) {
			main_el.scrollTop = 0;
		}
		scroll_restored = false;
	});

	/** @type {import('@sveltejs/kit').Snapshot<number>} */
	export const snapshot = {
		capture() {
			return main_el.scrollTop;
		},
		restore(scroll_top) {
			main_el.scrollTop = scroll_top;

			// Restore is not called for the first navigation to a page,
			// use this flag to track whether to reset the scroll to top or not in afterNavigate
			scroll_restored = true;
		}
	};
</script>

<Icons />

{#if $navigating}
	<PreloadingIndicator />
{/if}

{#if nav_visible}
	<SkipLink href="#main" />

	<slot name="top-nav" />
{/if}

<div class="modal-overlay" class:visible={$overlay_open} aria-hidden="true" />

<main id="main" bind:this={main_el} style:--sk-banner-bottom-height={banner_bottom_height}>
	<slot />
</main>

{#if banner_bottom_height !== '0px'}
	<div class="banner-bottom" style:--sk-banner-bottom-height={banner_bottom_height}>
		<slot name="banner-bottom" {banner_bottom_height} />
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 99;

		opacity: 0;
		pointer-events: none;

		width: 100%;
		height: 100%;
		height: 100dvh;

		background: var(--sk-back-1);
		transition: opacity 0.4s cubic-bezier(0.23, 1, 0.32, 1);
	}

	.modal-overlay.visible {
		opacity: 0.7;
		pointer-events: auto;
	}

	main {
		position: relative;
		margin: 0 auto;
		padding-top: var(--sk-nav-height);
		padding-bottom: var(--sk-banner-bottom-height);
		overflow: hidden;
		overflow-y: auto;
		height: 100%;
	}

	@media (max-width: 800px) {
		main {
			padding-top: var(--sk-banner-bottom-height);
			padding-bottom: 0;
		}
	}

	.banner-bottom {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
	}

	@media (max-width: 800px) {
		.banner-bottom {
			bottom: initial;
			top: 0;
		}
	}

	:global(body) {
		font-size: 1.6rem !important;
	}
</style>
