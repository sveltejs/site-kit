<script>
	import { browser } from '$app/environment';
	import { click_outside, focus_outside } from '$lib/actions';
	import Icon from '$lib/components/Icon.svelte';
	import { Separator } from '$lib/nav';
	import { nav_overlay_open, reduced_motion, should_nav_autohide, theme } from '$lib/stores';
	import { expoOut } from 'svelte/easing';
	import DocsContents from './DocsContents.svelte';
	import DocsOnThisPage from './DocsOnThisPage.svelte';
	import TSToggle from './TSToggle.svelte';

	/** @type {import('svelte').ComponentProps<DocsContents>['contents']} */
	export let contents;

	/** @type {import('svelte').ComponentProps<DocsOnThisPage>['details']} */
	export let pageContents;

	/** @type {HTMLElement} */
	let menu_container;

	let is_menu_open = false;

	$: $should_nav_autohide = !is_menu_open;
	$: $nav_overlay_open = is_menu_open;

	/** @type {'docs' | 'on-this-page' | null} */
	let selected_menu = null;

	$: {
		selected_menu;

		if (!browser) break $;

		menu_container?.scrollTo({ top: 0 });
	}

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

	/** @param {selected_menu} menu */
	function toggle_menu(menu) {
		if (is_menu_open) {
			if (selected_menu !== menu) return (selected_menu = menu);

			// Close
			is_menu_open = false;
			selected_menu = null;

			return;
		}

		selected_menu = menu;
		is_menu_open = true;
	}

	function close_menu() {
		is_menu_open = false;
		selected_menu = null;
	}
</script>

<nav
	class:menu-open={is_menu_open}
	class:dark={$theme.current === 'dark'}
	use:click_outside={close_menu}
	use:focus_outside={close_menu}
>
	<div aria-hidden="true" class="trick-overlay" />

	<button
		aria-expanded={selected_menu === 'docs'}
		class="trigger-button"
		on:click={() => toggle_menu('docs')}
	>
		<Icon name="menu" size="0.5em" /> &nbsp; Contents
	</button>

	<span />

	{#if is_menu_open}
		<section class="menu-container" bind:this={menu_container} in:slide_up out:fade_out>
			<h3>ON THIS PAGE</h3>
			<br />
			<DocsOnThisPage details={pageContents} on:select={() => (is_menu_open = false)} />

			<Separator linear />

			<h3>CONTENTS</h3>
			<br />
			<DocsContents {contents} show_ts_toggle={false} />

			<br /><br /><br />

			<div class="ts-toggle">
				<TSToggle />
			</div>
		</section>
	{/if}
</nav>

<style>
	nav {
		position: relative;
		z-index: 6;
		bottom: 48px;

		display: grid;
		grid-template-columns: auto 1fr auto;

		transition: 0.5s cubic-bezier(0.23, 1, 0.32, 1);
		transition-property: box-shadow, border-radius;

		width: 100vw;
		height: 48px;

		padding: 0 16px;
		box-shadow: 0 -0.1px 6px 0.9px hsla(0, 0%, 0%, 0.1);

		background-color: var(--sk-back-3);

		isolation: isolate;
	}

	nav.menu-open {
		border-radius: 0;
	}

	nav.dark {
		box-shadow: 0 -0.4px 0px 0px hsla(0, 0%, 40%, 1);
	}

	.trick-overlay {
		position: absolute;
		left: 0;

		width: 100%;
		height: 100%;

		border-radius: inherit;
		box-shadow: inherit;

		background-color: inherit;

		z-index: 4;
	}

	nav.dark .trick-overlay {
		left: 0.75px;
		width: calc(100% - 1.5px);
	}

	.trigger-button {
		font-size: var(--sk-text-xs);

		z-index: 5;
	}

	.trigger-button[aria-expanded='true'] {
		font-weight: 600;
		color: var(--sk-theme-1);
	}

	.menu-container {
		display: block;

		position: fixed;
		left: 0;
		bottom: var(--sk-nav-height);
		z-index: -1;

		width: calc(100%);
		height: 80vh;

		border-radius: 1rem 1rem 0 0;
		box-shadow: 3px -1px 8.6px -9px rgba(0, 0, 0, 0.11), -3px -1px 20px 1px rgba(0, 0, 0, 0.22);

		background-color: var(--sk-back-3);

		overflow-y: auto;
		overflow-x: hidden;
	}

	nav.dark .menu-container {
		box-shadow: none;

		border-top: solid 1.1px hsla(0, 0%, 100%, 0.2);
	}

	h3 {
		display: block;

		position: sticky;
		top: 0;
		z-index: 10;

		text-transform: uppercase;
		font-size: 1.4rem !important;
		font-weight: 400;
		margin: 0 0 -3rem 0 !important;
		padding: 2rem 0 2rem 0.6rem;
		color: var(--sk-text-3);

		background-color: var(--sk-back-3);

		padding-left: 3.2rem;

		font-size: 1.1em !important;
		font-weight: 600;
	}

	h3::before {
		content: '';

		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;

		transform: translateY(200%);

		width: 100%;
		height: 50%;

		background: linear-gradient(
			to bottom,
			hsla(var(--sk-back-3-hsl), 1) 0%,
			hsla(var(--sk-back-3-hsl), 0.3) 50%,
			hsl(var(--sk-back-3-hsl), 0) 100%
		);
	}

	.ts-toggle {
		position: sticky;
		left: 0.75px;
		bottom: 48px;
		z-index: 2;

		width: calc(100% - 2px);

		padding: 1rem 0;
		margin-right: 0;

		background-color: var(--sk-back-3);
	}

	.ts-toggle::after {
		display: block;
		content: '';
		position: absolute;
		left: 0;
		bottom: 4rem;
		width: calc(100% - 1.5px);
		height: 3rem;
		pointer-events: none;
		background: linear-gradient(
			to bottom,
			hsla(var(--sk-back-3-hsl), 0) 0%,
			hsla(var(--sk-back-3-hsl), 0.7) 50%,
			hsl(var(--sk-back-3-hsl)) 100%
		);
	}

	@media screen and (min-width: 832px) {
		nav {
			display: none;
		}
	}

	@media (prefers-reduced-motion) {
		.menu-container {
			transition: none;
		}
	}
</style>
