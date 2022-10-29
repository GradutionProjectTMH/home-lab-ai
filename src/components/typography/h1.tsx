import * as React from "react";
import { joinTxts } from "../../utils/text.util";
import textStyle from "./text-style";

type H1Props = {
	children: React.ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>;

const H1 = ({ children, className = "", ...props }: H1Props) => {
	return (
		<h1 className={joinTxts(textStyle.h1, className)} {...props}>
			{children}
		</h1>
	);
};

export default H1;
