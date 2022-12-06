import * as React from "react";
import Navbar from "../components/navbar";
import { RouteComponentProps, Router, useMatch } from "@reach/router";
import { joinTxts } from "../utils/text.util";
import { lineByRoutes, LineName } from "../configs/line-body.config";
import { routes } from "./navigator";

const Body = ({ children }: RouteComponentProps<React.HTMLAttributes<HTMLElement>>) => {
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
			<div className="sticky top-0 z-10 bg-gray-100 ">
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
				<div className="relative">
					<Navbar />
				</div>
			</div>
			<div className="relative w-full h-full">{children}</div>
		</main>
	);
};

export default Body;
