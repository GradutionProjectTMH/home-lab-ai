import React from "react";
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
import { STATUS_HIRE } from "../../../enums/hiring.enum";
import { Link } from "@reach/router";
import { special } from "../../../utils/ordinal-digit";
import Modal from "../../modal";

type HiringSuccessProp = {
	detailDrawing: DetailDrawing | undefined;
};

function HiringSuccess({ detailDrawing }: HiringSuccessProp) {
	const [isShownModal, setIsShownModal] = React.useState<boolean>(false);
	const [iFrameSrc, setIFrameSrc] = React.useState<string | null>();
	return (
		<>
			<Stack className="items-stretch px-6 py-12">
				<Stack className="basis-1/2 gap-8 items-stretch">
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
			) : detailDrawing?.hire.status === STATUS_HIRE.CANCELED ? (
				<>
					<Button
						className="!px-4 !py-1 justify-center items-center border-red-500 text-red-500"
						type="outline"
						disabled={true}
					>
						This job has been cancelled
					</Button>
				</>
			) : (
				<>
					{detailDrawing?.hire.floorDesigns?.map((floorDesign, index) => {
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
											<Stack
												column
												className="basis-1/3 items-stretch"
												key={i}
												onClick={() => {
													setIsShownModal(true);
													setIFrameSrc(design.coHomeUrl);
												}}
											>
												<img
													src={design.image}
													alt="suggested-design"
													className="border-white border-4 cursor-pointer hover:scale-110 hover:shadow-md hover:z-10 h-[400px]"
												/>
												<Stack className="gap-4 mt-2">
													<Button type="outline" className="px-4 py-1" LeftItem={AddTaskOutlinedSvg}>
														I choose this
													</Button>
													<Button type="ghost" className="px-4 py-1" LeftItem={ForwardToInboxOutlinedSvg}>
														Send message
													</Button>
												</Stack>
											</Stack>
										);
									})}
								</Stack>
							</div>
						);
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
		</>
	);
}

export default HiringSuccess;
