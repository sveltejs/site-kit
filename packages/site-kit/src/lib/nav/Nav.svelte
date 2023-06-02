<!-- @component
Top navigation bar for the application. It provides a slot for the left side, the right side, and the center.
-->

<script>
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { click_outside, focus_outside } from '$lib/actions';
	import { mql, nav_overlay_open, reduced_motion, theme } from '$lib/stores';
	import { expoOut } from 'svelte/easing';
	import Icon from '../components/Icon.svelte';
	import ThemeToggle from '../components/ThemeToggle.svelte';
	import Separator from './Separator.svelte';

	export let home_title = 'Homepage';

	const is_mobile = mql('(max-width: 800px)');

	let open = false;
	let visible = $page.data.nav_initially_visible ?? true;

	/** @type {HTMLElement} */
	let nav;

	// hide nav whenever we navigate
	page.subscribe(() => {
		open = false;
	});

	/**
	 * @param {HTMLElement} _
	 * @returns {import('svelte/transition').TransitionConfig}
	 */
	const slide_up = (_) => {
		return {
			css: (t, u) =>
				$reduced_motion
					? `opacity: ${t}`
					: `transform: translate3d(0, ${u * 120}%, 0) scale3d(${0.9 + 0.1 * t}, ${
							0.9 + 0.1 * t
					  }, 1)`,
			easing: expoOut,
			duration: 500
		};
	};

	/**
	 * @param {HTMLElement} node
	 * @returns {import('svelte/transition').TransitionConfig}
	 */
	const fade_out = (node) => {
		node.style.overflow = 'hidden';

		return {
			css: (t, u) =>
				`opacity: ${t}; 
				 ${
						!$reduced_motion
							? `transform: translate3d(0, 0, 0) scale3d(${1 - 0.1 * u}, ${1 - 0.1 * u}, 1})`
							: ''
					}`,
			easing: expoOut,
			duration: 500
		};
	};

	// Prevents navbar to show/hide when clicking in docs sidebar
	let hash_changed = false;
	function handle_hashchange() {
		hash_changed = true;
	}

	let last_scroll = 0;
	function handle_scroll() {
		const scroll = window.pageYOffset;
		if (!hash_changed) {
			visible = scroll < 50 || scroll < last_scroll;
		}

		last_scroll = scroll;
		hash_changed = false;
	}

	function handle_focus() {
		if (open && !nav.contains(document.activeElement)) {
			open = false;
		}
	}

	function close_nav() {
		open = false;
	}
</script>

<svelte:window
	on:hashchange={handle_hashchange}
	on:scroll={handle_scroll}
	on:focusin={handle_focus}
/>

<nav
	bind:this={nav}
	class:visible={visible || open}
	class:open
	class:dark={$theme.current === 'dark'}
	aria-label="Primary"
	use:click_outside={close_nav}
	use:focus_outside={close_nav}
