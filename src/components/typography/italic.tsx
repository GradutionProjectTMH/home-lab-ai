import * as React from "react";
import { joinTxts } from "../../utils/text.util";
import textStyle from "./text-style";

type ItalicProps = {
	children: React.ReactNode;
	isSpan?: boolean;
} & React.HTMLAttributes<HTMLHeadingElement>;

const Italic = ({ children, isSpan = false, className = "", ...props }: ItalicProps) => {
	const elementProps = {
		className: joinTxts(textStyle.italic, className),
		...props,
	};

	return isSpan ? <span {...elementProps}>{children}</span> : <p {...elementProps}>{children}</p>;
};

export default Italic;
