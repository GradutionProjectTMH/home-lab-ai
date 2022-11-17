import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/stores/store.redux";
import ErrorBoundary from "./components/error/error-boundary";
import Notification from "./components/notification";
import Initializer from "./components/initializer";

import "./styles/global.css";
import { Navigator } from "./pages/navigator";

export const Root = () => {
	return (
		<Provider store={store}>
			<ErrorBoundary>
				<Initializer />
				<Navigator />
				<Notification />
			</ErrorBoundary>
		</Provider>
	);
};
