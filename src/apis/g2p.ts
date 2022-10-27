import axios, { AxiosInstance } from "axios";
import qs from "query-string";
import { labelIndex } from "../configs/rooms.config";

const env = {
	api_endpoint: process.env.G2P_API_ENDPOINT,
	image_endpoint: process.env.G2P_IMAGE_ENDPOINT,
};

const api: AxiosInstance = axios.create({
	baseURL: env.api_endpoint,
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

const adjustGraph = async (ideaPositions: IdeaPosition[], ideaRelations: [IdeaPosition, IdeaPosition][]) => {
	const positionsParam = ideaPositions.map(
		(ideaPosition, index) => `["${index}","${ideaPosition.roomLabel}",${ideaPosition.x},${ideaPosition.y},"1"]`,
	);
	const relationsParam = ideaRelations.map((relation) => {
		const [ideaPositionA, ideaPositionB] = relation;
		const ideaPositionIndexA: number = ideaPositions.findIndex(
			(ideaPosition) => ideaPosition.roomLabel == ideaPositionA.roomLabel,
		);
		const ideaPositionIndexB: number = ideaPositions.findIndex(
			(ideaPosition) => ideaPosition.roomLabel == ideaPositionB.roomLabel,
		);

		return `["${ideaPositionIndexA}","${ideaPositionIndexB}"]`;
	});
	const indexesParam = ideaPositions.map(
		(ideaPosition, index) =>
			`[${labelIndex[ideaPosition.roomLabel]},"${ideaPosition.roomLabel}",${ideaPosition.x},${
				ideaPosition.y
			},${index}]`,
	);

	return api.get("AdjustGraph/", {
		params: {
			NewGraph: `[[${positionsParam.join(",")}],[${relationsParam.join(",")}],[${indexesParam.join(",")}]]`,
			userRoomID: "444.png",
			adptRoomID: "76647.png",
		},
	});
};

const loadTestBoundary = async (testName: string) => {
	return api.get("LoadTestBoundary", {
		params: {
			testName,
		},
	});
};

const numSearch = async (testName: string) => {
	return api.get("NumSearch/", {
		params: {
			userInfo: `["${testName}",[${[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}],[${[
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			]}],[${[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}]]`,
		},
	});
};

const getImageUrl = (trainName: string) => {
	return `${env.image_endpoint}snapshot_train/${trainName}`;
};

const loadTrainHouse = async (roomID: string) => {
	return api.get("LoadTrainHouse/", {
		params: {
			roomID,
		},
	});
};

const G2P = {
	adjustGraph,
	loadTestBoundary,
	numSearch,
	getImageUrl,
	loadTrainHouse,
};

export default G2P;
