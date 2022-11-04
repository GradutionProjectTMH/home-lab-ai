import "./src/styles/global.css";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./src/redux/stores/store.redux";
import CheckToken from "./src/components/check-token";

export const wrapPageElement = ({ element }) => {
	return (
		<Provider store={store}>
			<CheckToken />
			{element}
		</Provider>
	);
};
