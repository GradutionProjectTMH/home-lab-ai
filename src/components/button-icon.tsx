import * as React from "react";
import { navigate } from "@reach/router";
import { joinTxts } from "../utils/text.util";
import Stack from "./layout/stack";

export type ButtonType = "fill" | "outline" | "ghost";

const buttonClass: Record<ButtonType, string> = {
	fill: "bg-blue-700 fill-gray-50 hover:bg-blue-600 active:bg-blue-800",
	outline: "border-blue-700 border-2 fill-blue-700 hover:bg-gray-200 active:bg-gray-300",
	ghost: "fill-blue-700 hover:bg-gray-200 active:bg-gray-300",
};

type ButtonIconProps = {
	Icon: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
	disabled?: boolean;
	type?: ButtonType;
	link?: string;
} & React.HTMLAttributes<HTMLButtonElement>;

const ButtonIcon = ({
	Icon,
	disabled = false,
	type = "ghost",
	link,
	className = "",
	onClick,
	...props
}: ButtonIconProps) => {
	const handleClicked = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		if (link) {
			navigate(link);
			return;
		}

		if (onClick) onClick!(event);
	};

	return (
		<Icon
			className={joinTxts("rounded-full p-2 cursor-pointer", buttonClass[type], className)}
			onClick={handleClicked}
		/>
	);
};

export default ButtonIcon;
