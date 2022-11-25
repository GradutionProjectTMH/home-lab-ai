import * as React from "react";
import Stack from "../../layout/stack";
import Button from "../../button";
import H5 from "../../typography/h5";
import H4 from "../../typography/h4";
import Small from "../../typography/small";
import { ReactComponent as AddCircleOutline } from "../../../svgs/add_circle_outline.svg";
import { DetailDrawing } from "../../../interfaces/detail-drawing.interface";
import { splittingRoomColor } from "../../../utils/room-color";
import Modal from "../../modal";
import { joinTxts } from "../../../utils/text.util";
import { Link } from "@reach/router";
import Input from "../../input";

const rewards = [
	{
		icon: "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ethereum-ETH-icon.png",
		name: "Ethereum",
		symbol: "ETH",
		value: 0.37,
		price: 2.034,
		color: "#553C9A",
	},
	{
		icon: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
		name: "Alavanche",
		symbol: "AVAX",
		value: 46.4,
		price: 20.34,
		color: "#E53E3E",
	},
	{
		icon: "https://user-images.githubusercontent.com/12424618/54043975-b6cdb800-4182-11e9-83bd-0cd2eb757c6e.png",
		name: "Binance",
		symbol: "BNB",
		value: 6.4,
		price: 164.23,
		color: "#D69E2E",
	},
];

const dataMaterials = [
	{
		image: "https://thegioithepvn.com/wp-content/uploads/2021/06/thep-gan-xay-dung.jpg",
		name: "Scrap steel",
		amount: "100 ",
		trademark: "Thang Nguyen",
		unit: "ton",
		urlVerify: "http://localhost:3000/verify-material/:id",
	},
	{
		image: "https://thegioithepvn.com/wp-content/uploads/2021/06/thep-gan-xay-dung.jpg",
		name: "Scrap steel",
		amount: "100 ",
		trademark: "Thang Nguyen",
		unit: "ton",
		urlVerify: "http://localhost:3000/verify-material/:id",
	},
	{
		image: "https://thegioithepvn.com/wp-content/uploads/2021/06/thep-gan-xay-dung.jpg",
		name: "Scrap steel",
		amount: "100 ",
		trademark: "Thang Nguyen",
		unit: "ton",
		urlVerify: "http://localhost:3000/verify-material/:id",
	},
	{
		image: "https://thegioithepvn.com/wp-content/uploads/2021/06/thep-gan-xay-dung.jpg",
		name: "Scrap steel",
		amount: "100 ",
		trademark: "Thang Nguyen",
		unit: "ton",
		urlVerify: "http://localhost:3000/verify-material/:id",
	},
];

type AddToMarketplaceProp = {
	setCurrentPage: React.Dispatch<React.SetStateAction<"Order" | "Marketplace">>;
	detailDrawing: DetailDrawing | undefined;
};

