import * as React from "react";
import { joinTxts } from "../../utils/text.util";

type ItalicProps = {
	children: React.ReactNode;
	isSpan?: boolean;
} & React.HTMLAttributes<HTMLHeadingElement>;

const Italic = ({ children, isSpan = false, className = "", ...props }: ItalicProps) => {
	const elementProps = {
		className: joinTxts("font-body italic font-medium text-base", className),
		...props,
	};

	return isSpan ? <span {...elementProps}>{children}</span> : <p {...elementProps}>{children}</p>;
};

export default Italic;
