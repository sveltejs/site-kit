<script>
	import { BROWSER } from 'esm-env';
	import { persisted } from 'svelte-local-storage-store';
	import ToggleButton from './ToggleButton.svelte';

	const checked = persisted('svelte:prefers-ts', false);

	$: BROWSER && document.body.classList.toggle('prefers-ts', $checked);
</script>

<div class="input-output-toggle">
	<span aria-hidden="true">JavaScript</span>
	<ToggleButton bind:pressed={$checked} label="TypeScript code examples" />
	<span aria-hidden="true">TypeScript</span>
</div>

<style>
	.input-output-toggle {
		position: relative;
		display: flex;
		gap: 0.5em;
		user-select: none;
		align-items: center;
		width: 100%;
		height: var(--ts-toggle-height);
		z-index: 2;
		padding: 0 var(--sk-page-padding-side);
		margin: 0 auto;
	}

	@media (min-width: 832px) {
		.input-output-toggle {
			padding-left: 3.2rem;
			width: var(--sidebar-menu-width);
			margin: 0 0 0 auto;
		}
	}
</style>
