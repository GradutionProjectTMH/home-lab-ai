import * as React from "react";
import { Transition } from "react-transition-group";
import { joinTxts } from "../utils/text.util";
import Stack from "./layout/stack";
import ExpandMoreSvg from "../svgs/expand-more.svg";
import ExpandLessSvg from "../svgs/expand-less.svg";
import H3 from "./typography/h3";
import ButtonIcon from "./button-icon";

type CarouselProps = {
	title: string;
	children: React.ReactNode;
	disabled?: boolean;
	RightItem?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
	RightItemActive?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
} & React.HTMLAttributes<HTMLElement>;

const Carousel = ({
	title,
	disabled = false,
	RightItem,
	RightItemActive,
	children,
	className = "",
	onClick,
	...props
}: CarouselProps) => {
	const [isActive, setIsActive] = React.useState<boolean>(false);

	const handleClicked = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		if (disabled) return;

		setIsActive(!isActive);
		if (onClick) onClick(event);
	};

	return (
		<section className={joinTxts("py-3")} {...props}>
			<Stack
				className="justify-between items-center gap-2 px-6 cursor-pointer hover:bg-gray-200 active:bg-gray-300"
				onClick={handleClicked}
			>
				<H3>{title}</H3>
				{isActive ? <ExpandLessSvg className="w-12 h-12" /> : <ExpandMoreSvg className="w-12 h-12" />}
			</Stack>

			<Transition in={isActive} timeout={1000}>
				{(state) => {
					console.log(state);
					return children;
				}}
			</Transition>
		</section>
	);
};

export default Carousel;
