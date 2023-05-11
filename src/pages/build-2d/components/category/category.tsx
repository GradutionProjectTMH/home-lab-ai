import { Transition } from "@headlessui/react";
import * as React from "react";
import { Grid } from "../../../../components/layout/Grid";
import Stack from "../../../../components/layout/stack";
import H3 from "../../../../components/typography/h3";
import H4 from "../../../../components/typography/h4";
import { joinTxts } from "../../../../utils/text.util";
import CategoryItem, { CategoryItemData } from "../category-item/category-item";

type CategoryProps = {
	title: string;
	items: CategoryItemData[];
	onRefresh?: () => void;
	onCategoryChange?: (item: CategoryItemData) => void;
	disabled?: boolean;
	defaultOpened?: boolean;
	titleClassName?: React.HTMLAttributes<HTMLElement>["className"];
	RightItem?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
	RightItemActive?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
} & React.HTMLAttributes<HTMLElement>;

const Category = ({
	title,
	items,
	disabled = false,
	RightItem,
	RightItemActive,
	defaultOpened = false,
	titleClassName = "",
	onClick = () => {},
	onCategoryChange = (item) => {},
	onRefresh = () => {},
	...props
}: CategoryProps) => {
	const [isActive, setIsActive] = React.useState<boolean>(defaultOpened);

	const handleCLicked = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		if (disabled) return;

		setIsActive(!isActive);
		onClick(event);
	};

	const handleItemClicked = (item: CategoryItemData) => {
		onCategoryChange({
			...item,
			isChoose: !item.isChoose,
		});
	};

	const handleRefreshed = (event: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => {
		event.stopPropagation();
		onRefresh();
	};

	return (
		<section {...props}>
			<Stack
				className={
					"justify-between items-center gap-2 py-2 pr-6 border-b-gray-300 border-b cursor-pointer hover:bg-gray-50 active:bg-gray-100"
				}
				onClick={handleCLicked}
			>
				<Stack className="gap-4 items-center">
					<H3 className={joinTxts("text-gray-500", titleClassName)}>{title}</H3>
					{isActive ? <i className="ri-arrow-up-s-line text-xl" /> : <i className="ri-arrow-down-s-line text-xl" />}
				</Stack>

				{isActive && (
					<H4 className="text-primary hover:text-blue-500" onClick={handleRefreshed}>
						Làm mới
					</H4>
				)}
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
				<Grid className="grid-cols-3 grid-rows-2 gap-4 mt-4">
					{items.map((item) => {
						return <CategoryItem item={item} onItemClick={handleItemClicked} />;
					})}
				</Grid>
			</Transition>
		</section>
	);
};

export default Category;
