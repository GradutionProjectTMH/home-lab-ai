import { RouteComponentProps, useNavigate } from "@reach/router";
import { KonvaEventObject } from "konva/lib/Node";
import { Stage as StageType } from "konva/lib/Stage";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Circle, Layer, Line, Rect, Stage } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import G2P from "../../apis/g2p.api";
import SpringLoading from "../../components/SpringLoading";
import Accordion from "../../components/accordion";
import Button from "../../components/button";
import ButtonIcon from "../../components/button-icon";
import Stack from "../../components/layout/stack";
import Modal from "../../components/modal";
import H4 from "../../components/typography/h4";
import H5 from "../../components/typography/h5";
import Strong from "../../components/typography/strong";
import Text from "../../components/typography/text";
import { Room, findRoom, rooms } from "../../configs/rooms.config";
import { colors } from "../../configs/tailwind-theme.config";
import { useIsInViewport } from "../../hooks/useIsInViewPort";
import { popMessage, pushError, pushLoading, pushSuccess } from "../../redux/slices/message.slice";
import { RootState } from "../../redux/stores/store.redux";
import { ReactComponent as PencilSvg } from "../../svgs/pencil.svg";
import { matchArea } from "../../utils/konva.util";
import { joinTxts } from "../../utils/text.util";
import { randomImg } from "../../utils/tools.util";
import Chart, { ChartData } from "chart.js/auto";
import { Transition } from "@headlessui/react";
import { useMutation } from "@tanstack/react-query";
import { postGanttApi } from "../../apis/gantt/gantt.api";
import { AxiosError } from "axios";
import { Animation } from "../../components/animation";

type ConstructionFields = {
	length: string;
	width: string;
	height: string;
	floor: string;
	location: string;
	laborCost: string;
	startDate: string;
	endDate: string;
	laborAmount: string;
};

type ChartDataItem = {
	label: string;
	data: [number, number][];
	backgroundColor: string;
};

