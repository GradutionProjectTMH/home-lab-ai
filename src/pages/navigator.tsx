import React from "react";
import { Router } from "@reach/router";
import Body from "./body";
import BuildPage from "./build";
import Build2DPage from "./build-2d/build-2d";
import HomePage from "./home/home";
import MarketplacePage from "./marketplace";
import VerifyMaterial from "./verify-material/[id]";
import HistoryTransaction from "./history-transaction";

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
		name: "Build 2D",
		path: "/build-2d",
		page: Build2DPage,
	},
	{
		name: "Marketplace",
		path: "/marketplace",
		page: MarketplacePage,
	},
	{
		name: "VerifyMaterial",
		path: "/verify-material/:id",
		page: VerifyMaterial,
	},
	{
		name: "HistoryTransaction",
		path: "/history",
		isNav: false,
		page: HistoryTransaction,
	},
];

export const Navigator = () => {
	return (
		<Router>
			<Body path="/">
				{routes.map((route) => {
					const Page = route.page;

					return <Page key={route.path} path={route.path} />;
				})}
			</Body>
		</Router>
	);
};

export default Navigator;
