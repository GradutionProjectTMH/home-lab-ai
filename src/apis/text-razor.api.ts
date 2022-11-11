import { store } from "../redux/stores/store.redux";

const extract = async (text: string, extractors: string[]) => {
	const params = new URLSearchParams();
	params.append("text", text);
	params.append("extractors", extractors.join(","));

	console.log(store.getState());

	const api = store.getState().textRazorService!;
	return api.post("/", params);
};

const TextRazor = {
	extract,
};

export default TextRazor;
