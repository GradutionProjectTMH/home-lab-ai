import { ROLE, USER_STATUS } from "../enums/user.enum";
import { IAddress } from "./address.interface";

export interface IUser {
	firstName: string;
	lastName: string;
	email: string;
	signupType: string;
	idToken: string;
	password: string;
	avatar: string;
	role: ROLE;
	status: USER_STATUS;
	address: IAddress;
}
