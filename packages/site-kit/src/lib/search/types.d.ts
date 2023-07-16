export interface Block {
	breadcrumbs: string[];
	href: string;
	content: string;
	rank: number;
}

export interface SearchAppropriateBlock {
	content: string;
	h1: string;
	h2?: string;
	h3?: string;
	href: string;
	priority: number;
}

export interface Tree {
	breadcrumbs: string[];
	href: string;
	node: Partial<Block>;
	children: Tree[];
}
