<script>
	import Section from './Section.svelte';
</script>

<!-- TODO: CSS Vars -->
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

		{#if $$slots.four}
			<div>
				<slot name="four" />
			</div>
		{/if}

		{#if $$slots.five}
			<div>
				<slot name="five" />
			</div>
		{/if}
	</div>

	{#if $$slots.six}
		<div>
			<slot name="six" />
		</div>
	{/if}
</Section>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 1rem;
	}
</style>
