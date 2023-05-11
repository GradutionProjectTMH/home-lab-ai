import React, { forwardRef } from "react";
import { joinTxts } from "../../utils/text.util";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Grid = forwardRef<HTMLDivElement, GridProps>(({ children, className, ...props }, ref) => {
	return (
		<div ref={ref} className={joinTxts("grid", className)} {...props}>
			{children}
		</div>
	);
});
