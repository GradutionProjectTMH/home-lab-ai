import { Transition } from "@headlessui/react";
import { RouteComponentProps, useNavigate } from "@reach/router";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import TextRazor from "../../apis/text-razor.api";
import TFFloorPlan from "../../apis/tf-floor-plan.api";
import SpringLoading from "../../components/SpringLoading";
import Button from "../../components/button";
import { Image } from "../../components/image";
import Stack from "../../components/layout/stack";
import Slider from "../../components/slider";
import H1 from "../../components/typography/h1";
import H3 from "../../components/typography/h3";
import H4 from "../../components/typography/h4";
import Text from "../../components/typography/text";
import { popMessage, pushError, pushLoading } from "../../redux/slices/message.slice";
import { RootState } from "../../redux/stores/store.redux";
import { joinTxts, removeDuplicated } from "../../utils/text.util";
import { randomArray } from "../../utils/tools.util";
import { ChatIdea } from "./components/chat-idea";
import sponsorJpg from "./images/sponsor.jpg";
import style from "./style.module.css";

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

	const [isShowTitle, setIsShowTitle] = React.useState<boolean>(true);
	const [isShowChat, setIsShowChat] = React.useState<boolean>(false);

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
			<Stack className="h-[640px] items-center gap-4 drop-shadow-[12px_40px_36px_rgba(26,54,93,0.32)]">
				<Slider
					images={randomArray(slideImages).map((image) => `${process.env.PUBLIC_URL}/images/home-slider/${image}`)}
					showNav={false}
					useTranslate3D
					additionalClass={joinTxts("w-full h-full", style["slider"])}
				/>
				<Slider
					images={randomArray(slideImages).map((image) => `${process.env.PUBLIC_URL}/images/home-slider/${image}`)}
					showNav={false}
					useTranslate3D
					additionalClass={joinTxts("w-full h-full", style["slider"])}
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
					<Transition
						as={React.Fragment}
						show={isShowTitle}
						leave="transform duration-800 transition ease-in-out"
						leaveFrom="opacity-100 rotate-0 scale-100 "
						leaveTo="opacity-0 scale-95"
						afterLeave={() => setIsShowChat(true)}
						static
					>
						<Stack column className="flex-grow gap-10 justify-center py-8">
							<Stack column className="gap-4">
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
									<Button type="fill" onClick={() => setIsShowTitle(false)}>
										TÌM Ý TƯỞNG
									</Button>
									<Button type="outline" onClick={handleAnalyze2DButtonClicked}>
										BẮT ĐẦU THIẾT KẾ
									</Button>
									<input
										ref={analyze2DButtonRef}
										className="hidden"
										type="file"
										onChange={handleAnalyze2DFileChanged}
									/>
								</Stack>
							</Stack>

							<Stack column className="mt-24">
								<Stack column className="items-stretch gap-4">
									<H4 className="text-center text-gray-500">CÙNG ĐỒNG HÀNH VỚI</H4>
									<Stack className="gap-4 justify-center">
										{[...Array(4)].map((_) => (
											<Image src={sponsorJpg} />
										))}
									</Stack>
								</Stack>
							</Stack>
						</Stack>
					</Transition>

					<Transition
						as={React.Fragment}
						show={isShowChat}
						enter="transform transition duration-1000"
						enterFrom="opacity-0 scale-y-0 translate-y-[-100%]"
						enterTo="opacity-100 scale-y-100 translate-y-0"
						static
					>
						<Stack column className="flex-grow m-8">
							<ChatIdea className="h-[760px]" />
						</Stack>
					</Transition>

					<Stack column className="basis-[712px] shrink-0 items-stretch gap-24">
						{SliderHome}

						<Stack className="items-stretch px-4">
							<Stack
								column
								className="flex-grow justify-center items-center gap-2 h-[180px] bg-white rounded-lg border border-dark border-dashed shadow-lg"
							>
								<H3 className="text-center text-gray-500">BẠN ĐÃ CÓ THIẾT KẾ?</H3>
								<Text className="text-center text-gray-500">Tối ưu hóa thiết kế của bạn tại đây</Text>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</section>
		</SpringLoading>
	);
};

export default HomePage;
