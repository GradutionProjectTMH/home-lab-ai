import { RouteComponentProps, navigate } from "@reach/router";
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
import { downloadURI, randomImg, randomPick } from "../../utils/tools.util";
import { CategoryItemData } from "./components/category-item";
import CategoryItem from "./components/category-item/category-item";
import Category, { CategoryData } from "./components/category/category";
import { useMutation } from "@tanstack/react-query";
import { postTextToImageApi } from "../../apis/text-to-image/text-to-image.api";
import { useDispatch } from "react-redux";
import { pushError } from "../../redux/slices/message.slice";
import axios, { AxiosError } from "axios";
import { Transition } from "@headlessui/react";
import bgRenderJpg from "./images/bg-render.jpg";
import { getCategoriesApi, getProductsApi } from "../../apis/product/product.api";
import H5 from "../../components/typography/h5";
import { GetProductRoomType, GetProductStyle } from "../../apis/product/product-enum";

import { LIGHT_AND_DARKS_STYLES, MARBLES } from "./constants";
import { data } from "./data";

const Build2DPage = (props: RouteComponentProps) => {
	const dispatch = useDispatch();
	const [categories, setCategories] = React.useState<CategoryData[]>(data);

	// const {
	// 	mutateAsync: getCategories,
	// 	isLoading: isLoadingGetCategories,
	// 	data: getCategoriesRes,
	// } = useMutation(getCategoriesApi, {
	// 	onError: (error: AxiosError<{ message: string }>) => {
	// 		dispatch(pushError(error?.message));
	// 	},
	// });

	// React.useEffect(() => {
	// 	getCategories();
	// }, [getCategories]);

	const { mutateAsync: getProducts } = useMutation(getProductsApi, {
		onError: (error: AxiosError<{ message: string }>) => {
			dispatch(pushError(error?.message));
		},
	});

	// React.useEffect(() => {
	// 	if (!getCategoriesRes) return;

	// 	const rawCategories: CategoryData[] = getCategoriesRes.map((category) => ({
	// 		id: category.id,
	// 		title: category.name,
	// 		imgUrl: category.thumbnailUrl,
	// 		prompt: category.prompt,
	// 		items: [],
	// 		isLoading: true,
	// 	}));

	// 	setCategories(rawCategories);

	// 	(async () => {
	// 		const newCategories = await Promise.all(
	// 			rawCategories.map(async (category, index) => {
	// 				const products = await getProducts({ categoryIds: category.id, page: 1, limit: 3 });
	// 				category.items = products.data.map((product) => ({
	// 					id: product.id,
	// 					title: product.name,
	// 					imgUrl: product.thumbnailUrl,
	// 					isChoose: false,
	// 					marble: product.marble,
	// 					decorateTheItems: product.decorateTheItems,
	// 					kindsOfLargeObjects: product.kindsOfLargeObjects,
	// 					lightAndDarkStyle: product.lightAndDarkStyle,
	// 					prompt: product.prompt,
	// 					price: `${product.price / 1000} nghìn VNĐ`,
	// 				}));
	// 				category.isLoading = false;
	// 				return category;
	// 			}),
	// 		);

	// 		setCategories(newCategories);
	// 	})();
	// }, [getCategoriesRes]);

	const [prompt, setCurrentPrompt] = React.useState<string>();

	React.useEffect(() => {
		const getPrompt = (categoryPrompt: string) =>
			categories
				.find((category) => category.prompt === categoryPrompt)
				?.items.filter((item) => item.isChoose)
				.map((item) => item.prompt)
				.join(", ") || "";

		const prompt = getPrompt("Style");

		const roomName = getPrompt("Room Name");
		const floor = getPrompt("Floor");
		const decorateTheItems = getPrompt("Outside");
		const marble = getPrompt("Marble");
		const lightAndDarkStyle = getPrompt("Light and dark style");
		const ceiling = getPrompt("Ceiling");
		const palette = getPrompt("Palette");
		const feeling = getPrompt("Feeling");

		// const marble = randomPick(MARBLES) || "";
		// const lightAndDarkStyle = randomPick(LIGHT_AND_DARKS_STYLES) || "";

		setCurrentPrompt(
			prompt
				.replace("(Room Name)", roomName)
				.replace("(Floor)", floor)
				.replace("(Outside)", decorateTheItems)
				.replace("(Marble)", marble)
				.replace("(Light and dark style)", lightAndDarkStyle)
				.replace("(Ceiling)", ceiling)
				.replace("(Palette)", palette)
				.replace("(Feeling)", feeling),
		);
	}, [categories]);

	const {
		mutateAsync: postTextToImage,
		isLoading: isLoadingPostTextToImage,
		data: postTextToImageRes,
	} = useMutation(postTextToImageApi, {
		onSuccess: (chatRes) => {},
		onError: (error: AxiosError<{ message: string }>) => {
			dispatch(pushError(error?.message));
		},
	});

	const handleItemChanged = (
		currentCategory: CategoryData,
		currentItem: CategoryItemData,
		isMultipleChoice: boolean = false,
	) => {
		const categoryIndex = categories.findIndex((category) => category.id === currentCategory.id);
		const itemIndex = currentCategory.items.findIndex((item) => item.id === currentItem.id);

		if (!isMultipleChoice)
			currentCategory.items = [
				...currentCategory.items.slice(0, itemIndex).map((item) => ({ ...item, isChoose: false })),
				currentItem,
				...currentCategory.items.slice(itemIndex + 1).map((item) => ({ ...item, isChoose: false })),
			];
		else
			currentCategory.items = [
				...currentCategory.items.slice(0, itemIndex),
				currentItem,
				...currentCategory.items.slice(itemIndex + 1),
			];

		setCategories([...categories.slice(0, categoryIndex), currentCategory, ...categories.slice(categoryIndex + 1)]);
	};

	const selectedItems = categories.reduce((result, category) => {
		const selectedItems = category.items.filter((item) => item.isChoose);
		result.push(...selectedItems);
		return result;
	}, [] as CategoryItemData[]);

	const handleGenerateButtonClicked = async () => {
		postTextToImage({
			prompt: prompt!,
			negativePrompt: `low quality, blurry, bad anatomy, worst quality, text,  watermark, normal quality, ugly, signature, lowres, deformed,  disfigured, cropped, jpeg artifacts, error, mutation`,
			amount: 1,
		});
	};

	const productTableColumns: TableColumn[] = [
		{
			key: "name",
			title: "TÊN NỘI THẤT",
			dataIndex: "name",
			render: (text) => <Text className="text-ellipsis max-w-[400px]">{text}</Text>,
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

	const productTableDataSource = selectedItems.map((item) => ({
		id: item.id,
		name: item.title,
		price: item.price,
		quantity: 1,
	}));

	const handleOnclickDownload = async (url: string) => {
		const res = await axios.get(url, { responseType: "blob" });
		const urlImage = window.URL.createObjectURL(new Blob([res.data]));
		downloadURI(urlImage, "HomelabAI_design.png");
	};

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
				<Stack className="items-stretch gap-16">
					<Stack column className="flex-grow gap-10 py-8">
						<H1 className="!font-display !font-black">
							NỘI THẤT <span className={joinTxts(textStyle.h1, "text-primary")}>AI</span>
						</H1>

						<Stack column className="gap-16">
							{categories.map((category) => (
								<Category
									key={category.id}
									category={category}
									onCategoryChange={(item: CategoryItemData) => handleItemChanged(category, item)}
									isActive={true}
								/>
							))}
						</Stack>
					</Stack>

					<Stack column className="basis-7/12 shrink-0 items-stretch gap-24 mt-4">
						<Stack column className="gap-8">
							<div className="relative">
								<Stack className="relative items-center gap-4 drop-shadow-[12px_40px_36px_rgba(26,54,93,0.32)]">
									<Image src={postTextToImageRes?.output[0] || bgRenderJpg} className="w-full h-full" />
									<Transition
										show={isLoadingPostTextToImage}
										enter="transition duration-1000 delay-1000"
										enterFrom="opacity-0 scale-75"
										enterTo="opacity-100 scale-100"
										leave="transition duration-1000"
										leaveFrom="opacity-100 scale-100"
										leaveTo="opacity-0 scale-75"
										className="absolute top-0 left-0 w-full h-full backdrop-blur-md"
										static
									>
										<Stack column className="w-full h-full justify-center items-center">
											<div>
												<H4 className="bg-gray-700/50 px-8 py-4 text-white rounded-xl">
													<i className="ri-loop-right-line text-xl animate-spin inline-block" />
													&nbsp; Đang tạo thiết kế
												</H4>
											</div>
										</Stack>
									</Transition>
								</Stack>
								<div className="absolute bottom-0 right-0">
									<Stack className="gap-4 m-8">
										{postTextToImageRes?.output[0] && (
											<Button
												type="overlay"
												className="rounded-xl h-full"
												onClick={() => handleOnclickDownload(postTextToImageRes?.output[0])}
											>
												<i className="ri-download-cloud-line text-xl" />
											</Button>
										)}
										<Button type="overlay" className="rounded-xl" onClick={handleGenerateButtonClicked}>
											Tạo thiết kế&nbsp; <i className="ri-restart-line" />
										</Button>
									</Stack>
								</div>
							</div>

							<Accordion title="MÔ TẢ THIẾT KẾ">
								<Text className="text-justify mt-3">{prompt}</Text>
							</Accordion>

							<Grid className="grid-cols-2 grid-rows-1 gap-16">
								<Stack
									column
									className="justify-center items-center border border-dashed border-primary py-8 rounded-xl bg-background hover:bg-blue-500/10 cursor-pointer"
									onClick={() => navigate("/build")}
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
