import * as React from "react";
import Stack from "./layout/stack";
import { ReactComponent as ExpandMoreSvg } from "../svgs/expand-more.svg";
import { ReactComponent as ExpandLessSvg } from "../svgs/expand-less.svg";
import H3 from "./typography/h3";
import { joinTxts } from "../utils/text.util";
import H2 from "./typography/h2";
import { Transition } from "@headlessui/react";

type AccordionProps = {
	title: string;
	children: React.ReactNode;
	disabled?: boolean;
	defaultOpened?: boolean;
	titleClassName?: React.HTMLAttributes<HTMLElement>["className"];
	RightItem?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
	RightItemActive?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
} & React.HTMLAttributes<HTMLElement>;

const Accordion = ({
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
}: AccordionProps) => {
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
				<H2 className={joinTxts("text-gray-500", titleClassName)}>{title}</H2>
				{isActive ? <ExpandLessSvg className="w-12 h-12" /> : <ExpandMoreSvg className="w-12 h-12" />}
			</Stack>

			<Transition
				show={isActive}
				enter="transform transition duration-500"
				enterFrom="opacity-0 scale-x-75 scale-y-50 -translate-y-1/2"
				enterTo="opacity-100 scale-x-100 scale-y-100 translate-y-0"
				leave="transform transition duration-300"
				leaveFrom="opacity-100 scale-x-100 scale-100"
				leaveTo="opacity-0 scale-75"
				static
			>
				{children}
			</Transition>
		</section>
	);
};

export default Accordion;
