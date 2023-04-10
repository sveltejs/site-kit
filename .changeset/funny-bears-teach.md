---
'@sveltejs/site-kit': major
---

Dark mode toggle, dark mode styles changed as well

This is a breaking change because svelte.dev and kit.svelte.dev rely on variables changing based on `@media (prefers-color-scheme: dark)`, and the variables belonging to `:root` rather than `body`
