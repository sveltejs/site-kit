import lang_css from 'shikiji/langs/css.mjs';
import lang_diff from 'shikiji/langs/diff.mjs';
import lang_html from 'shikiji/langs/html.mjs';
import lang_javascript from 'shikiji/langs/javascript.mjs';
import lang_json from 'shikiji/langs/json.mjs';
import lang_markdown from 'shikiji/langs/markdown.mjs';
import lang_svelte from 'shikiji/langs/svelte.mjs';
import lang_typescript from 'shikiji/langs/typescript.mjs';
import lang_yaml from 'shikiji/langs/yaml.mjs';
import { getWasmInlined } from 'shikiji/wasm';
import lang_bash from 'shikiji/langs/shellscript.mjs';

import { createCssVariablesTheme } from 'shikiji';
import { rendererClassic, rendererRich, transformerTwoSlash } from 'shikiji-twoslash';
import { getHighlighterCore } from 'shikiji/core';
import 'shiki-twoslash/dist/index';
import ts from 'typescript';

const svelte_theme = createCssVariablesTheme({
	name: 'css-variables',
	variablePrefix: '--shiki-',
	variableDefaults: {},
	fontStyle: true
});

const shiki = await getHighlighterCore({
	themes: [svelte_theme],
	langs: [
		lang_javascript,
		lang_svelte,
		lang_typescript,
		lang_diff,
		lang_json,
		lang_yaml,
		lang_markdown,
		lang_html,
		lang_css,
		lang_bash
	],
	loadWasm: getWasmInlined
});

/**
 * @param {string} code
 * @param {string} lang
 * @param {boolean} twoslash
 */
export function highlight(code, lang, twoslash = false) {
	return shiki.codeToHtml(code, {
		lang,
		themes: { light: 'css-variables' },
		theme: 'css-variables',
		transformers: [
			transformerTwoSlash({
				renderer: rendererClassic(),
				filter: () => twoslash,
				twoslashOptions: {
					defaultCompilerOptions: {
						allowJs: true,
						checkJs: true,
						target: ts.ScriptTarget.ES2022,
						types: ['svelte', '@sveltejs/kit', '@types/node']
					}
				}
			})
		]
	});
}
