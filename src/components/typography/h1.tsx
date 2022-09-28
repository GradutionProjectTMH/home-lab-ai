import * as React from "react";
import { joinTxts } from "../../utils/text.util";

type H1Props = {
	children: React.ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>;

const H1 = ({ children, className = "", ...props }: H1Props) => {
	return (
		<h1 className={joinTxts("font-body font-bold tracking-tighter text-5xl", className)} {...props}>
			{children}
		</h1>
	);
};

export default H1;
