import axios from "axios";
// const token = window?.localStorage.getItem("token");
import { serverConfig } from "./environment";

const axiosHomeLiv = axios.create({
	baseURL: serverConfig.HOMELIV_API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

axiosHomeLiv.interceptors.request.use(
	function (config) {
		return config;
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error);
	},
);

axiosHomeLiv.interceptors.response.use(
	function (response) {
		const data = response.data;
		if (data?.statusCode !== 200) return Promise.reject("Có lỗi xảy ra");
		return data.data;
	},
	function (error) {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		return Promise.reject(error);
	},
);

export default axiosHomeLiv;
