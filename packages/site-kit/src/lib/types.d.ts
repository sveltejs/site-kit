export interface NavigationLink {
	title: string;
	prefix: string;
	pathname: string;
	sections?: {
		title: string;
		sections: {
			title: string;
			sections: {
				title: string;
				path: string;
				badge?: string;
			}[];
		}[];
	}[];
}
