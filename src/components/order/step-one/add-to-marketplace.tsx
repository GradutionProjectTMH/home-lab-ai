import * as React from "react";
import Stack from "../../layout/stack";
import Button from "../../button";
import H5 from "../../typography/h5";
import H4 from "../../typography/h4";
import Small from "../../typography/small";
import { ReactComponent as AddCircleOutline } from "../../../svgs/add_circle_outline.svg";
import { DetailDrawing } from "../../../interfaces/detail-drawing.interface";
import { splittingRoomColor } from "../../../utils/room-color";

const info = [
	{
		key: "Members",
		value: "Mother, Father, 2 Son, 1 Daughter, 1 Baby",
	},
	{
		key: "Titles",
		value: "Basic, Ancent",
	},
	{
		key: "Wallpaper",
		value: "Yes",
	},
	{
		key: "Budget",
		value: "3M VND - 5M VND",
	},
	{
		key: "Location",
		value: "Danang City",
	},
	{
		key: "Located at alley",
		value: "Yes",
	},
	{
		key: "Business in house",
		value: "Yes",
	},
];

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

type AddToMarketplaceProp = {
	setCurrentPage: React.Dispatch<React.SetStateAction<"Order" | "Marketplace">>;
	detailDrawing: DetailDrawing | undefined;
};

const AddToMarketplacePage = ({ detailDrawing, setCurrentPage }: AddToMarketplaceProp) => {
	const handleHiring = () => {
		window.scrollTo(0, 0);
		setCurrentPage("Order");
	};
	console.log(detailDrawing);
	console.log(detailDrawing?.numberOfFloors);

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
								Add to Marketplace
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
				{/* 2 */}
				<Stack className="py-8 border-b-gray-200 border-b">
					<Stack column={true} className="basis-1/2 gap-8 items-stretch">
						<Stack className="pl-6 gap-12 ">
							<H4 className="text-gray-700">Splitting Rooms:</H4>
						</Stack>
						{detailDrawing?.rooms.map((room, i) => {
							return (
								<Stack className="ml-32 items-stretch" key={i}>
									<Stack className="gap-2 items-center basis-1/3">
										<div
											className={`w-4 h-4 rounded-full border-white border-2`}
											style={{ backgroundColor: splittingRoomColor[room.name] }}
										/>
										<Small style={{ color: splittingRoomColor[room.name] }}>{room.name}</Small>
									</Stack>
									<Stack className="basis-2/3">
										<Small className="text-blue-700">{room.amount} Rooms</Small>
									</Stack>
								</Stack>
							);
						})}
					</Stack>
					<Stack column={true} className="basis-1/2 gap-8 items-stretch">
						<Stack className="ml-32 items-stretch">
							<Stack className="gap-2 items-center basis-1/3">
								<H4 className="text-gray-700">Number Of Floors:</H4>
							</Stack>
							<Stack className="basis-2/3">
								<H4 className="text-blue-700">
									{Number.isInteger(detailDrawing?.numberOfFloors) ? detailDrawing?.numberOfFloors : "_"} Floors
								</H4>
							</Stack>
						</Stack>
						<Stack className="ml-32 items-stretch">
							<Stack className="gap-2 items-center basis-1/3 justify-end pr-8">
								<Small className="text-gray-500">Height of each:</Small>
							</Stack>
							<Stack className="basis-2/3">
								<Small className="text-blue-700">
									{Number.isInteger(detailDrawing?.heightOfEachFloors) ? detailDrawing?.heightOfEachFloors : "_"} m
								</Small>
							</Stack>
						</Stack>
						<Stack className="ml-32 items-stretch">
							<Stack className="gap-2 items-center basis-1/3">
								<H4 className="text-gray-700">Theme Colors:</H4>
							</Stack>
							<Stack className="basis-2/3">
								<H4 className="text-blue-700">{detailDrawing?.themeColor || "_"}</H4>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
				{/* 3 */}
				<Stack className="py-8 border-b-gray-200 border-b">
					<Stack column={true} className="basis-1/2 gap-8 items-stretch">
						<Stack className="pl-6 gap-12 ">
							<H4 className="text-gray-700">Additional Information:</H4>
						</Stack>
						<Stack column={true} className="gap-4 items-stretch">
							{detailDrawing?.additionalInformation &&
								Object.keys(detailDrawing?.additionalInformation).map((info, i) => {
									return (
										<Stack className="pl-6 items-stretch" key={i}>
											<Stack className="gap-2 items-center basis-1/2">
												<H5 className="text-gray-500">{info}:</H5>
											</Stack>
											<Stack className="basis-2/3">
												<H5 className="text-blue-700">
													{String(
														detailDrawing?.additionalInformation[
															info as keyof typeof detailDrawing.additionalInformation
														],
													)}
												</H5>
											</Stack>
										</Stack>
									);
								})}
						</Stack>
					</Stack>
				</Stack>
				{/* 4 */}
				<Stack className="py-8 border-b-gray-200 border-b">
					<Stack column={true} className="basis-1/2 gap-8 items-stretch">
						<Stack className="pl-6 gap-12 ">
							<H4 className="text-gray-700 ">Bounty Reward:</H4>
						</Stack>

						<Stack column={true} className="gap-6 items-stretch">
							{rewards.map((reward, i) => {
								return (
									<Stack column={true} className="pl-6 gap-4 items-stretch" key={i}>
										<Stack className="gap-2 items-center basis-1/2">
											<img
												src={"https://cryptologos.cc/logos/avalanche-avax-logo.png"}
												alt="suggested-design"
												className=" rounded-full border-white border-2 "
												width={32}
												height={32}
											/>
											<H4 style={{ color: reward.color }}>
												{reward.name}: {reward.value} {reward.symbol}
											</H4>
										</Stack>
										<Stack className="basis-2/3">
											<H5 className="text-gray-500">
												1{reward.symbol} ~ {reward.price} USD
											</H5>
										</Stack>
									</Stack>
								);
							})}
						</Stack>
						<div>
							<Button className="flex justify-center" type="outline" LeftItem={AddCircleOutline}>
								Add method
							</Button>
						</div>
					</Stack>
				</Stack>
				<Stack column={true} className="py-8 border-b-gray-200 border-b">
					<H5 className="text-green-500 mb-8">You have completed all requirements</H5>
					<Stack className="gap-4 items-center">
						<Button className="!px-4 !py-1" type="fill">
							Publish Now
						</Button>
						<Button className="!px-4 !py-1" type="outline">
							Save
						</Button>
					</Stack>
				</Stack>
			</Stack>
		</>
	);
};

export default AddToMarketplacePage;
