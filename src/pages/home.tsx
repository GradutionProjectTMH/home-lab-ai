import * as React from "react";
import { HeadFC, navigate } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import Body from "../components/body";
import H1 from "../components/typography/h1";
import Stack from "../components/layout/stack";
import Text from "../components/typography/text";
import Button from "../components/button";
import H4 from "../components/typography/h4";
import MicSvg from "../svgs/mic-outlined.svg";
import LightBulbSvg from "../svgs/light-bulb.svg";
import ButtonIcon from "../components/button-icon";
import Small from "../components/typography/small";
import TextRazor from "../apis/text-razor.api";
import { useDispatch } from "react-redux";
import { pushInfo } from "../redux/slices/message.slice";

const HomePage = () => {
	const dispatch = useDispatch();
	const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

	const handleExtractorClicked = async () => {
		dispatch(pushInfo("We are processing your dream"));

		const res = await TextRazor.extract(textAreaRef.current!.value, [
			"entities",
			"topics",
			"words",
			"phrases",
			"dependency-trees",
			"relations",
			"entailments",
			"senses",
			"spelling",
		]);

		navigate("/build", {
			state: {
				text_razor: res.data.response,
			},
		});
	};

	const handleTryItButtonClicked = () => {
		textAreaRef.current?.focus();
	};

	return (
		<Body>
			<section className="container mx-auto">
				<Stack className="pt-48 items-stretch">
					<Stack column className="basis-1/2 gap-8 justify-center">
						<Stack column className="gap-6">
							<H1 className="!font-display !text-7xl text-blue-700">Make house</H1>
							<H1 className="!font-display !font-light !text-7xl text-blue-700">for better</H1>
							<H1 className="!font-display !text-7xl text-blue-700">living.</H1>
						</Stack>

						<Stack column className="gap-4">
							<Text className="text-gray-500">
								We combine your idea, Graph Design AI <br />
								and Blockchain platform to simplify your solution...
							</Text>

							<Stack className="gap-4">
								<Button type="fill" onClick={handleTryItButtonClicked}>
									TRY IT NOW
								</Button>
								<Button type="outline">READ MORE</Button>
							</Stack>
						</Stack>
					</Stack>

					<Stack className="basis-1/2 gap-4 drop-shadow-[12px_40px_36px_rgba(26,54,93,0.32)]">
						<StaticImage
							src="../images/living-room-1.jpg"
							alt="living-room-1"
							width={296}
							className="h-[32rem]"
							placeholder="blurred"
						/>
						<StaticImage src="../images/living-room-2.jpg" alt="living-room-2" width={296} className="h-[32rem]" />
					</Stack>
				</Stack>
			</section>

			<section className="relative">
				<div className="container mx-auto">
					<Stack className="mt-14 items-stretch justify-between">
						<Stack column className="bg-white shadow-xl shadow-blackAlpha-100">
							<textarea cols={64} rows={3} className="resize-none !outline-none p-4 border-0" ref={textAreaRef} />
							<Stack className="justify-between items-center mx-4 mb-2">
								<Small className="text-blue-500">Tell us your dream house will be...</Small>
								<Stack className="gap-1">
									<ButtonIcon Icon={MicSvg} className="w-10 h-10 !fill-gray-500" />
									<ButtonIcon
										Icon={LightBulbSvg}
										className="w-10 h-10 !fill-blue-500"
										onClick={handleExtractorClicked}
									/>
								</Stack>
							</Stack>
						</Stack>

						<Stack className="basis-1/2 items-center">
							<Stack className="bg-white gap-9 w-full">
								<Stack column className="items-center bg-blue-700 p-3">
									<H4 className="text-gray-100">800+</H4>
									<Text className="text-gray-100">Accepted Designs</Text>
								</Stack>
								<Stack column className="items-center p-3">
									<H4 className="text-gray-500">08</H4>
									<Text className="text-gray-500">Room Types</Text>
								</Stack>
								<Stack column className="items-center p-3">
									<H4 className="text-gray-500">300+</H4>
									<Text className="text-gray-500">Orders</Text>
								</Stack>
								<Stack column className="items-center p-3">
									<H4 className="text-gray-500">03</H4>
									<Text className="text-gray-500">Coins</Text>
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</div>
			</section>
		</Body>
	);
};

export default HomePage;
