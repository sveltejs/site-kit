<!--@component
use an svg icon that was provided through `Icons.svelte` from
- https://github.com/jacobmischka/svelte-feather-icon
- https://feathericons.com/
-->
<script>
	/** @type {string} */
	export let name;
	/** @type {string | number} */
	export let size = 20;
</script>

<svg class="icon" width={size} height={size}>
	<use xlink:href="#{name}" />
</svg>

<style>
	.icon {
		position: relative;
		overflow: hidden;
		vertical-align: middle;
		-o-object-fit: contain;
		object-fit: contain;
		-webkit-transform-origin: center center;
		transform-origin: center center;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		fill: none;
	}
</style>
