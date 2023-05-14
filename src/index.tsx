import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import ErrorBoundary from "./components/error/error-boundary";
import Initializer from "./components/initializer";
import Notification from "./components/notification";
import Navigator from "./pages/navigator";
import { store } from "./redux/stores/store.redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./styles/global.css";

// Create a React Query client
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<Provider store={store}>
		<QueryClientProvider client={queryClient}>
			<ErrorBoundary>
				<Initializer />
				<Navigator />
				<Notification />
			</ErrorBoundary>
		</QueryClientProvider>
	</Provider>,
);
