import { RouteComponentProps } from "@reach/router";
import * as React from "react";
import SpringLoading from "../../components/SpringLoading";
import Accordion from "../../components/accordion";
import Button from "../../components/button";
import { Image } from "../../components/image";
import { Grid } from "../../components/layout/Grid";
import Stack from "../../components/layout/stack";
import { Table } from "../../components/table";
import H1 from "../../components/typography/h1";
import H4 from "../../components/typography/h4";
import Text from "../../components/typography/text";
import textStyle from "../../components/typography/text-style";
import { joinTxts } from "../../utils/text.util";
import { randomImg } from "../../utils/tools.util";
import { CategoryItemData } from "./components/category-item";
import CategoryItem from "./components/category-item/category-item";
import Category from "./components/category/category";

type RoomStyle = {
	title: string;
	imgUrl: string;
};

const roomStyleList: RoomStyle[] = [
	{
		title: "Tối giản",
		imgUrl: randomImg(500, 500),
	},
	{
		title: "Hiện đại",
		imgUrl: randomImg(500, 500),
	},
	{
		title: "Phòng Sáng",
		imgUrl: randomImg(500, 500),
	},
	{
		title: "Phòng Tối",
		imgUrl: randomImg(500, 500),
	},
];

const Build2DPage = (props: RouteComponentProps) => {
	const [currentRoomStyle, setCurrentRoomStyle] = React.useState<RoomStyle>(roomStyleList[0]);

	const [data, setData] = React.useState<Record<string, CategoryItemData[]>>({
		tables: [...Array(6)].map((_, index) => ({
			id: index.toString(),
			title: "Clapheny",
			imgUrl: randomImg(500, 500),
			isChoose: false,
		})),
	});

	const handleItemChanged = (key: string, item: CategoryItemData) => {
		const dataCategory = data[key];
		const itemIndex = dataCategory.findIndex((itemData) => itemData.id === item.id);

		setData({
			...data,
			[key]: [...dataCategory.slice(0, itemIndex), item, ...dataCategory.slice(itemIndex + 1)],
		});
	};

	const handleItemRefreshed = (key: string) => {
		const newCategory = [...Array(6)].map((_, index) => ({
			id: index.toString(),
			title: "Clapheny",
			imgUrl: randomImg(500, 500),
			isChoose: false,
		}));

		setData({
			...data,
			[key]: newCategory,
		});
	};

	const productTableColumns: TableColumn[] = [
		{
			key: "id",
			title: "STT",
			dataIndex: "id",
			render: (_, __, index) => <Text>{index}</Text>,
		},
		{
			key: "name",
			title: "TÊN NỘI THẤT",
			dataIndex: "name",
		},
		{
			key: "price",
			title: "ĐƠN GIÁ",
			dataIndex: "price",
		},
		{
			key: "quantity",
			title: "SỐ LƯỢNG",
			dataIndex: "quantity",
		},
	];

	const productTableDataSource = [
		{
			id: "7643980998990",
			name: "Calpheny",
			price: "100K VNĐ",
			quantity: "1",
		},
		{
			id: "7643980998991",
			name: "Calpheny",
			price: "100K VNĐ",
			quantity: "1",
		},
		{
			id: "7643980998992",
			name: "Calpheny",
			price: "100K VNĐ",
			quantity: "1",
		},
		{
			id: "7643980998993",
			name: "Calpheny",
			price: "100K VNĐ",
			quantity: "1",
		},
		{
			id: "7643980998994",
			name: "Calpheny",
			price: "100K VNĐ",
			quantity: "1",
		},
		{
			id: "7643980998995",
			name: "Calpheny",
			price: "100K VNĐ",
			quantity: "1",
		},
	];

	return (
		<SpringLoading
			situations={[
				{ percent: 0, duration: 0 },
				{ percent: 60, duration: 500 },
				{ percent: 80, duration: 350 },
				{ percent: 100, duration: 200 },
			]}
		>
			<section className="container mx-auto">
				<Stack className="items-stretch gap-8">
					<Stack column className="flex-grow gap-10 py-8">
						<H1 className="!font-display !font-black">
							NỘI THẤT <span className={joinTxts(textStyle.h1, "text-primary")}>AI</span>
						</H1>
						<Stack column className="gap-16">
							<Category
								title="CHỌN BÀN"
								items={data["tables"]}
								onCategoryChange={(item: CategoryItemData) => handleItemChanged("tables", item)}
								onRefresh={() => handleItemRefreshed("tables")}
							/>

							<Category
								title="CHỌN BÀN"
								items={data["tables"]}
								onCategoryChange={(item: CategoryItemData) => handleItemChanged("tables", item)}
								onRefresh={() => handleItemRefreshed("tables")}
							/>
						</Stack>
					</Stack>

					<Stack column className="basis-[712px] shrink-0 items-stretch gap-24 mt-4">
						<Stack column className="gap-8">
							<div className="relative">
								<Stack className="h-[640px] items-center gap-4 drop-shadow-[12px_40px_36px_rgba(26,54,93,0.32)]">
									<Image src={randomImg(1000, 1000)} className="w-full h-full" />
								</Stack>
								<div className="absolute bottom-0 right-0">
									<Stack className="gap-4 m-8">
										<Button type="overlay" className="rounded-xl !py-2">
											<i className="ri-download-cloud-line text-xl" />
										</Button>
										<Button type="overlay" className="rounded-xl">
											Tạo lại&nbsp; <i className="ri-restart-line" />
										</Button>
									</Stack>
								</div>
							</div>

							<Grid className="grid-cols-4 grid-rows-1 gap-8">
								{roomStyleList.map((roomStyleItem) => {
									const { imgUrl, title } = roomStyleItem;
									return (
										<CategoryItem
											item={{ id: title, title, imgUrl, isChoose: roomStyleItem.title === currentRoomStyle.title }}
											onItemClick={() => setCurrentRoomStyle(roomStyleItem)}
											className="h-40"
										/>
									);
								})}
							</Grid>

							<Accordion title="DANH SÁCH SẢN PHẨM ĐÃ CHỌN">
								<Table columns={productTableColumns} dataSource={productTableDataSource} className="mt-8" />
							</Accordion>

							<Grid className="grid-cols-2 grid-rows-1 gap-16">
								<Stack
									column
									className="justify-center items-center border border-dashed border-primary py-8 rounded-xl bg-background hover:bg-blue-500/10 cursor-pointer"
								>
									<Text>Tối ưu thiết kế</Text>
									<H4 className="text-primary">HOMELAB</H4>
								</Stack>

								<Stack
									column
									className="justify-center items-center border border-dashed border-[#A18A68] py-8 rounded-xl bg-background hover:bg-[#A18A68]/10 cursor-pointer"
								>
									<Text>Đặt hàng tại</Text>
									<H4 className="text-[#A18A68]">HOMELIV</H4>
								</Stack>
							</Grid>
						</Stack>
					</Stack>
				</Stack>
			</section>

			<section className="pt-52"></section>
		</SpringLoading>
	);
};

export default Build2DPage;
