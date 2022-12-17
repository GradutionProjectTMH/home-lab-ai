import React, { useEffect } from "react";
import Stack from "../../layout/stack";
import H3 from "../../typography/h3";
import Strong from "../../typography/strong";
import Text from "../../../components/typography/text";
import H4 from "../../typography/h4";
import Button from "../../button";
import { ReactComponent as TrashOutlinedSvg } from "../../../svgs/trash-outlined.svg";
import { ReactComponent as AddTaskOutlinedSvg } from "../../../svgs/add-task-outlined.svg";
import { ReactComponent as ForwardToInboxOutlinedSvg } from "../../../svgs/forward-to-inbox-outlined.svg";
import { DetailDrawing } from "../../../interfaces/detail-drawing.interface";
import { STATUS_DRAWING_FLOOR, STATUS_HIRE } from "../../../enums/hiring.enum";
import { Link, navigate } from "@reach/router";
import { special } from "../../../utils/ordinal-digit";
import Modal from "../../modal";
import * as hireApi from "../../../apis/hire.api";
import DialogBox from "../../dialog-box";

type HiringSuccessProp = {
	detailDrawing: DetailDrawing | undefined;
	setDetailDrawing: React.Dispatch<React.SetStateAction<DetailDrawing | undefined>>;
};

type SelectedDrawing = {
	floor: number;
	index: number;
	isChoose: boolean;
};

