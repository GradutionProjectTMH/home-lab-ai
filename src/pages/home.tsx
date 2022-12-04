import * as React from "react";
import H1 from "../components/typography/h1";
import Stack from "../components/layout/stack";
import Text from "../components/typography/text";
import Button from "../components/button";
import H4 from "../components/typography/h4";
import { ReactComponent as MicSvg } from "../svgs/mic-outlined.svg";
import { ReactComponent as LightBulbSvg } from "../svgs/light-bulb.svg";
import ButtonIcon from "../components/button-icon";
import Small from "../components/typography/small";
import TextRazor from "../apis/text-razor.api";
import { useDispatch } from "react-redux";
import { popMessage, pushError, pushLoading } from "../redux/slices/message.slice";
import { RouteComponentProps, useNavigate } from "@reach/router";
import Slider from "../components/slider";
import { randomArray } from "../utils/tools.util";
import SpringLoading from "../components/SpringLoading";
import Carousel from "../components/carousel";
import Input from "../components/input";

const slideImages = [
	"1.jpg",
	"10.jpg",
	"11.jpg",
	"12.webp",
	"13.webp",
	"14.jpg",
	"15.jpg",
	"16.jpg",
	"17.jpeg",
	"18.webp",
	"19.webp",
	"2.jpg",
	"20.jpg",
	"3.jpg",
	"4.jpg",
	"5.jpg",
	"6.jpg",
	"7.webp",
	"8.webp",
	"9.jpg",
];

