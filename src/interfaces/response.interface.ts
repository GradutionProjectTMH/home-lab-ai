export interface IResponseWithData<T> {
	message: string;
	success: boolean;
	data: T;
}

export interface IResponse<T> {
	message: string;
	success: boolean;
}
