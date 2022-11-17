import React from "react";
import { Router } from "@reach/router";
import HomePage from "./home";
import BuildPage from "./build";
import MarketplacePage from "./marketplace";

export const routes = [
	{
		name: "Home",
		path: "/",
		page: HomePage,
	},
	{
		name: "Build",
		path: "/build",
		page: BuildPage,
	},
	{
		name: "Marketplace",
		path: "/marketplace",
		page: MarketplacePage,
	},
];

export const Navigator = () => {
	return (
		<Router>
			{routes.map((route) => {
				const Page = route.page;

				return <Page path={route.path} />;
			})}
		</Router>
	);
};
