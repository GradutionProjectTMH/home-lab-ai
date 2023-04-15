import React from "react";
import { Router } from "@reach/router";
import Body from "./body";
import BuildPage from "./build";
import HomePage from "./home/home";
import MarketplacePage from "./marketplace";
import RequestVerify from "./request-verify";
import VerifyMaterial from "./verify-material/[id]";
import OrderDetail from "./order/[id]";
import DetailDrawingPage from "./detail-drawing/[id]";
import OrderPage from "./order";
import HistoryTransaction from "./history-transaction";

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
		name: "Orders",
		path: "/orders",
		isNav: false,
		page: OrderPage,
	},
	{
		name: "Order",
		path: "/order/:id",
		isNav: false,
		page: OrderDetail,
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
		isNav: false,
		page: RequestVerify,
	},
	{
		name: "VerifyMaterial",
		path: "/verify-material/:id",
		isNav: false,
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
