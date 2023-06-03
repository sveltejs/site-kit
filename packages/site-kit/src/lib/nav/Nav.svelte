<!-- @component
Top navigation bar for the application. It provides a slot for the left side, the right side, and the center.
-->

<script>
	import { page } from '$app/stores';
	import { Search } from '$lib/search';
	import { overlay_open, searching, theme } from '$lib/stores';
	import Icon from '../components/Icon.svelte';
	import ThemeToggle from '../components/ThemeToggle.svelte';
	import Menu from './Menu.svelte';
	import Separator from './Separator.svelte';

	export let home_title = 'Homepage';

	let open = false;
	let visible = $page.data.nav_initially_visible ?? true;

	/** @type {HTMLElement} */
	let nav;

	// hide nav whenever we navigate
	page.subscribe(() => {
		open = false;
	});

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
		{#if $page.data.mobile_nav_start}
			{@const { icon, component, props } = $page.data.mobile_nav_start}

			<Menu --background="var(--sk-back-3)" let:open let:toggle>
				<button
					aria-label="Toggle contents"
					aria-expanded={open}
					class="menu-toggle start"
					class:open
					on:click={toggle}
				>
					<Icon name={icon} size="1em" />
				</button>

				<div slot="component" let:toggle>
					<svelte:component this={component} {...props} on:select={toggle} />
				</div>
			</Menu>
		{/if}

		<Menu --padding="1rem" let:toggle let:open>
			<button
				aria-label="Toggle menu"
				aria-expanded={open}
				class="menu-toggle"
				class:open
				on:click={toggle}
			>
				<Icon name={open ? 'close' : 'menu'} size="1em" />
			</button>

			<div class="mobile-main-menu" slot="component">
				<ul>
					<slot name="nav-right" />
					<Separator />
					<div style="height: 1rem" />
					<Search />
				</ul>
				<div class="appearance">
					<span class="caption">Theme</span>
					<ThemeToggle />
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
		transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);

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
		right: 0;

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

		.mobile-main-menu :global(li) {
			padding: 0.3rem 0;
		}

		.mobile-main-menu :global(li a) {
			display: block;

			border-radius: var(--sk-border-radius);

			width: 100%;
			padding: 0.8rem;
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

			justify-content: space-between;
			align-items: center;
			padding: 1.5rem 1.25rem;

			width: calc(100% + 1.25rem);
		}

		.appearance .caption {
			display: block;
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
