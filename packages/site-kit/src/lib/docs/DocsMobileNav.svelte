<script>
	import { Separator } from '$lib/nav';

	import DocsContents from './DocsContents.svelte';
	import DocsOnThisPage from './DocsOnThisPage.svelte';
	import TSToggle from './TSToggle.svelte';

	/** @type {import('svelte').ComponentProps<DocsContents>['contents']} */
	export let contents;

	/** @type {import('svelte').ComponentProps<DocsOnThisPage>['details']} */
	export let pageContents;
</script>

<section>
	<h3>ON THIS PAGE</h3>
	<br />
	<DocsOnThisPage details={pageContents} on:select />

	<Separator linear />

	<h3>CONTENTS</h3>
	<br />
	<DocsContents {contents} show_ts_toggle={false} />

	<br /><br /><br />

	<div class="ts-toggle">
		<TSToggle />
	</div>
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
		font-size: 1.4rem !important;
		font-weight: 400;
		margin: 0 0 -3rem 0 !important;
		padding: 2rem 0 2rem 0.6rem;
		color: var(--sk-text-2);

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

		/* transform: translateY(200%); */

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
