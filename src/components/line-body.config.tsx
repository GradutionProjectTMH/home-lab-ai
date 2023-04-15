import { useMatch } from "@reach/router";
import * as React from "react";
import { routes } from "../pages/navigator";

type ListPage = typeof routes[number]["name"];

const lineByRoutes: Record<ListPage, Record<string, JSX.Element>> = {
	"HomeLab.ai": {
		HLine2: <div className="absolute w-full h-[1px] bg-gray-300 top-[56rem]" />,
		HLine3: <div className="absolute w-full h-[1px] bg-gray-300 top-[8rem]" />,
		VLine1: <div className="absolute w-[1px] h-full bg-gray-300 left-0" />,
		VLine2: <div className="absolute w-[1px] h-full bg-gray-300 right-[712px]" />,
	},
};

const LineBody = () => {
	const matchedRoute = routes.find((route) => useMatch(route.path));
	const lines = lineByRoutes[matchedRoute!.name];

	return (
		<div className="absolute top-0 left-0 w-full h-full">
			<div className="relative w-full h-full">
				<div className="container mx-auto relative h-full">
					{lines &&
						Object.keys(lines)
							.filter((key) => key.includes("VLine"))
							.map((key) => lines[key])}
				</div>
				{lines &&
					Object.keys(lines)
						.filter((key) => key.includes("HLine"))
						.map((key) => lines[key])}
			</div>
		</div>
	);
};

export default LineBody;
