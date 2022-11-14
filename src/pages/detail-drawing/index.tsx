import * as React from "react";
import type { HeadFC } from "gatsby";
import Body from "../../components/body";
import Stack from "../../components/layout/stack";
import Seo from "../../components/seo";
import Carousel from "../../components/carousel";
import { StaticImage } from "gatsby-plugin-image";
import Strong from "../../components/typography/strong";
import Button from "../../components/button";
import H5 from "../../components/typography/h5";
import H4 from "../../components/typography/h4";
import Small from "../../components/typography/small";
import AddTaskOutlinedSvg from "../../svgs/add-task-outlined.svg";
import TrashOutlined from "../../svgs/trash-outlined.svg";

const splittingRooms = [
	{
		color: "#718096",
		name: "Public Area",
		amount: 1,
	},
	{
		color: "#38A169",
		name: "Bedroom",
		amount: 1,
	},
	{
		color: "#3182CE",
		name: "Bathroom",
		amount: 1,
	},
	{
		color: "#805AD5",
		name: "Kitchen",
		amount: 1,
	},
	{
		color: "#D53F8C",
		name: "Balcony",
		amount: 1,
	},
	{
		color: "#D69E2E",
		name: "Living Room",
		amount: 1,
	},
];

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

const Index = () => {
	const iFrameRef = React.useRef();
	const [iFrameHeight, setIFrameHeight] = React.useState("0px");

	const handleClick = (data: any) => {
		console.log(data);
	};
	return (
		<Body>
			<section className="pt-36 container mx-auto">
				<Carousel title="Requirements" defaultOpened>
					<Stack column={true} className="mt-8">
						{/* 1 */}
						<Stack className="pb-8 border-b-gray-200 border-b">
							<Stack column={true} className="basis-1/2 gap-8 items-stretch">
								<Stack className="pl-6 gap-12 ">
									<H4 className="text-gray-700 ">Bounty Reward:</H4>
								</Stack>

								<Stack column={true} className="gap-6 items-stretch">
									{rewards.map((reward, i) => {
										return (
											<Stack column={true} className="pl-6 gap-4 items-stretch" key={i}>
												<Stack className="gap-2 items-center basis-1/2">
													<StaticImage
														src={"https://cryptologos.cc/logos/avalanche-avax-logo.png"}
														alt="suggested-design"
														className=" rounded-full border-white border-2 "
														aspectRatio={1}
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
							</Stack>

							<Stack column={true} className="basis-1/2 gap-8 items-stretch ">
								<Stack className="basis-1/2 gap-2 items-stretch">
									<StaticImage
										src="../images/suggested-designs/33.png"
										alt="suggested-design"
										className="cursor-pointer basis-1/2 hover:scale-110 hover:shadow-md hover:z-10"
									/>
									<StaticImage
										src="../images/suggested-designs/33.png"
										alt="suggested-design"
										className="cursor-pointer basis-1/2 hover:scale-110 hover:shadow-md hover:z-10"
									/>
								</Stack>
								<Button className="!px-4 !py-1 justify-center items-center" type="outline">
									Working in stage 1
								</Button>
							</Stack>
						</Stack>
						{/* 2 */}
						<Stack className="py-8 border-b-gray-200 border-b">
							<Stack column={true} className="basis-1/2 gap-8 items-stretch">
								<Stack className="pl-6 gap-12 ">
									<H4 className="text-gray-700">Spliting Rooms:</H4>
								</Stack>
								{splittingRooms.map((splittingRoom, i) => {
									return (
										<Stack className="ml-32 items-stretch" key={i}>
											<Stack className="gap-2 items-center basis-1/3">
												<div
													className={`w-4 h-4 rounded-full border-white border-2`}
													style={{ backgroundColor: splittingRoom.color }}
												/>
												<Small style={{ color: splittingRoom.color }}>{splittingRoom.name}</Small>
											</Stack>
											<Stack className="basis-2/3">
												<Small className="text-blue-700">{splittingRoom.amount} Rooms</Small>
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
										<H4 className="text-blue-700">3 Floors</H4>
									</Stack>
								</Stack>
								<Stack className="ml-32 items-stretch">
									<Stack className="gap-2 items-center basis-1/3 justify-end pr-8">
										<Small className="text-gray-500">Height of each:</Small>
									</Stack>
									<Stack className="basis-2/3">
										<Small className="text-blue-700">10 m</Small>
									</Stack>
								</Stack>
								<Stack className="ml-32 items-stretch">
									<Stack className="gap-2 items-center basis-1/3">
										<H4 className="text-gray-700">Theme Colors:</H4>
									</Stack>
									<Stack className="basis-2/3">
										<H4 className="text-blue-700">White, Yellow</H4>
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
									{info.map((e, i) => {
										return (
											<Stack className="pl-6 items-stretch" key={i}>
												<Stack className="gap-2 items-center basis-1/2">
													<H5 className="text-gray-500">{e.key}:</H5>
												</Stack>
												<Stack className="basis-2/3">
													<H5 className="text-blue-700">{e.value}</H5>
												</Stack>
											</Stack>
										);
									})}
								</Stack>
							</Stack>
							<Stack column={true} className="basis-1/2 gap-8 items-end justify-end pr-28">
								<Stack className="pl-6 gap-12 ">
									<Stack column={true} className="items-end gap-3">
										<H4 className="text-gray-700">House Boundary:</H4>
										<Small className="text-gray-500">Width:</Small>
										<Small className="text-gray-500">Length:</Small>
									</Stack>
									<Stack column={true} className="gap-3">
										<H4 className="text-blue-700">35m2</H4>
										<Small className="text-gray-500">5 m</Small>
										<Small className="text-gray-500">10</Small>
									</Stack>
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</Carousel>
			</section>
			<section className="pt-36 container mx-auto">
				<Carousel title="First floor 3D model " defaultOpened>
					<Stack column={true} className="p-8 gap-8">
						<Stack>
							<div className="bg-white p-1 w-full">
								<iframe
									src="https://www.coohom.com/pub/tool/yundesign/cloud?designid=3FO3W8MXUB63&redirecturl=/pub/saas/apps/project/list&redirectbim=false&locale=en_US"
									className="w-full h-[700px]"
								></iframe>
							</div>
						</Stack>
						<Stack className="gap-8">
							{Array(3)
								.fill(0)
								.map((_, index) => {
									return (
										<div className="bg-white p-1 basis-1/3" key={index} onClick={() => handleClick(index)}>
											<StaticImage
												src="../images/suggested-designs/33.png"
												alt="suggested-design"
												className="cursor-pointer hover:scale-110 hover:shadow-md hover:z-10  w-full"
											/>
										</div>
									);
								})}
						</Stack>
						<Stack className="gap-4 mt-2 justify-center">
							<Button type="outline" className="px-4 py-1" LeftItem={AddTaskOutlinedSvg}>
								<Strong className="text-sm">I choose this</Strong>
							</Button>
							<Button type="ghost" className="px-4 py-1 text-red-500 !fill-red-500" LeftItem={TrashOutlined}>
								<Strong className="text-sm">Send message</Strong>
							</Button>
						</Stack>
					</Stack>
				</Carousel>
				<div className="h-[1px] my-4 bg-gray-300"></div>
				<Stack column={true} className="pb-20 px-6">
					<H5 className="text-green-500 my-8">13 days remaining to finish your work</H5>
					<Stack className="gap-4 items-center">
						<Button className="!px-4 !py-1" type="fill">
							Publish Now
						</Button>
						<Button className="!px-4 !py-1" type="outline">
							Save
						</Button>
					</Stack>
				</Stack>
			</section>
		</Body>
	);
};

export default Index;

export const Head: HeadFC = () => <Seo title="Add To Marketplace" />;
