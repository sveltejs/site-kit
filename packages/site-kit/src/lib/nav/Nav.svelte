<!-- @component
Top navigation bar for the application. It provides a slot for the left side, the right side, and the center.
-->

<script>
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { Search } from '$lib/search';
	import { overlay_open, reduced_motion, searching, theme } from '$lib/stores';
	import { onMount } from 'svelte';
	import { expoOut, quintOut } from 'svelte/easing';
	import { writable } from 'svelte/store';
	import Icon from '../components/Icon.svelte';
	import ThemeToggle from '../components/ThemeToggle.svelte';
	import Menu from './Menu.svelte';
	import NavContextMenu from './NavContextMenu.svelte';
	import Separator from './Separator.svelte';

	export let home_title = 'Homepage';

	/** @type {string | undefined} */
	export let title;

	/** @type {import('../types').NavigationLink[]} */
	export let links;

	/** @type {import('../types').NavigationLink | undefined} */
	let current_menu_view = undefined;

	let show_context_menu = false;

	/** @type {import('svelte/store').Writable<string | null>} */
	const page_selected = writable(null);

	/** @type {NavContextMenu} */
	let nav_context_instance;

	let open = false;
	let visible = true;

	/** @type {HTMLElement} */
	let nav;

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
		if (browser && current_menu_view) {
			nav_context_instance?.scrollToActive();
		}
	}

	onMount(() => {
		const segment = $page.url.pathname.split('/')[1];
		current_menu_view = links.find((link) => link.prefix === segment);
	});

	afterNavigate(({ to }) => {
		// if (to?.url.pathname === '/') {
		// const segment = $page.url.pathname.split('/')[1];
		// current_menu_view = links.find((link) => link.prefix === segment);
		// show_context_menu = !!current_menu_view;
		// }

		open = false;
	});

	/**
	 * @param {HTMLElement} node
	 * @param {{easing?: (t: number) => number, duration?: number }} [params]
	 * @returns {import('svelte/transition').TransitionConfig}
	 */
	const slide = (node, { duration = 400, easing = expoOut } = {}) => {
		const height = current_menu_view ? node.clientHeight : universal_menu_inner_height;

		return {
			css: (t, u) =>
				$reduced_motion.current
					? `opacity: ${t}`
					: `transform: translate3d(0, ${height * u}px, 0) scale3d(${0.9 + 0.1 * t}, ${
							0.9 + 0.1 * t
					  }, 1)`,
			easing,
			duration
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

		{#if title}
			<div class="nav-title">
				{title}
			</div>
		{/if}
	</a>

	<div class="buttons">
		<button
			aria-label="Toggle menu"
			aria-expanded={open}
			class="menu-toggle"
			class:open
			on:click={() => (open = !open)}
		>
			<Icon name={open ? 'close' : 'menu'} size="1em" />
		</button>

		<Menu {open} on:close={() => (open = false)}>
			<div
				class="mobile-main-menu"
				class:offset={show_context_menu}
				class:reduced-motion={$reduced_motion.current}
				in:slide
				out:slide={{ duration: 500, easing: quintOut }}
			>
				<div
					class="menu-background"
					class:dark={$theme.current === 'dark'}
					class:ready
					style:height={show_context_menu ? '100%' : `${universal_menu_inner_height}px`}
					style:--background={show_context_menu ? 'var(--sk-back-3)' : null}
					use:mounted={(mounted) => (ready = mounted)}
				/>

				<div
					class="clip"
					style:--height-difference="{menu_height - universal_menu_inner_height}px"
					on:transitionstart={(e) => {
						const target = /** @type {HTMLElement} */ (e.target);

						if (!target?.classList.contains('viewport')) return;
						if (e.propertyName !== 'transform') return;

						// we need to apply a clip-path during the transition so that the contents
						// are constrained to the menu background, but only while the transition
						// is running, otherwise it prevents the contents from being scrolled
						const a = 'calc(var(--height-difference) + 10px)';
						const b = '10px';

						const start = current_menu_view ? a : b;
						const end = current_menu_view ? b : a;

						const container = e.currentTarget;

						container.style.clipPath = `polygon(0% ${start}, 100% ${start}, 100% 100%, 0% 100%)`;

						setTimeout(() => {
							container.style.clipPath = `polygon(0% ${end}, 100% ${end}, 100% 100%, 0% 100%)`;
						}, 0);
					}}
					on:transitionend={(e) => {
						const target = /** @type {HTMLElement} */ (e.target);

						if (!target?.classList.contains('viewport')) return;
						if (e.propertyName !== 'transform') return;

						e.currentTarget.style.clipPath = '';
					}}
				>
					<div class="viewport" bind:clientHeight={menu_height}>
						<div class="universal">
							<div class="contents" bind:clientHeight={universal_menu_inner_height}>
								<ul>
									{#each links as link}
										<li>
											<a href={link.pathname}>
												{link.title}
											</a>

											{#if link.sections}
												<button
													class="related-menu-arrow"
													on:click|preventDefault={() => {
														current_menu_view = link;
														show_context_menu = true;
													}}
												>
													<Icon name="arrow-right-chevron" size="6rem" />
												</button>
											{/if}
										</li>
									{/each}
									<slot name="nav-right" />
								</ul>
								<Separator linear />
								<div style="height: 1rem" />
								<Search />
								<div class="appearance">
									<span class="caption">Theme</span>
									<ThemeToggle />
								</div>
							</div>
						</div>

						<div class="context">
							{#if current_menu_view}
								<NavContextMenu
									bind:this={nav_context_instance}
									contents={current_menu_view.sections}
								/>
							{/if}
						</div>

						<button class="back-button" on:click={() => (show_context_menu = false)}>
							<Icon name="arrow-left" size=".6em" />
							<span>Back to main menu</span>
						</button>
					</div>
				</div>
			</div>
		</Menu>
	</div>

	<ul class="menu-section">
		<slot name="nav-center" />
	</ul>

	<div class="external menu-section">
		<ul>
			{#each links as link}
				<a href={link.pathname}>
					{link.title}
				</a>
			{/each}
			<Separator />
			<slot name="nav-right" />
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

		.mobile-main-menu .clip {
			width: 100%;
			height: 100%;
			transition: clip-path 0.4s cubic-bezier(0.23, 1, 0.32, 1);
		}

		.mobile-main-menu .viewport {
			position: relative;
			display: grid;
			width: 200%;
			height: 100%;
			grid-template-columns: 50% 50%;
			transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
			grid-auto-rows: 100%;
		}

		.mobile-main-menu.reduced-motion .viewport {
			transition: none;
		}

		.mobile-main-menu.offset .viewport {
			transform: translate3d(-50%, 0, 0);
		}

		.mobile-main-menu .universal .contents {
			position: absolute;
			width: 50%;
			bottom: 0;
			padding: 1rem;
			max-height: 70vh;
			overflow-y: scroll;
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
			position: relative;
			display: block;
			align-items: center;
			padding: 0.3rem 0;
			height: 4rem;
		}

		.mobile-main-menu li button {
			position: absolute;
			right: 0;
			top: 0;
			width: 4rem;
			height: 100%;
		}

		.mobile-main-menu li button :global(svg) {
			stroke-width: 0;
		}

		.mobile-main-menu :global(li a) {
			display: flex;
			align-items: center;
			border-radius: var(--sk-border-radius);
			width: 100%;
			height: 100%;
			padding-left: 1rem;
		}

		.mobile-main-menu :global(li a[aria-current]) {
			background-color: hsla(var(--sk-theme-1-hsl), 0.05);
		}

		.mobile-main-menu :global(li:hover a) {
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
			gap: 2rem;
			padding: 1.5rem 1.25rem;
			justify-content: space-between;
			width: calc(100% + 1.25rem);
		}

		.appearance .caption {
			display: block;

			font-size: var(--sk-text-s);
		}

		nav :global(.large) {
			display: none;
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
			align-items: center;
		}

		ul :global(li) {
			padding: 0;
		}

		ul :global(a) {
			display: flex;
			align-items: center;
			height: 100%;
			padding: 0.5rem;
		}

		ul :global(a:hover) {
			color: var(--sk-theme-3);
		}

		.external {
			padding: 0 var(--sk-page-padding-side) 0 0;
			justify-content: end;
		}

		.buttons {
			display: none;
		}

		nav :global(.small) {
			display: none;
		}
	}
</style>