function HiringSuccess({ detailDrawing, setDetailDrawing }: HiringSuccessProp) {
	const [isShownModal, setIsShownModal] = React.useState<boolean>(false);
	const [iFrameSrc, setIFrameSrc] = React.useState<string | null>();
	const [isShownDialogBox, setIsShownDialogBox] = React.useState<boolean>(false);

	const [selectedDrawing, setSelectedDrawing] = React.useState<SelectedDrawing | null>(null);

	const handleChooseDrawing = async ({ floor, index, isChoose }: SelectedDrawing) => {
		try {
			if (!detailDrawing?.hire) return;
			const newDetailDrawing = { ...detailDrawing };
			const newHire = { ...detailDrawing.hire };
			if (!newHire.floorDesigns) return;

			newHire.floorDesigns[floor].designs[index].isChoose = isChoose;
			newHire.floorDesigns[floor].status = STATUS_DRAWING_FLOOR.FINISHED;

			if (!newHire.floorDesigns.some((floorDesign) => !floorDesign.status)) {
				// Sau khi hoàn thành tất cả các bảng vẽ cho từng tần
				newHire.status = STATUS_HIRE.FINISH;
			}

			await hireApi.updateHire(newHire._id, newHire);

			newDetailDrawing.hire = newHire;
			setDetailDrawing(newDetailDrawing);
		} catch (error) {
			throw error;
		}
	};

	return (
		<>
			<Stack className="items-stretch px-6 py-12">
				<Stack column={true} className="basis-1/2 items-stretch justify-between">
					<Stack className=" gap-8 items-stretch">
						<div className="">
							<img
								src={detailDrawing?.hire?.designer?.avatar}
								alt="suggested-design"
								className=" rounded-full border-white border-2 w-[200px] h-[200px]"
							/>
						</div>
						<Stack column className="gap-4">
							<Stack className="items-end gap-2">
								<H3 className="text-gray-700">
									{detailDrawing?.hire.designer?.firstName} {detailDrawing?.hire.designer?.lastName}
								</H3>
								<Strong className="text-gray-500">
									{/* {detailDrawing?.hire.designer?.user.address.city}/{detailDrawing?.hire.designer?.user.address.city} */}
								</Strong>
							</Stack>
							<Text className="text-gray-500">{detailDrawing?.hire.designer?.profile?.experience}</Text>
							<Strong className="text-blue-700">Public design</Strong>
							<Stack className="gap-2">
								{detailDrawing?.hire?.designer?.profile?.projects?.map((project, index) => {
									return (
										<Link key={index} to={project.url} target="_blank">
											<img src={project.tool.logo} alt={project.tool.name} className="w-8 h-8 rounded" />
										</Link>
									);
								})}
							</Stack>
							<Strong className="text-green-500">I have finished 3D model for your first floor.</Strong>
						</Stack>
					</Stack>
					<Stack>
						<Button onClick={() => navigate(`/detail-drawing/${detailDrawing?._id}`)}>Detail drawing</Button>
					</Stack>
				</Stack>
				<Stack className="basis-1/2 gap-2 items-stretch">
					<div className="cursor-pointer basis-1/2 hover:scale-110 hover:shadow-md hover:z-10">
						<img src={detailDrawing?.boundaryImg} alt="suggested-design" className="w-full h-full object-cover" />
					</div>
					<div className="cursor-pointer basis-1/2 hover:scale-110 hover:shadow-md hover:z-10">
						<img src={detailDrawing?.crossSectionImg} alt="suggested-design" className="w-full h-full object-cover" />
					</div>
				</Stack>
			</Stack>
			{detailDrawing?.hire.status === STATUS_HIRE.PENDING ? (
				<>
					<Button className="!px-4 !py-1 justify-center items-center" type="outline" disabled={true}>
						Waiting for the designer to accept
					</Button>
				</>
			) : (
				<>
					{detailDrawing?.hire.floorDesigns?.map((floorDesign, index) => {
						if (floorDesign.status !== STATUS_DRAWING_FLOOR.FINISHED) {
							return (
								<div key={index}>
									<Stack className="pt-8 justify-between items-center mx-6">
										<H4>Choose 3D model for your {special[index + 1]} floor:</H4>
										<Button type="ghost" className="px-4 py-1 text-red-500 fill-red-500" LeftItem={TrashOutlinedSvg}>
											Reject all drafts
										</Button>
									</Stack>

									<Stack className="mx-6 mt-2 gap-4">
										{floorDesign.designs.map((design, i) => {
											return (
												<Stack column className="basis-1/3 items-stretch" key={i}>
													<img
														onClick={() => {
															setIsShownModal(true);
															setIFrameSrc(design.coHomeUrl);
														}}
														src={design.image}
														alt="suggested-design"
														className="border-white border-4 cursor-pointer hover:scale-110 hover:shadow-md hover:z-10 h-[400px]"
													/>
													<Stack className="gap-4 mt-2 justify-center">
														<Button
															type="outline"
															className="px-4 py-1"
															LeftItem={AddTaskOutlinedSvg}
															onClick={() => {
																setSelectedDrawing({ floor: index, index: i, isChoose: true });
																// handleChooseDrawing(index, i, true);
																setIsShownDialogBox(true);
															}}
														>
															I choose this
														</Button>
													</Stack>
												</Stack>
											);
										})}
									</Stack>
								</div>
							);
						} else {
							const isChooseImage = floorDesign.designs.find((design) => design.isChoose);
							const draft = floorDesign.designs.filter((design) => !design.isChoose).length;
							if (!isChooseImage) return <></>;
							return (
								<div key={index}>
									<Stack className="pt-8 justify-between items-center mx-6">
										<H4>Choose 3D model for your {special[index + 1]} floor:</H4>
									</Stack>
									<Stack className="mx-6 mt-2 gap-4">
										<Stack column className="basis-2/3 items-stretch gap-6">
											<Stack className="items-center gap-3">
												<div className="w-3 h-3 bg-red-500 rounded-full" />
												<Text className="font-bold text-red-500">Draft: {draft} pieces</Text>
											</Stack>
											<Stack>
												<Stack className="px-4 py-3 border-4 border-green-500 flex gap-3 justify-center items-center">
													<AddTaskOutlinedSvg className="fill-green-500 w-6 h-6" />
													<Text className="font-bold text-green-500 text-base">DONE</Text>
												</Stack>
											</Stack>
										</Stack>
										<Stack column className="basis-1/3 items-stretch">
											<img
												onClick={() => {
													setIsShownModal(true);
													setIFrameSrc(isChooseImage.coHomeUrl);
												}}
												src={isChooseImage.image}
												alt="suggested-design"
												className="border-white border-4 cursor-pointer hover:scale-110 hover:shadow-md hover:z-10 h-[400px]"
											/>
										</Stack>
									</Stack>
								</div>
							);
						}
					})}
				</>
			)}
			<Modal
				isShown={isShownModal}
				onClose={() => {
					setIsShownModal(false);
					setIFrameSrc(null);
				}}
				withFull={true}
			>
				{iFrameSrc && (
					<div className="bg-white p-1 w-full">
						<iframe src={iFrameSrc} className="w-full h-full"></iframe>
					</div>
				)}
			</Modal>
			{isShownDialogBox && (
				<DialogBox
					message="Are you sure you want to choose this design?"
					accept={() => {
						if (selectedDrawing) {
							handleChooseDrawing(selectedDrawing);
						}
						setIsShownDialogBox(false);
					}}
					cancel={() => {
						setIsShownDialogBox(false);
					}}
				/>
			)}
		</>
	);
}

export default HiringSuccess;
