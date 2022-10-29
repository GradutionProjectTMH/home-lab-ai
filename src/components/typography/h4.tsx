import * as React from "react";
import { joinTxts } from "../../utils/text.util";
import textStyle from "./text-style";

type H4Props = {
	children: React.ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>;

const H4 = ({ children, className = "", ...props }: H4Props) => {
	return (
		<h4 className={joinTxts(textStyle.h4, className)} {...props}>
			{children}
		</h4>
	);
};

export default H4;