>
	{#if $page.data.secondary_nav}
		<svelte:component
			this={$page.data.secondary_nav.component}
			{...$page.data.secondary_nav.props}
		/>
	{/if}

	<div class="nav-spot home">
		<a href="/" title={home_title}>
			<slot name="home" />

			{#if $page.data.nav_title}
				<div class="nav-title">
					{$page.data.nav_title}
				</div>
			{/if}
		</a>
	</div>

	<button
		aria-label="Toggle menu"
		aria-expanded={open}
		class="menu-toggle"
		class:open
		on:click={() => (open = !open)}
	>
		<Icon name={open ? 'close' : 'menu'} size="1em" />
	</button>

	<ul class="menu-section">
		<slot name="nav-center" />
	</ul>

	{#if browser && (!$is_mobile || open)}
		<div class="external menu-section" in:slide_up out:fade_out>
			<ul>
				<slot name="nav-right" />
				<Separator />
			</ul>
			<div class="appearance">
				<span class="caption">Theme</span>
				<ThemeToggle />
			</div>
		</div>
	{/if}
</nav>

<div class="overlay" class:visible={$nav_overlay_open || open} />

<style>
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 99;

		opacity: 0;
		pointer-events: none;

		width: 100%;
		height: 100%;

		background: hsla(0, 0%, 0%, 0.5);
		backdrop-filter: blur(5px);

		transition: opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1);
	}

	.overlay.visible {
		opacity: 1;
		pointer-events: auto;
	}

	nav {
		position: fixed;
		top: 0;
		z-index: 100;

		width: 100vw;
		height: var(--sk-nav-height);
		margin: 0 auto;

		background-color: var(--sk-back-2);

		font-family: var(--sk-font);

		user-select: none;
		transition: transform 0.2s;

		box-shadow: 0 -0.1px 6px 0.9px hsla(0, 0%, 0%, 0.1);

		isolation: isolate;
	}

	@media (max-width: 800px) {
		nav:not(.visible) {
			transform: translate(
				0,
				calc(var(--sk-nav-height) + 2px)
			); /* TODO revert 5rem to 1rem after we remove the banner */
		}
	}

	.menu-section {
		position: relative;
		width: 100%;
	}

	ul {
		padding: 0;
		margin: 0;
		list-style: none;
	}

	ul :global(a) {
		color: var(--sk-text-2);
		line-height: 1;
	}

	.nav-spot {
		position: relative;
	}

	.home {
		height: var(--sk-nav-height);
		display: flex;
		background-image: url(../branding/svelte-logo.svg);
		background-position: calc(var(--sk-page-padding-side) - 1rem) 50%;
		background-repeat: no-repeat;
		background-size: auto 70%;
		align-items: center;
		padding-left: calc(var(--sk-page-padding-side) + 4rem);
	}

	.home a {
		display: flex;
		align-items: center;
		text-decoration: none;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-size: 1.8rem;
		color: var(--sk-text-4);
	}

	.home :global(strong) {
		color: var(--sk-text-1);
		font-weight: inherit;
	}

	.home .nav-title {
		display: flex;
		align-items: center;

		margin-left: 1rem;
		padding: 0.5rem 0 0.5rem 1rem;
		font-size: 0.7em;
		color: var(--sk-text-3);
		line-height: 1;
		height: 40%;

		border-left: solid 1px var(--sk-text-4);
	}

	button {
		position: absolute;
		bottom: calc(var(--sk-nav-height) / 2 - 1rem);
		right: var(--sk-page-padding-side);
		line-height: 1;
	}

	.appearance {
		display: flex;
		height: 100%;
		align-items: center;
		margin-left: 0.75rem;
	}

	.appearance .caption {
		display: none;
		font-size: var(--sk-text-xs);
		line-height: 1;
		margin-right: 0.5rem;
	}

	@media (max-width: 799px) {
		.nav-spot,
		nav > button {
			z-index: 7;
		}

		nav {
			top: unset;
			bottom: 0;
		}

		nav::after {
			content: '';

			position: absolute;
			left: 0;
			bottom: 0;

			width: 100%;
			height: 100%;

			border-radius: inherit;
			box-shadow: inherit;

			background-color: inherit;

			z-index: 6;
		}

		.home {
			position: absolute;
			bottom: 0;

			display: flex;
			align-items: center;

			height: var(--sk-nav-height);
			padding-left: calc(var(--sk-page-padding-side) + 4rem);
		}

		.menu-section {
			position: relative;
			display: none;
			width: 100%;
			background: var(--sk-back-1);
			padding: 1rem var(--sk-page-padding-side);
		}

		.open .menu-section {
			display: block;
		}

		.external {
			display: block;

			position: fixed;
			left: 0px;
			bottom: var(--sk-nav-height);
			z-index: 1;

			width: calc(100%);
			max-height: 70vh;
			padding: 1rem 1rem 1rem;

			border-radius: 1rem 1rem 0 0;
			/* box-shadow: 3px -1px 8.6px -9px rgba(0, 0, 0, 0.11), -3px -1px 20px 1px rgba(0, 0, 0, 0.22); */

			background-color: var(--sk-back-2);

			overflow-y: auto;
			overflow-x: hidden;
		}

		nav.dark .external {
			border-top: solid 1.1px hsla(0, 0%, 100%, 0.2);
		}

		.external::before {
			content: '';
			position: absolute;
			top: 0;
			left: var(--sk-page-padding-side);
			width: calc(100% - 2 * var(--sk-page-padding-side));
			height: 1px;
			background: radial-gradient(circle at center, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05));
		}

		.external::after {
			content: '';
			position: absolute;
			width: 100%;
			height: var(--shadow-height);
			left: 0;
			bottom: calc(-1 * var(--shadow-height));
			background: var(--shadow-gradient);
		}

		.external :global(li) {
			padding: 0.3rem 0;
		}

		.external :global(li a) {
			display: block;

			border-radius: var(--sk-border-radius);

			width: 100%;
			padding: 0.8rem;
		}

		.external :global(li a[aria-current]) {
			background-color: hsla(var(--sk-theme-1-hsl), 0.05);
		}

		.external :global(li a:hover) {
			border-radius: var(--sk-border-radius);

			color: initial;
			text-decoration: none;

			background-color: var(--sk-back-4);
		}

		.external :global(li a[aria-current]:hover) {
			background-color: hsla(var(--sk-theme-1-hsl), 0.05);
			color: var(--sk-theme-1);
		}

		.appearance {
			justify-content: space-between;
			align-items: center;
			margin: 10px 0 0;
			padding: 1rem 1.25rem;
			background: var(--sk-back-3);
			border-radius: 3.5rem;
		}

		.appearance .caption {
			display: block;
		}
	}

	@media (min-width: 800px) {
		.overlay {
			display: none;
		}

		nav {
			display: grid;
			grid-template-columns: 1fr auto 1fr;
			/* align-items: center; */
			/* justify-content: space-between; */
		}

		ul,
		.menu-section {
			display: flex;
			width: auto;
			height: 100%;
		}

		ul :global(li) {
			margin: 0 0.5rem;
			padding: 0;
		}

		ul :global(a) {
			display: flex;
			align-items: center;
			height: 100%;
		}

		.external {
			padding: 0 var(--sk-page-padding-side) 0 0;
			justify-content: end;
		}

		button {
			display: none;
		}
	}
</style>
