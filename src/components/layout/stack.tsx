import * as React from "react";
import { joinTxts } from "../../utils/text.util";

type StackProps = {
	children: React.ReactNode;
	column?: boolean;
} & React.HTMLAttributes<HTMLHeadingElement>;

const Stack = ({ children, column = false, className = "", ...props }: StackProps) => {
	return (
		<div className={joinTxts("flex", column ? "flex-col" : "flex-row", className)} {...props}>
			{children}
		</div>
	);
};

export default Stack;
