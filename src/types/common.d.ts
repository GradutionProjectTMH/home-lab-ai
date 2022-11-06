import { ROLE, USER_STATUS } from "../enums/user.enum";

type User = {
	firstName: string;
	lastName: string;
	email: string;
	signupType: string;
	idToken: string;
	password: string;
	avatar: string;
	role: ROLE;
	status: USER_STATUS;
	address: {
		code: string;
		state: string;
		country: string;
		city: string;
		district: string;
		street: string;
		detail: string;
	};
};

type UserLogin = User & {
	token?: string;
};
