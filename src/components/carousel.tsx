import * as React from "react";
import { Transition } from "react-transition-group";
import Stack from "./layout/stack";
import ExpandMoreSvg from "../svgs/expand-more.svg";
import ExpandLessSvg from "../svgs/expand-less.svg";
import H3 from "./typography/h3";
import { joinTxts } from "../utils/text.util";

type CarouselProps = {
	title: string;
	children: React.ReactNode;
	disabled?: boolean;
	defaultOpened?: boolean;
	titleClassName?: React.HTMLAttributes<HTMLElement>["className"];
	RightItem?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
	RightItemActive?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
} & React.HTMLAttributes<HTMLElement>;

const Carousel = ({
	title,
	disabled = false,
	RightItem,
	RightItemActive,
	defaultOpened = false,
	children,
	className = "",
	titleClassName = "",
	onClick,
	...props
}: CarouselProps) => {
	const [isActive, setIsActive] = React.useState<boolean>(defaultOpened);

	const handleClicked = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		if (disabled) return;

		setIsActive(!isActive);
		if (onClick) onClick(event);
	};

	return (
		<section {...props}>
			<Stack
				className="justify-between items-center gap-2 pr-6 border-b-gray-300 border-b cursor-pointer hover:bg-gray-200 active:bg-gray-300"
				onClick={handleClicked}
			>
				<H3 className={joinTxts("text-gray-500", titleClassName)}>{title}</H3>
				{isActive ? <ExpandLessSvg className="w-12 h-12" /> : <ExpandMoreSvg className="w-12 h-12" />}
			</Stack>

			<Transition in={isActive} timeout={1000}>
				{(state) => ["entering", "entered"].includes(state) && children}
			</Transition>
		</section>
	);
};

export default Carousel;
