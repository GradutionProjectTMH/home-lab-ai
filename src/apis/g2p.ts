import axios, { AxiosInstance } from "axios";

const env = {
	endpoint: process.env.G2P_ENDPOINT,
};

const api: AxiosInstance = axios.create({
	baseURL: env.endpoint,
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

const adjustGraph = async () => {
	return api.get("AdjustGraph/", {
		params: {
			NewGraph: `[[["0","Kitchen",82,81.5,"1"],["1","Balcony",82.5,179.5,"1"],["2","Bathroom",175,71.5,"1"],["4","SecondRoom",128,81.5,"1"],["3","MasterRoom",145.9296875,178.21875,"1"],["6","ChildRoom",175.4296875,179.71875,"1"],["5","LivingRoom",129,122,"1"]],[["0","5"],["0","4"],["1","3"],["1","5"],["2","5"],["2","4"],["3","5"],["4","5"],["6","3"],["6","5"]],[[2,"Kitchen",82,81.5,0],[9,"Balcony",82.5,179.5,1],[3,"Bathroom",175,71.5,2],[1,"MasterRoom",142,179.5,3],[7,"SecondRoom",128,81.5,4],[0,"LivingRoom",129,122,5]]]`,
			userRoomID: "444.png",
			adptRoomID: "76647.png",
		},
	});
};

const G2P = {
	adjustGraph,
};

export default G2P;
