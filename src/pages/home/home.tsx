import * as React from "react";
import H1 from "../../components/typography/h1";
import Stack from "../../components/layout/stack";
import Text from "../../components/typography/text";
import Button from "../../components/button";
import H4 from "../../components/typography/h4";
import { ReactComponent as MicSvg } from "../../svgs/mic-outlined.svg";
import { ReactComponent as LightBulbSvg } from "../../svgs/light-bulb.svg";
import LightBulbPng from "./images/light-bulb.png";
import DesignPng from "./images/design.png";
import PrototypePng from "./images/prototype.png";
import ConstructionPng from "./images/construction.png";
import ButtonIcon from "../../components/button-icon";
import TextRazor from "../../apis/text-razor.api";
import { useDispatch, useSelector } from "react-redux";
import { popMessage, pushError, pushLoading } from "../../redux/slices/message.slice";
import { RouteComponentProps, useNavigate } from "@reach/router";
import Slider from "../../components/slider";
import { randomArray } from "../../utils/tools.util";
import SpringLoading from "../../components/SpringLoading";
import Carousel from "../../components/carousel";
import Input from "../../components/input";
import H3 from "../../components/typography/h3";
import TFFloorPlan from "../../apis/tf-floor-plan.api";
import { RootState } from "../../redux/stores/store.redux";
import { removeDuplicated } from "../../utils/text.util";

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
	const analyze2DButtonRef = React.useRef<HTMLInputElement>(null);

	const tfFloorPlan = useSelector((state: RootState) => state.tfFloorPlanService);
	const environment = useSelector((state: RootState) => state.environment);

	const [textRazor, setTextRazor] = React.useState<Record<string, any>>({});
	const [detailDrawing, setDetailDrawing] = React.useState<Record<string, any>>({
		width: 0,
		height: 0,
		length: 0,
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

	const [file2D, setFile2D] = React.useState<File>();
	const [analyzed2DName, setAnalyzed2DName] = React.useState<string>();

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

		const topics = (textRazor.coarseTopics || []).map((coarseTopic: any) => coarseTopic.label);
		detailDrawing.theme = topics.join(", ");

		const categories = textRazor.entities.reduce((result: string[], entity: any) => {
			if (entity.freebaseTypes?.includes("/business/product_category")) result.push(entity.entityId);
			return result;
		}, []);
		detailDrawing.categories = removeDuplicated(categories).join(", ");

		const members = textRazor.entities.reduce((result: string[], entity: any) => {
			if (entity.freebaseTypes?.includes("/book/book_subject")) result.push(entity.entityId);
			return result;
		}, []);
		detailDrawing.members = removeDuplicated(members).join(", ");

		const location = textRazor.entities.reduce((result: string[], entity: any) => {
			if (entity.type?.includes("PopulatedPlace")) result.push(entity.entityId);
			return result;
		}, []);
		detailDrawing.location = removeDuplicated(location).join(", ");

		setDetailDrawing(detailDrawing);
		dispatch(popMessage(null));
	};

	const handleStartBuildingClicked = () => {
		//Validation
		let isValid = detailDrawing.width && detailDrawing.height && detailDrawing.area && detailDrawing.budget;
		if (!isValid) {
			dispatch(pushError("Please fill all required fields before continue"));
			return;
		}

		navigate("/build", { state: { detail_drawing: detailDrawing, analyzed_2d_name: analyzed2DName } });
	};

	const handleTryItButtonClicked = () => {
		textAreaRef.current?.focus();
	};

	const handleAnalyze2DButtonClicked = () => {
		if (!tfFloorPlan) return;

		const input = analyze2DButtonRef.current;
		input?.click();
	};

	const handle2DAreaDropped = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();

		const file = event.dataTransfer.files[0];
		setFile2D(file);
	};

	const handleAnalyze2DFileChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) return;

		const file = event.target.files[0];
		setFile2D(file);
	};

	React.useEffect(() => {
		if (!tfFloorPlan) {
			dispatch(pushLoading("Getting ready"));
			return;
		}

		dispatch(popMessage({ isClearAll: true }));
	}, [tfFloorPlan]);

	React.useEffect(() => {
		if (!file2D || !tfFloorPlan) return;

		const img = document.querySelector<HTMLImageElement>("#analyze2D img#input")!;
		img.src && URL.revokeObjectURL(img.src);
		img.src = URL.createObjectURL(file2D);

		setAnalyzed2DName(undefined);
		dispatch(pushLoading("Analyzing your 2D plan"));

		TFFloorPlan.process(file2D).then(({ data }) => {
			setAnalyzed2DName(data);

			setDetailDrawing({
				...detailDrawing,
				width: 8,
				length: 17,
				height: 5,
				area: 120,
				budget: 0.4,
			});

			dispatch(popMessage({ isClearAll: true }));
		});
	}, [file2D]);

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

	const SliderHome = React.useMemo(
		() => (
			<Stack className="basis-[712px] items-center gap-4 drop-shadow-[12px_40px_36px_rgba(26,54,93,0.32)]">
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
		),
		[],
	);

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
					<Stack column className="flex-grow gap-10 justify-center">
						<Stack column className="gap-4 mt-8">
							<H1 className="!font-display !font-black !text-[12rem]  text-primary">Vẽ lên</H1>
							<H1 className="!font-body !font-light !text-[8rem] text-dark">ngôi nhà</H1>
							<H1 className="!font-display !font-black !text-[9rem] text-dark">của bạn.</H1>
						</Stack>

						<Stack column className="gap-6">
							<Text className="text-dark">
								Sẵn sàng tiếp cận công cụ thế hệ mới cho thiết kế xây dựng <br />
								HomeLab.ai đã tham gia vào hơn 100 công trình dự án trong nước.
							</Text>

							<Stack className="gap-4">
								<Button type="fill" onClick={handleTryItButtonClicked}>
									BẮT ĐẦU
								</Button>
								<Button type="outline" onClick={handleAnalyze2DButtonClicked}>
									ĐÃ CÓ THIẾT KẾ
								</Button>
								<input ref={analyze2DButtonRef} className="hidden" type="file" onChange={handleAnalyze2DFileChanged} />
							</Stack>
						</Stack>
					</Stack>
					{SliderHome}
				</Stack>
			</section>

			<section className="relative">
				<div className="container mx-auto">
					<Stack className="mt-14 items-stretch">
						<Stack column className="flex-grow mr-4">
							<Stack column className="bg-white shadow-xl shadow-blackAlpha-100">
								<textarea
									rows={6}
									className="text-body !outline-none placeholder:text-gray-400 placeholder:text-body p-4 border-0"
									ref={textAreaRef}
									placeholder="Hãy bắt đầu xây dựng từ ý tưởng của bạn..."
								/>
								<Stack className="justify-end items-center mx-4 mb-2">
									<ButtonIcon Icon={MicSvg} className="w-10 h-10 !fill-gray-500" />
									<ButtonIcon
										Icon={LightBulbSvg}
										className="w-10 h-10 !fill-blue-500"
										onClick={handleExtractorClicked}
									/>
								</Stack>
							</Stack>

							{/* <Stack className="justify-between gap-4 m-8">
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
												Length<span className="text-red-500">*</span> :
											</Text>
											<Input
												placeholder="50"
												className="!text-blue-500 w-32"
												type="number"
												value={detailDrawing.length}
												onChange={(event) => handleUserInfoChanged("length", Number(event?.target.value))}
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

								<Stack column className="gap-4">
									<H4 className="text-gray-700">Additional information</H4>
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
								</Stack>
							</Stack> */}
						</Stack>

						<Stack column className="basis-[712px] items-stretch">
							<Stack className="gap-2 w-full">
								<Stack column className="relative w-[172px] h-[172px] bg-primary border-primary border-2">
									<img src={LightBulbPng} width={60} height={60} className="absolute top-4 right-4" />
									<Stack className="w-20 h-20 bg-background justify-center items-center">
										<H4 className="!text-5xl !font-body2 !font-black text-primary">01</H4>
									</Stack>
									<Stack className="flex-grow items-center px-4">
										<H4 className="text-background !font-body !text-4xl">Ý Tưởng</H4>
									</Stack>
								</Stack>
								<Stack column className="relative w-[172px] h-[172px] bg-transparent border-dark border-2">
									<img src={DesignPng} width={60} height={60} className="absolute top-4 right-4" />
									<Stack className="w-20 h-20 bg-dark justify-center items-center">
										<H4 className="!text-5xl !font-body2 !font-black text-background">02</H4>
									</Stack>
									<Stack className="flex-grow items-center px-4">
										<H4 className="text-dark !font-body !text-4xl">Thiết kế</H4>
									</Stack>
								</Stack>
								<Stack column className="relative w-[172px] h-[172px] bg-transparent border-dark border-2">
									<img src={PrototypePng} width={60} height={60} className="absolute top-4 right-4" />
									<Stack className="w-20 h-20 bg-dark justify-center items-center">
										<H4 className="!text-5xl !font-body2 !font-black text-background">03</H4>
									</Stack>
									<Stack className="flex-grow items-center px-4">
										<H4 className="text-dark !font-body !text-4xl">Thử nghiệm</H4>
									</Stack>
								</Stack>
								<Stack column className="relative w-[172px] h-[172px] bg-transparent border-dark border-2">
									<img src={ConstructionPng} width={60} height={60} className="absolute top-4 right-4" />
									<Stack className="w-20 h-20 bg-dark justify-center items-center">
										<H4 className="!text-5xl !font-body2 !font-black text-background">04</H4>
									</Stack>
									<Stack className="flex-grow items-center px-4">
										<H4 className="text-dark !font-body !text-4xl">Xây dựng</H4>
									</Stack>
								</Stack>
							</Stack>

							{/* <Button type="outline" className="mt-4" onClick={handleStartBuildingClicked}>
								Start Build
							</Button> */}

							{/* <Stack
								id="analyze2D"
								className="flex-grow mt-4 justify-center items-center border-2 border-spacing-2 border-dashed border-gray-500 text-gray-500 cursor-pointer hover:border-blue-500 hover:!text-blue-700"
								onClick={handleAnalyze2DButtonClicked}
								onDrop={handle2DAreaDropped}
								onDragOver={(event) => event.preventDefault()}
							>
								{file2D ? (
									<Stack column className="flex-grow items-stretch gap-2 p-2">
										<Stack className="basis-1/2 items-stretch gap-2">
											<div className="basis-1/2">
												<img id="input" src={URL.createObjectURL(file2D)} />
											</div>
											{analyzed2DName ? (
												<div className="basis-1/2">
													<img src={`${environment.tfFloorPlan.IMAGE_ENDPOINT}${analyzed2DName}_result.jpg`} />
												</div>
											) : (
												<div className="basis-1/2 bg-gray-300 animate-pulse w-full min-h-[240px]" />
											)}
										</Stack>
										<Stack className="basis-1/2 items-stretch gap-2">
											<Stack column className="basis-1/4 items-center gap-2">
												{analyzed2DName ? (
													<div>
														<img src={`${environment.tfFloorPlan.IMAGE_ENDPOINT}${analyzed2DName}_r.jpg`} />
													</div>
												) : (
													<div className="bg-gray-300 animate-pulse w-full min-h-[64px]" />
												)}
												{analyzed2DName ? (
													<div>
														<img src={`${environment.tfFloorPlan.IMAGE_ENDPOINT}${analyzed2DName}_cw.jpg`} />
														<H4 className="text-center">Raw</H4>
													</div>
												) : (
													<div className="bg-gray-300 animate-pulse w-full min-h-[64px]" />
												)}
											</Stack>
											<Stack column className="basis-1/4 items-center gap-2">
												{analyzed2DName ? (
													<div>
														<img src={`${environment.tfFloorPlan.IMAGE_ENDPOINT}${analyzed2DName}_r_color.jpg`} />
													</div>
												) : (
													<div className="bg-gray-300 animate-pulse w-full min-h-[64px]" />
												)}
												{analyzed2DName ? (
													<div>
														<img src={`${environment.tfFloorPlan.IMAGE_ENDPOINT}${analyzed2DName}_cw_color.jpg`} />
														<H4 className="text-center">Raw + Color</H4>
													</div>
												) : (
													<div className="bg-gray-300 animate-pulse w-full min-h-[64px]" />
												)}
											</Stack>
											<Stack column className="basis-1/4 items-center gap-2">
												{analyzed2DName ? (
													<div>
														<img src={`${environment.tfFloorPlan.IMAGE_ENDPOINT}${analyzed2DName}_new_r.jpg`} />
													</div>
												) : (
													<div className="bg-gray-300 animate-pulse w-full min-h-[64px]" />
												)}
												{analyzed2DName ? (
													<div>
														<img src={`${environment.tfFloorPlan.IMAGE_ENDPOINT}${analyzed2DName}_new_cw.jpg`} />
														<H4 className="text-center">Refined</H4>
													</div>
												) : (
													<div className="bg-gray-300 animate-pulse w-full min-h-[64px]" />
												)}
											</Stack>
											<Stack column className="basis-1/4 items-center gap-2">
												{analyzed2DName ? (
													<div>
														<img src={`${environment.tfFloorPlan.IMAGE_ENDPOINT}${analyzed2DName}_new_r_color.jpg`} />
													</div>
												) : (
													<div className="bg-gray-300 animate-pulse w-full h-16" />
												)}
												{analyzed2DName ? (
													<div>
														<img src={`${environment.tfFloorPlan.IMAGE_ENDPOINT}${analyzed2DName}_new_cw_color.jpg`} />
														<H4 className="text-center">Refined + Color</H4>
													</div>
												) : (
													<div className="bg-gray-300 animate-pulse w-full h-16" />
												)}
											</Stack>
										</Stack>
									</Stack>
								) : (
									<H3>Drop your 2D design here</H3>
								)}
							</Stack> */}
						</Stack>
					</Stack>
				</div>
			</section>

			{/* <section className="container mx-auto py-8">
				<Carousel title="Advanced Section" defaultOpened>
					<Stack column className="m-8 gap-4">
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

						<Stack className="gap-32">
							<Stack className="items-center gap-4">
								<Text className="text-gray-500">Located at alley:</Text>
								<input
									type="checkbox"
									checked={detailDrawing.locatedAtAlley}
									onChange={(event) => handleUserInfoChanged("locatedAtAlley", !detailDrawing.locatedAtAlley)}
								/>
							</Stack>
							<Stack className="items-center gap-4">
								<Text className="text-gray-500">Business in house:</Text>
								<input
									type="checkbox"
									checked={detailDrawing.businessInHouse}
									onChange={(event) => handleUserInfoChanged("businessInHouse", !detailDrawing.businessInHouse)}
								/>
							</Stack>
							<Stack className="items-center gap-4">
								<Text className="text-gray-500">In the corner:</Text>
								<input
									type="checkbox"
									checked={detailDrawing.inTheCorner}
									onChange={(event) => handleUserInfoChanged("inTheCorner", !detailDrawing.inTheCorner)}
								/>
							</Stack>
						</Stack>
					</Stack>

					<Carousel title="Show text">
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
					</Carousel>

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
			</section> */}
		</SpringLoading>
	);
};

export default HomePage;
