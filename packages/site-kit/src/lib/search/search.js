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

		if (breadcrumbs.length >= 1 && breadcrumbs?.[0]) {
			new_block.h1 = breadcrumbs[0];
		}
		if (breadcrumbs.length >= 2 && breadcrumbs?.[1]) {
			new_block.h2 = breadcrumbs[1];
		}
		if (breadcrumbs.length >= 3 && breadcrumbs?.[2]) {
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
			tokenizer: { language: 'english', stemming: true }
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
	const search_results = /** @type {any[]} */ (
		(
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
		).hits.map(({ document }) => document)
	);

	/** @type {import('./types').SearchAppropriateBlock[]} */
	const blocks = [];

	for (const result of search_results) {
		// @ts-ignore
		const block = /** @type {import('./types').SearchAppropriateBlock} */ (result);

		blocks.push(block);
	}

	// console.log(search_results);
	// console.log(results);

	console.log(buildBlockTree(blocks));

	return buildBlockTree(blocks);
}

/**
 * Get a block with details by its href
 * @param {string} href
 */
export function lookup(href) {
	return map.get(href);
}

/**
 * @param {SearchAppropriateBlock[]} blocks
 * @returns {Tree[]}
 */
function buildBlockTree(blocks) {
	// Group blocks by h1
	const groupedByH1 = blocks.reduce((acc, block) => {
		if (block.h1) {
			acc[block.h1] = acc[block.h1] || [];
			acc[block.h1].push(block);
		}
		return acc;
	}, {});

	// Create trees
	return Object.entries(groupedByH1).map(([h1, group]) => {
		// Create a node for h1
		const h1Node = group.find((block) => !block.h2) || { ...group[0], content: '' };

		// Group h2s under h1
		const groupedByH2 = group.reduce((acc, block) => {
			if (block.h2) {
				acc[block.h2] = acc[block.h2] || [];
				acc[block.h2].push(block);
			}
			return acc;
		}, {});

		// Create children for h1 node
		const children = Object.entries(groupedByH2).map(([h2, group]) => {
			// Create a node for h2
			const h2Node = group.find((block) => !block.h3) || { ...group[0], content: '' };

			// h3 blocks under h2
			const h3Children = group
				.filter((block) => block.h3)
				.map((block) => ({
					breadcrumbs: [h1, h2, block.h3],
					href: block.href,
					node: { header: block.h3, content: block.content },
					children: []
				}));

			return {
				breadcrumbs: [h1, h2],
				href: h2Node.href,
				node: { header: h2, content: h2Node.content },
				children: h3Children
			};
		});

		return {
			breadcrumbs: [h1],
			href: h1Node.href,
			node: { header: h1, content: h1Node.content },
			children
		};
	});
}
