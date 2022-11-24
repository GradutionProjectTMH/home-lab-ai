import * as React from "react";
import { navigate } from "@reach/router";
import { joinTxts } from "../utils/text.util";
import Stack from "./layout/stack";
import H5 from "./typography/h5";

export type ButtonType = "fill" | "outline" | "ghost";

const buttonClass: Record<ButtonType, string> = {
	fill: "bg-blue-700 text-gray-50 fill-gray-50 hover:bg-blue-600 active:bg-blue-800",
	outline: "text-blue-700 border-blue-700 border-2 fill-blue-700 hover:bg-gray-200 active:bg-gray-300",
	ghost: "text-blue-700 fill-blue-700 hover:bg-gray-200 active:bg-gray-300",
};

type ButtonProps = {
	disabled?: boolean;
	type?: ButtonType;
	LeftItem?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
	RightItem?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
	link?: string;
	typeButton?: "button" | "submit" | "reset" | undefined;
} & React.HTMLAttributes<HTMLElement>;

const Button = ({
	title,
	disabled = false,
	type = "fill",
	LeftItem,
	RightItem,
	link,
	children,
	className = "",
	onClick,
	typeButton,
	...props
}: ButtonProps) => {
	const handleClicked = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		if (link) {
			navigate(link);
			return;
		}

		if (onClick) onClick!(event);
	};

	return (
		<button
			className={joinTxts("px-6 py-3", buttonClass[type], className)}
			{...props}
			disabled={disabled}
			onClick={handleClicked}
			type={typeButton}
		>
			<Stack className="items-center justify-center gap-2">
				{LeftItem && <LeftItem className="w-6 h-6" />}
				<H5>{children}</H5>
				{RightItem && <RightItem className="w-6 h-6" />}
			</Stack>
		</button>
	);
};

export default Button;