const AddToMarketplacePage = ({ detailDrawing, setCurrentPage }: AddToMarketplaceProp) => {
	const [isShownModal, setIsShownModal] = React.useState<boolean>(false);
	const [iFrameSrc, setIFrameSrc] = React.useState<string | null>();
	const [imageSelected, setImageSelected] = React.useState<number | null>();
	const [materials, setMaterials] = React.useState(dataMaterials);

	const handleHiring = () => {
		window.scrollTo(0, 0);
		setCurrentPage("Order");
	};

	const handleChangeInputAmount = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
		const newMaterials = [...materials];
		newMaterials[index].amount = e.target.value;
		setMaterials(newMaterials);
	};
	return (
		<>
			<Stack className="gap-x-8">
				<div>
					<Button className="!w-80 flex justify-center" type="outline" onClick={handleHiring}>
						Hiring
					</Button>
				</div>
			</Stack>
			<Stack column={true} className="mt-8">
				{/* 1 */}
				<Stack className="pb-8 border-b-gray-200 border-b">
					<Stack column={true} className="basis-1/2 gap-8 items-stretch  ">
						<div>
							<Button className=" !w-80 flex justify-center" type="fill">
								Build from scratch
							</Button>
						</div>
						<Stack className="pl-6 gap-12 ">
							<Stack column={true} className="items-end gap-3">
								<H4 className="text-gray-700">House Boundary:</H4>
								<Small className="text-gray-500">Width:</Small>
								<Small className="text-gray-500">Length:</Small>
							</Stack>
							<Stack column={true} className="gap-3">
								<H4 className="text-blue-700">{detailDrawing?.houseBoundary || "_"}m²</H4>
								<Small className="text-gray-500">{detailDrawing?.width || "_"} m</Small>
								<Small className="text-gray-500">{detailDrawing?.height || "_"} m</Small>
							</Stack>
						</Stack>
					</Stack>
					<Stack column={true} className="basis-1/2 gap-8 items-stretch ">
						<Stack className="basis-1/2 gap-2 items-stretch">
							<Stack className="cursor-pointer basis-1/2 hover:scale-110 hover:shadow-md hover:z-10 ">
								<img src={detailDrawing?.boundaryImg} alt="suggested-design" className="w-full object-cover" />
							</Stack>

							<Stack className="cursor-pointer basis-1/2 hover:scale-110 hover:shadow-md hover:z-10 ">
								<img src={detailDrawing?.crossSectionImg} alt="suggested-design" className=" object-cover" />
							</Stack>
						</Stack>
					</Stack>
				</Stack>

				<Stack className="pb-8 border-b-gray-200 border-b p-6">
					<Stack className=" gap-4">
						<Stack
							className="basis-1/3 items-stretch "
							onClick={() => {
								if (imageSelected === 1) {
									setImageSelected(null);
								} else {
									setImageSelected(1);
									setIsShownModal(true);
									setIFrameSrc(
										"https://www.coohom.com/pub/tool/yundesign/cloud?designid=3FO40GHV6QF1&redirecturl=/pub/saas/apps/project/list&redirectbim=false&locale=en_US",
									);
								}
							}}
						>
							<div
								className={joinTxts(
									"border-4 hover:scale-110 hover:shadow-md hover:z-10",
									imageSelected == 1 ? "border-blue-500" : null,
								)}
							>
								<img
									src="../images/suggested-designs/33.png"
									alt="suggested-design"
									className="border-white border-4 cursor-pointer  h-[400px]"
								/>
							</div>
						</Stack>
						<Stack
							className="basis-1/3 items-stretch "
							onClick={() => {
								if (imageSelected === 2) {
									setImageSelected(null);
								} else {
									setImageSelected(2);
									setIsShownModal(true);
									setIFrameSrc(
										"https://www.coohom.com/pub/tool/yundesign/cloud?designid=3FO40GHV6QF1&redirecturl=/pub/saas/apps/project/list&redirectbim=false&locale=en_US",
									);
								}
							}}
						>
							<div
								className={joinTxts(
									"border-4 hover:scale-110 hover:shadow-md hover:z-10",
									imageSelected == 2 ? "border-blue-500" : null,
								)}
							>
								<img
									src="../images/suggested-designs/33.png"
									alt="suggested-design"
									className="border-white border-4 cursor-pointer  h-[400px]"
								/>
							</div>
						</Stack>
						<Stack
							className="basis-1/3 items-stretch "
							onClick={() => {
								if (imageSelected === 3) {
									setImageSelected(null);
								} else {
									setImageSelected(3);
									setIsShownModal(true);
									setIFrameSrc(
										"https://www.coohom.com/pub/tool/yundesign/cloud?designid=3FO40GHV6QF1&redirecturl=/pub/saas/apps/project/list&redirectbim=false&locale=en_US",
									);
								}
							}}
						>
							<div
								className={joinTxts(
									"border-4 hover:scale-110 hover:shadow-md hover:z-10",
									imageSelected == 3 ? "border-blue-500" : null,
								)}
							>
								<img
									src="../images/suggested-designs/33.png"
									alt="suggested-design"
									className="border-white border-4 cursor-pointer  h-[400px]"
								/>
							</div>
						</Stack>
					</Stack>
				</Stack>
				<Stack column={true} className="py-8 border-b-gray-200 border-b">
					<table className="table-auto">
						<thead className="border-b-gray-200 border-b ">
							<tr className="text-blue-500 text-lg">
								<th className="pb-2 w-1/12">Id</th>
								<th className="pb-2 w-2/12">Image</th>
								<th className="pb-2 w-4/12">Name</th>
								<th className="pb-2 w-3/12">Trademark</th>
								<th className="pb-2 w-1/12">Amount</th>
								<th className="pb-2 w-1/12">Verify</th>
							</tr>
						</thead>
						<tbody>
							{materials.map((material, index) => {
								return (
									<tr key={index} className="text-lg">
										<td className="text-center align-middle">1</td>
										<td className="text-center align-middle">
											<Stack className="justify-center p-2">
												<img
													src={material.image}
													alt="suggested-design"
													className="border-white border-4 cursor-pointer rounded-full w-[100px] h-[100px]"
												/>
											</Stack>
										</td>
										<td className="text-center align-middle">{material.name}</td>
										<td className="text-center align-middle">{material.trademark}</td>
										<td className="text-center align-middle">
											<Stack className="gap-2">
												<Input
													type={"number"}
													value={material.amount}
													onChange={(e) => {
														handleChangeInputAmount(index, e);
													}}
												/>
												{material.unit}
											</Stack>
										</td>
										<td className="text-center align-middle">
											<a href={material.urlVerify} target="_blank" className="hover:text-blue-500 font-bold">
												Check
											</a>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</Stack>
				{/* <Stack column={true} className="py-8 border-b-gray-200 border-b">
					<H5 className="text-green-500 mb-8">You have completed all requirements</H5>
					<Stack className="gap-4 items-center">
						<Button className="!px-4 !py-1" type="fill">
							Publish Now
						</Button>
						<Button className="!px-4 !py-1" type="outline">
							Save
						</Button>
					</Stack>
				</Stack> */}
			</Stack>
			<Modal
				isShown={isShownModal}
				onClose={() => {
					setIsShownModal(false);
					setIFrameSrc(null);
				}}
				withFull={true}
			>
				{iFrameSrc && (
					<div className="bg-white p-1 w-full">
						<iframe src={iFrameSrc} className="w-full h-full"></iframe>
					</div>
				)}
			</Modal>
		</>
	);
};

export default AddToMarketplacePage;

// {/* 2 */}
// <Stack className="py-8 border-b-gray-200 border-b">
// <Stack column={true} className="basis-1/2 gap-8 items-stretch">
// 	<Stack className="pl-6 gap-12 ">
// 		<H4 className="text-gray-700">Splitting Rooms:</H4>
// 	</Stack>
// 	{detailDrawing?.rooms?.map((room, i) => {
// 		return (
// 			<Stack className="ml-32 items-stretch" key={i}>
// 				<Stack className="gap-2 items-center basis-1/3">
// 					<div
// 						className={`w-4 h-4 rounded-full border-white border-2`}
// 						style={{ backgroundColor: splittingRoomColor[room.name] }}
// 					/>
// 					<Small style={{ color: splittingRoomColor[room.name] }}>{room.name}</Small>
// 				</Stack>
// 				<Stack className="basis-2/3">
// 					<Small className="text-blue-700">{room.amount} Rooms</Small>
// 				</Stack>
// 			</Stack>
// 		);
// 	})}
// </Stack>
// <Stack column={true} className="basis-1/2 gap-8 items-stretch">
// 	<Stack className="ml-32 items-stretch">
// 		<Stack className="gap-2 items-center basis-1/3">
// 			<H4 className="text-gray-700">Number Of Floors:</H4>
// 		</Stack>
// 		<Stack className="basis-2/3">
// 			<H4 className="text-blue-700">
// 				{Number.isInteger(detailDrawing?.numberOfFloors) ? detailDrawing?.numberOfFloors : "_"} Floors
// 			</H4>
// 		</Stack>
// 	</Stack>
// 	<Stack className="ml-32 items-stretch">
// 		<Stack className="gap-2 items-center basis-1/3 justify-end pr-8">
// 			<Small className="text-gray-500">Height of each:</Small>
// 		</Stack>
// 		<Stack className="basis-2/3">
// 			<Small className="text-blue-700">
// 				{Number.isInteger(detailDrawing?.heightOfEachFloors) ? detailDrawing?.heightOfEachFloors : "_"} m
// 			</Small>
// 		</Stack>
// 	</Stack>
// 	<Stack className="ml-32 items-stretch">
// 		<Stack className="gap-2 items-center basis-1/3">
// 			<H4 className="text-gray-700">Theme Colors:</H4>
// 		</Stack>
// 		<Stack className="basis-2/3">
// 			<H4 className="text-blue-700">{detailDrawing?.themeColor || "_"}</H4>
// 		</Stack>
// 	</Stack>
// </Stack>
// </Stack>
// {/* 3 */}
// <Stack className="py-8 border-b-gray-200 border-b">
// <Stack column={true} className="basis-1/2 gap-8 items-stretch">
// 	<Stack className="pl-6 gap-12 ">
// 		<H4 className="text-gray-700">Additional Information:</H4>
// 	</Stack>
// 	<Stack column={true} className="gap-4 items-stretch">
// 		{detailDrawing?.additionalInformation &&
// 			Object.keys(detailDrawing?.additionalInformation).map((info, i) => {
// 				return (
// 					<Stack className="pl-6 items-stretch" key={i}>
// 						<Stack className="gap-2 items-center basis-1/2">
// 							<H5 className="text-gray-500">{info}:</H5>
// 						</Stack>
// 						<Stack className="basis-2/3">
// 							<H5 className="text-blue-700">
// 								{String(
// 									detailDrawing?.additionalInformation[
// 										info as keyof typeof detailDrawing.additionalInformation
// 									],
// 								)}
// 							</H5>
// 						</Stack>
// 					</Stack>
// 				);
// 			})}
// 	</Stack>
// </Stack>
// </Stack>
// {/* 4 */}
// <Stack className="py-8 border-b-gray-200 border-b">
// <Stack column={true} className="basis-1/2 gap-8 items-stretch">
// 	<Stack className="pl-6 gap-12 ">
// 		<H4 className="text-gray-700 ">Bounty Reward:</H4>
// 	</Stack>

// 	<Stack column={true} className="gap-6 items-stretch">
// 		{rewards.map((reward, i) => {
// 			return (
// 				<Stack column={true} className="pl-6 gap-4 items-stretch" key={i}>
// 					<Stack className="gap-2 items-center basis-1/2">
// 						<img
// 							src={"https://cryptologos.cc/logos/avalanche-avax-logo.png"}
// 							alt="suggested-design"
// 							className=" rounded-full border-white border-2 "
// 							width={32}
// 							height={32}
// 						/>
// 						<H4 style={{ color: reward.color }}>
// 							{reward.name}: {reward.value} {reward.symbol}
// 						</H4>
// 					</Stack>
// 					<Stack className="basis-2/3">
// 						<H5 className="text-gray-500">
// 							1{reward.symbol} ~ {reward.price} USD
// 						</H5>
// 					</Stack>
// 				</Stack>
// 			);
// 		})}
// 	</Stack>
// 	<div>
// 		<Button className="flex justify-center" type="outline" LeftItem={AddCircleOutline}>
// 			Add method
// 		</Button>
// 	</div>
// </Stack>
// </Stack>
