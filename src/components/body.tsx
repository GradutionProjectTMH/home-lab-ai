import * as React from "react";
import Navbar, { routes } from "./navbar";
import { useMatch } from "@reach/router";
import { joinTxts } from "../utils/text.util";

type LineName = "HLine1" | "HLine2" | "VLine1" | "VLine2";

const lineByRoutes: Record<string, Record<LineName, string>> = {
	Home: {
		HLine1: "bg-gray-300 top-48",
		HLine2: "bg-gray-300 top-[44rem]",
		VLine1: "bg-gray-300 left-1/2",
		VLine2: "",
	},
	Build: {
		HLine1: "bg-gray-300 top-44",
		HLine2: "bg-gray-300 top-[44rem]",
		VLine1: "bg-gray-300 left-0",
		VLine2: "bg-gray-300 right-0",
	},
	Order: {
		HLine1: "bg-gray-300 top-48",
		HLine2: "bg-gray-300 top-[36rem]",
		VLine1: "bg-gray-300 left-0",
		VLine2: "bg-gray-300 right-0",
	},
};

type MainLayoutProps = {
	children: React.ReactNode;
};

const Body = ({ children }: MainLayoutProps) => {
	const matchedRoute = routes.find((route) => useMatch(route.path));
	const lines = lineByRoutes[matchedRoute!.name];

	return (
		<main className="relative bg-gray-100 min-h-screen">
			<div className="absolute top-0 left-0 w-full h-full">
				<div className="relative w-full h-full">
					<div className="container mx-auto relative h-full">
						{lines &&
							Object.keys(lines)
								.filter((key) => key.includes("VLine"))
								.map((key) => (
									<div key={key} className={joinTxts("absolute w-[1px] h-full top-0", lines[key as LineName])} />
								))}
					</div>
					{lines &&
						Object.keys(lines)
							.filter((key) => key.includes("HLine"))
							.map((key) => (
								<div key={key} className={joinTxts("absolute w-full h-[1px] left-0", lines[key as LineName])} />
							))}
				</div>
			</div>

			<Navbar className="absolute top-0 left-0 w-full z-10" />
			<div className="relative w-full h-full z-0">{children}</div>
		</main>
	);
};

export default Body;
