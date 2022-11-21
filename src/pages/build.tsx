import * as React from "react";
import { Circle, Layer, Line, Rect, Stage } from "react-konva";
import { colors } from "../configs/tailwind-theme.config";
import { joinTxts } from "../utils/text.util";
import { findRoom, getRoomLabel as getRoomName, labelIndex, Room, rooms } from "../configs/rooms.config";
import { KonvaEventObject } from "konva/lib/Node";
import { matchArea } from "../utils/konva.util";
import Body from "./body";
import Stack from "../components/layout/stack";
import H4 from "../components/typography/h4";
import ButtonIcon from "../components/button-icon";
import Strong from "../components/typography/strong";
import H5 from "../components/typography/h5";
import Text from "../components/typography/text";
import Carousel from "../components/carousel";
import Button from "../components/button";
import { ReactComponent as ChevronRightSvg } from "../svgs/chevron-right.svg";
import { ReactComponent as ChevronLeftSvg } from "../svgs/chevron-left.svg";
import { ReactComponent as DownloadSvg } from "../svgs/download.svg";
import { ReactComponent as PencilSvg } from "../svgs/pencil.svg";
import G2P from "../apis/g2p.api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/stores/store.redux";
import { UN_AUTHORIZED } from "../constants/error.constant";
import { pushError, pushInfo, pushLoading, pushSuccess } from "../redux/slices/message.slice";
import { ethers } from "ethers";
import Ether from "../apis/ether.api";
import { parseEther } from "ethers/lib/utils";
import Modal from "../components/modal";
import { RouteComponentProps, useNavigate } from "@reach/router";
import Input from "../components/input";
import Select from "../components/select";
import { DetailDrawing } from "../interfaces/detail-drawing.interface";
import * as detailDrawingApi from "../apis/detail-drawing.api";
import { useIsInViewport } from "../hooks/useIsInViewPort";

