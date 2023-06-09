<!-- @component
Top navigation bar for the application. It provides a slot for the left side, the right side, and the center.
-->

<script>
	import { page } from '$app/stores';
	import { Search } from '$lib/search';
	import { overlay_open, searching, theme, reduced_motion } from '$lib/stores';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Icon from '../components/Icon.svelte';
	import ThemeToggle from '../components/ThemeToggle.svelte';
	import Menu from './Menu.svelte';
	import Separator from './Separator.svelte';
	import { set_nav_context } from './nav.context';
	import NavContextMenu from './NavContextMenu.svelte';
	import { browser } from '$app/environment';
	import { expoOut } from 'svelte/easing';
	import MotionToggle from '$lib/components/MotionToggle.svelte';

	export let home_title = 'Homepage';

	/** @type {import('svelte/store').Writable<string | null>} */
	const current_menu_view = writable(null);

	/** @type {import('svelte/store').Writable<string | null>} */
	const page_selected = writable(null);

	set_nav_context({ current_menu_view, page_selected });

	let context_menu = 'docs';

	$: if ($current_menu_view ?? $page_selected) {
		context_menu = /** @type {string} */ ($current_menu_view ?? $page_selected);
	}

	$: context_menu_content =
		/** @type {import('svelte').ComponentProps<NavContextMenu>} */ $page.data.nav_context_list[
			context_menu
		];

	/** @type {NavContextMenu} */
	let nav_context_instance;

	let open = false;
	let visible = $page.data.nav_initially_visible ?? true;

	/** @type {HTMLElement} */
	let nav;

	$: {
		$page;

		// Change every time $page changes
		open = false;
	}

	let menu_height = 0;
	let universal_menu_inner_height = 0;
	let ready = false;

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

	$: {
		if (browser && $current_menu_view !== null) {
			nav_context_instance?.scrollToActive();
		}
	}

	page.subscribe(($page) => {
		if ($page.url.pathname === '/') {
			$current_menu_view = null;
			$page_selected = null;
		}
	});

	onMount(() => {
		$current_menu_view = $page_selected;
	});

	/**
	 * @param {HTMLElement} node
	 * @returns {import('svelte/transition').TransitionConfig}
	 */
	const slide_up = (node) => {
		const height = $current_menu_view ? node.clientHeight : universal_menu_inner_height;

		return {
			css: (t, u) =>
				$reduced_motion.current
					? `opacity: ${t}`
					: `transform: translate3d(0, ${height * u}px, 0) scale3d(${0.9 + 0.1 * t}, ${
							0.9 + 0.1 * t
					  }, 1)`,
			easing: expoOut,
			duration: 300
		};
	};

	/**
	 * @param {HTMLElement} _
	 * @param {(current: boolean) => void} fn
	 */
	function mounted(_, fn) {
		// this is necessary to ensure that the menu-background height
		// is applied without an animation
		setTimeout(() => {
			fn(true);
		});

		return {
			destroy() {
				fn(false);
			}
		};
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
	style:z-index={$overlay_open && $searching ? 80 : null}
	aria-label="Primary"
>
	<a href="/" title={home_title} class="nav-spot home">
		<span class="home-large">
			<slot name="home-large" />
		</span>

		<span class="home-small">
			<slot name="home-small" />
		</span>

		{#if $page.data.nav_title}
			<div class="nav-title">
				{$page.data.nav_title}
			</div>
		{/if}
	</a>

	<div class="buttons">
		<Menu let:toggle let:open on:close={() => ($current_menu_view = $page_selected)}>
			<button
				aria-label="Toggle menu"
				aria-expanded={open}
				class="menu-toggle"
				class:open
				on:click={toggle}
			>
				<Icon name={open ? 'close' : 'menu'} size="1em" />
			</button>

			<div
				slot="popup"
				class="mobile-main-menu"
				class:offset={$current_menu_view !== null}
				class:reduced-motion={$reduced_motion.current}
				transition:slide_up
			>
				<div
					class="menu-background"
					class:dark={$theme.current === 'dark'}
					class:ready
					style:height={$current_menu_view !== null ? '100%' : `${universal_menu_inner_height}px`}
					style:--background={$current_menu_view ? 'var(--sk-back-3)' : null}
					use:mounted={(mounted) => (ready = mounted)}
				/>

				<div
					class="viewport"
					bind:clientHeight={menu_height}
					style="--height-difference: {menu_height - universal_menu_inner_height + 'px'}"
				>
					<div class="universal">
						<ul bind:clientHeight={universal_menu_inner_height}>
							<slot name="nav-right" />
							<Separator />
							<div style="height: 1rem" />
							<Search />
							<li class="appearance">
								<div>
									<span class="caption">Theme</span>
									<ThemeToggle />
								</div>
							</li>
						</ul>
					</div>

					<div class="context">
						<NavContextMenu bind:this={nav_context_instance} contents={context_menu_content} />
					</div>

					<button class="back-button" on:click={() => ($current_menu_view = null)}>
						<Icon name="arrow-left" size=".6em" />
						<span>Back to main menu</span>
					</button>
				</div>
			</div>
		</Menu>
	</div>

	<ul class="menu-section">
		<slot name="nav-center" />
	</ul>

	<div class="external menu-section">
		<ul>
			<slot name="nav-right" />
			<Separator />
		</ul>
		<div class="appearance">
			<span class="caption">Theme</span>
			<ThemeToggle />
		</div>
	</div>
</nav>

<style>
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
		transition: 0.5s var(--quint-out);
		transition-property: transform, background;

		box-shadow: 0 -0.1px 6px 0.9px hsla(0, 0%, 0%, 0.1);

		isolation: isolate;
	}

	@media (max-width: 800px) {
		nav:not(.visible) {
			transform: translate(0, calc(var(--sk-nav-height)));
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

	.home {
		display: flex;
		align-items: center;
		text-decoration: none;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-size: 1.8rem;
		color: var(--sk-text-4);
	}

	.home .home-small {
		display: none;

		margin-left: -0.75rem;
	}

	.home .home-large {
		display: block;
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

	.buttons {
		display: flex;
		gap: 0.5rem;

		position: absolute;
		bottom: 0;
		right: 1rem;

		height: 100%;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;

		height: 100%;
		width: var(--sk-nav-height);

		display: flex;
		gap: 1.5rem;

		line-height: 1;
	}

	button.open {
		color: var(--sk-theme-1);
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
		nav .buttons :global(button) {
			position: relative;
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
			left: 0rem;
			bottom: 0;

			display: flex;
			align-items: center;

			height: var(--sk-nav-height);
			padding-left: calc(var(--sk-page-padding-side) + 4rem);
		}

		.home .home-small {
			display: block;
		}

		.home .home-large {
			display: none;
		}

		.home .home-small:empty + .nav-title {
			margin-left: 0rem;
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

		.menu-background {
			position: absolute;
			width: 100%;
			left: 0;
			bottom: 0;
			height: 100%;
			border-radius: 1rem 1rem 0 0;
			background: var(--background, var(--sk-back-2));
		}

		.menu-background.ready {
			transition: height 0.4s cubic-bezier(0.23, 1, 0.32, 1);
		}

		.menu-background.dark {
			border-top: solid 1.1px hsla(0, 0%, 100%, 0.2);
		}

		.mobile-main-menu {
			height: 100%;
		}

		.mobile-main-menu .viewport {
			position: relative;
			display: grid;
			width: 200%;
			height: 100%;
			grid-template-columns: 50% 50%;
			transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
			grid-auto-rows: 100%;
			clip-path: polygon(
				0 var(--height-difference),
				50% var(--height-difference),
				50% 100%,
				0 100%
			);
		}

		.mobile-main-menu.reduced-motion .viewport {
			transition: none;
		}

		.mobile-main-menu.offset .viewport {
			transform: translate3d(-50%, 0, 0);
			clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);
		}

		.mobile-main-menu .universal ul {
			position: absolute;
			width: 50%;
			bottom: 0;
			padding: 1rem;
		}

		.mobile-main-menu.offset .context {
			transform: translate3d(0, 0, 0);
			opacity: 1;
		}

		.mobile-main-menu .viewport > * {
			overflow-y: auto;
			transition: inherit;
			transition-property: transform, opacity;
		}

		.mobile-main-menu .context {
			position: relative;
			height: 100%;
			padding-bottom: 2rem;
		}

		.mobile-main-menu .back-button {
			position: absolute;
			bottom: 0;
			right: 0;
			z-index: 9;

			display: flex;
			align-items: center;
			justify-content: start;
			gap: 1rem;

			font-size: 0.9em;
			color: var(--sk-text-3);

			background-color: var(--sk-back-2);

			width: 50%;
			height: 48px;
			padding: 0 1.5rem;
		}

		.mobile-main-menu .back-button :global(svg) {
			transform: scale(0.8);
		}

		.mobile-main-menu :global(li) {
			padding: 0.3rem 0;
		}

		.mobile-main-menu :global(li a) {
			border-radius: var(--sk-border-radius);
			width: 100%;
		}

		.mobile-main-menu :global(li a[aria-current]) {
			background-color: hsla(var(--sk-theme-1-hsl), 0.05);
		}

		.mobile-main-menu :global(li a:hover) {
			border-radius: var(--sk-border-radius);

			color: initial;
			text-decoration: none;

			background-color: var(--sk-back-4);
		}

		.mobile-main-menu :global(li a[aria-current]:hover) {
			background-color: hsla(var(--sk-theme-1-hsl), 0.05);
			color: var(--sk-theme-1);
		}

		.appearance {
			position: relative;
			left: -1.25rem;
			bottom: -1rem;

			display: flex;
			flex-direction: column;
			gap: 2rem;

			padding: 1.5rem 1.25rem;

			width: calc(100% + 1.25rem);
		}

		.appearance > div {
			display: flex;
			align-items: center;
			justify-content: space-between;

			width: calc(100%);
		}

		.appearance .caption {
			display: block;

			font-size: var(--sk-text-s);
		}
	}

	@media (min-width: 800px) {
		nav {
			display: grid;
			grid-template-columns: 1fr auto 1fr;
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

		.buttons {
			display: none;
		}
	}
</style>
