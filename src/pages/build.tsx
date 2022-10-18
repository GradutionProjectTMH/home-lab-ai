import * as React from "react";
import type { HeadFC } from "gatsby";
import useImage from "use-image";
import { Image, Layer, Rect, Shape, Stage } from "react-konva";
import { colors } from "../configs/tailwind-theme.config";
import { joinTxts } from "../utils/text.util";
import { StaticImage } from "gatsby-plugin-image";
import Body from "../components/body";
import Stack from "../components/layout/stack";
import H4 from "../components/typography/h4";
import Seo from "../components/seo";
import ButtonIcon from "../components/button-icon";
import Strong from "../components/typography/strong";
import H5 from "../components/typography/h5";
import Text from "../components/typography/text";
import Carousel from "../components/carousel";
import Button from "../components/button";
import ChevronRightSvg from "../svgs/chevron-right.svg";
import ChevronLeftSvg from "../svgs/chevron-left.svg";
import DownloadSvg from "../svgs/download.svg";
import PencilSvg from "../svgs/pencil.svg";
import G2P from "../apis/g2p";

const rooms = [
	{
		id: 0,
		name: "Public Area",
		labels: ["LivingRoom", "Storage", "Balcony", "Entrance"],
		colorTheme: "gray",
	},
	{
		id: 1,
		name: "Bedroom",
		labels: ["MasterRoom", "SecondRoom", "ChildRoom", "StudyRoom", "GuestRoom"],
		colorTheme: "yellow",
	},
	{
		id: 2,
		name: "Function Area",
		labels: ["Bathroom", "Kitchen", "DiningRoom"],
		colorTheme: "green",
	},
	{
		id: 3,
		name: "External",
		labels: [
			"External",
			"External",
			"External",
			"External",
			"External",
			"External",
			"External",
			"External",
			"External",
			"External",
		],
		colorTheme: "blue",
	},
];

