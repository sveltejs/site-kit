import { Marked } from 'marked';

const escapeTest = /[&<>"']/;
const escapeReplace = /[&<>"']/g;
const escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
const escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
const escapeReplacements = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;'
};

/**
 * @param {string} ch
 */
const getEscapeReplacement = (ch) =>
	escapeReplacements[/** @type {keyof typeof escapeReplacements} */ (ch)];

export const SHIKI_LANGUAGE_MAP = {
	bash: 'bash',
	env: 'bash',
	html: 'svelte',
	svelte: 'svelte',
	sv: 'svelte',
	js: 'javascript',
	dts: 'typescript',
	css: 'css',
	diff: 'diff',
	ts: 'typescript',
	'': ''
};

/**
 * @param {string} html
 * @param {boolean} encode
 */
export function escape(html, encode = false) {
	if (encode) {
		if (escapeTest.test(html)) {
			return html.replace(escapeReplace, getEscapeReplacement);
		}
	} else {
		if (escapeTestNoEncode.test(html)) {
			return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
		}
	}

	return html;
}

/** @param {string} title */
export function slugify(title) {
	return title
		.toLowerCase()
		.replace(/&#39;/g, '')
		.replace(/&lt;/g, '')
		.replace(/&gt;/g, '')
		.replace(/[^a-z0-9-$]/g, '-')
		.replace(/-{2,}/g, '-')
		.replace(/^-/, '')
		.replace(/-$/, '');
}

/** @param {string} markdown */
export function removeMarkdown(markdown) {
	return markdown
		.replace(/\*\*(.+?)\*\*/g, '$1') // bold
		.replace(/_(.+?)_/g, '$1') // Italics
		.replace(/\*(.+?)\*/g, '$1') // Italics
		.replace(/`(.+?)`/g, '$1') // Inline code
		.replace(/~~(.+?)~~/g, '$1') // Strikethrough
		.replace(/\[(.+?)\]\(.+?\)/g, '$1') // Link
		.replace(/\n/g, ' ') // New line
		.replace(/ {2,}/g, ' ')
		.trim();
}

/** @param {string} html */
export function removeHTMLEntities(html) {
	return html.replace(/&.+?;/g, '');
}

/** @param {string} str */
export const normalizeSlugify = (str) => {
	return slugify(removeHTMLEntities(removeMarkdown(str))).replace(/(<([^>]+)>)/gi, '');
};

/** @type {Partial<import('marked').Renderer>} */
const default_renderer = {
	code(code, infostring, escaped) {
		const lang = infostring?.match(/\S*/)?.[0];

		code = code.replace(/\n$/, '') + '\n';

		if (!lang) {
			return '<pre><code>' + (escaped ? code : escape(code, true)) + '</code></pre>\n';
		}

		return (
			'<pre><code class="language-' +
			escape(lang, true) +
			'">' +
			(escaped ? code : escape(code, true)) +
			'</code></pre>\n'
		);
	},

	blockquote(quote) {
		return '<blockquote>\n' + quote + '</blockquote>\n';
	},

	html(html) {
		return html;
	},

	heading(text, level) {
		return '<h' + level + '>' + text + '</h' + level + '>\n';
	},

	hr() {
		return '<hr>\n';
	},

	list(body, ordered, start) {
		const type = ordered ? 'ol' : 'ul',
			startatt = ordered && start !== 1 ? ' start="' + start + '"' : '';
		return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
	},

	listitem(text) {
		return '<li>' + text + '</li>\n';
	},

	checkbox(checked) {
		return '<input ' + (checked ? 'checked="" ' : '') + 'disabled="" type="checkbox"' + '' + '> ';
	},

	paragraph(text) {
		return '<p>' + text + '</p>\n';
	},

	table(header, body) {
		if (body) body = '<tbody>' + body + '</tbody>';

		return '<table>\n' + '<thead>\n' + header + '</thead>\n' + body + '</table>\n';
	},

	tablerow(content) {
		return '<tr>\n' + content + '</tr>\n';
	},

	tablecell(content, flags) {
		const type = flags.header ? 'th' : 'td';
		const tag = flags.align ? '<' + type + ' align="' + flags.align + '">' : '<' + type + '>';
		return tag + content + '</' + type + '>\n';
	},

	// span level renderer
	strong(text) {
		return '<strong>' + text + '</strong>';
	},

	em(text) {
		return '<em>' + text + '</em>';
	},

	codespan(text) {
		return '<code>' + text + '</code>';
	},

	br() {
		return '<br>';
	},

	del(text) {
		return '<del>' + text + '</del>';
	},

	link(href, title, text) {
		if (href === null) {
			return text;
		}
		let out = '<a href="' + escape(href) + '"';
		if (title) {
			out += ' title="' + title + '"';
		}
		out += '>' + text + '</a>';
		return out;
	},

	image(href, title, text) {
		if (href === null) {
			return text;
		}

		let out = '<img src="' + href + '" alt="' + text + '"';
		if (title) {
			out += ' title="' + title + '"';
		}
		out += '>';
		return out;
	},

	text(text) {
		return text;
	}
};

/** @type {import('marked').TokenizerObject} */
const tokenizer = {
	url(src) {
		// if `src` is a package version string, eg: adapter-auto@1.2.3
		// do not tokenize it as email
		if (/@\d+\.\d+\.\d+/.test(src)) {
			return undefined;
		}
		// else, use the default tokenizer behavior
		return false;
	}
};

/**
 * @param {string} markdown
 * @param {Partial<import('marked').Renderer>} renderer
 */
export async function transform(markdown, renderer = {}) {
	const marked = new Marked({
		renderer: {
			...default_renderer,
			...renderer
		},
		tokenizer
	});

	return (await marked.parse(markdown)) ?? '';
}

/** @param {string} markdown */
export function extract_frontmatter(markdown) {
	const match = /---\r?\n([\s\S]+?)\r?\n---/.exec(markdown);
	if (!match) return { metadata: {}, body: markdown };

	const frontmatter = match[1];
	const body = markdown.slice(match[0].length);

	/** @type {Record<string, string>} */
	const metadata = {};
	frontmatter.split('\n').forEach((pair) => {
		const i = pair.indexOf(':');
		metadata[pair.slice(0, i).trim()] = removeQuotes(pair.slice(i + 1).trim());
	});

	return { metadata, body };
}

/** @param {string} str */
const removeQuotes = (str) => str.replace(/(^["']|["']$)/g, '');
