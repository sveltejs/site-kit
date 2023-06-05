<script>
	import { Separator } from '$lib/nav';
	import DocsContents from './DocsContents.svelte';
	import DocsOnThisPage from './DocsOnThisPage.svelte';
	import TSToggle from './TSToggle.svelte';

	/** @type {import('svelte').ComponentProps<DocsContents>['contents'] | undefined} */
	export let contents = undefined;

	/** @type {import('svelte').ComponentProps<DocsOnThisPage>['details'] | undefined} */
	export let pageContents = undefined;
</script>

<section>
	{#if pageContents}
		<h3>ON THIS PAGE</h3>
		<br />

		<DocsOnThisPage details={pageContents} on:select />

		<Separator linear />
	{/if}

	{#if contents}
		<h3>CONTENTS</h3>
		<br />
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

	h3 {
		display: block;

		position: sticky;
		top: 0;
		z-index: 10;

		text-transform: uppercase;
		font-size: 1em !important;
		font-weight: 600;
		color: var(--sk-text-2);

		margin: 0 0 -3rem 0 !important;
		padding: 1.5rem 0;
		padding-left: 2.4rem;

		background-color: var(--sk-back-3);
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
		left: 0;
		bottom: 0;
		z-index: 2;

		width: calc(100%);

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
