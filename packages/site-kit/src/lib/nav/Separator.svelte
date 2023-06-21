<!-- @component
Simple separator component for use within `Nav`
-->

<hr />

<style>
	hr {
		border: none;
	}

	hr {
		display: flex;
		align-items: center;
		height: 100%;
	}

	hr::before {
		content: '•';
		margin: 0 0.3rem;
		color: #ccc;
	}

	@media (max-width: 832px) {
		hr {
			display: block;
			position: relative;
			height: 1px;
			margin: 0.5rem 0;
			background: var(--sk-back-translucent);
		}
	}
</style>
