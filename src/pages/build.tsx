import * as React from "react";
import { Circle, Layer, Line, Rect, Stage } from "react-konva";
import { colors } from "../configs/tailwind-theme.config";
import { joinTxts } from "../utils/text.util";
import { findRoom, getRoomLabel as getRoomName, labelIndex, Room, rooms } from "../configs/rooms.config";
import { KonvaEventObject, Node } from "konva/lib/Node";
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
import { popMessage, pushError, pushInfo, pushLoading, pushSuccess } from "../redux/slices/message.slice";
import Modal from "../components/modal";
import { RouteComponentProps, useNavigate } from "@reach/router";
import { DetailDrawing } from "../interfaces/detail-drawing.interface";
import * as detailDrawingApi from "../apis/detail-drawing.api";
import { useIsInViewport } from "../hooks/useIsInViewPort";
import { Stage as StageType } from "konva/lib/Stage";
import { dataURIToBlob, downloadURI } from "../utils/tools.util";
import axiosClient from "../configs/server.config";
import SpringLoading from "../components/SpringLoading";

const BuildPage = ({ location }: RouteComponentProps) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const g2pService = useSelector((state: RootState) => state.g2pService);
	const environment = useSelector((state: RootState) => state.environment);

	const leftFloorPlanRef = React.useRef<StageType>(null);
	const rightFloorPlanRef = React.useRef<StageType>(null);

	const boundaryObserverTargetRef = React.useRef<HTMLImageElement>(null);
	const isIntersecting = useIsInViewport(boundaryObserverTargetRef);

	const user = useSelector((state: RootState) => state.user);

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
			dispatch(pushLoading("Getting ready"));
			rooms.forEach((room) => (room.leftIndex = 0));
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
				dispatch(popMessage({}));
			});

			G2P.numSearch(boundaryName).then((res) => {
				const { data } = res;
				setSuggestedPlans(data.map((trainName: any) => ({ trainName, url: G2P.getTrainImageUrl(trainName) })));
				return handleSuggestedPlanClicked(data[0]);
			});
		}
	}, [g2pService, boundaryName]);

	const handleBoundaryClicked = (boundaryName: string) => {
		setBoundaryName(boundaryName);
		setIsShownModalBoundary(false);
	};

	const handleRoomClicked = (room: Room) => {
		setCurrentRoom(room);
	};

	const handleLeftTransferButtonClicked = async () => {
		const res = await G2P.transGraph(boundaryName, rightFloorPlan.trainName as string);
		const { rmpos, hsedge } = res.data;

		rooms.forEach((room) => (room.rightIndex = 0));
		const transRoomPositions: IdeaPosition[] = rmpos.map(([_, roomLabel, x, y, id]: any[]) => {
			const room: Room = findRoom(roomLabel);

			const result: IdeaPosition = {
				index: id,
				roomLabel: room.labels[room.rightIndex],
				x,
				y,
			};
			++room.rightIndex;

			return result;
		});

		rooms.forEach((room) => (room.leftIndex = 0));
		const ideaPositions: IdeaPosition[] = transRoomPositions.map(({ roomLabel, x, y, index }: IdeaPosition) => {
			const room: Room = findRoom(roomLabel);
			const result: IdeaPosition = {
				index,
				roomLabel: room.labels[room.leftIndex],
				x,
				y,
			};
			++room.leftIndex;

			return result;
		});

		setRightFloorPlan({ ...rightFloorPlan, transRmpos: rmpos });
		setIdeaPositions(ideaPositions);

		const ideaRelations: [IdeaPosition, IdeaPosition][] = hsedge.map(
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
			rightFloorPlan.transRmpos,
			boundaryName,
			rightFloorPlan.trainName,
		);
		const { hsedge, roomret, exterior } = res.data;
		rooms.forEach((room) => (room.rightIndex = 0));
		const transRoomPositions: IdeaPosition[] = roomret.map(([[xA, yA, xB, yB], [roomLabel], id]: any[]) => {
			const room: Room = findRoom(roomLabel);

			const result: IdeaPosition = {
				index: id,
				roomLabel: room.labels[room.rightIndex],
				x: (xA + xB) / 2,
				y: (yA + yB) / 2,
			};
			++room.rightIndex;

			return result;
		});

		const relations: [IdeaPosition, IdeaPosition][] = hsedge.map(
			([positionIndexA, positionIndexB]: number[], index: string) => {
				const transRoomPositionA = transRoomPositions.find(
					(position: IdeaPosition) => position.index == positionIndexA,
				);
				const transRoomPositionB = transRoomPositions.find(
					(position: IdeaPosition) => position.index == positionIndexB,
				);

				return [transRoomPositionA, transRoomPositionB];
			},
		);

		const exteriors = exterior
			.trim()
			.split(" ")
			.map((exterior: any) => exterior.split(","));

		setRightFloorPlan({
			...rightFloorPlan,
			hsbox: undefined,
			...res.data,
			trainName: rightFloorPlan.trainName,
			transRoomPositions,
			exteriors,
			relations,
			isGenerated: true,
		});

		dispatch(popMessage({}));
		dispatch(pushSuccess("Build finished"));
	};

	const handleSaved = async () => {
		const leftFloorPlanUri = await leftFloorPlanRef.current!.toDataURL({
			mimeType: "image/jpeg",
		});
		const rightFloorPlanUri = await leftFloorPlanRef.current!.toDataURL({
			mimeType: "image/jpeg",
		});
		downloadURI(leftFloorPlanUri, "LeftFloorPlan.jpg");
		downloadURI(rightFloorPlanUri, "rightFloorPlan.jpg");
	};

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
			--room.leftIndex;

			setIdeaPositions([...ideaPositions.slice(0, index), ...ideaPositions.slice(index + 1)]);
		}
	};

	const handleRoomAdded = (event: KonvaEventObject<MouseEvent>) => {
		if (event.evt.button != 0) return;
		if (currentRoom.leftIndex == currentRoom.labels.length) return;

		const { offsetX, offsetY } = event.evt;
		const lastIndex = ideaPositions.reduce((result, ideaPosition: IdeaPosition) => {
			if (ideaPosition.index > result) return ideaPosition.index;
			return result;
		}, 0);
		const newIdeaPosition: IdeaPosition = {
			index: lastIndex + 1,
			roomLabel: currentRoom.labels[currentRoom.leftIndex],
			x: offsetX / 2,
			y: offsetY / 2,
		};
		++currentRoom.leftIndex;

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
		const { hsedge, rmpos, exterior } = res.data;

		rooms.forEach((room) => (room.rightIndex = 0));
		const transRoomPositions: IdeaPosition[] = rmpos.map(([id, roomLabel, x, y]: any[]) => {
			const room: Room = findRoom(roomLabel);

			const result: IdeaPosition = {
				roomLabel: room.labels[room.rightIndex],
				x,
				y,
				index: id,
			};
			++room.rightIndex;

			return result;
		});

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

		const exteriors = exterior
			.trim()
			.split(" ")
			.map((exterior: any) => exterior.split(","));

		setRightFloorPlan({ ...res.data, trainName, transRoomPositions, exteriors, relations, isGenerated: false });
	};

	const handleMakeOrder = async () => {
		//Validation
		let isValid = detailDrawing.width && detailDrawing.height && detailDrawing.area && detailDrawing.budget;
		if (!isValid) {
			dispatch(pushError("Please fill all required fields before make order"));
			return;
		}

		dispatch(pushLoading("Making order"));
		if (!user) throw new Error(UN_AUTHORIZED);

		const leftFloorPlanImg: HTMLImageElement = (await leftFloorPlanRef.current!.toImage({
			mimeType: "image/jpeg",
		})) as HTMLImageElement;
		const rightFloorPlanImg: HTMLImageElement = (await rightFloorPlanRef.current!.toImage({
			mimeType: "image/jpeg",
		})) as HTMLImageElement;

		const leftFloorPlan = dataURIToBlob(leftFloorPlanImg.src);
		const rightFloorPlan = dataURIToBlob(rightFloorPlanImg.src);

		const formData = new FormData();
		formData.append("files", leftFloorPlan, "LeftFloorPlan.jpg");
		formData.append("files", rightFloorPlan, "rightFloorPlan.jpg");

		const [boundaryImg, crossSectionImg] = await axiosClient.post<string, string[]>(`uploads`, formData);

		const data: Partial<DetailDrawing> = {
			houseBoundary: detailDrawing.area,
			width: detailDrawing.width,
			height: detailDrawing.height,
			boundaryImg,
			crossSectionImg,
			rooms: ideaPositions.map((ideaPosition) => ({ name: ideaPosition.roomLabel, amount: 1 })) as any,
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

		const result = await detailDrawingApi.create(data);

		dispatch(popMessage({}));
		navigate(`/order/${result._id}`);
	};

	const detailDrawing = (location as any).state?.detail_drawing || {
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
	};
	const door = rightFloorPlan?.door.split(",").map(Number);

	const { analyzed2DName } = location?.state as any;

	return (
		<SpringLoading
			situations={[
				{ percent: 0, duration: 0 },
				{ percent: 60, duration: 500 },
				{ percent: 80, duration: 350 },
				{ percent: 100, duration: 200 },
			]}
		>
			<section className="container mx-auto">
				<Stack className="items-stretch">
					<Stack column className="grow gap-8 items-stretch">
						<Stack column className="gap-1">
							<H4 className="text-gray-500">Your Idea</H4>
							<Stack className="h-[33rem] bg-white justify-center items-center">
								<Stage
									ref={leftFloorPlanRef}
									width={512}
									height={512}
									onDblClick={handleRoomAdded}
									onContextMenu={handleResetSelectIdea}
									className="border-gray-300 border"
								>
									<Layer>
										<Rect width={512} height={512} fill={(colors as any).white} />
									</Layer>
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
								<Stage ref={rightFloorPlanRef} width={512} height={512} className="border-gray-300 border">
									<Layer>
										<Rect width={512} height={512} fill={(colors as any).white} />
									</Layer>
									<Layer
										scale={{ x: 2, y: 2 }}
										clipFunc={(context) => {
											if (!rightFloorPlan?.exteriors) return;

											context.beginPath();

											const [xBegin, yBegin] = rightFloorPlan?.exteriors[0];
											context.moveTo(xBegin, yBegin);

											rightFloorPlan?.exteriors.slice(1).map(([x, y]: number[]) => {
												context.lineTo(x, y);
											});

											context.closePath();
										}}
									>
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
										{rightFloorPlan?.relations?.map(
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
										{rightFloorPlan?.transRoomPositions?.map((position: any[], index: number) => {
											const { roomLabel, x, y } = position as Record<string, any>;
											return (
												<Circle
													key={[x, y, roomLabel].join("-")}
													x={x}
													y={y}
													width={10}
													height={10}
													fill={(colors as any)[findRoom(roomLabel).colorTheme][500]}
													stroke={(colors as any)["gray"][900]}
													strokeWidth={1.2}
												/>
											);
										})}
									</Layer>

									<Layer scale={{ x: 2, y: 2 }}>
										{rightFloorPlan?.exteriors && (
											<Line
												points={[...rightFloorPlan.exteriors, rightFloorPlan.exteriors[0]].reduce(
													(result: number[], exterior) => [...result, ...exterior],
													[],
												)}
												stroke={(colors as any)["gray"][900]}
												strokeWidth={2}
											/>
										)}
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
							const isMaxRoom = room.leftIndex == room.labels.length;
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
				<Carousel title="Advanced Section" defaultOpened>
					{detailDrawing && (
						<Stack className="mt-4 px-8 flex-wrap items-start justify-around gap-y-4">
							<Stack className="items-end gap-12">
								<Stack column className="gap-4">
									<H4 className="text-gray-700">House boundary</H4>
									<Stack column className="gap-4">
										<Stack className="items-center gap-2">
											<Text className="!text-gray-500 w-16 whitespace-nowrap">
												Width<span className="text-red-500">*</span> :
											</Text>
											<Text className="text-blue-500">{detailDrawing.width}m</Text>
										</Stack>
										<Stack className="items-center gap-2">
											<Text className="!text-gray-500 w-16 whitespace-nowrap">
												Height<span className="text-red-500">*</span> :
											</Text>
											<Text className="text-blue-500">{detailDrawing.height}m</Text>
										</Stack>
										<Stack className="items-center gap-2">
											<Text className="!text-gray-500 w-16 whitespace-nowrap">
												Length<span className="text-red-500">*</span> :
											</Text>
											<Text className="text-blue-500">{detailDrawing.length}m</Text>
										</Stack>
										<Stack className="items-center gap-2">
											<Text className="!text-gray-500 w-16 whitespace-nowrap">
												Area<span className="text-red-500">*</span> :
											</Text>
											<Text className="text-blue-500">
												{detailDrawing.area}m<sup>2</sup>
											</Text>
										</Stack>
									</Stack>
								</Stack>
							</Stack>

							<Stack className="items-end gap-12">
								<Stack column className="gap-4">
									<H4 className="text-gray-700">Additional information</H4>
									<Stack column className="gap-4">
										<Stack className="items-center">
											<Text className="text-gray-500 w-28 whitespace-nowrap">
												Budget<span className="text-red-500">*</span> :
											</Text>
											<Text className="text-blue-500">{detailDrawing.budget} Million VND</Text>
										</Stack>
										<Stack className="items-center">
											<Text className="text-gray-500 w-28">Members:</Text>
											<Text className="text-blue-500">{detailDrawing.members}</Text>
										</Stack>
										<Stack className="items-center">
											<Text className="text-gray-500 w-28">Theme:</Text>
											<Text className="text-blue-500">{detailDrawing.theme}</Text>
										</Stack>
										<Stack className="items-center">
											<Text className="text-gray-500 w-28">Location:</Text>
											<Text className="text-blue-500">{detailDrawing.location}</Text>
										</Stack>
										<Stack className="items-center">
											<Text className="text-gray-500 w-28">Categories:</Text>
											<Text className="text-blue-500">{detailDrawing.categories}</Text>
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
											<input type="checkbox" checked={detailDrawing.locatedAtAlley} disabled />
										</Stack>
										<Stack className="items-center">
											<Text className="text-gray-500 w-40">Business in house:</Text>
											<input type="checkbox" checked={detailDrawing.businessInHouse} disabled />
										</Stack>
										<Stack className="items-center">
											<Text className="text-gray-500 w-40">In the corner:</Text>
											<input type="checkbox" checked={detailDrawing.inTheCorner} disabled />
										</Stack>
									</Stack>
								</Stack>
							</Stack>
						</Stack>
					)}

					{analyzed2DName && (
						<Stack column className="flex-grow items-stretch gap-2 p-2">
							<Stack className="basis-1/2 items-stretch gap-2">
								<div className="basis-1/2">
									src={`${environment.tfFloorPlan.IMAGE_ENDPOINT}${analyzed2DName}_input.jpg`}
								</div>
								<div className="basis-1/2">
									<img src={`${environment.tfFloorPlan.IMAGE_ENDPOINT}${analyzed2DName}_result.jpg`} />
								</div>
							</Stack>
							<Stack className="basis-1/2 items-stretch gap-2">
								<Stack column className="basis-1/4 items-center gap-2">
									<div>
										<img src={`${environment.tfFloorPlan.IMAGE_ENDPOINT}${analyzed2DName}_r.jpg`} />
									</div>
									<div>
										<img src={`${environment.tfFloorPlan.IMAGE_ENDPOINT}${analyzed2DName}_cw.jpg`} />
										<H4 className="text-center">Raw</H4>
									</div>
								</Stack>
								<Stack column className="basis-1/4 items-center gap-2">
									<div>
										<img src={`${environment.tfFloorPlan.IMAGE_ENDPOINT}${analyzed2DName}_r_color.jpg`} />
									</div>
									<div>
										<img src={`${environment.tfFloorPlan.IMAGE_ENDPOINT}${analyzed2DName}_cw_color.jpg`} />
										<H4 className="text-center">Raw + Color</H4>
									</div>
								</Stack>
								<Stack column className="basis-1/4 items-center gap-2">
									<div>
										<img src={`${environment.tfFloorPlan.IMAGE_ENDPOINT}${analyzed2DName}_new_r.jpg`} />
									</div>
									<div>
										<img src={`${environment.tfFloorPlan.IMAGE_ENDPOINT}${analyzed2DName}_new_cw.jpg`} />
										<H4 className="text-center">Refined</H4>
									</div>
								</Stack>
								<Stack column className="basis-1/4 items-center gap-2">
									<div>
										<img src={`${environment.tfFloorPlan.IMAGE_ENDPOINT}${analyzed2DName}_new_r_color.jpg`} />
									</div>
									<div>
										<img src={`${environment.tfFloorPlan.IMAGE_ENDPOINT}${analyzed2DName}_new_cw_color.jpg`} />
										<H4 className="text-center">Refined + Color</H4>
									</div>
								</Stack>
							</Stack>
						</Stack>
					)}
				</Carousel>
			</section>

			<section className="container mx-auto py-4">
				<Stack className="justify-center gap-4 mt-6">
					<Button type="outline" LeftItem={DownloadSvg} className="!px-4 !py-1" onClick={handleSaved}>
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
						<Stack column key={boundaryName} className="basis-1/4 justify-center items-center p-2">
							<img
								src={G2P.getBoundaryImageUrl(boundaryName)}
								alt={`Boundary ${boundaryName}`}
								ref={index == boundaryNames.length - 1 ? boundaryObserverTargetRef : null}
								className="w-full cursor-pointer hover:scale-110 hover:shadow-md hover:z-10"
								onClick={() => handleBoundaryClicked(boundaryName)}
							/>
							<Text>{boundaryName}</Text>
						</Stack>
					))}
				</Stack>
			</Modal>
		</SpringLoading>
	);
};

export default BuildPage;
