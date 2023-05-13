import * as React from "react";
import Stack from "../../../../components/layout/stack";
import { joinTxts } from "../../../../utils/text.util";
import H4 from "../../../../components/typography/h4";
import H3 from "../../../../components/typography/h3";
import { Image } from "../../../../components/image";
import { randomImg } from "../../../../utils/tools.util";
import H5 from "../../../../components/typography/h5";
import { Grid } from "../../../../components/layout/Grid";
import { Transition } from "@headlessui/react";

export type CategoryItemData = {
	id: string;
	title: string;
	imgUrl: string;
	marble?: string;
	lightAndDarkStyle?: string;
	decorateTheItems?: string;
	kindsOfLargeObjects?: string;
	prompt?: string;
	price?: string;
	isChoose: boolean;
};

type CategoryItemProps = {
	item: CategoryItemData;
	onItemClick?: (item: CategoryItemData) => void;
	disabled?: boolean;
	defaultOpened?: boolean;
	titleClassName?: React.HTMLAttributes<HTMLElement>["className"];
	RightItem?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
	RightItemActive?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
} & React.HTMLAttributes<HTMLElement>;

const CategoryItem = ({
	item,
	disabled = false,
	RightItem,
	RightItemActive,
	defaultOpened = false,
	titleClassName = "",
	onItemClick = () => {},
	className,
	...props
}: CategoryItemProps) => {
	const handleCLicked = (item: CategoryItemData) => {
		if (disabled) return;
		onItemClick(item);
	};

	const { id, imgUrl, isChoose, title } = item;

	return (
		<Stack
			key={id}
			column
			className={joinTxts("items-center gap-2 cursor-pointer", className)}
			onClick={() => handleCLicked(item)}
			{...props}
		>
			<div
				className={joinTxts(
					"relative w-full h-48 border-4 rounded-xl overflow-hidden",
					isChoose ? "border-primary" : "border-transparent",
				)}
			>
				<Image src={imgUrl} className="w-full h-full" />
				{isChoose && (
					<>
						<div className="absolute top-0 right-0 w-16 h-16 translate-x-1/2 -translate-y-1/2 rotate-45 bg-primary" />
						<H5 className="absolute top-0 right-0">
							<i className="ri-check-line text-xl text-white" />
						</H5>
					</>
				)}
			</div>
			<H5 className={isChoose ? "text-primary" : "text-gray-500"}>{title}</H5>
		</Stack>
	);
};

export default CategoryItem;