const BuildPage = ({ location }: RouteComponentProps) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const g2pService = useSelector((state: RootState) => state.g2pService);

	const boundaryObserverTargetRef = React.useRef<HTMLImageElement>(null);
	const isIntersecting = useIsInViewport(boundaryObserverTargetRef);

	const user = useSelector((state: RootState) => state.user);
	const [detailDrawing, setDetailDrawing] = React.useState<Record<string, any>>({
		width: "",
		length: "",
		area: "",
		budget: "",
		members: "",
		theme: "",
		location: "",
		locatedAtAlley: false,
		businessInHouse: false,
		inTheCorner: false,
	});

	const [isShownModalBoundary, setIsShownModalBoundary] = React.useState<boolean>(false);
	const [boundaryNames, setBoundaryNames] = React.useState<string[]>([]);

	const [currentRoom, setCurrentRoom] = React.useState<Room>(rooms[0]);
	const [rightFloorPlan, setRightFloorPlan] = React.useState<any>(null);

	const [suggestedPlans, setSuggestedPlans] = React.useState<SuggestedPlan[]>([]);

	const [boundaryName, setBoundaryName] = React.useState<string>("444.png");
	const [boundary, setBoundary] = React.useState<Boundary>();
	const [ideaPositions, setIdeaPositions] = React.useState<IdeaPosition[]>([]);
	const [selectedIdeaPosition, setSelectedIdeaPosition] = React.useState<IdeaPosition>();
	const [ideaRelations, setIdeaRelations] = React.useState<[IdeaPosition, IdeaPosition][]>([]);

	React.useEffect(() => {
		if (g2pService)
			G2P.getTestNames(0, 20).then((res) => {
				setBoundaryNames(res.data);
			});
	}, [g2pService]);

	React.useEffect(() => {
		isIntersecting &&
			G2P.getTestNames(boundaryNames.length, 20).then((res) => {
				setBoundaryNames([...boundaryNames, ...res.data]);
			});
	}, [isIntersecting]);

	React.useEffect(() => {
		if (g2pService) {
			rooms.forEach((room) => (room.currentIndex = 0));
			G2P.loadTestBoundary(boundaryName).then((res) => {
				const { data } = res;
				const boundary: Boundary = {
					door: data.door.trim().split(","),
					exteriors: data.exterior
						.trim()
						.split(" ")
						.map((exterior: any) => exterior.split(",")),
				};
				setBoundary(boundary);
			});

			G2P.numSearch(boundaryName).then((res) => {
				const { data } = res;
				setSuggestedPlans(data.map((trainName: any) => ({ trainName, url: G2P.getTrainImageUrl(trainName) })));
			});
		}
	}, [g2pService, boundaryName]);

	const handleUserInfoChanged = (key: string, value: any) => {
		setDetailDrawing({
			...detailDrawing,
			[key]: value,
		});
	};

	const handleBoundaryClicked = (boundaryName: string) => {
		setBoundaryName(boundaryName);
		setIsShownModalBoundary(false);
	};

	const handleRoomClicked = (room: Room) => {
		setCurrentRoom(room);
	};

	const handleLeftTransferButtonClicked = async () => {
		rooms.forEach((room) => (room.currentIndex = 0));

		const res = await G2P.transGraph(boundaryName, rightFloorPlan.trainName as string);
		const roomPositions = res.data.rmpos!;
		const roomRelations = res.data.hsedge!;

		const ideaPositions: IdeaPosition[] = roomPositions.map(
			([roomId, roomLabel, x, y, id]: [number, string, number, number, number]) => {
				const room: Room = findRoom(roomLabel);
				const result: IdeaPosition = {
					roomLabel: room.labels[room.currentIndex],
					x,
					y,
				};
				++room.currentIndex;

				return result;
			},
		);

		setRightFloorPlan({ ...rightFloorPlan, transRoomPositions: roomPositions });
		setIdeaPositions(ideaPositions);

		const ideaRelations: [IdeaPosition, IdeaPosition][] = roomRelations.map(
			([roomPositionIndexA, roomPositionIndexB]: [number, number]) => [
				ideaPositions[roomPositionIndexA],
				ideaPositions[roomPositionIndexB],
			],
		);
		setIdeaRelations(ideaRelations);

		setSelectedIdeaPosition(undefined);
	};

	const handleRightTransferButtonClicked = async () => {
		dispatch(pushLoading("We are building your house"));

		const res = await G2P.adjustGraph(
			ideaPositions,
			ideaRelations,
			rightFloorPlan.transRoomPositions,
			boundaryName,
			rightFloorPlan.trainName,
		);
		const { hsedge, roomret } = res.data;
		const rmpos = roomret.map(([[xA, yA, xB, yB], [roomLabel], id]: any[]) => [
			labelIndex[roomLabel],
			roomLabel,
			(xA + xB) / 2,
			(yA + yB) / 2,
			id,
		]);

		const relations: [IdeaPosition, IdeaPosition][] = hsedge.map(
			([positionIndexA, positionIndexB]: number[], index: string) => {
				const [, labelA, xA, yA] = rmpos.find((position: any[]) => position[4] == positionIndexA);
				const [, labelB, xB, yB] = rmpos.find((position: any[]) => position[4] == positionIndexB);

				return [
					{ roomLabel: labelA, x: xA, y: yA },
					{ roomLabel: labelB, x: xB, y: yB },
				];
			},
		);
		setRightFloorPlan({
			...res.data,
			trainName: rightFloorPlan.trainName,
			transRoomPositions: rmpos,
			relations,
			isGenerated: true,
		});

		dispatch(pushSuccess("Build finished"));
	};

	const { entities, sentences, nounPhrases }: any = (location as any).state?.text_razor || {};
	const filteredEntities =
		entities &&
		entities
			.filter((entity: any) => entity.entityEnglishId != "")
			.reduce((result: any[], entity: any) => {
				const index = result.findIndex((item) => item.entityEnglishId == entity.entityEnglishId);
				if (index == -1) result.push(entity);
				return result;
			}, []);

	let currentSentenceKey = 0;
	nounPhrases?.forEach((nounPhrase: any) => {
		if (sentences[currentSentenceKey].words.slice(-1)[0].position < nounPhrase.wordPositions[0]) ++currentSentenceKey;

		sentences[currentSentenceKey].words.forEach((word: any) => {
			if (nounPhrase.wordPositions.includes(word.position)) word.isNounPhrase = true;
		});
	});

	const handleDragEnd = (event: KonvaEventObject<MouseEvent>, index: number) => {
		const element = event.target;
		const { x, y } = element.attrs;

		const currentIdeaPosition: IdeaPosition = ideaPositions[index];
		currentIdeaPosition.x = x;
		currentIdeaPosition.y = y;

		// If match canvas area => update position
		if (matchArea(x, y, 0, 256, 0, 256)) {
			setIdeaPositions([...ideaPositions.slice(0, index), currentIdeaPosition, ...ideaPositions.slice(index + 1)]);
		}

		// Else => remove it
		else {
			const newIdeaRelations = ideaRelations.filter(
				(ideaRelation: [IdeaPosition, IdeaPosition]) => !ideaRelation.includes(currentIdeaPosition),
			);
			setIdeaRelations(newIdeaRelations);

			const room = findRoom(currentIdeaPosition.roomLabel);
			--room.currentIndex;

			setIdeaPositions([...ideaPositions.slice(0, index), ...ideaPositions.slice(index + 1)]);
		}
	};

	const handleRoomAdded = (event: KonvaEventObject<MouseEvent>) => {
		if (event.evt.button != 0) return;
		if (currentRoom.currentIndex == currentRoom.labels.length) return;

		const { offsetX, offsetY } = event.evt;
		const newIdeaPosition: IdeaPosition = {
			roomLabel: currentRoom.labels[currentRoom.currentIndex],
			x: offsetX / 2,
			y: offsetY / 2,
		};
		++currentRoom.currentIndex;

		setIdeaPositions([...ideaPositions, newIdeaPosition]);
	};

	const handleRightIdeaClicked = (event: KonvaEventObject<PointerEvent>, index: number) => {
		event.evt.preventDefault();
		event.cancelBubble = true;
		const currentIdeaPosition: IdeaPosition = ideaPositions[index];

		if (selectedIdeaPosition) {
			const isConnected = ideaRelations.find(
				(ideaRelation) => ideaRelation.includes(selectedIdeaPosition) && ideaRelation.includes(currentIdeaPosition),
			);

			if (!isConnected) {
				setIdeaRelations([...ideaRelations, [selectedIdeaPosition, currentIdeaPosition]]);
			}

			// Toggle selected state
			setSelectedIdeaPosition(undefined);
			return;
		}

		// Toggle selected state
		setSelectedIdeaPosition(currentIdeaPosition);
	};

	const handleResetSelectIdea = (event: KonvaEventObject<PointerEvent>) => {
		event.evt.preventDefault();
		setSelectedIdeaPosition(undefined);
	};

	const handleRightRelationClicked = (event: KonvaEventObject<PointerEvent>, index: number) => {
		event.evt.preventDefault();
		event.cancelBubble = true;

		setIdeaRelations([...ideaRelations.slice(0, index), ...ideaRelations.slice(index + 1)]);
	};

	const handleSuggestedPlanClicked = async (trainName: string) => {
		const res = await G2P.loadTrainHouse(trainName);
		const { hsedge, rmpos } = res.data;

		const relations: [IdeaPosition, IdeaPosition][] = hsedge.map(
			([positionIndexA, positionIndexB]: number[], index: string) => {
				const [, labelA, xA, yA] = rmpos[positionIndexA];
				const [, labelB, xB, yB] = rmpos[positionIndexB];

				return [
					{ roomLabel: labelA, x: xA, y: yA },
					{ roomLabel: labelB, x: xB, y: yB },
				];
			},
		);
		setRightFloorPlan({ ...res.data, trainName, relations, isGenerated: false });
	};

	const handleMakeOrder = async () => {
		if (!user) throw new Error(UN_AUTHORIZED);

		const data: Partial<DetailDrawing> = {
			houseBoundary: detailDrawing.area,
			width: detailDrawing.width,
			height: detailDrawing.height,
			boundaryImg: "https://home-lab-ai.s3.ap-southeast-1.amazonaws.com/1667836921029-641790842.png",
			crossSectionImg: "https://home-lab-ai.s3.ap-southeast-1.amazonaws.com/1667836921029-340586306.png",
			additionalInformation: {
				budget: `${detailDrawing.budget} Million VND`,
				members: detailDrawing.members,
				theme: detailDrawing.theme,
				location: detailDrawing.location,
				locatedAtAlley: detailDrawing.locatedAtAlley,
				businessInHouse: detailDrawing.businessInHouse,
				inTheCorner: detailDrawing.inTheCorner,
			},
		};

		try {
			const result = await detailDrawingApi.create(data);
			navigate(`/order/${result._id}`);
		} catch (error) {
			throw error;
		}
	};

	const door = rightFloorPlan?.door.split(",").map(Number);

	return (
		<>
			<section className="container mx-auto">
				<Stack className="items-stretch">
					<Stack column className="grow gap-8 items-stretch">
						<Stack column className="gap-1">
							<H4 className="text-gray-500">Your Idea</H4>
							<Stack className="h-[33rem] bg-white justify-center items-center">
								<Stage
									width={512}
									height={512}
									onDblClick={handleRoomAdded}
									onContextMenu={handleResetSelectIdea}
									className="border-gray-300 border"
								>
									<Layer scale={{ x: 2, y: 2 }}>
										{boundary && (
											<Line
												points={[...boundary.exteriors, boundary.exteriors[0]].reduce(
													(result: number[], exterior) => [...result, ...exterior],
													[],
												)}
												stroke={(colors as any)["gray"][900]}
												strokeWidth={2}
											/>
										)}

										{boundary && (
											<Line points={boundary.door} stroke={(colors as any)["yellow"][400]} strokeWidth={2} />
										)}

										{ideaRelations.map(([ideaPositionA, ideaPositionB], index) => (
											<Line
												key={`${ideaPositionA.roomLabel}-${ideaPositionB.roomLabel}`}
												points={[ideaPositionA.x, ideaPositionA.y, ideaPositionB.x, ideaPositionB.y]}
												stroke={(colors as any)["gray"][900]}
												strokeWidth={1.2}
												onContextMenu={(event) => handleRightRelationClicked(event, index)}
											/>
										))}

										{ideaPositions.map((ideaPosition, index) => (
											<Circle
												key={`${ideaPosition.roomLabel}`}
												x={ideaPosition.x}
												y={ideaPosition.y}
												width={10}
												height={10}
												fill={(colors as any)[findRoom(ideaPosition.roomLabel).colorTheme][500]}
												stroke={
													ideaPosition == selectedIdeaPosition
														? (colors as any)["red"][500]
														: (colors as any)["gray"][900]
												}
												strokeWidth={1.2}
												draggable
												onDragEnd={(event) => handleDragEnd(event, index)}
												onContextMenu={(event) => handleRightIdeaClicked(event, index)}
											/>
										))}
									</Layer>
								</Stage>
							</Stack>
						</Stack>
					</Stack>

					<Stack column className="mx-2 justify-center items-center gap-4">
						<ButtonIcon
							Icon={ChevronRightSvg}
							className="w-12 h-12 fill-gray-500"
							onClick={handleRightTransferButtonClicked}
							disabled={ideaPositions.length == 0 || ideaRelations.length == 0}
						/>
						<H5 className="block [writing-mode:vertical-lr] rotate-180 font-medium text-gray-400 tracking-widest">
							TRANSFER
						</H5>
						<ButtonIcon
							Icon={ChevronLeftSvg}
							className="w-12 h-12 fill-gray-500"
							onClick={handleLeftTransferButtonClicked}
						/>
					</Stack>

					<Stack column className="grow gap-8 items-stretch">
						<Stack column className="gap-1">
							<H4 className="text-gray-500">Floor Plan</H4>
							<Stack className="h-[33rem] bg-white justify-center items-center">
								<Stage width={512} height={512}>
									<Layer scale={{ x: 2, y: 2 }}>
										{rightFloorPlan?.hsbox?.map((box: any[], index: number) => {
											const [[x1, y1, x2, y2], [label]] = box;
											const room = rooms.find((room) => room.labels.includes(label));
											return (
												<Rect
													key={[x1, y1, x2, y2, label].join("-")}
													x={x1}
													y={y1}
													width={x2 - x1}
													height={y2 - y1}
													fill={(colors as any)[room?.colorTheme!][200]}
													stroke={(colors as any)["gray"][700]}
												/>
											);
										})}
										{rightFloorPlan?.roomret?.map((plan: any[], index: number) => {
											const [[x1, y1, x2, y2], [label], id] = plan;
											const room = findRoom(label);
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
										{rightFloorPlan?.windows?.map((position: number[]) => {
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
										{rightFloorPlan?.relations.map(
											([positionA, positionB]: [IdeaPosition, IdeaPosition], index: string) => {
												const { roomLabel: labelA, x: xA, y: yA } = positionA;
												const { roomLabel: labelB, x: xB, y: yB } = positionB;

												return (
													<Line
														key={[xA, yA, labelA, xB, yB, labelB].join("-")}
														points={[xA, yA, xB, yB]}
														stroke={(colors as any)["gray"][900]}
														strokeWidth={1.2}
													/>
												);
											},
										)}
										{rightFloorPlan?.rmpos?.map((position: any[], index: number) => {
											const [_, label, x, y] = position;
											return (
												<Circle
													key={[x, y, label].join("-")}
													x={x}
													y={y}
													width={10}
													height={10}
													fill={(colors as any)[findRoom(label).colorTheme][500]}
													stroke={(colors as any)["gray"][900]}
													strokeWidth={1.2}
												/>
											);
										})}
									</Layer>
								</Stage>
							</Stack>
						</Stack>
					</Stack>
				</Stack>

				<Stack column className="items-stretch mt-8">
					<Stack className="justify-center gap-10">
						{rooms.map((room) => {
							const isCurrentRoom = currentRoom == room;
							const isMaxRoom = room.currentIndex == room.labels.length;
							const colorShade = isMaxRoom ? 200 : 500;

							return (
								<Stack
									column
									key={room.name}
									className="items-center gap-2 cursor-pointer"
									onClick={() => handleRoomClicked(room)}
								>
									<div
										className={joinTxts("rounded-full border-4 border-white", isCurrentRoom ? "w-10 h-10" : "w-8 h-8")}
										style={{ backgroundColor: (colors as any)[room.colorTheme][colorShade] }}
									/>
									<Strong
										style={{
											color: (colors as any)[room.colorTheme][colorShade],
										}}
									>
										{room.name}
									</Strong>
								</Stack>
							);
						})}
					</Stack>
				</Stack>

				<Stack className="flex-nowrap overflow-visible overflow-x-scroll scroll-smooth scroll-mx-4 snap-mandatory snap-x max-h-min py-8 mt-4 scroll">
					{suggestedPlans.map((suggestedPlan) => (
						<Stack key={suggestedPlan.trainName} className="flex-none basis-1/6">
							<img
								src={suggestedPlan.url}
								alt={`Suggested Design ${suggestedPlan.trainName}`}
								className="h-full object-cover cursor-pointer hover:scale-110 hover:shadow-md hover:z-10"
								onClick={() => handleSuggestedPlanClicked(suggestedPlan.trainName)}
							/>
						</Stack>
					))}
				</Stack>

				<Stack className="mt-4 justify-center font-medium text-gray-400 tracking-widest">
					<H5 className="">RECOMMENDED DESIGNS</H5>
				</Stack>
			</section>

			<section className="container mx-auto mt-4">
				<Carousel title="Advanced Section">
					<Stack className="mt-4 px-6 flex-wrap items-start justify-around gap-y-4">
						<Stack className="items-end gap-12">
							<Stack column className="gap-4">
								<H4 className="text-gray-700">House boundary</H4>
								<Stack column className="gap-4">
									<Stack className="items-center">
										<Text className="text-gray-500 w-16">Width:</Text>
										<Input
											placeholder="50"
											className="!text-blue-500 w-32"
											type="number"
											value={detailDrawing.width}
											onChange={(event) => handleUserInfoChanged("width", Number(event?.target.value))}
											after={<Text className="text-blue-500">m</Text>}
										/>
									</Stack>
									<Stack className="items-center">
										<Text className="text-gray-500 w-16">Length:</Text>
										<Input
											placeholder="50"
											className="!text-blue-500 w-32"
											type="number"
											value={detailDrawing.height}
											onChange={(event) => handleUserInfoChanged("height", Number(event?.target.value))}
											after={<Text className="text-blue-500">m</Text>}
										/>
									</Stack>
									<Stack className="items-center">
										<Text className="text-gray-500 w-16">Area:</Text>
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
										<Text className="text-gray-500 w-28">Budget:</Text>
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
										<Text className="text-gray-500 w-28">Members:</Text>
										<Input
											value={detailDrawing.members}
											onChange={(event) => handleUserInfoChanged("members", event?.target.value)}
											placeholder="Mother, Father, Children"
											className="!text-blue-500 w-full"
										/>
									</Stack>
									<Stack className="items-center">
										<Text className="text-gray-500 w-28">Theme:</Text>
										<Input
											value={detailDrawing.theme}
											onChange={(event) => handleUserInfoChanged("theme", event?.target.value)}
											placeholder="White, Yellow"
											className="!text-blue-500 w-full"
										/>
									</Stack>
									<Stack className="items-center">
										<Text className="text-gray-500 w-28">Location:</Text>
										<Input
											value={detailDrawing.location}
											onChange={(event) => handleUserInfoChanged("location", event?.target.value)}
											placeholder="Danang"
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

					<div className="h-[1px] my-4 bg-gray-200"></div>

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

			<section className="container mx-auto py-4">
				<Stack className="justify-center gap-4 mt-6">
					<Button type="outline" LeftItem={DownloadSvg} className="!px-4 !py-1">
						Save
					</Button>
					<Button
						type="outline"
						LeftItem={PencilSvg}
						className="!px-4 !py-1"
						onClick={() => setIsShownModalBoundary(true)}
					>
						Load
					</Button>
					<Button type="fill" className="!px-4 !py-1" onClick={handleMakeOrder}>
						Make Order
					</Button>
				</Stack>
			</section>

			<Modal title="Choose your boundary" isShown={isShownModalBoundary} onClose={() => setIsShownModalBoundary(false)}>
				<Stack className="flex-wrap px-4 py-4">
					{boundaryNames.map((boundaryName, index) => (
						<Stack key={boundaryName} className="basis-1/4 items-center p-2">
							<img
								src={G2P.getBoundaryImageUrl(boundaryName)}
								alt={`Boundary ${boundaryName}`}
								ref={index == boundaryNames.length - 1 ? boundaryObserverTargetRef : null}
								className="w-full cursor-pointer hover:scale-110 hover:shadow-md hover:z-10"
								onClick={() => handleBoundaryClicked(boundaryName)}
							/>
						</Stack>
					))}
				</Stack>
			</Modal>
		</>
	);
};

export default BuildPage;
