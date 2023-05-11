import axios from "axios";
// const token = window?.localStorage.getItem("token");
import { serverConfig } from "./environment";

const axiosHomeLab = axios.create({
	baseURL: serverConfig.HOMELAB_API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

axiosHomeLab.interceptors.request.use(
	function (config) {
		return config;
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error);
	},
);

axiosHomeLab.interceptors.response.use(
	function (response) {
		return response.data;
	},
	function (error) {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		return Promise.reject(error);
	},
);

export default axiosHomeLab;
