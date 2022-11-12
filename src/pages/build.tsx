import * as React from "react";
import { HeadFC, navigate } from "gatsby";
import { Circle, Layer, Line, Rect, Stage } from "react-konva";
import { colors } from "../configs/tailwind-theme.config";
import { joinTxts } from "../utils/text.util";
import { findRoom, getRoomLabel as getRoomName, labelIndex, Room, rooms } from "../configs/rooms.config";
import { KonvaEventObject } from "konva/lib/Node";
import { matchArea } from "../utils/konva.util";
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
import G2P from "../apis/g2p.api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/stores/store.redux";
import { UN_AUTHORIZED } from "../constants/error.constant";
import { pushError } from "../redux/slices/message.slice";

const BuildPage = ({ location }: any) => {
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.user);

	const [currentRoom, setCurrentRoom] = React.useState<Room>(rooms[0]);
	const [rightFloorPlan, setRightFloorPlan] = React.useState<any>(null);

	const [suggestedPlans, setSuggestedPlans] = React.useState<SuggestedPlan[]>([]);

	const [boundary, setBoundary] = React.useState<Boundary>();
	const [ideaPositions, setIdeaPositions] = React.useState<IdeaPosition[]>([]);
	const [selectedIdeaPosition, setSelectedIdeaPosition] = React.useState<IdeaPosition>();
	const [ideaRelations, setIdeaRelations] = React.useState<[IdeaPosition, IdeaPosition][]>([]);

	React.useEffect(() => {
		rooms.forEach((room) => (room.currentIndex = 0));
		G2P.loadTestBoundary("444.png").then((res) => {
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

		G2P.numSearch("444.png").then((res) => {
			const { data } = res;
			setSuggestedPlans(data.map((trainName: any) => ({ trainName, url: G2P.getImageUrl(trainName) })));
		});
	}, []);

	const handleRoomClicked = (room: Room) => {
		setCurrentRoom(room);
	};

	const handleLeftTransferButtonClicked = async () => {
		rooms.forEach((room) => (room.currentIndex = 0));

		const res = await G2P.transGraph("444.png", rightFloorPlan.trainName as string);
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
		const res = await G2P.adjustGraph(
			ideaPositions,
			ideaRelations,
			rightFloorPlan.transRoomPositions,
			"444.png",
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
	};

	const { entities, sentences, nounPhrases }: any = location.state?.text_razor || {};
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

	const handleMakeOrder = () => {
		if (!user) {
			dispatch(pushError(UN_AUTHORIZED));
			throw new Error(UN_AUTHORIZED);
		}
		navigate("/hiring");
	};

	const door = rightFloorPlan?.door.split(",").map(Number);
	return (
		<Body>
			<section className="container mx-auto">
				<Stack className="pt-36 items-stretch">
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

				<Stack className="mt-4">
					{suggestedPlans.map((suggestedPlan) => (
						<Stack key={suggestedPlan.trainName} className="flex-grow">
							<img
								src={suggestedPlan.url}
								alt={`Suggested Design ${suggestedPlan.trainName}`}
								className="w-full cursor-pointer hover:scale-110 hover:shadow-md hover:z-10"
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
					<Stack className="mt-4 px-6 flex-wrap items-start gap-y-4">
						<Stack className="basis-1/2 items-end gap-12">
							<Stack column className="items-end gap-4">
								<H4 className="text-gray-700">House boundary</H4>
								<Text className="text-gray-500">Width:</Text>
								<Text className="text-gray-500">Length:</Text>
								<Text className="text-gray-500">Height:</Text>
							</Stack>
							<Stack column className="items-start gap-4">
								<Text className="text-blue-500">
									50m<sup>2</sup>
								</Text>
								<Text className="text-blue-500">
									50m<sup>2</sup>
								</Text>
								<Text className="text-blue-500">10m</Text>
							</Stack>
						</Stack>
						<Stack className="basis-1/2 items-end gap-12">
							<Stack column className="items-end gap-4">
								<H4 className="text-gray-700">Budget</H4>
								<Text className="text-gray-500">Width:</Text>
								<Text className="text-gray-500">Height:</Text>
							</Stack>
							<Stack column className="items-start gap-4">
								<H4 className="text-blue-500">2.000 Million VND</H4>
								<Text className="text-blue-500">
									50m<sup>2</sup>
								</Text>
								<Text className="text-blue-500">
									50m<sup>2</sup>
								</Text>
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
										<Stack className="gap-2">
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

					<Stack className="mt-4 px-6 gap-4">
						<Stack className="basis-1/2 gap-12">
							<Stack column className="items-end gap-4">
								<H4 className="text-gray-700">Entities list:</H4>
								{entities &&
									entities.slice(0, Math.round(entities.length / 2)).map((entity: any) => (
										<Text key={entity.entityId} className="text-gray-700">
											{entity.entityEnglishId}
										</Text>
									))}
							</Stack>
							<Stack column className="items-start gap-4">
								<H4 className="text-gray-500">Confidence score</H4>
								{entities &&
									entities.slice(0, Math.round(entities.length / 2)).map((entity: any) => (
										<Text key={entity.entityId} className="text-gray-500">
											{entity.confidenceScore}
										</Text>
									))}
							</Stack>
						</Stack>

						<Stack className="basis-1/2 gap-12">
							<Stack column className="items-end gap-4">
								<H4 className="text-gray-700">Entities list:</H4>
								{entities &&
									entities.slice(Math.round(entities.length / 2)).map((entity: any) => (
										<Text key={entity.entityId} className="text-gray-700">
											{entity.entityEnglishId}
										</Text>
									))}
							</Stack>
							<Stack column className="items-start gap-4">
								<H4 className="text-gray-500">Confidence score</H4>
								{entities &&
									entities.slice(Math.round(entities.length / 2)).map((entity: any) => (
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
					<Button type="fill" className="!px-4 !py-1" onClick={handleMakeOrder}>
						Make Order
					</Button>
				</Stack>
			</section>
		</Body>
	);
};

export default BuildPage;

export const Head: HeadFC = () => <Seo title="Building" />;
