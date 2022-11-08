import axios, { AxiosInstance } from "axios";
import { labelIndex } from "../configs/rooms.config";
import { store } from "../redux/stores/store.redux";

const env = store.getState().environment.g2p;

const api: AxiosInstance = axios.create({
	baseURL: env.API_ENDPOINT,
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
const transGraph = async (testName: string, trainName: string) => {
	return api.get("TransGraph/", {
		params: {
			userInfo: [
				testName,
				1,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				1,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				1,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
			].join(","),
			roomID: trainName,
		},
	});
};

const adjustGraph = async (
	ideaPositions: IdeaPosition[],
	ideaRelations: [IdeaPosition, IdeaPosition][],
	roomPositions: any[],
	testName: string,
	trainName: string,
) => {
	const ideaPositionsParam = ideaPositions.map(
		(ideaPosition, index) => `["${index}","${ideaPosition.roomLabel}",${ideaPosition.x},${ideaPosition.y},"1"]`,
	);
	const ideaRelationsParam = ideaRelations.map((relation) => {
		const [ideaPositionA, ideaPositionB] = relation;
		const ideaPositionIndexA: number = ideaPositions.findIndex(
			(ideaPosition) => ideaPosition.roomLabel == ideaPositionA.roomLabel,
		);
		const ideaPositionIndexB: number = ideaPositions.findIndex(
			(ideaPosition) => ideaPosition.roomLabel == ideaPositionB.roomLabel,
		);

		return `["${ideaPositionIndexA}","${ideaPositionIndexB}"]`;
	});
	const roomPositionsParam = roomPositions.map(
		([roomID, roomLabel, x, y], index) => `[${roomID},"${roomLabel}",${x},${y},${index}]`,
	);

	return api.get("AdjustGraph/", {
		params: {
			NewGraph: `[[${ideaPositionsParam.join(",")}],[${ideaRelationsParam.join(",")}],[${roomPositionsParam.join(
				",",
			)}]]`,
			userRoomID: testName,
			adptRoomID: trainName,
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
	return `${env.IMAGE_ENDPOINT}snapshot_train/${trainName}`;
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
	transGraph,
};

export default G2P;
