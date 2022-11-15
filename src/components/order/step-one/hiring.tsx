import * as React from "react";
import { HeadFC, Link } from "gatsby";
import Body from "../../body";
import Stack from "../../layout/stack";
import Seo from "../../seo";
import Carousel from "../../carousel";
import { StaticImage } from "gatsby-plugin-image";
import Strong from "../../typography/strong";
import Text from "../../typography/text";
import H3 from "../../typography/h3";
import Button from "../../button";
import H5 from "../../typography/h5";
import { Designer } from "../../../interfaces/designer.interface";
import * as designerApi from "../../../apis/designer.api";
import * as hireApi from "../../../apis/hire.api";
import { Hire } from "../../../interfaces/hire.interface";
import { DetailDrawing } from "../../../interfaces/detail-drawing.interface";
import AddToMarketplacePage from "./add-to-marketplace";

type HiringProp = {
	setIsLoader: React.Dispatch<React.SetStateAction<boolean>>;
	detailDrawing: DetailDrawing | undefined;
};

const Hiring = ({ setIsLoader, detailDrawing }: HiringProp) => {
	const [designers, setDesigner] = React.useState<Designer[]>();
	const [selectedDesigner, setSelectedDesigner] = React.useState<Designer>();
	const [currentPage, setCurrentPage] = React.useState<"Order" | "Marketplace">("Order");

	const fetchAllDesigner = async () => {
		try {
			const result = await designerApi.getAll();
			console.log(result);
			setDesigner(result.data);
			setSelectedDesigner(result.data[0]);
		} catch (error) {
			console.log(error);
		}
	};

	React.useEffect(() => {
		fetchAllDesigner();
	}, []);

	const handleClickDesigner = (designer: Designer) => {
		setSelectedDesigner(designer);
	};

	const handleClickOrder = async () => {
		if (!selectedDesigner || !detailDrawing) return;

		const hiring: Hire = {
			designerId: selectedDesigner.userId,
			detailDrawingId: detailDrawing._id,
			floorDesigns: [],
			houseDesigns: [],
		};

		try {
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
								src={selectedDesigner?.user?.avatar}
								alt="suggested-design"
								className=" rounded-full border-white border-2 w-[200px] h-[200px]"
							/>
						</div>
						<Stack column className=" gap-4">
							<Stack className="items-end gap-2">
								<H3 className="text-gray-700">
									{selectedDesigner?.user?.firstName} {selectedDesigner?.user?.lastName}
								</H3>
								<Strong className="text-gray-500">
									{/* {selectedDesigner?.user.address.city}/{selectedDesigner?.user.address.country} */}
								</Strong>
							</Stack>
							<Text className="text-gray-500">{selectedDesigner?.experience}</Text>
							<Strong className="text-blue-700">Public design</Strong>
							<Stack className="gap-2">
								{selectedDesigner?.projects.map((project, index) => {
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
										src={designer.user?.avatar}
										alt="suggested-design"
										className=" rounded-full border-white border-2 w-[100px] h-[100px]  "
									/>
									<Stack column={true} className="">
										<H3 className="text-gray-700">
											{designer.user?.firstName} {designer.user?.lastName}
										</H3>
										<Text className="text-gray-500">{designer.experience}</Text>
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
						Add to Marketplace
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

export const Head: HeadFC = () => <Seo title="Make Order" />;
