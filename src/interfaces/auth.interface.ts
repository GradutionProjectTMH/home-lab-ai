import { IUser } from "./user.interface";

export interface IAuthLogin extends IUser {
	token?: string;
}
