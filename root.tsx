import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/redux/stores/store.redux";
import Initializer from "./src/components/initializer";

import "./src/styles/global.css";

export const Root = ({ element }) => {
	return (
		<Provider store={store}>
			<Initializer />
			{element}
		</Provider>
	);
};
