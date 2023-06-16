<script>
	import { afterNavigate } from '$app/navigation';
	import { click_outside, focus_outside } from '$lib/actions';
	import { overlay_open } from '$lib/stores';
	import Icon from '../components/Icon.svelte';

	/** @type {boolean} */
	export let open;

	function close() {
		open = false;
	}

	afterNavigate(close);

	$: $overlay_open = open;
</script>

<div style="display: contents" use:click_outside={close} use:focus_outside={close}>
	<button
		aria-label="Toggle menu"
		aria-expanded={open}
		class="menu-toggle"
		class:open
		on:click={() => (open = !open)}
	>
		<Icon name={open ? 'close' : 'menu'} size="1em" />
	</button>

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
		pointer-events: none;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;

		height: 100%;
		width: var(--sk-nav-height);

		display: flex;
		gap: 1.5rem;

		line-height: 1;
	}
</style>
