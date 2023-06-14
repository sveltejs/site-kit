export interface Section {
	title: string;
	sections: {
		title: string;
		path: string;
		badge?: string;
	}[];
}

export type Menu = Record<string, Section[]>;
