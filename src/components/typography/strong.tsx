import * as React from "react";
import { joinTxts } from "../../utils/text.util";
import textStyle from "./text-style";

type StrongProps = {
	children: React.ReactNode;
	isSpan?: boolean;
} & React.HTMLAttributes<HTMLHeadingElement>;

const Strong = ({ children, isSpan = false, className = "", ...props }: StrongProps) => {
	const elementProps = {
		className: joinTxts(textStyle.strong, className),
		...props,
	};

	return isSpan ? <span {...elementProps}>{children}</span> : <p {...elementProps}>{children}</p>;
};

export default Strong;
