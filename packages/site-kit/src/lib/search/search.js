import { create, insertMultiple, search as orama_search } from '@orama/orama';

/** If the search is already initialized */
export let inited = false;

/** @type {import('@orama/orama').Orama} */
let index;

/** @type {Map<string, import('./types').Block>} */
const map = new Map();

/** @type {Map<string, string>} */
const hrefs = new Map();

/** @type {import('./types').SearchAppropriateBlock[]} */
const search_appropriate_blocks = [];

/**
 * Initialize the search index
 * @param {import('./types').Block[]} blocks
 * @param {Record<string, number>} priority_map
 */
export async function init(blocks, priority_map) {
	if (inited) return;

	for (const { breadcrumbs, href, content } of blocks) {
		const new_block = /** @type {import('./types').SearchAppropriateBlock} */ ({});

		if (breadcrumbs.length >= 1 && breadcrumbs[0]) {
			new_block.h1 = breadcrumbs[0];
		}
		if (breadcrumbs.length >= 2 && breadcrumbs[1]) {
			new_block.h2 = breadcrumbs[1];
		}
		if (breadcrumbs.length >= 3 && breadcrumbs[2]) {
			new_block.h3 = breadcrumbs[2];
		}

		// Add priorities
		for (const [regex_str, priority] of Object.entries(priority_map)) {
			const regex = new RegExp(regex_str);
			if (regex.test(href)) {
				new_block.priority = priority;
				break;
			}
		}

		new_block.href = href;
		new_block.content = content;

		search_appropriate_blocks.push(new_block);
	}

	index = await create({
		schema: {
			content: 'string',
			h1: 'string',
			h2: 'string',
			h3: 'string',
			priority: 'number'
		},
		components: {
			tokenizer: { language: 'english', stemming: false }
		},
		sort: { enabled: false }
	});

	// @ts-ignore Block[] is the right type
	await insertMultiple(index, search_appropriate_blocks);

	console.log(search_appropriate_blocks);

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
	const search_results = (
		await orama_search(index, {
			term: query,
			sortBy: (a, b) => {
				const [_docIdA, scoreA, docA] = a;
				const [_docIdB, scoreB, docB] = b;

				// @ts-ignore
				return docB.priority * 1000 + scoreB - (docA.priority * 1000 + scoreA);
			},
			boost: {
				h1: 3,
				h2: 2,
				h3: 1
			},

			limit: search_appropriate_blocks.length
		})
	).hits.map(({ document }) => document);

	/** @type {import('./types').SearchAppropriateBlock[]} */
	const blocks = [];

	for (const result of search_results) {
		// @ts-ignore
		const block = /** @type {import('./types').SearchAppropriateBlock} */ (result);

		blocks.push(block);
	}

	const results = /** @type {import('./types').Tree[]} */ (convertToTrees(blocks));

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
 * @param {import('./types').SearchAppropriateBlock[]} blocks
 * @returns {import('./types').Tree | null}
 */
function createTree(breadcrumbs, blocks) {
	const depth = breadcrumbs.length;

	const node = blocks.find((block) => {
		let { h1, h2, h3 } = block;
		/** @type {(string|undefined)[]} */
		let blockBreadcrumbs = [];
		if (h3) blockBreadcrumbs = [h1, h2, h3];
		else if (h2) blockBreadcrumbs = [h1, h2];
		else if (h1) blockBreadcrumbs = [h1];

		if (blockBreadcrumbs.length !== depth) return false;
		return breadcrumbs.every((part, i) => blockBreadcrumbs[i] === part);
	});

	if (!node) return null;

	const descendants = blocks.filter((block) => {
		let { h1, h2, h3 } = block;
		/** @type {(string)[]} */
		let blockBreadcrumbs = [];
		if (h3) blockBreadcrumbs = /** @type {string[]} */ ([h1, h2, h3].filter(Boolean));
		else if (h2) blockBreadcrumbs = [h1, h2];
		else if (h1) blockBreadcrumbs = [h1];

		if (blockBreadcrumbs.length <= depth) return false;
		return breadcrumbs.every((part, i) => blockBreadcrumbs[i] === part);
	});

	const childParts = Array.from(
		new Set(
			descendants.map((block) => {
				let { h1, h2, h3 } = block;
				return h3 || h2 || h1;
			})
		)
	);

	return {
		breadcrumbs,
		href: node ? node.href : '',
		node: {
			content: node?.content
		},
		children: /** @type {import('./types').Tree[]} */ (
			childParts.map((part) => createTree([...breadcrumbs, part], descendants)).filter(Boolean)
		)
	};
}

/**
 *
 * @param {import('./types').SearchAppropriateBlock[]} blocks
 * @returns {(import('./types').Tree | null)[]}
 */
function convertToTrees(blocks) {
	let topHeaders = Array.from(new Set(blocks.map((block) => block.h1).filter(Boolean)));
	return topHeaders.map((header) => createTree([header], blocks)).filter(Boolean);
}
