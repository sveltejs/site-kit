<script>
	import Icon from '$lib/components/Icon.svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	/** @type {string} */
	export let code;

	let copying = false;

	function copy() {
		try {
			navigator.clipboard.writeText(code);

			copying = true;

			setTimeout(() => {
				copying = false;
			}, 1000);
		} catch {}
	}
</script>

<button id="copy-to-clipboard-button" on:click={copy} class:hidable={!copying}>
	{#if copying}
		<span transition:fade={{ easing: cubicOut, duration: 400 }}>
			<Icon name="copy-to-clipboard-filled" />
		</span>
	{:else}
		<span transition:fade={{ easing: cubicOut, duration: 400 }}>
			<Icon name="copy-to-clipboard-empty" />
		</span>
	{/if}
</button>

<style>
	:global(:where(pre.shiki, .code-block):hover #copy-to-clipboard-button.hidable) {
		opacity: 1;
	}

	:global(.code-block #copy-to-clipboard-button) {
		top: 5px;
	}

	button {
		position: absolute;
		top: 1rem;
		right: 1rem;

		display: grid;
		place-items: center;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;

		height: 2.4rem;
		width: 2.4rem;

		overflow: hidden;

		transition: opacity 0.1s ease-in-out;
	}

	button.hidable {
		opacity: 0;
	}

	span {
		grid-column: 1 / span 1;
		grid-row: 1 / span 1;
	}

	button :global(svg) {
		stroke-width: 0 !important;
	}
</style>
