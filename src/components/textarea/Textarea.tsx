import React from "react";
import { forwardRef } from "react";
import { joinTxts } from "../../utils/text.util";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
	return (
		<textarea
			ref={ref}
			className={joinTxts(
				"!outline-none font-body text-black w-full p-4 border border-light-gray placeholder:text-dark-gray hover:border-in-gray focus:border-in-gray",
				className,
			)}
			{...props}
		/>
	);
});
