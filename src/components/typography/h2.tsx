import * as React from "react";
import { joinTxts } from "../../utils/text.util";

type H2Props = {
	children: React.ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>;

const H2 = ({ children, className = "", ...props }: H2Props) => {
	return (
		<h2 className={joinTxts("font-body font-bold tracking-tighter text-3xl", className)} {...props}>
			{children}
		</h2>
	);
};

export default H2;
