import { forwardRef } from "react";
import { joinTxts } from "../../utils/text.util";
import React from "react";

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(({ className, children, ...props }, ref) => {
	return <div ref={ref} className={joinTxts("animate-pulse bg-gray-200", className)} {...props} />;
});
