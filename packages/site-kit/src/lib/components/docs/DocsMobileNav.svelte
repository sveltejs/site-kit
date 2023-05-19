<script>
	import { theme } from '../ThemeToggle.svelte';
	import DocsContents from './DocsContents.svelte';
	import DocsOnThisPage from './DocsOnThisPage.svelte';

	/** @type {import('svelte').ComponentProps<DocsContents>['contents']} */
	export let contents;

	/** @type {import('svelte').ComponentProps<DocsOnThisPage>['details']} */
	export let pageContents;
</script>

<nav class:dark={$theme.current === 'dark'}>
	<button class="trigger-button docs-menu">Menu</button>
	<section class="menu-container">
		<DocsContents {contents} show_ts_toggle={false} />
	</section>

	<span />

	<button class="trigger-button on-this-page">On This Page</button>
	<section class="menu-container">
		<DocsOnThisPage details={pageContents} />
	</section>
</nav>

<style>
	nav {
		display: grid;
		grid-template-columns: auto 1fr auto;

		position: fixed;
		bottom: 0;
		left: 50%;
		z-index: 5;

		transform: translate(-50%, 1px);
		transition: 0.15s ease-in;
		transition-property: box-shadow, border-radius;

		width: 95vw;
		height: 48px;

		padding: 0 16px;
		border-radius: 1rem 1rem 0 0;
		box-shadow: 3px -10px 8.6px -9px rgba(0, 0, 0, 0.11), -3px -1px 20px 1px rgba(0, 0, 0, 0.22);

		background-color: var(--sk-back-3);
	}

	nav:focus-within {
		border-radius: 0;
	}

	nav.dark {
		box-shadow: inset 0 0 0 0.9px hsla(0, 0%, 100%, 0.2), 0 0 0 1.4px hsla(0, 0%, 0%, 0.2);
	}

	.trigger-button {
		font-size: var(--sk-text-xs);
	}

	nav:focus-within .trigger-button.docs-menu:focus + .menu-container {
		display: block;
		animation: slide-up 0.3s ease-in;
		animation-fill-mode: forwards;
	}

	nav:focus-within .trigger-button.on-this-page:focus + .menu-container {
		display: block;
		animation: slide-up 0.3s ease-in;
		animation-fill-mode: forwards;
	}

	.menu-container {
		display: none;

		position: fixed;
		left: 0;
		bottom: 48px;

		width: 100%;
		height: 70vh;

		background-color: var(--sk-back-3);

		overflow-y: auto;

		animation: slide-down 0.3s ease-out;
		animation-fill-mode: forwards;
	}

	@keyframes slide-up {
		0% {
			transform: translateY(100%);
			display: none;
		}
		0.0001% {
			display: block;
			transform: translateY(100%);
		}
		100% {
			transform: translateY(0);
		}
	}

	@keyframes slide-down {
		0% {
			transform: translateY(0);
		}
		99.9999% {
			transform: translateY(100%);
		}
		100% {
			display: none;
		}
	}

	@media screen and (min-width: 832px) {
		nav {
			display: none;
		}
	}
</style>
