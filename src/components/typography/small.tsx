import * as React from "react";
import { joinTxts } from "../../utils/text.util";

type SmallProps = {
	children: React.ReactNode;
	isSpan?: boolean;
} & React.HTMLAttributes<HTMLHeadingElement>;

const Small = ({ children, isSpan = false, className = "", ...props }: SmallProps) => {
	const elementProps = {
		className: joinTxts(textStyle.small, className),
		...props,
	};

	return isSpan ? <span {...elementProps}>{children}</span> : <p {...elementProps}>{children}</p>;
};

export default Small;
