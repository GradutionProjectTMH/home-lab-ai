import * as React from "react";
import { joinTxts } from "../../utils/text.util";

type StackProps = {
	children: React.ReactNode;
	column?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const Stack = React.forwardRef(
	({ children, column = false, className = "", ...props }: StackProps, ref: React.Ref<HTMLDivElement>) => {
		return (
			<div ref={ref} className={joinTxts("flex", column ? "flex-col" : "flex-row", className)} {...props}>
				{children}
			</div>
		);
	},
);

export default Stack;
