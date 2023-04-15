import * as React from "react";
import Stack from "../../components/layout/stack";
import Accordion from "../../components/accordion";
import Strong from "../../components/typography/strong";
import Button from "../../components/button";
import H5 from "../../components/typography/h5";
import H4 from "../../components/typography/h4";
import Small from "../../components/typography/small";
import { ReactComponent as AddTaskOutlinedSvg } from "../../svgs/add-task-outlined.svg";
import { ReactComponent as TrashOutlined } from "../../svgs/trash-outlined.svg";
import { DetailDrawing } from "../../interfaces/detail-drawing.interface";
import * as detailDrawingApi from "../../apis/detail-drawing.api";
import * as hireApi from "../../apis/hire.api";
import { splittingRoomColor } from "../../utils/room-color";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/stores/store.redux";
import { STATUS_DRAWING_FLOOR, STATUS_HIRE } from "../../enums/hiring.enum";
import { RouteComponentProps } from "@reach/router";
import { special } from "../../utils/ordinal-digit";
import UploadFile from "../../components/upload-file";
import ModelDetailDrawing from "../../components/detail-drawing/model.detail-drawing";
import { ROLE } from "../../enums/user.enum";
import IPFS from "../../apis/ipfs.api";
import { ethers } from "ethers";
import Ether from "../../apis/ether.api";
import { popMessage, pushError, pushLoading, pushSuccess } from "../../redux/slices/message.slice";
import { createTransaction } from "../../apis/transaction.api";
import { Transaction } from "../../interfaces/transaction.interface";
import Modal from "../../components/modal";
import { Hire } from "../../interfaces/hire.interface";

const rewards = [
	{
		icon: "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ethereum-ETH-icon.png",
		name: "Ethereum",
		symbol: "ETH",
		value: 0.37,
		price: 2.034,
		color: "#553C9A",
	},
	{
		icon: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
		name: "Alavanche",
		symbol: "AVAX",
		value: 46.4,
		price: 20.34,
		color: "#E53E3E",
	},
	{
		icon: "https://user-images.githubusercontent.com/12424618/54043975-b6cdb800-4182-11e9-83bd-0cd2eb757c6e.png",
		name: "Binance",
		symbol: "BNB",
		value: 6.4,
		price: 164.23,
		color: "#D69E2E",
	},
];

type DetailDrawingProps = {
	id?: string;
} & RouteComponentProps;