const HomePage = (props: RouteComponentProps) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

	const [textRazor, setTextRazor] = React.useState<Record<string, any>>({});
	const [detailDrawing, setDetailDrawing] = React.useState<Record<string, any>>({
		width: 0,
		height: 0,
		area: 0,
		budget: 0,
		members: "",
		theme: "",
		location: "",
		categories: "",
		locatedAtAlley: false,
		businessInHouse: false,
		inTheCorner: false,
	});

	const handleUserInfoChanged = (key: string, value: any) => {
		setDetailDrawing({
			...detailDrawing,
			[key]: value,
		});
	};

	const handleExtractorClicked = async () => {
		dispatch(pushLoading("We are processing your dream"));

		const textRazor = await TextRazor.extract(textAreaRef.current!.value, [
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

		setTextRazor(textRazor);
		console.log(textRazor);

		const topics = textRazor.coarseTopics.map((coarseTopic: any) => coarseTopic.label);
		handleUserInfoChanged("theme", topics.join(", "));

		const categories = textRazor.entities.reduce((result: string[], entity: any) => {
			if (entity.freebaseTypes?.includes("/business/product_category")) result.push(entity.entityId);
			return result;
		}, []);
		handleUserInfoChanged("categories", categories.join(", "));

		const members = textRazor.entities.reduce((result: string[], entity: any) => {
			if (entity.freebaseTypes?.includes("/book/book_subject")) result.push(entity.entityId);
			return result;
		}, []);
		handleUserInfoChanged("members", members.join(", "));

		const location = textRazor.entities.reduce((result: string[], entity: any) => {
			if (entity.type?.includes("PopulatedPlace")) result.push(entity.entityId);
			return result;
		}, []);
		handleUserInfoChanged("location", location.join(", "));

		dispatch(popMessage(null));
	};

	const handleStartBuildingClicked = () => {
		//Validation
		let isValid = detailDrawing.width && detailDrawing.height && detailDrawing.area && detailDrawing.budget;
		if (!isValid) {
			dispatch(pushError("Please fill all required fields before continue"));
			return;
		}

		navigate("/build", { state: { detail_drawing: detailDrawing } });
	};

	const handleTryItButtonClicked = () => {
		textAreaRef.current?.focus();
	};

	const { entities, sentences, nounPhrases }: any = textRazor;
	const filteredEntities =
		entities &&
		entities
			.filter((entity: any) => entity.entityEnglishId != "")
			.reduce((result: any[], entity: any) => {
				const index = result.findIndex((item) => item.entityEnglishId == entity.entityEnglishId);
				if (index == -1) result.push(entity);
				return result;
			}, []);

	nounPhrases?.forEach((nounPhrase: any) => {
		const sentence = sentences.find(
			(sentence: any) =>
				nounPhrase.wordPositions[0] >= sentence.words[0].position &&
				nounPhrase.wordPositions.slice(-1)[0] <= sentence.words.slice(-1)[0].position,
		);

		const beginIndex = nounPhrase.wordPositions[0] - sentence.words[0].position;
		const endIndex = nounPhrase.wordPositions.slice(-1)[0] - sentence.words[0].position;

		for (let i = beginIndex; i <= endIndex; ++i) sentence.words[i].isNounPhrase = true;
	});

	return (
		<SpringLoading
			situations={[
				{ percent: 0, duration: 0 },
				{ percent: 30, duration: 500 },
				{ percent: 60, duration: 1000 },
				{ percent: 80, duration: 400 },
				{ percent: 93, duration: 1000 },
				{ percent: 100, duration: 200 },
			]}
		>
			<section className="container mx-auto">
				<Stack className="items-stretch">
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

					<Stack className="basis-1/2 items-center gap-4 drop-shadow-[12px_40px_36px_rgba(26,54,93,0.32)]">
						<Slider
							images={randomArray(slideImages).map((image) => `${process.env.PUBLIC_URL}/images/home-slider/${image}`)}
							showNav={false}
							useTranslate3D
						/>
						<Slider
							images={randomArray(slideImages).map((image) => `${process.env.PUBLIC_URL}/images/home-slider/${image}`)}
							showNav={false}
							useTranslate3D
						/>
					</Stack>
				</Stack>
			</section>

			<section className="relative">
				<div className="container mx-auto">
					<Stack className="mt-14 items-stretch">
						<Stack column className="basis-1/2 bg-white shadow-xl shadow-blackAlpha-100 mr-4">
							<textarea rows={6} className="!outline-none p-4 border-0" ref={textAreaRef} />
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

						<Stack column className="basis-1/2">
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

							<Button type="outline" className="mt-4" onClick={handleStartBuildingClicked}>
								Start Build
							</Button>
						</Stack>
					</Stack>
				</div>
			</section>

			<section className="container mx-auto px-8">
				<Stack className="mt-8 flex-wrap items-start justify-between gap-y-4">
					<Stack className="items-end gap-12">
						<Stack column className="gap-4">
							<H4 className="text-gray-700">House boundary</H4>
							<Stack column className="gap-4">
								<Stack className="items-center gap-2">
									<Text className="!text-gray-500 w-16 whitespace-nowrap">
										Width<span className="text-red-500">*</span> :
									</Text>
									<Input
										placeholder="50"
										className="!text-blue-500 w-32"
										type="number"
										value={detailDrawing.width}
										onChange={(event) => handleUserInfoChanged("width", Number(event?.target.value))}
										after={<Text className="text-blue-500">m</Text>}
									/>
								</Stack>
								<Stack className="items-center gap-2">
									<Text className="!text-gray-500 w-16 whitespace-nowrap">
										Height<span className="text-red-500">*</span> :
									</Text>
									<Input
										placeholder="50"
										className="!text-blue-500 w-32"
										type="number"
										value={detailDrawing.height}
										onChange={(event) => handleUserInfoChanged("height", Number(event?.target.value))}
										after={<Text className="text-blue-500">m</Text>}
									/>
								</Stack>
								<Stack className="items-center gap-2">
									<Text className="!text-gray-500 w-16 whitespace-nowrap">
										Area<span className="text-red-500">*</span> :
									</Text>
									<Input
										placeholder="50"
										className="!text-blue-500 w-32"
										type="number"
										value={detailDrawing.area}
										onChange={(event) => handleUserInfoChanged("area", Number(event?.target.value))}
										after={
											<Text className="text-blue-500">
												m<sup>2</sup>
											</Text>
										}
									/>
								</Stack>
							</Stack>
						</Stack>
					</Stack>
					<Stack className="items-end gap-12">
						<Stack column className="gap-4">
							<H4 className="text-gray-700">Additional information</H4>
							<Stack column className="gap-4">
								<Stack className="items-center">
									<Text className="text-gray-500 w-32 whitespace-nowrap">
										Budget<span className="text-red-500">*</span> :
									</Text>
									<Input
										placeholder="50"
										className="!text-blue-500 w-full"
										type="number"
										value={detailDrawing.budget}
										onChange={(event) => handleUserInfoChanged("budget", event?.target.value)}
										after={<Text className="text-blue-500">Million VND</Text>}
									/>
								</Stack>
								<Stack className="items-center">
									<Text className="text-gray-500 w-32">Members:</Text>
									<Input
										value={detailDrawing.members}
										onChange={(event) => handleUserInfoChanged("members", event?.target.value)}
										placeholder="Mother, Father, Children"
										className="!text-blue-500 w-full"
									/>
								</Stack>
								<Stack className="items-center">
									<Text className="text-gray-500 w-32">Theme:</Text>
									<Input
										value={detailDrawing.theme}
										onChange={(event) => handleUserInfoChanged("theme", event?.target.value)}
										placeholder="White, Yellow"
										className="!text-blue-500 w-full"
									/>
								</Stack>
								<Stack className="items-center">
									<Text className="text-gray-500 w-32">Location:</Text>
									<Input
										value={detailDrawing.location}
										onChange={(event) => handleUserInfoChanged("location", event?.target.value)}
										placeholder="Da Nang"
										className="!text-blue-500 w-full"
									/>
								</Stack>
								<Stack className="items-center">
									<Text className="text-gray-500 w-32">Categories:</Text>
									<Input
										value={detailDrawing.categories}
										onChange={(event) => handleUserInfoChanged("categories", event?.target.value)}
										placeholder="Table, Chair, Bed"
										className="!text-blue-500 w-full"
									/>
								</Stack>
							</Stack>
						</Stack>
					</Stack>
					<Stack className="items-end gap-12">
						<Stack column className="gap-4">
							<H4 className="text-gray-700">Quick questions</H4>
							<Stack column className="gap-4">
								<Stack className="items-center">
									<Text className="text-gray-500 w-40">Located at alley:</Text>
									<input
										type="checkbox"
										checked={detailDrawing.locatedAtAlley}
										onChange={(event) => handleUserInfoChanged("locatedAtAlley", !detailDrawing.locatedAtAlley)}
									/>
								</Stack>
								<Stack className="items-center">
									<Text className="text-gray-500 w-40">Business in house:</Text>
									<input
										type="checkbox"
										checked={detailDrawing.businessInHouse}
										onChange={(event) => handleUserInfoChanged("businessInHouse", !detailDrawing.businessInHouse)}
									/>
								</Stack>
								<Stack className="items-center">
									<Text className="text-gray-500 w-40">In the corner:</Text>
									<input
										type="checkbox"
										checked={detailDrawing.inTheCorner}
										onChange={(event) => handleUserInfoChanged("inTheCorner", !detailDrawing.inTheCorner)}
									/>
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</section>

			<section className="container mx-auto py-8">
				<Carousel title="Advanced Section" defaultOpened>
					<Stack className="mt-4 px-6 flex-wrap gap-y-4">
						<Stack column className="gap-4">
							{sentences &&
								sentences.map((sentence: any) => (
									<Stack key={sentence.position} className="gap-2">
										<H4 className="text-gray-700">
											{sentence.position + 1 < 10 ? `0${sentence.position + 1}` : sentence.position + 1}.
										</H4>
										<Stack className="gap-2 flex-wrap">
											{sentence.words.map((word: any) => (
												<H4 key={word.position} className={word.isNounPhrase ? "text-blue-500" : "text-gray-500"}>
													{word.token}
												</H4>
											))}
										</Stack>
									</Stack>
								))}
						</Stack>
					</Stack>

					<div className="h-[1px] my-4 bg-gray-200"></div>

					{entities && (
						<Stack className="mt-4 px-6 gap-4">
							<Stack className="basis-1/2 gap-12">
								<Stack column className="items-end gap-4">
									<H4 className="text-gray-700">Entities list:</H4>
									{filteredEntities.slice(0, Math.round(entities.length / 2)).map((entity: any) => (
										<Text key={entity.entityId} className="text-gray-700">
											{entity.entityEnglishId}
										</Text>
									))}
								</Stack>
								<Stack column className="items-start gap-4">
									<H4 className="text-gray-500">Confidence score</H4>
									{filteredEntities.slice(0, Math.round(entities.length / 2)).map((entity: any) => (
										<Text key={entity.entityId} className="text-gray-500">
											{entity.confidenceScore}
										</Text>
									))}
								</Stack>
							</Stack>

							<Stack className="basis-1/2 gap-12">
								<Stack column className="items-end gap-4">
									<H4 className="text-gray-700">Entities list:</H4>
									{filteredEntities.slice(Math.round(entities.length / 2)).map((entity: any) => (
										<Text key={entity.entityId} className="text-gray-700">
											{entity.entityEnglishId}
										</Text>
									))}
								</Stack>
								<Stack column className="items-start gap-4">
									<H4 className="text-gray-500">Confidence score</H4>
									{filteredEntities.slice(Math.round(entities.length / 2)).map((entity: any) => (
										<Text key={entity.entityId} className="text-gray-500">
											{entity.confidenceScore}
										</Text>
									))}
								</Stack>
							</Stack>
						</Stack>
					)}
				</Carousel>
			</section>
		</SpringLoading>
	);
};

export default HomePage;
