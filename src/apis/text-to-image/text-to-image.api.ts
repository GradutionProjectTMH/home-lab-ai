import axiosHomeLab from "../../configs/homelab-server.config";

export const postTextToImageApi = async (data: TextToImageReq): Promise<TextToImageRes> => {
	return axiosHomeLab.post<TextToImageReq, TextToImageRes>(`text-to-image`, { width: "1000", height: "800", ...data });
};
