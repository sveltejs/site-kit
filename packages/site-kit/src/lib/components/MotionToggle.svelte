<script>
	import { reduced_motion } from '$lib/stores';
	import { BROWSER } from 'esm-env';
	import { onDestroy } from 'svelte';

	$: console.log($reduced_motion);

	function toggle() {
		const opposite = !$reduced_motion.current;

		if (opposite !== window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			// Switch the preference to `system`
			$reduced_motion.preference = 'system';
		} else {
			// Switch the preference to `light` or `dark`
			$reduced_motion.preference = 'user';
		}

		$reduced_motion.current = opposite;
	}

	/** @param {MediaQueryListEvent} e */
	const cb = (e) =>
		reduced_motion.set({ preference: $reduced_motion.preference, current: e.matches });

	/** @type {MediaQueryList} */
	let query;

	$: {
		if (!BROWSER) break $;

		query?.removeEventListener('change', cb);

		if ($reduced_motion.preference === 'system') {
			query = window.matchMedia('(prefers-reduced-motion: reduce)');
			query.addEventListener('change', cb);
		}
	}

	onDestroy(() => query?.removeEventListener('change', cb));
</script>

<button
	on:click={toggle}
	type="button"
	aria-pressed={!$reduced_motion.current}
	aria-label="Dark mode"
>
	<span class="check" class:checked={!$reduced_motion.current}>
		<span class="icon">
			{#if BROWSER}
				{#if !$reduced_motion.current}
					{@html `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m10.65 15.75l4.875-3.125q.35-.225.35-.625t-.35-.625L10.65 8.25q-.375-.25-.763-.038t-.387.663v6.25q0 .45.388.663t.762-.038ZM3.025 13q.425 0 .763.275t.462.7q.15.575.363 1.088t.487 1.012q.225.375.188.8t-.338.725q-.275.275-.675.25t-.625-.35q-.55-.775-.925-1.663T2.15 14q-.075-.4.188-.7t.687-.3ZM4.95 6.4q.3.3.325.725T5.1 7.9q-.275.5-.487 1.025t-.363 1.1q-.125.425-.463.7T3.026 11q-.425 0-.687-.313t-.163-.712q.2-.95.575-1.837t.9-1.663q.225-.325.625-.337t.675.262Zm1.4 12.625q.3-.325.738-.35t.812.2q.5.275 1.012.5t1.063.375q.425.125.7.45t.275.75q0 .425-.313.675t-.712.175q-.95-.2-1.788-.575T6.5 20.35q-.35-.225-.388-.625t.238-.7ZM11 3.05q0 .425-.263.75t-.687.45q-.575.15-1.1.363t-1.025.512q-.375.225-.812.188t-.738-.338q-.3-.3-.263-.712t.388-.638q.8-.5 1.663-.863T9.974 2.2q.4-.075.713.175T11 3.05ZM20 12q0-2.825-1.738-4.988T13.825 4.2q-.375-.1-.6-.425T13 3.05q0-.4.275-.662T13.9 2.2q3.5.7 5.8 3.425T22 12q0 3.65-2.3 6.375T13.9 21.8q-.35.075-.625-.188T13 20.95q0-.4.225-.725t.6-.425q2.7-.65 4.438-2.813T20 12Z"/></svg>`}
				{:else}
					{@html `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12c0-1.19.22-2.32.6-3.38l1.88.68C4.17 10.14 4 11.05 4 12c0 4.41 3.59 8 8 8s8-3.59 8-8s-3.59-8-8-8c-.95 0-1.85.17-2.69.48l-.68-1.89C9.69 2.22 10.82 2 12 2c5.52 0 10 4.48 10 10zM5.5 4C4.67 4 4 4.67 4 5.5S4.67 7 5.5 7S7 6.33 7 5.5S6.33 4 5.5 4zM11 16V8H9v8h2zm4 0V8h-2v8h2z"/></svg>`}
				{/if}
			{/if}
		</span>
	</span>
</button>

<style>
	button {
		position: relative;
		border-radius: 11px;
		display: block;
		width: 40px;
		height: 22px;
		flex-shrink: 0;
		border: 1px solid var(--sk-text-3);
		background-color: var(--sk-back-2);
		transition: border-color 0.25s;
	}

	button:hover {
		color: var(--sk-text-1);

		border-color: var(--sk-text-1);
	}

	.check {
		position: absolute;
		top: 1px;
		left: 1px;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background-color: var(--sk-back-4);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
		transition: transform 0.25s;
		pointer-events: none;
	}

	.check.checked {
		transform: translate(18px);
	}

	.icon {
		position: relative;
		display: block;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		overflow: hidden;
	}

	.icon :global(svg) {
		position: absolute;
		top: 3px;
		left: 3px;
		width: 12px;
		height: 12px;
	}
</style>
