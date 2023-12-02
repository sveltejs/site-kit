<script context="module">
	/**
	 * Only to be used on non svelte.dev sites. Shouldn't be used inside svelte.dev codebase itself
	 * @param {import('./Banner.svelte').BannerScope} scope
	 * @param {import('@sveltejs/kit').RequestEvent['fetch']} fetch
	 * @returns {Promise<import('./Banner.svelte').BannerData>}
	 */
	export async function fetchBanner(scope = 'svelte.dev', fetch) {
		if (scope === 'svelte.dev') return fetch('/banner.json').then((r) => r.json());

		const req = await fetch('https://svelte.dev/banner.json');
		if (!req.ok) {
			console.warn('There was an error fetching the banner data. Check svelte.dev/banner.json');
			return [];
		}

		return /** @type {import('./Banner.svelte').BannerData} */ (await req.json()).filter(
			(banner) => !banner.scope || banner.scope?.includes(scope)
		);
	}
</script>

<script>
	import Banner from './Banner.svelte';

	/** @type {import('./Banner.svelte').BannerData} */
	export let data;
</script>

{#each data as { content, href, id, start, arrow, end }}
	<Banner {id} start={new Date(start)} end={end ? new Date(end) : undefined} {arrow} {href}>
		{@html content}
	</Banner>
{/each}
