import { store } from "../redux/stores/store.redux";

const getImage = (name: string) => {
	const imageEndpoint = store.getState().environment.tfFloorPlan.IMAGE_ENDPOINT;
	return `${imageEndpoint}download/${name}`;
};

const process = (imageFile: File) => {
	const api = store.getState().tfFloorPlanService!;

	const formData = new FormData();
	formData.append("file", imageFile);
	return api.post("process", formData);
};

const TFFloorPlan = {
	getImage,
	process,
};

export default TFFloorPlan;
