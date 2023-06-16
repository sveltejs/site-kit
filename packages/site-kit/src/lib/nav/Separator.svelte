<!-- @component
Simple separator component for use within `Nav`
-->

<script>
	export let vertical = false;
</script>

<hr class:vertical />

<style>
	hr {
		border: none;
	}

	hr:not(.vertical) {
		display: block;
		position: relative;
		height: 1px;
		margin: 0.5rem 0;
		background: var(--sk-back-translucent);
	}

	hr.vertical {
		display: flex;
		align-items: center;
		height: 100%;
	}

	hr.vertical::before {
		content: '•';
		margin: 0 0.3rem;
		color: #ccc;
	}
</style>
