import * as React from "react";
import Stack from "../../layout/stack";
import Strong from "../../typography/strong";
import Text from "../../typography/text";
import H3 from "../../typography/h3";
import Button from "../../button";
import H5 from "../../typography/h5";
import * as userApi from "../../../apis/user.api";
import * as hireApi from "../../../apis/hire.api";
import { FloorDesign, Hire, HouseDesign } from "../../../interfaces/hire.interface";
import { DetailDrawing } from "../../../interfaces/detail-drawing.interface";
import AddToMarketplacePage from "./add-to-marketplace";
import { STATUS_DRAWING_FLOOR, STATUS_HIRE } from "../../../enums/hiring.enum";
import { Link } from "@reach/router";
import { ROLE } from "../../../enums/user.enum";
import { User } from "../../../types/common";
import Ether from "../../../apis/ether.api";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { popMessage, pushLoading, pushSuccess } from "../../../redux/slices/message.slice";
import { RootState } from "../../../redux/stores/store.redux";
import IPFS from "../../../apis/ipfs.api";
import { dataExampleHouseDesign } from "../../../utils/example-data-house-design";
import { createTransaction } from "../../../apis/transaction.api";
import { Transaction } from "../../../interfaces/transaction.interface";

type HiringProp = {
	setIsLoader: React.Dispatch<React.SetStateAction<boolean>>;
	detailDrawing: DetailDrawing | undefined;
};

