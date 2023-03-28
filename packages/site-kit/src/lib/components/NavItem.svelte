<!-- @component
Simple item component for use within `Nav`
-->
<script>
	/** @type {string | undefined} */
	export let href = undefined;

	/** @type {string | undefined} */
	export let external = undefined;

	/** @type {string | undefined} */
	export let title = undefined;

	/** @type {any}*/
	export let selected = undefined;
</script>

{#if external}
	<li>
		<a href={external} {title} rel="external">
			<span class="large"><slot /></span>
			<!-- if no slot="small" given, fall back to using content from large -->
			<span class="small"><slot name="small"><slot /></slot></span>
		</a>
	</li>
{:else}
	<li>
		<a aria-current={selected} {href} {title}>
			<span class="large"><slot /></span>
			<!-- if no slot="small" given, fall back to using content from large -->
			<span class="small"><slot name="small"><slot /></slot></span>
		</a>
	</li>
{/if}

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

	@media (min-width: 800px) {
		.small {
			display: none;
		}

		.large {
			display: inline;
		}
	}
</style>
