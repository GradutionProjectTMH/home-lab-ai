import axios from "axios";
// const token = window?.localStorage.getItem("token");
import { store } from "../redux/stores/store.redux";

const env = store.getState().environment.server;

const token = localStorage.getItem("token");
const axiosClient = axios.create({
	baseURL: process.env.REACT_APP_API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
		Authorization: token ? `Bearer ${token}` : "",
	},
	// paramsSerializer: {
	// 	encode: (params) => queryString.stringify(params),
	// },
});

axiosClient.interceptors.request.use(
	function (config) {
		const token = localStorage.getItem("token");
		config.headers = {
			Authorization: token ? `Bearer ${token}` : "",
		};

		return config;
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error);
	},
);

type ServerResponse<T> = {
	message: string;
	success: boolean;
	data?: T;
};

axiosClient.interceptors.response.use(
	function (response) {
		const result = response.data as ServerResponse<any>;

		if (result.success) {
			return result.data;
		}

		return Promise.reject(result.message);
	},
	function (error) {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		return Promise.reject(error);
	},
);

export default axiosClient;