const DetailDrawingPage = ({ id }: DetailDrawingProps) => {
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.user);
	const ether = useSelector((state: RootState) => state.ether);

	const [isLoader, setIsLoader] = React.useState<boolean>(true);
	const [detailDrawing, setDetailDrawing] = React.useState<DetailDrawing>();
	const [isShownModal, setIsShownModal] = React.useState<boolean>(false);
	const [numberFloor, setNumberFloor] = React.useState<number>(0);

	const [iFrameSrc, setIFrameSrc] = React.useState<string | null>();
	const [isShownModalCoHome, setIsShownModalCoHome] = React.useState<boolean>(false);

	const handleClick = (src: string) => {
		setIFrameSrc(src);
	};

	const fetchDetailDrawing = async () => {
		if (!id) return;
		try {
			const result = await detailDrawingApi.getById(id);

			setDetailDrawing(result);
		} catch (error: any) {
			console.error(error);

			throw error;
		} finally {
			setIsLoader(false);
		}
	};

	React.useEffect(() => {
		fetchDetailDrawing();
	}, [isLoader]);

	const handleClickAccept = async () => {
		try {
			const hire = detailDrawing!.hire;

			dispatch(pushLoading("Establishing transaction"));

			const signer = ether!.provider.getSigner();
			let tx;
			let txReceipt;
			try {
				tx = await ether!.contract.HomeLab.connect(signer).acceptedPhase(hire.projectId, hire.floorDesigns![0].phaseId);
				txReceipt = await tx.wait();
				console.log(txReceipt);
			} catch (error) {
				console.error(error);
				throw Ether.parseError(error);
			}

			const transaction = await createTransaction({
				from: tx.from,
				to: tx.to,
				method: "Accepted Design",
				hash: tx.hash,
			});

			const currentTransactions = hire.transactions;
			currentTransactions.push(transaction as Transaction);
			await hireApi.updateHire(hire._id, {
				status: STATUS_HIRE.RUNNING,
				transactions: currentTransactions,
			});
			const newDetailDrawing = { ...detailDrawing };
			newDetailDrawing.hire!.status = STATUS_HIRE.RUNNING;
			setDetailDrawing(newDetailDrawing as DetailDrawing);
			dispatch(popMessage({ isClearAll: true }));
			dispatch(pushSuccess("Accepted design"));
		} catch (error) {
			throw error;
		}
	};

	const handleClickUpload = async (floor: number) => {
		setNumberFloor(floor);
		setIsShownModal(true);
	};

	const handleSummitDrawingFloor = async (floor: number) => {
		if (detailDrawing?.hire) {
			const hire: Hire = detailDrawing.hire;

			dispatch(pushLoading("Establishing transaction"));

			const ipfsData = hire.floorDesigns![floor - 1].designs.map((design, index) => ({
				path: (index + 1).toString(),
				content: design.image,
			}));
			const ipfsResult = await IPFS.uploadMany(ipfsData);

			const signer = ether!.provider.getSigner();
			let tx;
			let txReceipt;
			try {
				tx = await ether!.contract.HomeLab.connect(signer).submitPhase(
					hire.projectId,
					hire.floorDesigns![0].phaseId,
					IPFS.getIPFSUrlFromPath(ipfsResult.directory.cid.toString()),
				);
				txReceipt = await tx.wait();
				console.log(txReceipt);
			} catch (error) {
				console.error(error);
				throw Ether.parseError(error);
			}

			await createTransaction({
				from: tx.from,
				to: tx.to,
				method: "Submitted Design",
				hash: tx.hash,
			});

			hire.floorDesigns![floor - 1].status = STATUS_DRAWING_FLOOR.SUBMITTED;

			await hireApi.updateHire(hire._id, hire);

			const newDetailDrawing = { ...detailDrawing };
			newDetailDrawing.hire = hire;
			setDetailDrawing(newDetailDrawing);
			dispatch(popMessage({ isClearAll: true }));
			dispatch(pushSuccess("Submitted design"));
		}
	};

	if (isLoader) return <></>;

	return (
		<>
			<section className="container mx-auto">
				<Accordion title="Requirements" defaultOpened>
					<Stack column={true} className="mt-8">
						{/* 1 */}
						<Stack className="pb-8 border-b-gray-200 border-b">
							<Stack column={true} className="basis-1/2 gap-8 items-stretch">
								<Stack className="pl-6 gap-12 ">
									<H4 className="text-gray-700 ">Bounty Reward:</H4>
								</Stack>

								<Stack column={true} className="gap-6 items-stretch">
									{rewards.map((reward, i) => {
										return (
											<Stack column={true} className="pl-6 gap-4 items-stretch" key={i}>
												<Stack className="gap-2 items-center basis-1/2">
													<img
														src={"https://cryptologos.cc/logos/avalanche-avax-logo.png"}
														alt="suggested-design"
														className=" rounded-full border-white border-2 "
														width={32}
														height={32}
													/>
													<H4 style={{ color: reward.color }}>
														{reward.name}: {reward.value} {reward.symbol}
													</H4>
												</Stack>
												<Stack className="basis-2/3">
													<H5 className="text-gray-500">
														1{reward.symbol} ~ {reward.price} USD
													</H5>
												</Stack>
											</Stack>
										);
									})}
								</Stack>
							</Stack>

							<Stack column={true} className="basis-1/2 gap-8 items-stretch ">
								<Stack>
									<Stack className="basis-1/2 gap-2 items-stretch">
										<img
											src={detailDrawing?.boundaryImg}
											alt="suggested-design"
											className="cursor-pointer basis-1/2 hover:scale-110 hover:shadow-md hover:z-10"
										/>
									</Stack>
									<Stack className="basis-1/2 gap-2 items-stretch">
										<img
											src={detailDrawing?.crossSectionImg}
											alt="suggested-design"
											className="cursor-pointer basis-1/2 hover:scale-110 hover:shadow-md hover:z-10"
										/>
									</Stack>
								</Stack>
								<Button
									className="!px-4 !py-1 justify-center items-center"
									type="outline"
									onClick={handleClickAccept}
									disabled={
										!(
											detailDrawing?.hire.status === STATUS_HIRE.PENDING && detailDrawing?.hire.designerId === user?._id
										)
									}
								>
									{detailDrawing?.hire.status === STATUS_HIRE.FINISH
										? "Finish"
										: detailDrawing?.hire.status === STATUS_HIRE.RUNNING
										? "Working"
										: detailDrawing?.hire.status === STATUS_HIRE.PENDING && detailDrawing?.hire.designerId === user?._id
										? "Accept"
										: detailDrawing?.hire.status === STATUS_HIRE.PENDING
										? "Waiting for the designer to accept"
										: "Working"}
								</Button>
							</Stack>
						</Stack>
						{/* 2 */}
						<Stack className="py-8 border-b-gray-200 border-b">
							<Stack column={true} className="basis-1/2 gap-8 items-stretch">
								<Stack className="pl-6 gap-12 ">
									<H4 className="text-gray-700">Spliting Rooms:</H4>
								</Stack>
								{detailDrawing?.rooms?.map((room, i) => {
									return (
										<Stack className="ml-32 items-stretch" key={i}>
											<Stack className="gap-2 items-center basis-1/3">
												<div
													className={`w-4 h-4 rounded-full border-white border-2`}
													style={{ backgroundColor: splittingRoomColor[room.name] }}
												/>
												<Small style={{ color: splittingRoomColor[room.name] }}>{room.name}</Small>
											</Stack>
											<Stack className="basis-2/3">
												<Small className="text-blue-700">{room.amount} Rooms</Small>
											</Stack>
										</Stack>
									);
								})}
							</Stack>
							<Stack column={true} className="basis-1/2 gap-8 items-stretch">
								<Stack className="ml-32 items-stretch">
									<Stack className="gap-2 items-center basis-1/3">
										<H4 className="text-gray-700">Number Of Floors:</H4>
									</Stack>
									<Stack className="basis-2/3">
										<H4 className="text-blue-700">
											{Number.isInteger(detailDrawing?.numberOfFloors) ? detailDrawing?.numberOfFloors : "_"} Floors
										</H4>
									</Stack>
								</Stack>
								<Stack className="ml-32 items-stretch">
									<Stack className="gap-2 items-center basis-1/3 justify-end pr-8">
										<Small className="text-gray-500">Height of each:</Small>
									</Stack>
									<Stack className="basis-2/3">
										<Small className="text-blue-700">
											{Number.isInteger(detailDrawing?.heightOfEachFloors) ? detailDrawing?.heightOfEachFloors : "_"} m
										</Small>
									</Stack>
								</Stack>
								<Stack className="ml-32 items-stretch">
									<Stack className="gap-2 items-center basis-1/3">
										<H4 className="text-gray-700">Theme Colors:</H4>
									</Stack>
									<Stack className="basis-2/3">
										<H4 className="text-blue-700">{detailDrawing?.themeColor || "_"}</H4>
									</Stack>
								</Stack>
							</Stack>
						</Stack>
						{/* 3 */}
						<Stack className="py-8 border-b-gray-200 border-b">
							<Stack column={true} className="basis-1/2 gap-8 items-stretch">
								<Stack className="pl-6 gap-12 ">
									<H4 className="text-gray-700">Additional Information:</H4>
								</Stack>
								<Stack column={true} className="gap-4 items-stretch">
									{detailDrawing?.additionalInformation &&
										Object.keys(detailDrawing?.additionalInformation).map((info, i) => {
											return (
												<Stack className="pl-6 items-stretch" key={i}>
													<Stack className="gap-2 items-center basis-1/2">
														<H5 className="text-gray-500">{info}:</H5>
													</Stack>
													<Stack className="basis-2/3">
														<H5 className="text-blue-700">
															{String(
																detailDrawing?.additionalInformation[
																	info as keyof typeof detailDrawing.additionalInformation
																],
															)}
														</H5>
													</Stack>
												</Stack>
											);
										})}
								</Stack>
							</Stack>

							<Stack column={true} className="basis-1/2 gap-8 items-end justify-end pr-28">
								<Stack className="pl-6 gap-12 ">
									<Stack column={true} className="items-end gap-3">
										<H4 className="text-gray-700">House Boundary:</H4>
										<Small className="text-gray-500">Width:</Small>
										<Small className="text-gray-500">Length:</Small>
									</Stack>
									<Stack column={true} className="gap-3">
										<H4 className="text-blue-700">{detailDrawing?.houseBoundary || "_"}m²</H4>
										<Small className="text-gray-500">{detailDrawing?.width || "_"} m</Small>
										<Small className="text-gray-500">{detailDrawing?.height || "_"} m</Small>
									</Stack>
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</Accordion>
			</section>
			{detailDrawing?.hire.status !== STATUS_HIRE.PENDING && (
				<section className="container mx-auto">
					{detailDrawing?.hire.floorDesigns?.map((floorDesign, index) => {
						return (
							<Accordion
								key={index}
								title={`${special[index + 1].charAt(0).toUpperCase() + special[index + 1].slice(1)} floor 3D model `}
								defaultOpened
							>
								<Stack column={true} className="p-8 gap-8">
									<Stack className="gap-8">
										{floorDesign.designs.map((design, i) => {
											return (
												<Stack column={true} className="basis-1/3 " key={i}>
													<div
														className="bg-white p-1  hover:scale-110 hover:shadow-md hover:z-10"
														key={index}
														onClick={() => {
															setIsShownModalCoHome(true);
															handleClick(design.coHomeUrl);
														}}
													>
														<img
															src={design.image}
															alt="suggested-design"
															className="cursor-pointer w-full h-[400px]"
														/>
													</div>
												</Stack>
											);
										})}
										{floorDesign.designs.length < 3 &&
											user?.role === ROLE.DESIGNER &&
											user?._id === detailDrawing.hire.designerId &&
											floorDesign.status !== STATUS_DRAWING_FLOOR.CANCELED &&
											floorDesign.status !== STATUS_DRAWING_FLOOR.FINISHED && (
												<div className="p-1 basis-1/3 h-[400px]" onClick={() => handleClickUpload(index + 1)}>
													<UploadFile />
												</div>
											)}
									</Stack>
								</Stack>
								{floorDesign.designs.length > 2 && (
									<Stack className="justify-center">
										{floorDesign.status === STATUS_DRAWING_FLOOR.SUBMITTED ? (
											<H5 className="text-green-500"> Pending client review</H5>
										) : floorDesign.status === STATUS_DRAWING_FLOOR.FINISHED ? (
											<></>
										) : (
											<Button className="!px-11" onClick={() => handleSummitDrawingFloor(index + 1)}>
												Submit
											</Button>
										)}
									</Stack>
								)}
							</Accordion>
						);
					})}

					<div className="h-[1px] my-4 bg-gray-300"></div>
					<Stack column={true} className="pb-20 px-6">
						<H5 className="text-green-500 my-8">13 days remaining to finish your work</H5>
						<Stack className="gap-4 items-center">
							<Button className="!px-4 !py-1" type="fill">
								Publish Now
							</Button>
							<Button className="!px-4 !py-1" type="outline">
								Save
							</Button>
						</Stack>
					</Stack>
				</section>
			)}

			{detailDrawing?.hire._id && (
				<ModelDetailDrawing
					numberFloor={numberFloor}
					idHire={detailDrawing?.hire._id}
					floorDesigns={detailDrawing.hire.floorDesigns}
					isShownModal={isShownModal}
					setIsShownModal={setIsShownModal}
					setIsLoader={setIsLoader}
				/>
			)}

			{iFrameSrc && (
				<Modal isShown={isShownModalCoHome} onClose={() => setIsShownModalCoHome(false)} withFull={true}>
					<Stack className="w-full h-full">
						<div className="bg-white p-1 w-full">
							<iframe src={iFrameSrc} className="w-full h-[700px]"></iframe>
						</div>
					</Stack>
				</Modal>
			)}
		</>
	);
};

export default DetailDrawingPage;
