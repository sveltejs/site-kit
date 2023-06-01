<!-- @component
Simple item component for use within `Nav`
-->

<script>
	/** @type {string | undefined} */
	export let href = undefined;

	/** @type {boolean} */
	export let external = false;

	/** @type {string | undefined} */
	export let title = undefined;

	/** @type {any}*/
	export let selected = undefined;

	export let mobileOnly = false;

	/** @type {(() => void) | undefined} */
	export let action = undefined;
</script>

<li data-primary={$$slots['primary-icon'] ? true : null} class:mobile-only={mobileOnly}>
	<a
		{href}
		{title}
		aria-current={!external ? selected : null}
		rel={external ? 'external' : null}
		on:click={(e) => {
			if (action) {
				e.preventDefault();
				action();
			}
		}}
	>
		<span class="primary-icon"><slot name="primary-icon" /></span>

		<span class="large"><slot /></span>

		<!-- if no slot="small" given, fall back to using content from large -->
		<span class="small"><slot name="small"><slot /></slot></span>
	</a>
</li>

<style>
	a {
		font-size: var(--sk-text-s);
	}

	a:hover {
		color: var(--sk-theme-3);
		opacity: 1;
	}

	[aria-current] {
		color: var(--sk-theme-1);
	}

	.small {
		display: inline;
	}

	.large {
		display: none;
	}

	.mobile-only {
		display: inline;
	}

	@media (min-width: 800px) {
		.small {
			display: none;
		}

		.large {
			display: inline;
		}

		.mobile-only {
			display: none;
		}
	}
</style>
