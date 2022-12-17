import { ROLE, USER_STATUS } from "../enums/user.enum";

type User = {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	signupType: string;
	idToken: string;
	password: string;
	avatar: string;
	role: ROLE;
	status: USER_STATUS;
	wallet: string;
	address: {
		code: string;
		state: string;
		country: string;
		city: string;
		district: string;
		street: string;
		detail: string;
	};
	profile?: {
		experience?: string;
		projects?: [
			{
				tool: {
					name: string;
					logo: string;
				};
				url: string;
			},
		];
	};
};

type UserLogin = User & {
	token?: string;
};

type ResponseAllData<T> = {
	currentPage: number;
	data: T[];
	totalPage: number;
};
