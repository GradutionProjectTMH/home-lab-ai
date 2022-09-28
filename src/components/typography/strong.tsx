import * as React from "react";
import { joinTxts } from "../../utils/text.util";

type StrongProps = {
	children: React.ReactNode;
	isSpan?: boolean;
} & React.HTMLAttributes<HTMLHeadingElement>;

const Strong = ({ children, isSpan = false, className = "", ...props }: StrongProps) => {
	const elementProps = {
		className: joinTxts("font-body font-bold text-base", className),
		...props,
	};

	return isSpan ? <span {...elementProps}>{children}</span> : <p {...elementProps}>{children}</p>;
};

export default Strong;
