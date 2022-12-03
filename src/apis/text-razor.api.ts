import axiosClient from "../configs/server.config";

const extract = async (text: string, extractors: string[]) => {
	return (await axiosClient.post<any, any>(`text-razor`, { text, extractors })).response;
};

const TextRazor = {
	extract,
};

export default TextRazor;
