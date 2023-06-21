<script>
	import { afterNavigate } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { root_scroll } from '$lib/actions';
	import Icon from '$lib/components/Icon.svelte';
	import { afterUpdate, createEventDispatcher, onMount } from 'svelte';

	/** @type {import('./types').Page} */
	export let details;

	const dispatch = createEventDispatcher();

	/** @type {string} */
	let hash = '';

	/** @type {number} */
	let height = 0;

	/** @type {HTMLElement} */
	let content;

	/** @type {NodeListOf<HTMLElement>} */
	let headings;

	/** @type {number[]} */
	let positions = [];

	/** @type {HTMLElement} */
	let containerEl;

	let show_contents = false;

	onMount(async () => {
		await document.fonts.ready;
		update();
		highlight();
	});

	afterNavigate(() => {
		update();
		highlight();
	});

	function update() {
		const contentEl = /** @type {HTMLElement | null} */ (document.querySelector('.content'));

		if (!contentEl) return;

		content = contentEl;

		const { top } = content.getBoundingClientRect();
		headings = content.querySelectorAll('h2[id]');
		positions = Array.from(headings).map((heading) => {
			const style = getComputedStyle(heading);
			return heading.getBoundingClientRect().top - parseFloat(style.scrollMarginTop) - top;
		});
		height = window.innerHeight;
	}

	function highlight() {
		const { top, bottom } = content.getBoundingClientRect();
		let i = headings.length;
		while (i--) {
			if (bottom - height < 50 || positions[i] + top < 100) {
				const heading = headings[i];
				hash = `#${heading.id}`;
				return;
			}
		}
		hash = '';
	}

	/** @param {URL} url */
	function select(url) {
		// belt...
		setTimeout(() => {
			hash = url.hash;
		});
		// ...and braces
		window.addEventListener(
			'scroll',
			() => {
				hash = url.hash;
			},
			{ once: true }
		);
	}

	afterUpdate(() => {
		// bit of a hack — prevent sidebar scrolling if
		// TOC is open on mobile, or scroll came from within sidebar
		if (show_contents && window.innerWidth < 832) return;
		const active = containerEl.querySelector('.active');
		if (active) {
			const { top, bottom } = active.getBoundingClientRect();
			const min = 100;
			const max = window.innerHeight - 100;

			if (top > max) {
				containerEl.scrollBy({
					top: top - max,
					left: 0,
					behavior: 'smooth'
				});
			} else if (bottom < min) {
				containerEl.scrollBy({
					top: bottom - min,
					left: 0,
					behavior: 'smooth'
				});
			}
		}
	});
</script>

<svelte:window
	use:root_scroll={highlight}
	on:resize={update}
	on:hashchange={() => select($page.url)}
/>

<aside class="on-this-page" bind:this={containerEl}>
	<h2><Icon name="contents" size="1em" /> <span>On this page</span></h2>
	<nav aria-label="On this page">
		<ul>
			<li>
				<a
					href="{base}/docs/{details.slug}"
					class:active={hash === ''}
					on:click={() => dispatch('select')}>{details.title}</a
				>
			</li>
			{#each details.sections as { title, slug }}
				<li>
					<a
						href={`#${slug}`}
						class:active={`#${slug}` === hash}
						on:click={() => dispatch('select')}
					>
						{title}
					</a>

					<hr />
				</li>
			{/each}
		</ul>
	</nav>
</aside>

<style>
	.on-this-page {
		display: var(--on-this-page-display);
		position: fixed;
		padding: var(--sk-page-padding-top) var(--sk-page-padding-side) 0 0;
		width: min(280px, calc(var(--sidebar-width) - var(--sk-page-padding-side)));
		height: calc(100vh - var(--sk-nav-height) - var(--sk-page-padding-top));
		top: var(--sk-nav-height);
		left: calc(100vw - (var(--sidebar-width)));
		overflow-y: auto;
	}

	h2 {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		text-transform: uppercase;
		font-size: 1.4rem !important;
		font-weight: 400;
		margin: 0 0 1rem 0 !important;
		padding: 0 0 0 0.6rem;
		color: var(--sk-text-3);
	}

	h2 :global(svg) {
		display: none;

		transform: translateY(-1px);
	}

	ul {
		list-style: none !important;
		margin-left: 0 !important;
	}

	li {
		margin: 0.2rem !important;
	}

	li::before {
		content: none !important;
	}

	hr {
		display: none;
	}

	a {
		display: block;
		padding: 0.3rem 0.5rem;
		color: var(--sk-text-3) !important;
		border-left: 2px solid transparent;
		box-shadow: none !important;

		transition: 0.4s var(--quint-out) !important;
		transition-property: background, border-left;
	}

	a:hover {
		text-decoration: none;
		background: var(--sk-back-3);
	}

	a.active {
		background: var(--sk-back-3);
		border-left-color: var(--sk-theme-1);
	}

	@media screen and (max-width: 1200px) {
		.on-this-page {
			position: relative;
			top: 0;
			left: 0;

			display: block;

			width: 100%;
			height: max-content;

			margin-top: 3rem;
			padding: 0.5rem;

			border-radius: var(--sk-border-radius);
			box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.1);

			background-color: var(--sk-back-3);
		}

		h2 {
			font-size: var(--sk-text-s) !important;

			padding: 0.8rem 1rem;

			border: none;
		}

		h2 span {
			line-height: 1;
		}

		h2 :global(svg) {
			display: block;
		}

		ul {
			margin: 0;
		}

		li:first-child {
			display: none;
		}

		a {
			padding: 0.4rem 0.75rem;
			box-sizing: border-box;

			color: var(--sk-text-2) !important;
		}

		a.active {
			background-color: transparent;
			border-left: 0;
		}

		a:hover {
			text-decoration: none;
			background-color: initial;
		}

		hr {
			display: block;
			border: none;

			background-color: var(--sk-back-4);

			height: 1px;
			widows: 100%;
		}

		li:last-child hr {
			display: none;
		}
	}
</style>