const BuildPage = ({ location }: RouteComponentProps) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const g2pService = useSelector((state: RootState) => state.g2pService);
	const environment = useSelector((state: RootState) => state.environment);

	const leftFloorPlanRef = React.useRef<StageType>(null);
	const rightFloorPlanRef = React.useRef<StageType>(null);

	const boundaryObserverTargetRef = React.useRef<HTMLImageElement>(null);
	const isIntersecting = useIsInViewport(boundaryObserverTargetRef);

	const [isShownModalBoundary, setIsShownModalBoundary] = React.useState<boolean>(false);
	const [boundaryNames, setBoundaryNames] = React.useState<string[]>([]);

	const [isShownModalCoohome, setIsShownModalCoohome] = React.useState<boolean>(false);

	const [currentRoom, setCurrentRoom] = React.useState<Room>(rooms[0]);
	const [rightFloorPlan, setRightFloorPlan] = React.useState<any>(null);

	const [suggestedPlans, setSuggestedPlans] = React.useState<SuggestedPlan[]>([]);

	const [boundaryName, setBoundaryName] = React.useState<string>("24276.png");
	const [boundary, setBoundary] = React.useState<Boundary>();
	const [ideaPositions, setIdeaPositions] = React.useState<IdeaPosition[]>([]);
	const [selectedIdeaPosition, setSelectedIdeaPosition] = React.useState<IdeaPosition>();
	const [ideaRelations, setIdeaRelations] = React.useState<[IdeaPosition, IdeaPosition][]>([]);

	const [isLoadingSpring, setIsLoadingSpring] = React.useState<boolean>(true);

	const ganttChartRenderRef = React.useRef<HTMLCanvasElement>(null);
	const ganttChartRef = React.useRef<Chart>();
	const [ganttChartData, setGanttChartData] = React.useState<ChartData>({
		labels: [],
		datasets: [],
	});

	const [isShownEstimation, setIsShownEstimation] = React.useState<boolean>(true);

	const {
		mutateAsync: postGantt,
		isLoading: isLoadingPostGantt,
		isSuccess: isPostGanttSuccess,
	} = useMutation(postGanttApi, {
		onSuccess: (ganttRes) => {
			const labels = Object.keys(ganttRes);

			function generateLineDataset(keyDataset: "Labors" | "Days" | "Costs") {
				return Object.values(ganttRes).reduce((result, ganttCategoryData, index) => {
					result.push(ganttCategoryData[keyDataset]);
					return result;
				}, [] as number[]);
			}

			function generateFloatingBarDataset(keyDataset: "Labors" | "Days" | "Costs") {
				return Object.values(ganttRes).reduce((result, ganttCategoryData, index) => {
					if (index === 0) result.push([0, ganttCategoryData[keyDataset]]);
					else {
						const prevData = result[index - 1];
						result.push([prevData[1], prevData[1] + ganttCategoryData[keyDataset]]);
					}

					// Handle last item
					if (result.length === labels.length && keyDataset === "Days") {
						const [startDate, endDate] = result[index];
						const duration = endDate - startDate;
						const offset = duration / 2;
						result[index] = [
							startDate - Math.round(offset * Math.random()),
							Math.round(endDate - offset * Math.random()),
						];
					}

					return result;
				}, [] as [number, number][]);
			}

			const laborsDataset = {
				label: "Nhân công (người)",
				data: generateLineDataset("Labors"),
				backgroundColor: colors.yellow[500],
				yAxisID: "y",
			};

			const daysDataset = {
				label: "Từ (ngày) đến (ngày)",
				data: generateFloatingBarDataset("Days"),
				backgroundColor: colors.blue[500],
				yAxisID: "y",
			};

			const costsDataset = {
				label: "Chi phí (triệu VNĐ)",
				data: generateLineDataset("Costs").map((dataItem) => dataItem / 1000000),
				backgroundColor: colors.green[500],
				yAxisID: "y",
			};

			setGanttChartData({
				labels,
				datasets: [laborsDataset, daysDataset, costsDataset],
			});

			dispatch(popMessage({ isClearAll: true }));
			dispatch(pushSuccess("Tính toán thành công!"));
		},
		onError: (error: AxiosError<{ message: string }>) => {
			dispatch(pushError(error?.message));
		},
	});

	React.useEffect(() => {
		console.log("Generate gantt chart");

		if (isLoadingSpring || !ganttChartRenderRef.current || !isPostGanttSuccess) return;

		const baseFont = {
			family: "Comfortaa",
			size: 16,
		};

		ganttChartRef.current = new Chart(ganttChartRenderRef.current!, {
			type: "bar",
			data: ganttChartData,
			options: {
				indexAxis: "y",
				responsive: true,
				plugins: {
					tooltip: {
						bodyFont: baseFont,
					},
					legend: {
						position: "top",
						labels: { font: baseFont },
					},
					title: {
						display: true,
						text: "Biểu đồ dự toán thi công",
						font: baseFont,
					},
				},
				scales: {
					y: {
						title: { font: baseFont },
						ticks: {
							font: baseFont,
						},
					},
					x: {
						title: { font: baseFont },
						ticks: {
							font: baseFont,
						},
					},
				},
			},
		});

		return () => ganttChartRef.current?.destroy();
	}, [isLoadingSpring, ganttChartRenderRef.current, isPostGanttSuccess, isShownEstimation]);

	React.useEffect(() => {
		if (isLoadingSpring) return;

		if (ganttChartRef.current) {
			ganttChartRef.current.data = ganttChartData;
			ganttChartRef.current.update();
		}
	}, [isLoadingSpring, ganttChartData]);

	const {
		register,
		handleSubmit,
		setValue: setFieldValue,
		formState: { errors: formErrors },
	} = useForm<ConstructionFields>();

	const handleValidSubmit = ({
		floor,
		height,
		laborAmount,
		laborCost,
		length,
		location,
		width,
		endDate,
		startDate,
	}: ConstructionFields) => {
		postGantt({
			floor: Number(floor),
			height: Number(height),
			laborAmount: Number(laborAmount),
			laborCost: Number(laborCost) * 1000000,
			length: Number(length),
			location,
			width: Number(width),
			estimate: (new Date(endDate).getTime() - new Date(startDate).getTime()) / (3600000 * 24),
		});
		dispatch(pushLoading("Đang tạo biểu đồ dự toán"));
	};

	React.useEffect(() => {
		setSuggestedPlans([...Array(10).keys()].map((i) => ({ trainName: randomImg(), url: randomImg() })));
	}, []);

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

	const { analyzed_2d_name: analyzed2DName } = location?.state || ({} as any);

	return (
		<SpringLoading
			situations={[
				{ percent: 0, duration: 0 },
				{ percent: 60, duration: 500 },
				{ percent: 80, duration: 350 },
				{ percent: 100, duration: 200 },
			]}
			onFinished={() => setIsLoadingSpring(false)}
		>
			<section className="container mx-auto">
				<Stack className="items-stretch mt-12">
					<Stack className="grow justify-center">
						<Stack column className="w-[512px] gap-1">
							<H4 className="text-gray-500">KHUNG NHÀ</H4>
							<Stack className="bg-white justify-center items-center">
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
							remixIconName="chevron-right-line"
							className="w-12 h-12 fill-gray-500"
							onClick={handleRightTransferButtonClicked}
							disabled={ideaPositions.length == 0 || ideaRelations.length == 0}
						/>
						<H5 className="block [writing-mode:vertical-lr] rotate-180 font-medium text-gray-400 tracking-widest">
							CHUYỂN ĐỔI
						</H5>
						<ButtonIcon
							remixIconName="chevron-right-line"
							className="w-12 h-12 fill-gray-500"
							onClick={handleLeftTransferButtonClicked}
						/>
					</Stack>

					<Stack className="grow justify-center">
						<Stack column className="w-[512px] gap-1">
							<H4 className="text-gray-500">MẶT CẮT NGANG</H4>
							<Stack className="bg-white justify-center items-center">
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

				<Stack column className="items-stretch mt-28">
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

				<Stack className="mt-4 justify-center font-medium text-gray-400 tracking-[0.8rem]">
					<H5>THIẾT KẾ ĐỀ XUẤT</H5>
				</Stack>
			</section>

			<section className="container mx-auto mt-24">
				<Accordion title="THỬ NGHIỆM VỚI MÔ HÌNH 3D" defaultOpened>
					<Stack column className="items-stretch gap-6 p-6">
						<img
							src={randomImg(1920, 1000)}
							className="object-cover w-full h-[624px] border-4 border-dark cursor-pointer"
						/>
					</Stack>
				</Accordion>
			</section>

			<section className="container mx-auto mt-24">
				<Accordion title="LÂP KẾ HOẠCH THI CÔNG" defaultOpened onChangeActive={setIsShownEstimation}>
					<Stack>
						<form className="basis-1/2 px-8 mt-4" onSubmit={handleSubmit(handleValidSubmit)}>
							<Stack column className="flex-wrap items-stretch gap-8">
								<Stack className="items-end gap-12">
									<Stack column className="flex-grow gap-4">
										<H4 className="text-gray-700">DIỆN TÍCH KHUNG NHÀ:</H4>
										<Stack column className="gap-2">
											<Stack className="items-center gap-2">
												<Text className="!text-gray-500 w-40 whitespace-nowrap">
													Chiều dài<span className="text-red-500">*</span> :
												</Text>
												<Stack className="items-center gap-4">
													<input
														type="number"
														className="!border-none !ring-0 bg-light px-4 w-32 h-8"
														{...register("length", { required: true, min: 1, max: 100, pattern: /^[0-9]*$/ })}
													/>
													<Text className="text-blue-500">m</Text>
													{formErrors.length && <Text className="ml-8 text-red-500">Chiều dài không hợp lệ</Text>}
												</Stack>
											</Stack>
											<hr />
											<Stack className="items-center gap-2">
												<Text className="!text-gray-500 w-40 whitespace-nowrap">
													Chiều rộng<span className="text-red-500">*</span> :
												</Text>
												<Stack className="items-center gap-4">
													<input
														type="number"
														className="!border-none !ring-0 bg-light px-4 w-32 h-8"
														{...register("width", { required: true, min: 1, max: 100, pattern: /^[0-9]*$/ })}
													/>
													<Text className="text-blue-500">m</Text>
													{formErrors.width && <Text className="ml-8 text-red-500">Chiều rộng không hợp lệ</Text>}
												</Stack>
											</Stack>
											<hr />
											<Stack className="items-center gap-2">
												<Text className="!text-gray-500 w-40 whitespace-nowrap">
													Chiều cao<span className="text-red-500">*</span> :
												</Text>
												<Stack className="items-center gap-4">
													<input
														type="number"
														className="!border-none !ring-0 bg-light px-4 w-32 h-8"
														{...register("height", { required: true, min: 1, max: 100, pattern: /^[0-9]*$/ })}
													/>
													<Text className="text-blue-500">m</Text>
													{formErrors.height && <Text className="ml-8 text-red-500">Chiều cao không hợp lệ</Text>}
												</Stack>
											</Stack>
											<hr />
											<Stack className="items-center gap-2">
												<Text className="!text-gray-500 w-40 whitespace-nowrap">
													Số tầng<span className="text-red-500">*</span> :
												</Text>
												<Stack className="items-center gap-4">
													<input
														type="number"
														className="!border-none !ring-0 bg-light px-4 w-32 h-8"
														{...register("floor", { required: true, min: 1, max: 100, pattern: /^[0-9]*$/ })}
													/>
													<Text className="text-blue-500">tầng</Text>
													{formErrors.floor && <Text className="ml-8 text-red-500">Số tầng không hợp lệ</Text>}
												</Stack>
											</Stack>
											<hr />
											<Stack className="items-center gap-2">
												<Text className="!text-gray-500 w-40 whitespace-nowrap">
													Địa điểm<span className="text-red-500">*</span> :
												</Text>
												<Stack className="items-center gap-4">
													<input
														className="!border-none !ring-0 bg-light px-4 w-52 h-8"
														{...register("location", { required: true })}
													/>
													{formErrors.location && <Text className="ml-8 text-red-500">Địa điểm không hợp lệ</Text>}
												</Stack>
											</Stack>
										</Stack>
									</Stack>
								</Stack>

								<Stack className="items-end gap-12">
									<Stack column className="flex-grow gap-4">
										<H4 className="text-gray-700">THÔNG TIN CHI TIẾT:</H4>
										<Stack column className="gap-2">
											<Stack className="items-center">
												<Text className="text-gray-500 w-52 whitespace-nowrap">
													Chi phí dự tính<span className="text-red-500">*</span> :
												</Text>
												<Stack className="items-center gap-4">
													<input
														type="number"
														className="!border-none !ring-0 bg-light px-4 w-32 h-8"
														{...register("laborCost", { required: true, min: 1, max: 10000, pattern: /^[0-9]*$/ })}
													/>
													<Text className="text-blue-500">triệu VNĐ</Text>
													{formErrors.laborCost && <Text className="ml-8 text-red-500">Chi phí không hợp lệ</Text>}
												</Stack>
											</Stack>
											<hr />
											<Stack className="items-center">
												<Text className="text-gray-500 w-52 whitespace-nowrap">
													Thời gian dự kiến<span className="text-red-500">*</span> :
												</Text>
												<Stack column className="gap-2">
													<Stack className="items-center gap-4">
														<Text className="text-blue-500">Từ ngày</Text>
														<input
															type="date"
															className="!border-none !ring-0 bg-light px-4 h-8"
															{...register("startDate", {
																required: true,
															})}
															onChange={() => setFieldValue("endDate", "")}
														/>
														<Text className="text-blue-500">Đến ngày</Text>
														<input
															type="date"
															className="!border-none !ring-0 bg-light px-4 h-8"
															{...register("endDate", {
																required: true,
																validate: (value, formValues) => {
																	if (new Date(value) > new Date(formValues.endDate)) return false;
																},
															})}
														/>
													</Stack>
													{(formErrors.startDate || formErrors.endDate) && (
														<Text className="text-red-500">Thời gian không hợp lệ</Text>
													)}
												</Stack>
											</Stack>
											<hr />
											<Stack className="items-center">
												<Text className="text-gray-500 w-52 whitespace-nowrap">
													Số lượng nhân công<span className="text-red-500">*</span> :
												</Text>
												<Stack className="items-center gap-4">
													<input
														type="number"
														className="!border-none !ring-0 bg-light px-4 w-32 h-8"
														{...register("laborAmount", { required: true, min: 1, max: 100, pattern: /^[0-9]*$/ })}
													/>
													<Text className="text-blue-500">người</Text>
													{formErrors.laborAmount && <Text className="ml-8 text-red-500">Số người không hợp lệ</Text>}
												</Stack>
											</Stack>
											<hr />
										</Stack>
									</Stack>
								</Stack>
							</Stack>

							<section className="container mx-auto py-16">
								<Stack className="justify-end gap-4 mt-6">
									<Button
										type="outline"
										LeftItem={PencilSvg}
										className="!px-4 !py-1"
										onClick={() => setIsShownModalBoundary(true)}
									>
										LƯU BẢN THIẾT KẾ
									</Button>
									<Button type="fill" typeButton="submit" className="!px-4 !py-1">
										<i className="ri-hourglass-line text-xl" />
										&nbsp; LẬP KẾ HOẠCH
									</Button>
								</Stack>
							</section>
						</form>

						{isPostGanttSuccess && (
							<Stack className="items-stretch gap-2 p-2 mt-4 min-w-[600px]">
								<canvas ref={ganttChartRenderRef} className="w-full h-full" />
							</Stack>
						)}
					</Stack>
				</Accordion>
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

			<Modal
				isShown={isShownModalCoohome}
				onClose={() => {
					setIsShownModalCoohome(false);
				}}
				withFull={true}
			>
				<div className="bg-white p-1 w-full">
					<iframe src={""} className="w-full h-full"></iframe>
				</div>
			</Modal>
		</SpringLoading>
	);
};

export default BuildPage;
