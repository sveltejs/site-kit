interface Section {
	title: string;
	sections: {
		title: string;
		path: string;
		badge?: string;
	}[];
}

export interface NavigationLink {
	title: string;
	prefix: string;
	pathname: string;
	sections?: Section[];
}
