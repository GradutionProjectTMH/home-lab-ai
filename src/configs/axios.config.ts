import axios from "axios";
import queryString from "query-string";
import appConfig from "./env.config";
const token = localStorage.getItem("token");

const axiosClient = axios.create({
	baseURL: appConfig.server.BASE_URL,
	headers: {
		"Content-Type": "application/json",
		Authorization: token ? `Bearer ${token}` : "",
	},
	paramsSerializer: {
		encode: (params) => queryString.stringify(params),
	},
});

axiosClient.interceptors.request.use(
	function (config) {
		// Do something before request is sent
		return config;
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error);
	},
);

axiosClient.interceptors.response.use(
	function (response) {
		if (response && response.data) {
			return response.data;
		}
		return response;
	},
	function (error) {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		return Promise.reject(error);
	},
);

export default axiosClient;
