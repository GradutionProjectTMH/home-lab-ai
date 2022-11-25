import * as React from "react";
import Stack from "../../layout/stack";
import Strong from "../../typography/strong";
import Text from "../../typography/text";
import H3 from "../../typography/h3";
import Button from "../../button";
import H5 from "../../typography/h5";
import * as userApi from "../../../apis/user.api";
import * as hireApi from "../../../apis/hire.api";
import { Hire } from "../../../interfaces/hire.interface";
import { DetailDrawing } from "../../../interfaces/detail-drawing.interface";
import AddToMarketplacePage from "./add-to-marketplace";
import { STATUS_HIRE } from "../../../enums/hiring.enum";
import { Link } from "@reach/router";
import { ROLE } from "../../../enums/user.enum";
import { User } from "../../../types/common";
import Ether from "../../../apis/ether.api";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { pushSuccess } from "../../../redux/slices/message.slice";
import { RootState } from "../../../redux/stores/store.redux";
import IPFS from "../../../apis/ipfs.api";

type HiringProp = {
	setIsLoader: React.Dispatch<React.SetStateAction<boolean>>;
	detailDrawing: DetailDrawing | undefined;
};

const Hiring = ({ setIsLoader, detailDrawing }: HiringProp) => {
	console.log("detailDrawing", detailDrawing);

	const dispatch = useDispatch();
	const ether = useSelector((state: RootState) => state.ether);

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

	const handleClickDesigner = (designer: User) => {
		setSelectedDesigner(designer);
	};

	const handleClickOrder = async () => {
		if (!selectedDesigner || !detailDrawing) return;

		const hiring: Partial<Hire> = {
			designerId: selectedDesigner._id,
			detailDrawingId: detailDrawing._id,
			status: STATUS_HIRE.ACCEPT,
			floorDesigns: [],
			houseDesigns: [],
		};

		try {
			const timestamp = await Ether.getTimestamp();
			const value = parseEther("10");
			const expiredIn = Ether.BN.from(timestamp).add(300);
			const dataIpfs = await IPFS.upload(
				JSON.stringify({
					drawing: detailDrawing,
					designer: selectedDesigner,
					bounty: value,
					expiredIn,
				}),
			);
			const transaction = await ether!.contract.HomeLab.connect(ether!.provider.getSigner()).startProject(
				detailDrawing._id,
				IPFS.getIPFSUrlFromPath(dataIpfs.path),
				ethers.constants.AddressZero,
				"0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
				expiredIn,
				value,
				{ value: value },
			);
			const receipt = await transaction.wait();
			dispatch(pushSuccess(receipt.events![0].event));

			const result = await hireApi.createHire(hiring);
			console.log("hiring: ", result);

			console.log("Hiring success");
			setIsLoader(true);
		} catch (error) {
			throw error;
		}
	};

	const handleAddToMarketplace = () => {
		window.scrollTo(0, 0);
		setCurrentPage("Marketplace");
	};

	if (currentPage === "Marketplace") {
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
								<Button className="" type="outline" onClick={handleClickOrder}>
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
					<Button className="px-8" type="outline" onClick={handleAddToMarketplace}>
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
