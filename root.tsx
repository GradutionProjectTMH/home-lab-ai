import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/redux/stores/store.redux";
import ErrorBoundary from "./src/components/error/error-boundary";
import Notification from "./src/components/notification";
import Initializer from "./src/components/initializer";

import "./src/styles/global.css";

export const Root = ({ element }) => {
	return (
		<Provider store={store}>
			<ErrorBoundary>
				<Initializer />
				{element}
				<Notification />
			</ErrorBoundary>
		</Provider>
	);
};
