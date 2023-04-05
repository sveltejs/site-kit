<div class="terminal">
	<div class="chrome">
		<span class="red dot" />
		<span class="yellow dot" />
		<span class="green dot" />
		<span class="title">terminal</span>
	</div>
	<pre><code
			><span class="line"
				>npm create <span class="orange-highlight">svelte</span>@latest my-app</span
			>
<span class="line">cd my-app</span>
<span class="line">npm install</span>
<span class="line">npm run dev -- --open</span></code
		></pre>
</div>

<style>
	.terminal {
		background: rgba(0, 0, 0, 0.7);
		margin: 0;
		border-radius: var(--sk-border-radius);
		overflow: hidden;
	}

	.terminal .chrome {
		position: relative;
		background: var(--sk-back-3);
		color: var(--sk-text-3);
		display: flex;
		align-items: center;
		font-size: var(--sk-text-s);
		padding: 1rem;
		gap: 1rem;
	}

	.terminal .dot {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
	}

	.red {
		background-color: hsl(15, 100%, 65%);
	}

	.yellow {
		background-color: hsl(48, 100%, 67%);
	}

	.green {
		background-color: hsl(141, 53%, 53%);
	}

	.title {
		position: absolute;
		display: flex;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
	}

	.terminal pre {
		padding: 1em;
		font-size: var(--sk-text-xs);
	}

	.line::before {
		content: '$ ';
		opacity: 0.3;
	}

	pre code {
		color: white;
		font-size: 1em;
	}

	.orange-highlight {
		color: hsl(15, 100%, 65%);
	}

	@media (min-width: 440px) {
		.terminal pre {
			font-size: var(--sk-text-s);
		}
	}

	@media (min-width: 1080px) {
		.terminal pre {
			font-size: var(--sk-text-m);
		}
	}
</style>
