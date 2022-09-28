import * as React from "react";
import type { HeadFC } from "gatsby";
import Body from "../components/body";
import Stack from "../components/layout/stack";
import H4 from "../components/typography/h4";
import Seo from "../components/seo";
import ButtonIcon from "../components/button-icon";
import ChevronRightSvg from "../svgs/chevron-right.svg";
import ChevronLeftSvg from "../svgs/chevron-left.svg";
import H5 from "../components/typography/h5";
import Strong from "../components/typography/strong";
import { joinTxts } from "../utils/text.util";

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
			</section>
		</Body>
	);
};

export default IndexPage;

export const Head: HeadFC = () => <Seo title="Building" />;
