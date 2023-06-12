<script>
	import { Separator } from '$lib/nav';
	import DocsContents from './DocsContents.svelte';
	import DocsOnThisPage from './DocsOnThisPage.svelte';
	import TSToggle from './TSToggle.svelte';

	/** @type {import('svelte').ComponentProps<DocsContents>['contents'] | undefined} */
	export let contents = undefined;
</script>

<section>
	{#if contents}
		<DocsContents {contents} show_ts_toggle={false} />

		<br /><br /><br />

		<div class="ts-toggle">
			<TSToggle />
		</div>
	{/if}
</section>

<style>
	section {
		position: relative;
	}

	.ts-toggle {
		position: sticky;
		left: 0;
		bottom: 47px;
		z-index: 2;

		width: 100%;

		padding: 1rem 0;
		margin-right: 0;

		background-color: var(--sk-back-3);
	}

	.ts-toggle::after {
		display: block;
		content: '';
		position: absolute;
		left: 0;
		bottom: 44px;
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
</style>
