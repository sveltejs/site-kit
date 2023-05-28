<script>
	import { TSToggle } from '.';
	import { theme } from '../ThemeToggle.svelte';
	import DocsContents from './DocsContents.svelte';
	import DocsOnThisPage from './DocsOnThisPage.svelte';

	/** @type {import('svelte').ComponentProps<DocsContents>['contents']} */
	export let contents;

	/** @type {import('svelte').ComponentProps<DocsOnThisPage>['details']} */
	export let pageContents;
</script>

<nav class:dark={$theme.current === 'dark'}>
	<div aria-hidden="true" class="trick-overlay" />

	<div class="group-menu">
		<button class="trigger-button docs-menu">Menu</button>
		<section class="menu-container">
			<DocsContents {contents} show_ts_toggle={false} />

			<div class="ts-toggle">
				<TSToggle />
			</div>
		</section>
	</div>

	<span />

	<div class="group-otp">
		<button class="trigger-button on-this-page">On This Page</button>
		<section class="menu-container">
			<DocsOnThisPage details={pageContents} />
		</section>
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

	nav:focus-within + .overlay {
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
		transition: 0.15s ease-in;
		transition-property: box-shadow, border-radius;

		width: 95vw;
		height: 48px;

		padding: 0 16px;
		border-radius: 1rem 1rem 0 0;
		box-shadow: 3px -1px 8.6px -9px rgba(0, 0, 0, 0.11), -3px -1px 20px 1px rgba(0, 0, 0, 0.22);

		background-color: var(--sk-back-3);

		isolation: isolate;
	}

	nav:focus-within {
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

	.group-menu:focus-within .ts-toggle {
		opacity: 1;
		pointer-events: all;
	}

	.group-menu:focus-within .menu-container,
	.group-otp:focus-within .menu-container {
		transform: translate3d(0, 0, 0);
	}

	.group-menu:focus-within .menu-container > :global(*),
	.group-otp:focus-within .menu-container > :global(*) {
		opacity: 1;
	}

	.menu-container {
		display: block;

		position: fixed;
		left: 0;
		bottom: 48px;

		width: 100%;
		height: 70vh;

		transform: translate3d(0, 120%, 0) scale3d(0.9, 0.9, 1);

		border-radius: 1rem 1rem 0 0;
		box-shadow: 3px -1px 8.6px -9px rgba(0, 0, 0, 0.11), -3px -1px 20px 1px rgba(0, 0, 0, 0.22);

		background-color: var(--sk-back-3);

		overflow-y: auto;

		transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
	}

	.menu-container > :global(*) {
		opacity: 0;

		transition: opacity 0.3s ease-in;
	}

	nav.dark .menu-container {
		box-shadow: inset 0 0 0 0.9px hsla(0, 0%, 100%, 0.2), 0 0 0 1.4px hsla(0, 0%, 0%, 0.2);
	}

	.ts-toggle {
		position: sticky;
		left: 0.75px;
		bottom: 0;
		z-index: 2;

		width: calc(100% - 1.7px);

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
