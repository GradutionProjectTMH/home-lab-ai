import { Transition } from "@headlessui/react";
import * as React from "react";
import { Grid } from "../../../../components/layout/Grid";
import Stack from "../../../../components/layout/stack";
import H3 from "../../../../components/typography/h3";
import H4 from "../../../../components/typography/h4";
import { joinTxts } from "../../../../utils/text.util";
import CategoryItem, { CategoryItemData } from "../category-item/category-item";
import Text from "../../../../components/typography/text";
import { Skeleton } from "../../../../components/skeleton";
import H5 from "../../../../components/typography/h5";

export type CategoryData = {
	id: string;
	title: string;
	items: CategoryItemData[];
	isLoading: boolean;
	prompt: string;
};

type CategoryProps = {
	category: CategoryData;
	onCategoryChange?: (item: CategoryItemData) => void;
	disabled?: boolean;
	isActive?: boolean;
	titleClassName?: React.HTMLAttributes<HTMLElement>["className"];
	RightItem?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
	RightItemActive?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
} & React.HTMLAttributes<HTMLElement>;

const Category = ({
	category,
	disabled = false,
	RightItem,
	RightItemActive,
	isActive = false,
	titleClassName = "",
	onClick = () => {},
	onCategoryChange = (item) => {},
	...props
}: CategoryProps) => {
	const handleItemClicked = (item: CategoryItemData) => {
		onCategoryChange({
			...item,
			isChoose: !item.isChoose,
		});
	};

	return (
		<section {...props}>
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
				<Stack className="gap-4 items-center">
					<div className="grow h-[1px] bg-gray-300" />
					<H5 className="shrink-0 text-gray-400 tracking-widest">{category.title.toUpperCase()}</H5>
					<div className="grow h-[1px] bg-gray-300" />
				</Stack>

				{category.isLoading ? (
					<Grid className="grid-cols-4 grid-rows-1 gap-4 mt-4">
						{[...Array(4)].map((_, index) => (
							<Skeleton key={index} className="h-40 rounded-xl" />
						))}
					</Grid>
				) : (
					<Grid className="grid-cols-4 grid-rows-1 gap-4 mt-4">
						{category.items.length > 0 ? (
							category.items.map((item) => {
								return <CategoryItem item={item} onItemClick={handleItemClicked} />;
							})
						) : (
							<Text className="text-gray-500">Không có dữ liệu</Text>
						)}
					</Grid>
				)}
			</Transition>
		</section>
	);
};

export default Category;
