<script>
	import { click_outside, focus_outside } from '$lib/actions';
	import { overlay_open, reduced_motion, theme } from '$lib/stores';
	import { expoOut } from 'svelte/easing';

	export let visible = true;

	let open = false;

	function toggle() {
		open = !open;
	}

	function close() {
		open = false;
	}

	$: $overlay_open = open;

	/**
	 * @param {HTMLElement} _
	 * @returns {import('svelte/transition').TransitionConfig}
	 */
	const slide_up = (_) => {
		return {
			css: (t, u) =>
				$reduced_motion
					? `opacity: ${t}`
					: `transform: translate3d(0, ${u * 120}%, 0) scale3d(${0.9 + 0.1 * t}, ${
							0.9 + 0.1 * t
					  }, 1)`,
			easing: expoOut,
			duration: 500
		};
	};

	/**
	 * @param {HTMLElement} node
	 * @returns {import('svelte/transition').TransitionConfig}
	 */
	const fade_out = (node) => {
		node.style.overflow = 'hidden';

		return {
			css: (t, u) =>
				`opacity: ${t}; 
				 ${
						!$reduced_motion
							? `transform: translate3d(0, 0, 0) scale3d(${1 - 0.1 * u}, ${1 - 0.1 * u}, 1})`
							: ''
					}`,
			easing: expoOut,
			duration: 500
		};
	};
</script>

{#if visible}
	<div style="display: contents" use:click_outside={close} use:focus_outside={close}>
		<div class="label">
			<slot {toggle} {open} />
		</div>

		{#if open}
			<div class="menu" class:dark={$theme.current === 'dark'} in:slide_up out:fade_out>
				<slot name="component" {toggle} />
			</div>
		{/if}
	</div>
{/if}

<style>
	.menu {
		display: block;

		position: fixed;
		left: 0px;
		bottom: var(--bottom, var(--sk-nav-height));
		z-index: 1;

		width: 100%;
		max-height: 70vh;
		padding: var(--padding);

		border-radius: 1rem 1rem 0 0;

		background: var(--background, var(--sk-back-2));

		overflow-y: auto;
		overflow-x: hidden;
	}

	.menu.dark {
		border-top: solid 1.1px hsla(0, 0%, 100%, 0.2);
	}
</style>