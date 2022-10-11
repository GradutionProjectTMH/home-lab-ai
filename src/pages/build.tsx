import * as React from "react";
import type { HeadFC } from "gatsby";
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

const rooms = [
	{
		name: "Public Area",
		bgColor: "bg-gray-500",
		textColor: "text-gray-500",
	},
	{
		name: "Bedroom",
		bgColor: "bg-green-500",
		textColor: "text-green-500",
	},
	{
		name: "Bathroom",
		bgColor: "bg-blue-500",
		textColor: "text-blue-500",
	},
	{
		name: "Kitchen",
		bgColor: "bg-purple-500",
		textColor: "text-purple-500",
	},
	{
		name: "Balcony",
		bgColor: "bg-pink-500",
		textColor: "text-pink-500",
	},
	{
		name: "Living Room",
		bgColor: "bg-yellow-500",
		textColor: "text-yellow-500",
	},
];

const IndexPage = () => {
	const [currentRoom, setCurrentRoom] = React.useState(rooms[0].name);

	const handleRoomClicked = (room: string) => {
		setCurrentRoom(room);
	};

	return (
		<Body>
			<section className="container mx-auto">
				<Stack className="pt-36 items-stretch">
					<Stack column className="grow gap-8 items-stretch">
						<Stack column className="gap-1">
							<H4 className="text-gray-500">Your Idea</H4>
							<div className="h-[33rem] bg-white"></div>
						</Stack>
					</Stack>

					<Stack column className="mx-2 justify-center items-center gap-4">
						<ButtonIcon Icon={ChevronRightSvg} className="w-12 h-12 fill-gray-500" />
						<H5 className="block [writing-mode:vertical-lr] rotate-180 font-medium text-gray-400 tracking-widest">
							TRANSFORM
						</H5>
						<ButtonIcon Icon={ChevronLeftSvg} className="w-12 h-12 fill-gray-500" />
					</Stack>

					<Stack column className="grow gap-8 items-stretch">
						<Stack column className="gap-1">
							<H4 className="text-gray-500">Your Idea</H4>
							<div className="h-[33rem] bg-white"></div>
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
										room.bgColor,
										currentRoom == room.name ? "w-10 h-10" : "w-8 h-8",
									)}
								/>
								<Strong className={room.textColor}>{room.name}</Strong>
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
								<H4 className="text-gray-700">Additional Infor:</H4>
								<Text className="text-gray-500">Members:</Text>
								<Text className="text-gray-500">Style:</Text>
								<Text className="text-gray-500">Budget:</Text>
								<Text className="text-gray-500">Location:</Text>
								<Text className="text-gray-500">Located at alley:</Text>
								<Text className="text-gray-500">Business in house:</Text>
								<Text className="text-gray-500">Others:</Text>
							</Stack>
							<Stack column className="items-start gap-4">
								<H4 className="text-green-700">Very detailed</H4>
								<Text className="text-blue-700">Mother, Father, 2 Son, 1 Daughter, 1 Baby</Text>
								<Text className="text-blue-700">Basic, Ancient</Text>
								<Text className="text-blue-700">Danang City</Text>
								<Text className="text-blue-700">Mother, Father, 2 Son, 1 Daughter, 1 Baby</Text>
								<Text className="text-blue-700">Yes</Text>
								<Text className="text-blue-700">Yes</Text>
								<Text className="text-blue-700">Has pool, wallpaper</Text>
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

export default IndexPage;

export const Head: HeadFC = () => <Seo title="Building" />;