const Hiring = ({ setIsLoader, detailDrawing }: HiringProp) => {
	const dispatch = useDispatch();
	const ether = useSelector((state: RootState) => state.ether);
	const user = useSelector((state: RootState) => state.user);

	const [designers, setDesigner] = React.useState<User[]>();
	const [selectedDesigner, setSelectedDesigner] = React.useState<User>();
	const [currentPage, setCurrentPage] = React.useState<"Order" | "Marketplace">("Order");

	const fetchAllDesigner = async () => {
		const result = await userApi.getAllUser({ typeUser: ROLE.DESIGNER });
		console.log(result);

		setDesigner(result.data);
		setSelectedDesigner(result.data[0]);
	};

	React.useEffect(() => {
		fetchAllDesigner();
	}, []);

	React.useEffect(() => {
		if (detailDrawing?.hire) {
			setCurrentPage("Marketplace");
		}
	}, []);

	const handleClickDesigner = (designer: User) => {
		setSelectedDesigner(designer);
	};

	const handleClickOrder = async (isSelfBuild: boolean) => {
		if (!selectedDesigner || !detailDrawing || detailDrawing.hire) {
			if (isSelfBuild) return setCurrentPage("Marketplace");
			return;
		}

		const floorDesigns: FloorDesign[] = [];
		if (detailDrawing.numberOfFloors > 0) {
			Array(detailDrawing.numberOfFloors)
				.fill(0)
				.forEach((e, index) => {
					floorDesigns.push({
						designs: [],
						floor: index + 1,
						status: STATUS_DRAWING_FLOOR.PENDING,
						phaseId: "",
					});
				});
		}

		const hiring: Partial<Hire> = {
			designerId: isSelfBuild ? user?._id : selectedDesigner._id,
			detailDrawingId: detailDrawing._id,
			status: STATUS_HIRE.RUNNING,
			floorDesigns: floorDesigns,
			houseDesigns: isSelfBuild ? (dataExampleHouseDesign as any) : [],
		};

		if (!isSelfBuild) {
			try {
				dispatch(pushLoading("Creating hiring contract"));

				const ipfsDetailDrawingData = {
					...detailDrawing,
					boundaryImagePath: "/BoundaryImage",
					crossSectionPath: "/CrossSectionImage",
				};

				const ipfsResult = await IPFS.uploadMany([
					{
						path: "",
						content: JSON.stringify(ipfsDetailDrawingData),
					},
					{
						path: "BoundaryImage",
						content: detailDrawing!.boundaryImg,
					},
					{
						path: "CrossSectionImage",
						content: detailDrawing!.crossSectionImg,
					},
				]);

				const currentTimeStamp = await Ether.getTimestamp();
				const expiredAt = currentTimeStamp + 60 * 500;
				const signer = ether!.provider.getSigner();
				let tx;
				let txReceipt;
				try {
					const amount = 1;
					tx = await ether!.contract.HomeLab.connect(signer).startProject(
						detailDrawing!._id,
						IPFS.getIPFSUrlFromPath(ipfsResult.directory.cid.toString()),
						ethers.constants.AddressZero,
						user!.wallet,
						expiredAt,
						amount,
						{ value: amount },
					);

					txReceipt = await tx.wait();
					console.log(txReceipt);
				} catch (error) {
					console.error(error);
					throw Ether.parseError(error);
				}

				const transaction = await createTransaction({
					from: tx.from,
					to: tx.to,
					method: "Started Project",
					hash: tx.hash,
				});

				hiring.transactions = [transaction as Transaction];
				hiring.projectId = txReceipt.events![0].args!["projectId"].toString();
				hiring.floorDesigns![0].phaseId = txReceipt.events![0].args!["phaseId"].toString();
				await hireApi.createHire(hiring);

				dispatch(popMessage({ isClearAll: true }));
				dispatch(pushSuccess("Contract created successfully"));

				setIsLoader(true);
			} catch (error) {
				throw error;
			}
		} else {
			dispatch(pushLoading("Prepare to building"));
			await hireApi.createHire(hiring);
			setIsLoader(true);
			dispatch(popMessage({ isClearAll: true }));
		}
	};

	const handleAddToMarketplace = () => {
		window.scrollTo(0, 0);
		setCurrentPage("Marketplace");
	};

	if (currentPage === "Marketplace" && detailDrawing?.hire.designerId === user?._id) {
		return <AddToMarketplacePage detailDrawing={detailDrawing} setCurrentPage={setCurrentPage} />;
	}

	return (
		<>
			<Stack className="gap-x-8 p-6">
				<Stack column={true} className="basis-1/2 gap-8 items-stretch">
					<div>
						<Button className="!px-32" type="fill">
							Hiring
						</Button>
					</div>
					<H5 className="text-gray-500">
						Hiring the partner that can help you to bring <br></br> your dream house to reality
					</H5>
					<Stack className="gap-8">
						<div>
							<img
								src={selectedDesigner?.avatar}
								alt="suggested-design"
								className=" rounded-full border-white border-2 w-[200px] h-[200px]"
							/>
						</div>
						<Stack column className=" gap-4">
							<Stack className="items-end gap-2">
								<H3 className="text-gray-700">
									{selectedDesigner?.firstName} {selectedDesigner?.lastName}
								</H3>
								<Strong className="text-gray-500">
									{/* {selectedDesigner?.user.address.city}/{selectedDesigner?.user.address.country} */}
								</Strong>
							</Stack>
							<Text className="text-gray-500">{selectedDesigner?.profile?.experience}</Text>
							<Strong className="text-blue-700">Public design</Strong>
							<Stack className="gap-2">
								{selectedDesigner?.profile?.projects?.map((project, index) => {
									return (
										<Link key={index} to={project.url} target="_blank">
											<img src={project.tool.logo} alt={project.tool.name} className="w-8 h-8 rounded" />
										</Link>
									);
								})}
							</Stack>
							<div>
								<Button className="" type="outline" onClick={() => handleClickOrder(false)}>
									Order Now
								</Button>
							</div>
						</Stack>
					</Stack>

					<Stack className="basis-1/2 gap-2 items-stretch">
						<Stack className="cursor-pointer basis-1/2 hover:scale-110 hover:shadow-md hover:z-10 ">
							<img src={detailDrawing?.boundaryImg} alt="suggested-design" className="w-full object-cover" />
						</Stack>

						<Stack className="cursor-pointer basis-1/2 hover:scale-110 hover:shadow-md hover:z-10 ">
							<img
								src={detailDrawing?.crossSectionImg}
								alt="suggested-design"
								className="w-full selection:object-cover"
							/>
						</Stack>
					</Stack>
				</Stack>
				<div className="basis-1/2">
					<Stack className="flex-wrap">
						{designers?.map((designer, i) => {
							return (
								<Stack
									className="w-1/2 gap-6 cursor-pointer hover:bg-gray-200 hover:rounded p-3"
									key={i}
									onClick={() => handleClickDesigner(designer)}
								>
									<img
										src={designer.avatar}
										alt="suggested-design"
										className=" rounded-full border-white border-2 w-[100px] h-[100px]  "
									/>
									<Stack column={true} className="">
										<H3 className="text-gray-700">
											{designer.firstName} {designer.lastName}
										</H3>
										<Text className="text-gray-500">{designer.profile?.experience}</Text>
										<Text className="text-gray-500">
											{/* {designer.user.address.city}/{designer.user.address.country} */}
											USA
										</Text>
									</Stack>
								</Stack>
							);
						})}
					</Stack>
				</div>
			</Stack>

			<Stack column={true} className="pb-8 p-6">
				<div className="mt-8 ">
					<Button className="px-8" type="outline" onClick={() => handleClickOrder(true)}>
						Build from scratch
					</Button>
				</div>
				<H5 className="text-green-500 my-8">You have completed all requirements</H5>
				<Stack className="gap-4 items-center">
					<div>
						<Button className="!px-4 !py-1" type="fill">
							Publish Now
						</Button>
					</div>
					<div>
						<Button className="!px-4 !py-1" type="outline">
							Save
						</Button>
					</div>
				</Stack>
			</Stack>
		</>
	);
};

export default Hiring;
