import "./src/styles/global.css";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./src/redux/stores/store.redux";
import Initializer from "./src/components/initializer";

export const wrapPageElement = ({ element }) => {
	return (
		<Provider store={store}>
			<Initializer />
			{element}
		</Provider>
	);
};
