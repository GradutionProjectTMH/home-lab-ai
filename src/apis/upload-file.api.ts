import axiosClient from "../configs/server.config";

const uploadFile = async (file: File): Promise<string[]> => {
	const formData = new FormData();
	formData.append("files", file, file.name);
	return axiosClient.post<string, string[]>(`uploads`, formData);
};

export { uploadFile };
