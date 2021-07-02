<script>
	import ParallaxLogo from './ParallaxLogo.svelte';

	export let title;
	export let tagline;
	export let logotype;
	export let outline;
</script>

<style>
	.hero {
		position: relative;
		margin: 10rem auto;
		padding: 0 var(--side-nav);
		max-width: 120rem;
	}

	p { color: var(--text) }

	.hero {
		margin: 10rem auto;
	}

	.hero p, .logotype {
		position: relative;
		left: 1.6rem;
	}

	.hero p {
		font-size: 2rem;
	}

	.logotype {
		height: 4rem;
	}

	@media (min-width: 640px) {
		.logotype {
			height: 6rem;
		}

		.hero p {
			font-size: var(--h3);
		}
	}

	@media (min-width: 800px) {
		.hero {
			margin: 15rem auto;
		}

		.hero p, .logotype {
			left: 3rem;
		}
	}
</style>

<ParallaxLogo alt="{title} logo" src={outline}/>

<section class="hero">
	<img alt="{title} logotype" class="logotype" src={logotype}>
	<p>{tagline}</p>
</section>