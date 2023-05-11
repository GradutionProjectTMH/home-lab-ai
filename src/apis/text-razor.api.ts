import axiosHomeLab from "../configs/homelab-server.config";

const extract = async (text: string, extractors: string[]) => {
	return (await axiosHomeLab.post<any, any>(`text-razor`, { text, extractors })).response;
};

const TextRazor = {
	extract,
};

export default TextRazor;
