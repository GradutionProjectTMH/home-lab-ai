import { AxiosResponse } from "axios";
import { IResponseWithData } from "../interfaces/response.interface";

export const baseApi = <T>(response: AxiosResponse<IResponseWithData<T>, any>): T => {
	const result = response as any as IResponseWithData<T>;

	if (!result["success"]) {
		throw new Error(result["message"]);
	}

	return result.data;
};
