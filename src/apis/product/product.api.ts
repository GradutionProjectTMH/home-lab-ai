import axiosHomeLiv from "../../configs/homeliv-server.config";

export const getProductsApi = async (data: GetProductsReq): Promise<GetProductsRes> => {
	return axiosHomeLiv.get<GetProductsReq, GetProductsRes>(`product`, {
		params: data,
	});
};

export const getCategoriesApi = async (): Promise<GetCategoriesRes> => {
	return axiosHomeLiv.get<undefined, GetCategoriesRes>(`category`);
};
