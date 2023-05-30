<!-- @component
The main shell of the application. It provides a slot for the top navigation, the main content, and the bottom banner.
-->

<script>
	import { navigating } from '$app/stores';
	import '../styles/index.css';
	import Icons from './Icons.svelte';
	import PreloadingIndicator from './PreloadingIndicator.svelte';
	import SkipLink from './SkipLink.svelte';

	/**
	 * Height of the bottom banner. If '0px', the banner is not visible.
	 */
	export let banner_bottom_height = '0px';
	/**
	 * Whether the navigation is visible.
	 */
	export let nav_visible = true;
</script>

<Icons />

{#if $navigating}
	<PreloadingIndicator />
{/if}

{#if nav_visible}
	<SkipLink href="#main" />

	<slot name="top-nav" />
{/if}

<main id="main" style:--sk-banner-bottom-height={banner_bottom_height}>
	<slot />
</main>

{#if banner_bottom_height !== '0px'}
	<div style:--sk-banner-bottom-height={banner_bottom_height}>
		<slot name="banner-bottom" {banner_bottom_height} />
	</div>
{/if}

<style>
	main {
		position: relative;
		margin: 0 auto;
		padding-top: var(--sk-nav-height);
		padding-bottom: var(--sk-banner-bottom-height);
		overflow: hidden;
	}

	:global(body) {
		font-size: 1.6rem !important;
	}
</style>
