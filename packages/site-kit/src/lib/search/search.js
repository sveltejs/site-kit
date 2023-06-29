import { create, insertMultiple, search as orama_search } from '@orama/orama';

/** If the search is already initialized */
export let inited = false;

/** @type {import('@orama/orama').Orama} */
let index;

/** @type {Map<string, import('./types').Block>} */
const map = new Map();

/** @type {Map<string, string>} */
const hrefs = new Map();

/**
 * Initialize the search index
 * @param {import('./types').Block[]} blocks
 */
export async function init(blocks) {
	if (inited) return;

	index = await create({
		schema: {
			title: 'string',
			content: 'string',
			breadcrumbs: 'string[]'
		},
		components: {
			tokenizer: { language: 'english', stemming: false }
		}
	});

	// @ts-ignore Block[] is the right type
	await insertMultiple(index, blocks);

	for (const block of blocks) {
		map.set(block.href, block);
		hrefs.set(block.breadcrumbs.join('::'), block.href);
	}

	inited = true;
}

/**
 * Search for a given query in the existing index
 * @param {string} query
 * @returns {Promise<import('./types').Tree[]>}
 */
export async function search(query) {
	const escaped = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
	const regex = new RegExp(`(^|\\b)${escaped}`, 'i');

	const search_results = (await orama_search(index, { term: query })).hits.map(
		({ document }) => document
	);

	/** @type {import('./types').Block[]} */
	const blocks = [];

	for (const result of search_results) {
		// @ts-ignore
		const block = /** @type {import('./types').Block} */ (result);

		blocks.push(block);
	}

	blocks.sort((a, b) => {
		const a_title_matches = regex.test(/** @type {string} */ (a.breadcrumbs.at(-1)));
		const b_title_matches = regex.test(/** @type {string} */ (b.breadcrumbs.at(-1)));

		// massage the order a bit, so that title matches
		// are given higher priority
		if (a_title_matches !== b_title_matches) {
			return a_title_matches ? -1 : 1;
		}

		return a.breadcrumbs.length - b.breadcrumbs.length || a.rank - b.rank;
	});

	const results = tree([], blocks).children;

	console.log(results);

	return results;
}

/**
 * Get a block with details by its href
 * @param {string} href
 */
export function lookup(href) {
	return map.get(href);
}

/**
 * @param {string[]} breadcrumbs
 * @param {import('./types').Block[]} blocks
 * @returns {import('./types').Tree}
 */
function tree(breadcrumbs, blocks) {
	const depth = breadcrumbs.length;

	const node = blocks.find((block) => {
		if (block.breadcrumbs.length !== depth) return false;
		return breadcrumbs.every((part, i) => block.breadcrumbs[i] === part);
	});

	const descendants = blocks.filter((block) => {
		if (block.breadcrumbs.length <= depth) return false;
		return breadcrumbs.every((part, i) => block.breadcrumbs[i] === part);
	});

	const child_parts = Array.from(new Set(descendants.map((block) => block.breadcrumbs[depth])));

	return {
		breadcrumbs,
		href: /** @type {string} */ (hrefs.get(breadcrumbs.join('::'))),
		node: /** @type {import('./types').Block} */ (node),
		children: child_parts.map((part) => tree([...breadcrumbs, part], descendants))
	};
}
