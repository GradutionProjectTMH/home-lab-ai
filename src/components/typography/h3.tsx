import * as React from "react";
import { joinTxts } from "../../utils/text.util";

type H3Props = {
	children: React.ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>;

const H3 = ({ children, className = "", ...props }: H3Props) => {
	return (
		<h3 className={joinTxts("font-body font-bold tracking-tighter text-2xl", className)} {...props}>
			{children}
		</h3>
	);
};

export default H3;
