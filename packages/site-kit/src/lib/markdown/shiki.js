import { rendererClassic, transformerTwoslash } from '@shikijs/twoslash';
import { createCssVariablesTheme, getWasmInlined } from 'shiki';
import { getHighlighterCore } from 'shiki/core';
import css from 'shiki/langs/css.mjs';
import diff from 'shiki/langs/diff.mjs';
import html from 'shiki/langs/html.mjs';
import javascript from 'shiki/langs/javascript.mjs';
import json from 'shiki/langs/json.mjs';
import markdown from 'shiki/langs/markdown.mjs';
import bash from 'shiki/langs/shellscript.mjs';
import svelte from 'shiki/langs/svelte.mjs';
import typescript from 'shiki/langs/typescript.mjs';
import yaml from 'shiki/langs/yaml.mjs';
import ts from 'typescript';

const svelte_theme = createCssVariablesTheme({
	name: 'css-variables',
	variablePrefix: '--shiki-',
	variableDefaults: {},
	fontStyle: true
});

const shiki = await getHighlighterCore({
	themes: [svelte_theme],
	langs: [javascript, svelte, typescript, diff, json, yaml, markdown, html, css, bash],
	loadWasm: getWasmInlined,
	langAlias: {
		sh: 'bash'
	}
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
			transformerTwoslash({
				renderer: rendererClassic(),
				filter: () => twoslash,
				// onTwoslashError: (error, code, lang) => {
				// 	console.error('Shiki twoslash error: ', { lang, code, error });
				// },
				// onShikiError: (error, code, lang) => {
				// 	console.error('Shiki error: ', { lang, code, error });
				// },
				twoslashOptions: {
					compilerOptions: {
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
