<script>
	import { click_outside, focus_outside } from '$lib/actions';
	import { overlay_open } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	/** @type {boolean} */
	export let open;

	function close() {
		dispatch('close');
	}

	$: $overlay_open = open;
</script>

<div style="display: contents" use:click_outside={close} use:focus_outside={close}>
	{#if open}
		<div class="menu">
			<slot />
		</div>
	{/if}
</div>

<style>
	.menu {
		display: block;

		position: fixed;
		left: 0px;
		bottom: var(--bottom, var(--sk-nav-height));
		z-index: 1;

		width: 100%;
		height: 70vh;
		border-radius: 1rem 1rem 0 0;
		overflow-y: hidden;
		overflow-x: hidden;
	}
</style>
