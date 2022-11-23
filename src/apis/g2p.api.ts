import { store } from "../redux/stores/store.redux";

const transGraph = async (testName: string, trainName: string) => {
	const api = store.getState().g2pService!;
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
		(ideaPosition) => `["${ideaPosition.index}","${ideaPosition.roomLabel}",${ideaPosition.x},${ideaPosition.y},"1"]`,
	);
	const ideaRelationsParam = ideaRelations.map(
		([ideaPositionA, ideaPositionB]) => `["${ideaPositionA.index}","${ideaPositionB.index}"]`,
	);
	const roomPositionsParam = roomPositions.map(
		([roomID, roomLabel, x, y], index) => `[${roomID},"${roomLabel}",${x},${y},${index}]`,
	);

	const api = store.getState().g2pService!;
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

const getTestNames = async (skip: number, take: number) => {
	const api = store.getState().g2pService!;
	return api.get("GetTestNames", {
		params: { skip, take },
	});
};

const loadTestBoundary = async (testName: string) => {
	const api = store.getState().g2pService!;
	return api.get("LoadTestBoundary", {
		params: {
			testName,
		},
	});
};

const numSearch = async (testName: string) => {
	const api = store.getState().g2pService!;
	return api.get("NumSearch/", {
		params: {
			userInfo: `["${testName}",[${[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}],[${[
				1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			]}],[${[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}]]`,
		},
	});
};

const getTrainImageUrl = (trainName: string) => {
	const imageEndpoint = store.getState().environment.g2p.IMAGE_ENDPOINT;
	return `${imageEndpoint}snapshot_train/${trainName}`;
};

const getBoundaryImageUrl = (name: string) => {
	const imageEndpoint = store.getState().environment.g2p.IMAGE_ENDPOINT;
	return `${imageEndpoint}Img/${name}`;
};

const loadTrainHouse = async (roomID: string) => {
	const api = store.getState().g2pService!;
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
	getTrainImageUrl,
	getBoundaryImageUrl,
	loadTrainHouse,
	transGraph,
	getTestNames,
};

export default G2P;

[
	[
		["1", "Kitchen", 184, 111.5, "1"],
		["2", "LivingRoom", 101, 93, "1"],
		["3", "MasterRoom", 160.5, 159, "1"],
		["4", "SecondRoom", 101, 159, "1"],
		["5", "Balcony", 160.5, 194.5, "1"],
	],
	[
		["1", "2"],
		["1", "3"],
		["2", "3"],
		["2", "4"],
		["3", "5"],
		["3", "4"],
		["4", "5"],
	],
	[
		[3, "Bathroom", 184, 75, 0],
		[2, "Kitchen", 184, 111.5, 1],
		[0, "LivingRoom", 101, 93, 2],
		[1, "MasterRoom", 160.5, 159, 3],
		[7, "SecondRoom", 101, 159, 4],
		[9, "Balcony", 160.5, 194.5, 5],
	],
];

[
	[
		["1", "Kitchen", 184, 111.5, "1"],
		["2", "LivingRoom", 101, 93, "1"],
		["3", "MasterRoom", 160.5, 159, "1"],
		["4", "SecondRoom", 101, 159, "1"],
		["5", "Balcony", 160.5, 194.5, "1"],
	],
	[
		["0", "1"],
		["0", "2"],
		["1", "2"],
		["1", "3"],
		["2", "4"],
		["2", "3"],
		["3", "4"],
	],
	[
		[3, "Bathroom", 184, 75, 0],
		[2, "Kitchen", 184, 111.5, 1],
		[0, "LivingRoom", 101, 93, 2],
		[1, "MasterRoom", 160.5, 159, 3],
		[7, "SecondRoom", 101, 159, 4],
		[9, "Balcony", 160.5, 194.5, 5],
	],
];
