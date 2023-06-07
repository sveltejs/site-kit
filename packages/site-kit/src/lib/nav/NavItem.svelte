<!-- @component
Simple item component for use within `Nav`
-->

<script>
	import Icon from '$lib/components/Icon.svelte';
	import { get_nav_context } from './nav.context';

	/** @type {string | undefined} */
	export let href = undefined;

	/** @type {boolean} */
	export let external = false;

	/** @type {string | undefined} */
	export let title = undefined;

	/** @type {any}*/
	export let selected = undefined;

	export let mobileOnly = false;

	/** @type {(() => void) | undefined} */
	export let action = undefined;

	/** @type {string | undefined} */
	export let relatedMenuName = undefined;

	const { current_menu_view, page_selected } = get_nav_context();

	$: $page_selected = (selected && relatedMenuName) ?? $page_selected;
</script>

<li data-primary={$$slots['primary-icon'] ? true : null} class:mobile-only={mobileOnly}>
	<a
		{href}
		{title}
		aria-current={!external ? selected : null}
		rel={external ? 'external' : null}
		on:click={(e) => {
			if (action || relatedMenuName) e.preventDefault();

			action?.();

			if (relatedMenuName) $current_menu_view = relatedMenuName ?? '';
		}}
	>
		<span class="primary-icon"><slot name="primary-icon" /></span>

		<span class="large"><slot /></span>

		<!-- if no slot="small" given, fall back to using content from large -->
		<span class="small"><slot name="small"><slot /></slot></span>

		{#if relatedMenuName}
			<span style="flex: 1 1 auto" />
			<button class="related-menu-arrow">
				<Icon name="arrow-right-chevron" size="6rem" />
			</button>
		{/if}
	</a>
</li>

<style>
	a {
		display: flex;
		align-items: center;

		font-size: var(--sk-text-s);

		height: 3.5rem;
		padding-left: 1rem;
	}

	a:hover {
		color: var(--sk-theme-3);
		opacity: 1;
	}

	[aria-current] {
		color: var(--sk-theme-1);
	}

	.small {
		display: inline;
	}

	.large {
		display: none;
	}

	.mobile-only {
		display: inline;
	}

	.related-menu-arrow {
		height: 100%;
		width: 4rem;

		/* z-index: 2; */
	}

	.related-menu-arrow :global(svg) {
		stroke-width: 0.01;

		filter: brightness(0.8);

		transform: scale(1.3);
	}

	@media (min-width: 800px) {
		a {
			padding: 0;
		}

		.related-menu-arrow {
			display: none;
		}

		.small {
			display: none;
		}

		.large {
			display: inline;
		}

		.mobile-only {
			display: none;
		}
	}
</style>
