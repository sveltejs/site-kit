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
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import Banner, { preferences } from './Banner.svelte';

	/** @type {import('./Banner.svelte').BannerData} */
	export let data;

	const time = new Date();

	$: showing = data.filter(
		({ id, start, end }) =>
			$preferences[id] && time > new Date(start) && time < new Date(end ?? new Date(2123, 12, 1))
	);

	$: if (browser) {
		document.documentElement.style.setProperty(
			'--sk-banner-bottom-height',
			showing.length * 43 + 'px'
		);
	}

	onMount(() => {
		for (const { id } of data) {
			$preferences[id] ??= true;
		}
	});
</script>

{#each showing as { content, href, id, arrow }}
	<Banner {id} {arrow} {href}>
		{@html content}
	</Banner>
{/each}
