import { RouteComponentProps } from "@reach/router";
import * as React from "react";
import LineBody from "../components/line-body.config";
import Navbar from "../components/navbar";

const Body = ({ children }: RouteComponentProps<React.HTMLAttributes<HTMLElement>>) => {
	const [fixNav, setFixNav] = React.useState<boolean>(false);

	React.useEffect(() => {
		const handleScrolled = () => {
			if (window.scrollY <= 50) {
				setFixNav(false);
			} else {
				setFixNav(true);
			}
		};

		window.addEventListener("scroll", handleScrolled);
		return () => window.removeEventListener("scroll", handleScrolled);
	}, [fixNav]);

	return (
		<main className="relative bg-background min-h-screen">
			<LineBody />
			<div className="sticky top-0 z-10 bg-background overflow-hidden">
				{!fixNav && <LineBody />}
				<div className="relative">
					<Navbar fixNav={fixNav} />
				</div>
			</div>
			<div className="relative w-full h-full">{children}</div>
		</main>
	);
};

export default Body;
