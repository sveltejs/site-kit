<script>
	import Section from '../components/Section.svelte';
</script>

<Section --background="var(--sk-back-1)">
	<div class="grid">
		{#if $$slots.one}
			<div>
				<slot name="one" />
			</div>
		{/if}

		{#if $$slots.two}
			<div>
				<slot name="two" />
			</div>
		{/if}

		{#if $$slots.three}
			<div>
				<slot name="three" />
			</div>
		{/if}
	</div>
</Section>

<style>
	.grid {
		--columns: 1;

		display: grid;
		grid-template-columns: repeat(var(--columns), 1fr);
		grid-gap: 1rem;
	}

	.grid :global(h2) {
		font-size: var(--sk-text-xl);
		line-height: 1.2;
	}

	.grid {
		display: grid;
		gap: 1em;
		margin: 0 0 4rem 0;
	}

	.grid:last-child {
		margin-bottom: 0;
	}

	@media (min-width: 900px) {
		.grid :global(h2) {
			font-size: var(--sk-text-xl);
		}

		.grid {
			--columns: 3;

			gap: 7rem;
		}
	}
</style>
