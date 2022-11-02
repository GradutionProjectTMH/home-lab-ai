import axios, { AxiosInstance } from "axios";

const env = {
	endpoint: process.env.GATSBY_TEXT_RAZOR_ENDPOINT,
	api_key: process.env.GATSBY_TEXT_RAZOR_API_KEY,
};

const api: AxiosInstance = axios.create({
	baseURL: env.endpoint,
	headers: {
		"x-requested-with": "*",
		"permit-by-nabatti99": "true",
		"X-TextRazor-Key": env.api_key,
		"Content-Type": "application/x-www-form-urlencoded",
	},
});

api.interceptors.request.use(
	(config) => {
		console.log(config);
		return config;
	},
	(error) => {
		console.error(error);
		return Promise.reject(error);
	},
);

api.interceptors.response.use(
	(response) => {
		console.log(response);
		return response;
	},
	(error) => {
		console.error(error);
		return Promise.reject(error);
	},
);

const extract = async (text: string, extractors: string[]) => {
	const params = new URLSearchParams();
	params.append("text", text);
	params.append("extractors", extractors.join(","));

	return api.post("/", params);
};

const TextRazor = {
	extract,
};

export default TextRazor;
