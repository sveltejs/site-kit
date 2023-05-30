<script>
	import { click_outside, focus_outside } from '$lib/actions';
	import { reduced_motion, theme } from '$lib/stores';
	import { expoIn, expoOut, sineOut } from 'svelte/easing';
	import DocsContents from './DocsContents.svelte';
	import DocsOnThisPage from './DocsOnThisPage.svelte';
	import TSToggle from './TSToggle.svelte';

	/** @type {import('svelte').ComponentProps<DocsContents>['contents']} */
	export let contents;

	/** @type {import('svelte').ComponentProps<DocsOnThisPage>['details']} */
	export let pageContents;

	let is_menu_open = false;

	/** @type {'docs' | 'on-this-page' | null} */
	let selected_menu = null;

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
		on:click={() => toggle_menu('docs')}
		class="trigger-button docs-menu"
	>
		Docs
	</button>

	<span />

	<button
		aria-expanded={selected_menu === 'on-this-page'}
		class="trigger-button on-this-page"
		on:click={() => toggle_menu('on-this-page')}
	>
		On This Page
	</button>

	{#if is_menu_open}
		<section in:slide_up out:fade_out class="menu-container">
			<div
				class="viewport"
				class:motion={!$reduced_motion}
				class:offset={selected_menu === 'on-this-page'}
			>
				<div class="view-one">
					<DocsContents {contents} show_ts_toggle={false} />

					<div class="ts-toggle">
						<TSToggle />
					</div>
				</div>

				<div class="view-two">
					<DocsOnThisPage details={pageContents} on:select={() => (is_menu_open = false)} />
				</div>
			</div>
		</section>
	{/if}
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
		left: 0.5px;
		bottom: 48px;

		width: calc(100% - 1px);
		height: 70vh;

		border-radius: 1rem 1rem 0 0;
		box-shadow: 3px -1px 8.6px -9px rgba(0, 0, 0, 0.11), -3px -1px 20px 1px rgba(0, 0, 0, 0.22);

		background-color: var(--sk-back-3);

		overflow-y: auto;

		transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
	}

	nav.dark .menu-container {
		box-shadow: none;

		border-top: solid 1.1px hsla(0, 0%, 100%, 0.2);
	}

	.viewport {
		display: grid;
		grid-template-columns: 50% 50%;
		grid-auto-rows: 100%;

		width: 200%;
		height: 100%;
	}

	.viewport.motion {
		transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
	}

	.viewport.offset {
		transform: translate(-50%, 0);
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
