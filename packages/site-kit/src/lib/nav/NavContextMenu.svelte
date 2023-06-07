<script>
	import { page } from '$app/stores';
	import { createEventDispatcher, tick } from 'svelte';

	/**
	 * @type {{
	 *  title: string;
	 *  sections: {
	 *    title: string;
	 *    path: string;
	 *    badge?: string;
	 *  }[]
	 * }[]}
	 */
	export let contents = [];

	export async function scrollToActive() {
		if (!navEl) return;

		// div class="context"
		const containerEl = navEl.parentElement;

		if (!containerEl) return;

		await tick();

		const active = navEl.querySelector('.active');

		if (active) {
			const { top, bottom } = active.getBoundingClientRect();
			const min = 100;
			const max = window.innerHeight - 100;

			if (top > max) {
				containerEl.scrollBy({
					top: top - max,
					left: 0,
					behavior: 'auto'
				});
			} else if (bottom < min) {
				containerEl.scrollBy({
					top: bottom - min,
					left: 0,
					behavior: 'auto'
				});
			}
		} else {
			containerEl.scrollTo({
				top: 0,
				left: 0,
				behavior: 'auto'
			});
		}
	}

	/** @type {HTMLElement} */
	let navEl;

	$: {
		if (contents) {
			scrollToActive();
		}
	}
</script>

<nav bind:this={navEl}>
	{#each contents as { sections, title }}
		<section>
			<h3>{title}</h3>

			<ul>
				{#each sections as { path, title, badge }}
					<li>
						<a href={path} class:active={path === $page.url.pathname}>
							{title}

							{#if badge}
								<span class="badge">{badge}</span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</nav>

<style>
	nav {
		padding: 2rem;

		font-family: var(--sk-font);

		overflow-y: auto;
	}

	h3 {
		display: block;

		padding-bottom: 0.8rem;

		font-size: var(--sk-text-s);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 600;
		color: var(--sk-text-3);
	}

	ul {
		list-style-type: none;

		margin: 0;
		margin-bottom: 2.5rem;
	}

	li {
		display: block;
	}

	a {
		display: flex;

		border-radius: var(--sk-border-radius);

		line-height: 1;
		color: var(--sk-text-2);

		padding: 0.9rem 0.75rem !important;

		transition: 0.1s ease;
		transition-property: background-color, color;
	}

	a:hover {
		text-decoration: none;

		background-color: var(--sk-back-4);
	}

	.active {
		background-color: hsla(var(--sk-theme-1-hsl), 0.1) !important;
		color: var(--sk-theme-1) !important;
		font-weight: 400;
	}
</style>