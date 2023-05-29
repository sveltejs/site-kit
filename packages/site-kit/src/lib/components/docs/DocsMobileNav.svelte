<script>
	import { click_outside, focus_outside } from '$lib/actions';
	import { tick } from 'svelte';
	import { expoOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { TSToggle } from '.';
	import { theme } from '../ThemeToggle.svelte';
	import DocsContents from './DocsContents.svelte';
	import DocsOnThisPage from './DocsOnThisPage.svelte';

	/** @type {import('svelte').ComponentProps<DocsContents>['contents']} */
	export let contents;

	/** @type {import('svelte').ComponentProps<DocsOnThisPage>['details']} */
	export let pageContents;

	const menu_open = {
		docs: false,
		on_this_page: false
	};

	/**
	 * @param {HTMLElement} _
	 * @returns {import('svelte/transition').TransitionConfig}
	 */
	const slide_up = (_) => {
		return {
			css: (t, u) =>
				`transform: translate3d(0, ${u * 120}%, 0) scale3d(${0.9 + 0.1 * t}, ${0.9 + 0.1 * t}, 1)`,
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
				 transform: translate3d(0, 0, 0) scale3d(${1 - 0.1 * u}, ${1 - 0.1 * u}, 1})`,
			easing: expoOut,
			duration: 500
		};
	};

	function toggle_docs_menu() {
		menu_open.docs = !menu_open.docs;
	}

	function toggle_on_this_page_menu() {
		menu_open.on_this_page = !menu_open.on_this_page;
	}

	async function close_docs_menu() {
		await tick();
		menu_open.docs = false;
	}

	async function close_on_this_page_menu() {
		await tick();

		menu_open.on_this_page = false;
	}
</script>

<nav
	class:menu-open={menu_open.docs || menu_open.on_this_page}
	class:dark={$theme.current === 'dark'}
>
	<div aria-hidden="true" class="trick-overlay" />

	<div class="group-menu" use:click_outside={close_docs_menu} use:focus_outside={close_docs_menu}>
		<button
			aria-expanded={menu_open.docs}
			on:click={toggle_docs_menu}
			class="trigger-button docs-menu">Menu</button
		>

		{#if menu_open.docs}
			<section in:slide_up out:fade_out class="menu-container">
				<DocsContents {contents} show_ts_toggle={false} />

				<div class="ts-toggle">
					<TSToggle />
				</div>
			</section>
		{/if}
	</div>

	<span />

	<div
		class="group-otp"
		use:click_outside={close_on_this_page_menu}
		use:focus_outside={close_on_this_page_menu}
	>
		<button
			aria-expanded={menu_open.on_this_page}
			class="trigger-button on-this-page"
			on:click={toggle_on_this_page_menu}
		>
			On This Page
		</button>

		{#if menu_open.on_this_page}
			<section in:slide_up out:fade={{ duration: 400, easing: expoOut }} class="menu-container">
				<DocsOnThisPage on:select={close_on_this_page_menu} details={pageContents} />
			</section>
		{/if}
	</div>
</nav>

<div aria-hidden="true" class="overlay" />

<style>
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 101;

		width: 100vw;
		height: 100vh;

		backdrop-filter: blur(5px);

		opacity: 0;
		pointer-events: none;

		transition: opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1);

		background: hsla(0, 0%, 0%, 0.5);
	}

	nav.menu-open + .overlay {
		opacity: 1;
		pointer-events: all;
	}

	nav {
		display: grid;
		grid-template-columns: auto 1fr auto;

		position: fixed;
		bottom: 0;
		left: 50%;
		z-index: 102;

		transform: translate(-50%, 1px);
		transition: 0.5s cubic-bezier(0.23, 1, 0.32, 1);
		transition-property: box-shadow, border-radius;

		width: 95vw;
		height: 48px;

		padding: 0 16px;
		border-radius: 1rem 1rem 0 0;
		box-shadow: 3px -1px 8.6px -9px rgba(0, 0, 0, 0.11), -3px -1px 20px 1px rgba(0, 0, 0, 0.22);

		background-color: var(--sk-back-3);

		isolation: isolate;
	}

	nav.menu-open {
		border-radius: 0;
	}

	nav.dark {
		box-shadow: inset 0 0 0 0.9px hsla(0, 0%, 100%, 0.2), 0 0 0 1.4px hsla(0, 0%, 0%, 0.2);
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

	[class^='group-'] {
		display: flex;
		align-items: center;
	}

	.trigger-button {
		font-size: var(--sk-text-xs);

		z-index: 5;
	}

	.menu-container {
		display: block;

		position: fixed;
		left: 0.5px;
		bottom: 48px;

		width: calc(100% - 1px);
		height: 70vh;

		/* transform: translate3d(0, 120%, 0) scale3d(0.9, 0.9, 1); */

		border-radius: 1rem 1rem 0 0;
		box-shadow: 3px -1px 8.6px -9px rgba(0, 0, 0, 0.11), -3px -1px 20px 1px rgba(0, 0, 0, 0.22);

		background-color: var(--sk-back-3);

		overflow-y: auto;

		transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
	}

	nav.dark .menu-container {
		box-shadow: inset 0 0 0 0.9px hsla(0, 0%, 100%, 0.2), 0 0 0 1.4px hsla(0, 0%, 0%, 0.2);
	}

	.ts-toggle {
		position: sticky;
		left: 0.75px;
		bottom: 0;
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
