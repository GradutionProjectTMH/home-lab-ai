import axiosHomeLab from "../configs/homelab-server.config";

const uploadFile = async (file: File): Promise<string[]> => {
	const formData = new FormData();
	formData.append("files", file, file.name);
	return axiosHomeLab.post<string, string[]>(`uploads`, formData);
};

export { uploadFile };
