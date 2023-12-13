import lang_css from 'shikiji/langs/css.mjs';
import lang_diff from 'shikiji/langs/diff.mjs';
import lang_html from 'shikiji/langs/html.mjs';
import lang_javascript from 'shikiji/langs/javascript.mjs';
import lang_json from 'shikiji/langs/json.mjs';
import lang_markdown from 'shikiji/langs/markdown.mjs';
import lang_svelte from 'shikiji/langs/svelte.mjs';
import lang_typescript from 'shikiji/langs/typescript.mjs';
import lang_yaml from 'shikiji/langs/yaml.mjs';
import shiki_nord from 'shikiji/themes/github-dark.mjs';
import { getWasmInlined } from 'shikiji/wasm';

import { rendererRich, transformerTwoSlash } from 'shikiji-twoslash';
import { getHighlighterCore } from 'shikiji/core';
import ts from 'typescript';

const shiki = await getHighlighterCore({
	themes: [shiki_nord],
	langs: [
		lang_javascript,
		lang_svelte,
		lang_typescript,
		lang_diff,
		lang_json,
		lang_yaml,
		lang_markdown,
		lang_html,
		lang_css
	],
	loadWasm: getWasmInlined
});

/**
 * @param {string} code
 * @param {string} lang
 */
export function highlight(code, lang) {
	return shiki.codeToHtml(code, {
		lang,
		themes: { light: 'github-dark' },
		theme: 'css-variables',
		transformers: [
			transformerTwoSlash({
				renderer: rendererRich,
				twoslashOptions: {
					defaultCompilerOptions: {
						allowJs: true,
						checkJs: true,
						target: ts.ScriptTarget.ES2022,
						types: ['svelte', '@sveltejs/kit']
					}
				}
			})
		]
	});
}
