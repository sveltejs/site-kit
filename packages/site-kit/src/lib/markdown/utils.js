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
const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;

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

/** @param {string} html */
export function unescape(html) {
  // explicitly match decimal, hex, and named HTML entities
  return html.replace(unescapeTest, (_, n) => {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
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

/** @param {string} href */
function cleanUrl(href) {
  try {
    href = encodeURI(href).replace(/%25/g, '%');
  } catch (e) {
    return null;
  }
  return href;
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

  space() {
    return '';
  },

  code({ text, lang, escaped }) {
    const langString = (lang || '').match(/^\S*/)?.[0];

    const code = text.replace(/\n$/, '') + '\n';

    if (!langString) {
      return '<pre><code>'
        + (escaped ? code : escape(code, true))
        + '</code></pre>\n';
    }

    return '<pre><code class="language-'
      + escape(langString)
      + '">'
      + (escaped ? code : escape(code, true))
      + '</code></pre>\n';
  },

  blockquote({ tokens }) {
    const body = this.parser?.parse(tokens);
    return `<blockquote>\n${body}</blockquote>\n`;
  },

  html({ text }) {
    return text;
  },

  heading({ tokens, depth }) {
    return `<h${depth}>${this.parser?.parseInline(tokens)}</h${depth}>\n`;
  },

  hr(token) {
    return '<hr>\n';
  },

  list(token) {
    const ordered = token.ordered;
    const start = token.start;

    let body = '';
    for (let j = 0; j < token.items.length; j++) {
      const item = token.items[j];
      body += this.listitem?.(item);
    }

    const type = ordered ? 'ol' : 'ul';
    const startAttr = (ordered && start !== 1) ? (' start="' + start + '"') : '';
    return '<' + type + startAttr + '>\n' + body + '</' + type + '>\n';
  },

  listitem(item) {
    let itemBody = '';
    if (item.task) {
      const checkbox = this.checkbox?.({ checked: !!item.checked });
      if (item.loose) {
        if (item.tokens.length > 0 && item.tokens[0].type === 'paragraph') {
          item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;
          if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === 'text') {
            item.tokens[0].tokens[0].text = checkbox + ' ' + item.tokens[0].tokens[0].text;
          }
        } else {
          item.tokens.unshift({
            type: 'text',
            raw: checkbox + ' ',
            text: checkbox + ' '
          });
        }
      } else {
        itemBody += checkbox + ' ';
      }
    }

    itemBody += this.parser?.parse(item.tokens, !!item.loose);

    return `<li>${itemBody}</li>\n`;
  },

  checkbox({ checked }) {
    return '<input '
      + (checked ? 'checked="" ' : '')
      + 'disabled="" type="checkbox">';
  },

  paragraph({ tokens }) {
    return `<p>${this.parser?.parseInline(tokens)}</p>\n`;
  },

  table(token) {
    let header = '';

    // header
    let cell = '';
    for (let j = 0; j < token.header.length; j++) {
      cell += this.tablecell?.(token.header[j]);
    }
    header += this.tablerow?.({ text: cell });

    let body = '';
    for (let j = 0; j < token.rows.length; j++) {
      const row = token.rows[j];

      cell = '';
      for (let k = 0; k < row.length; k++) {
        cell += this.tablecell?.(row[k]);
      }

      body += this.tablerow?.({ text: cell });
    }
    if (body) body = `<tbody>${body}</tbody>`;

    return '<table>\n'
      + '<thead>\n'
      + header
      + '</thead>\n'
      + body
      + '</table>\n';
  },

  tablerow({ text }) {
    return `<tr>\n${text}</tr>\n`;
  },

  tablecell(token) {
    const content = this.parser?.parseInline(token.tokens);
    const type = token.header ? 'th' : 'td';
    const tag = token.align
      ? `<${type} align="${token.align}">`
      : `<${type}>`;
    return tag + content + `</${type}>\n`;
  },

  /**
   * span level renderer
   */
  strong({ tokens }) {
    return `<strong>${this.parser?.parseInline(tokens)}</strong>`;
  },

  em({ tokens }) {
    return `<em>${this.parser?.parseInline(tokens)}</em>`;
  },

  codespan({ text }) {
    return `<code>${text}</code>`;
  },

  br(token) {
    return '<br>';
  },

  del({ tokens }) {
    return `<del>${this.parser?.parseInline(tokens)}</del>`;
  },

  link({ href, title, tokens }) {
    const text = this.parser?.parseInline(tokens) || '';
    const cleanHref = cleanUrl(href);
    if (cleanHref === null) {
      return text;
    }
    href = cleanHref;
    let out = '<a href="' + href + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += '>' + text + '</a>';
    return out;
  },

  image({ href, title, text }) {
    const cleanHref = cleanUrl(href);
    if (cleanHref === null) {
      return text;
    }
    href = cleanHref;

    let out = `<img src="${href}" alt="${text}"`;
    if (title) {
      out += ` title="${title}"`;
    }
    out += '>';
    return out;
  },

  text(token) {
    return 'tokens' in token && token.tokens ? this.parser?.parseInline(token.tokens) || '' : token.text;
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
