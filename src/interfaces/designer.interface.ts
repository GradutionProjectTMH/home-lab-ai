import { User } from "../types/common";

export interface Designer {
	userId: string;
	user?: User;
	experience: string;
	projects: [
		{
			tool: {
				name: string;
				logo: string;
			};
			url: string;
		},
	];
}
