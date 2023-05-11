import * as React from "react";
import { navigate } from "@reach/router";
import { joinTxts } from "../utils/text.util";
import Stack from "./layout/stack";
import H5 from "./typography/h5";

export type ButtonType = "fill" | "outline" | "ghost" | "overlay";

const buttonClass: Record<ButtonType, string> = {
	fill: "bg-primary text-background fill-background hover:bg-blue-400 active:bg-blue-500",
	outline: "text-dark border-dark border-2 fill-dark hover:bg-gray-100 active:bg-gray-200",
	ghost: "text-primary fill-primary hover:bg-gray-100 active:bg-gray-200",
	overlay:
		"backdrop-blur-md bg-gray-500/30 border-white border text-white fill-white hover:bg-gray-400/30 active:bg-gray-300/30",
};

type ButtonProps = {
	disabled?: boolean;
	type?: ButtonType;
	LeftItem?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
	RightItem?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
	link?: string;
	typeButton?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
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
			className={joinTxts("px-6 py-3", buttonClass[type], className, disabled ? "opacity-50" : "")}
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