const BuildPage = ({ location }: any) => {
	const [currentRoom, setCurrentRoom] = React.useState<string>(rooms[0].name);
	const [leftFloorPlan, setLeftFloorPlan] = React.useState<any>(null);

	const handleRoomClicked = (room: string) => {
		setCurrentRoom(room);
	};

	const handleTransferButtonClicked = async () => {
		const res = await G2P.adjustGraph();
		console.log(res.data);
		setLeftFloorPlan(res.data);
	};

	const { entities } = location.state;

	const door = leftFloorPlan?.door.split(",").map(Number);
	return (
		<Body>
			<section className="container mx-auto">
				<Stack className="pt-36 items-stretch">
					<Stack column className="grow gap-8 items-stretch">
						<Stack column className="gap-1">
							<H4 className="text-gray-500">Your Idea</H4>
							<Stack className="h-[33rem] bg-white justify-center items-center">
								<Stage width={512} height={512}>
									<Layer scale={{ x: 2, y: 2 }}></Layer>
								</Stage>
							</Stack>
						</Stack>
					</Stack>

					<Stack column className="mx-2 justify-center items-center gap-4">
						<ButtonIcon
							Icon={ChevronRightSvg}
							className="w-12 h-12 fill-gray-500"
							onClick={handleTransferButtonClicked}
						/>
						<H5 className="block [writing-mode:vertical-lr] rotate-180 font-medium text-gray-400 tracking-widest">
							TRANSFER
						</H5>
						<ButtonIcon Icon={ChevronLeftSvg} className="w-12 h-12 fill-gray-500" />
					</Stack>

					<Stack column className="grow gap-8 items-stretch">
						<Stack column className="gap-1">
							<H4 className="text-gray-500">Floor Plan</H4>
							<Stack className="h-[33rem] bg-white justify-center items-center">
								<Stage width={512} height={512}>
									<Layer scale={{ x: 2, y: 2 }}>
										{leftFloorPlan?.roomret.map((plan: any[], index: number) => {
											const [[x1, y1, x2, y2], [label], id] = plan;
											const room = rooms.find((room) => room.labels.includes(label));
											return (
												<Rect
													key={id}
													x={x1}
													y={y1}
													width={x2 - x1}
													height={y2 - y1}
													fill={(colors as any)[room?.colorTheme!][200]}
													stroke={(colors as any)["gray"][700]}
												/>
											);
										})}
										{leftFloorPlan?.windows.map((position: number[]) => {
											const [x, y, width, height]: number[] = position;

											return (
												<Rect
													key={position.join(",")}
													x={x}
													y={y}
													width={width}
													height={height}
													fill={(colors as any)["white"]}
													stroke={(colors as any)["gray"][700]}
												/>
											);
										})}
										{door && (
											<Rect
												x={door[0]}
												y={door[1]}
												width={door[2] - door[0]}
												height={door[3] - door[1]}
												stroke={(colors as any)["yellow"][400]}
											/>
										)}
									</Layer>
								</Stage>
							</Stack>
						</Stack>
					</Stack>
				</Stack>

				<Stack column className="items-stretch mt-8">
					<Stack className="justify-center gap-10">
						{rooms.map((room) => (
							<Stack
								column
								key={room.name}
								className="items-center gap-2 cursor-pointer"
								onClick={() => handleRoomClicked(room.name)}
							>
								<div
									className={joinTxts(
										"rounded-full border-4 border-white",
										currentRoom == room.name ? "w-10 h-10" : "w-8 h-8",
									)}
									style={{ backgroundColor: (colors as any)[room.colorTheme][500] }}
								/>
								<Strong
									style={{
										color: (colors as any)[room.colorTheme][500],
									}}
								>
									{room.name}
								</Strong>
							</Stack>
						))}
					</Stack>
				</Stack>

				<Stack className="mt-4">
					<StaticImage
						src="../images/suggested-designs/33.png"
						alt="suggested-design"
						className="cursor-pointer hover:scale-110 hover:shadow-md hover:z-10"
					/>
					<StaticImage
						src="../images/suggested-designs/33.png"
						alt="suggested-design"
						className="cursor-pointer hover:scale-110 hover:shadow-md hover:z-10"
					/>
					<StaticImage
						src="../images/suggested-designs/33.png"
						alt="suggested-design"
						className="cursor-pointer hover:scale-110 hover:shadow-md hover:z-10"
					/>
					<StaticImage
						src="../images/suggested-designs/33.png"
						alt="suggested-design"
						className="cursor-pointer hover:scale-110 hover:shadow-md hover:z-10"
					/>
					<StaticImage
						src="../images/suggested-designs/33.png"
						alt="suggested-design"
						className="cursor-pointer hover:scale-110 hover:shadow-md hover:z-10"
					/>
					<StaticImage
						src="../images/suggested-designs/33.png"
						alt="suggested-design"
						className="cursor-pointer hover:scale-110 hover:shadow-md hover:z-10"
					/>
					<StaticImage
						src="../images/suggested-designs/33.png"
						alt="suggested-design"
						className="cursor-pointer hover:scale-110 hover:shadow-md hover:z-10"
					/>
					<StaticImage
						src="../images/suggested-designs/33.png"
						alt="suggested-design"
						className="cursor-pointer hover:scale-110 hover:shadow-md hover:z-10"
					/>
					<StaticImage
						src="../images/suggested-designs/33.png"
						alt="suggested-design"
						className="cursor-pointer hover:scale-110 hover:shadow-md hover:z-10"
					/>
					<StaticImage
						src="../images/suggested-designs/33.png"
						alt="suggested-design"
						className="cursor-pointer hover:scale-110 hover:shadow-md hover:z-10"
					/>
				</Stack>

				<Stack className="mt-4 justify-center font-medium text-gray-400 tracking-widest">
					<H5 className="">RECOMMENDED DESIGNS</H5>
				</Stack>
			</section>

			<section className="container mx-auto mt-4">
				<Carousel title="Advanced Section">
					<Stack className="mt-4 px-6 flex-wrap gap-y-4">
						<Stack className="basis-1/2 gap-12">
							<Stack column className="items-end gap-4">
								<H4 className="text-gray-700">House boundary:</H4>
								<Text className="text-gray-500">Width:</Text>
								<Text className="text-gray-500">Length:</Text>
							</Stack>
							<Stack column className="items-start gap-4">
								<H4 className="text-blue-700">35m2</H4>
								<Text className="text-blue-700">5m</Text>
								<Text className="text-blue-700">10m</Text>
							</Stack>
						</Stack>

						<Stack className="basis-1/2 gap-12">
							<Stack column className="items-end gap-4">
								<H4 className="text-gray-700">Number Of floors:</H4>
								<Text className="text-gray-500">Height of each:</Text>
							</Stack>
							<Stack column className="items-start gap-4">
								<H4 className="text-blue-700">3 Floors</H4>
								<Text className="text-blue-700">10 m</Text>
							</Stack>
						</Stack>

						<Stack className="basis-1/2 gap-12">
							<Stack column className="items-end gap-4">
								<H4 className="text-gray-700">Theme Colors:</H4>
							</Stack>
							<Stack column className="items-start gap-4">
								<H4 className="text-blue-700">White, Yellow</H4>
							</Stack>
						</Stack>
					</Stack>

					<div className="h-[1px] my-4 bg-gray-200"></div>

					<Stack column className="mt-4 px-6 gap-4">
						<Stack className="gap-12">
							<Stack column className="items-end gap-4">
								<H4 className="text-gray-700">Entities list:</H4>
								{entities &&
									entities.map((entity: any) => (
										<Text key={entity.entityId} className="text-gray-700">
											{entity.entityEnglishId}
										</Text>
									))}
							</Stack>
							<Stack column className="items-start gap-4">
								<H4 className="text-gray-500">Confidence score</H4>
								{entities &&
									entities.map((entity: any) => (
										<Text key={entity.entityId} className="text-gray-500">
											{entity.confidenceScore}
										</Text>
									))}
							</Stack>
						</Stack>
					</Stack>
				</Carousel>
			</section>

			<section className="container mx-auto py-4">
				<Stack className="justify-center gap-4 mt-6">
					<Button type="outline" LeftItem={DownloadSvg} className="!px-4 !py-1">
						Save
					</Button>
					<Button type="outline" LeftItem={PencilSvg} className="!px-4 !py-1">
						Load
					</Button>
					<Button type="fill" className="!px-4 !py-1">
						Make Order
					</Button>
				</Stack>
			</section>
		</Body>
	);
};

export default BuildPage;

export const Head: HeadFC = () => <Seo title="Building" />;
