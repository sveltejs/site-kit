<script context="module">
	/**
	 * @typedef {'svelte.dev' | 'kit.svelte.dev' | 'learn.svelte.dev'} BannerScope
	 * @typedef {(import('svelte').ComponentProps<import('./Banner.svelte').default> & {
	 * content: string; scope?: BannerScope[]
	 * })[]} BannerData
	 */
</script>

<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { persisted } from 'svelte-local-storage-store';
	import Icon from './Icon.svelte';

	/** Whether to show an arrow at the end */
	export let arrow = false;

	/** Required for dismissing behavior e.g `<Banner id="svelte-5-runes" />` will make sure the banner
	 * hidden only for this ID. Later if another banner is added, that will be visible by default.
	 *
	 * @type {string}
	 */
	export let id;

	/**
	 * Link to the event. It must be an absolute path (https://svelte.dev/blog/runes instead of /blog/runes)
	 * @type {string}
	 */
	export let href;

	/**
	 * When to start showing the banner
	 * @type {Date}
	 */
	export let start;

	/**
	 * When to stop showing the banner. Banner never goes away if this value is not provided
	 * @type {Date}
	 */
	export let end = new Date(2123, 12, 1);

	const banner_preferences = persisted(
		'svelte:banner-preferences',
		/** @type {Record<string, boolean>} */ ({})
	);

	let height = 0;

	const time = new Date();

	$: show = $banner_preferences[id] && time > start && time < end;

	$: if (browser) {
		document.documentElement.style.setProperty(
			'--sk-banner-bottom-height',
			(show ? height : 0) + 'px'
		);
	}

	onMount(() => {
		$banner_preferences[id] ??= true;
	});
</script>

<div class="banner-bottom" bind:clientHeight={height} class:show>
	<div class="main-area">
		<a {href}>
			<slot />
		</a>

		{#if arrow}
			<Icon name="arrow-right" size="1.2em" />
		{/if}
	</div>

	<button class="close-button" on:click={() => ($banner_preferences[id] = false)}>
		<Icon name="close" />
	</button>
</div>

<style>
	.banner-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 80;

		display: flex;
		justify-content: center;
		align-items: center;

		overflow-y: auto;

		width: 100%;
		height: max-content;

		transition: opacity 0.2s 0.2s var(--quint-out);
		opacity: 0;
		pointer-events: none;
	}

	.show {
		pointer-events: all;
		opacity: 1;
	}

	.banner-bottom {
		text-align: center;
		background: var(--sk-theme-1-variant);
		color: white;
		padding: 8px;
	}

	.banner-bottom :global(a) {
		color: hsl(0, 0%, 99%);
	}

	button {
		position: absolute;
		top: 0;
		right: 1rem;

		display: flex;
		align-items: center;

		height: 100%;
	}

	.main-area {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.main-area :global(svg) {
		transition: transform 0.2s var(--quint-out);
	}

	.main-area:hover :global(svg) {
		transform: translateX(40%);
	}

	div :global(a[href]) {
		text-decoration: none;
	}

	@media screen and (max-width: 800px) {
		.banner-bottom {
			bottom: initial;
			top: 0;
		}

		.main-area :global(svg) {
			display: none;
		}
	}
</style>
