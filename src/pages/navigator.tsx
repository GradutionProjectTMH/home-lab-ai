import React from "react";
import { Router } from "@reach/router";
import Body from "./body";
import BuildPage from "./build";
import HomePage from "./home";
import MarketplacePage from "./marketplace";
import RequestVerify from "./request-verify";
import VerifyMaterial from "./verify-material/[id]";
import Order from "./order/[id]";
import DetailDrawingPage from "./detail-drawing/[id]";

export const routes = [
	{
		name: "Home",
		path: "/",
		isNav: true,
		page: HomePage,
	},
	{
		name: "Build",
		path: "/build",
		isNav: true,
		page: BuildPage,
	},
	{
		name: "Order",
		path: "/order/:id",
		isNav: false,
		page: Order,
	},
	{
		name: "Marketplace",
		path: "/marketplace",
		isNav: true,
		page: MarketplacePage,
	},
	{
		name: "DetailDrawing",
		path: "/detail-drawing/:id",
		isNav: false,
		page: DetailDrawingPage,
	},
	{
		name: "RequestVerify",
		path: "/request-verify",
		isNav: true,
		page: RequestVerify,
	},
	{
		name: "VerifyMaterial",
		path: "/verify-material/:id",
		isNav: true,
		page: VerifyMaterial,
	},
];

export const Navigator = () => {
	return (
		<Router>
			<Body path="/">
				{routes.map((route) => {
					const Page = route.page;

					return <Page path={route.path} />;
				})}
			</Body>
		</Router>
	);
};

export default Navigator;
