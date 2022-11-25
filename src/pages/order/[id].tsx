import * as React from "react";
import Stack from "../../components/layout/stack";
import Carousel from "../../components/carousel";
import Button from "../../components/button";
import { DetailDrawing } from "../../interfaces/detail-drawing.interface";
import * as detailDrawingApi from "../../apis/detail-drawing.api";
import HiringSuccess from "../../components/order/step-one/hiring-success";
import Hiring from "../../components/order/step-one/hiring";
import { RouteComponentProps } from "@reach/router";
import jsPDF from "jspdf";
import pdfDoc, { fontFaces } from "../../apis/js-pdf.api";
import { PDFHeading1, PDFItem, PDFList, PDFSection, PDFKey, PDFValue, PDFHeading2, PDFImage } from "./estimation";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/stores/store.redux";
import Text from "../../components/typography/text";
import { formatPrice } from "../../utils/text.util";

type OrderProps = {
	id?: string;
} & RouteComponentProps;

const Order = ({ id }: OrderProps) => {
	const [isLoader, setIsLoader] = React.useState<boolean>(true);
	const [detailDrawing, setDetailDrawing] = React.useState<DetailDrawing>();
	const user = useSelector((state: RootState) => state.user);

	const pdfContent = React.useRef<HTMLDivElement>(null);

	const fetchDetailDrawing = async () => {
		if (!id) return;
		try {
			const result: any = await detailDrawingApi.getById(id);
			setDetailDrawing(result);
		} catch (error: any) {
			throw error;
		} finally {
			setIsLoader(false);
		}
	};

	const handleEstimationSaved = async () => {
		const content = pdfContent.current!;
		pdfDoc.html(content, {
			callback: (doc: jsPDF) => {
				doc.save("Estimation.pdf");
			},
			fontFaces,
			width: 3508 / 2,
			windowWidth: 3508,
			margin: [72 / 4, 96 / 4, 112 / 4, 120 / 4],
			autoPaging: "text",
		});
	};

	React.useEffect(() => {
		fetchDetailDrawing();
	}, [isLoader]);

	if (isLoader) return <></>;

	console.log(detailDrawing);

	const materials =
		(detailDrawing as any)?.hire.houseDesigns[0].designs[0].materials?.map((material: any) => {
			return {
				...material,
				amount: 1,
			};
		}) || [];

	const totalPrice = materials.reduce((result: number, material: any) => {
		result += material.price * (material.amount || 0);
		return result;
	}, 0);

	return (
		<>
			<section className="container mx-auto">
				<Carousel title="Step 01: Complete your design (Task 01)" defaultOpened>
					{detailDrawing?.hire && detailDrawing?.hire.designerId !== user?._id ? (
						<HiringSuccess detailDrawing={detailDrawing} setDetailDrawing={setDetailDrawing} />
					) : (
						<Hiring setIsLoader={setIsLoader} detailDrawing={detailDrawing} />
					)}
				</Carousel>
			</section>

			{/* <section className="pt-16 container mx-auto">
				<Carousel title="Step 02: Choose your furnitures" defaultOpened>
					<Stack className="items-stretch px-6 py-12">
						<Stack className="basis-2/3">
							<Stack column>
								<H1 className="text-gray-700">
									Let’s make your <br /> living room <span className="text-blue-500">cooler.</span>
								</H1>
								<div className="mt-8">
									<Button type="fill">Go To Marketplace</Button>
								</div>
							</Stack>
						</Stack>

						<Stack className="basis-1/3 gap-2 items-stretch">
							<img
								src="../images/living-room.webp"
								alt="suggested-design"
								className="cursor-pointer hover:scale-110 hover:shadow-md hover:z-10"
							/>
						</Stack>
					</Stack>
				</Carousel>
			</section> */}

			<section className="pt-16 container mx-auto">
				<Carousel title="Step 02: Estimation">
					<Stack className="justify-center items-center">
						<Stack className="p-16 bg-white">
							<Stack ref={pdfContent} column className="flex-grow w-[749px] container bg-white gap-8">
								<Stack className="justify-center">
									<img src={`${process.env.PUBLIC_URL}/images/logo-full-vertical.png`} height={256} className="h-64" />
								</Stack>

								<PDFSection>
									<PDFHeading1>PERSONAL INFORMATION</PDFHeading1>
									<PDFList>
										<PDFItem>
											<PDFKey>Name</PDFKey>
											<PDFValue>Nguyen Dinh Huy</PDFValue>
										</PDFItem>
										<PDFItem>
											<PDFKey>Age</PDFKey>
											<PDFValue>22</PDFValue>
										</PDFItem>
										<PDFItem>
											<PDFKey>Email</PDFKey>
											<PDFValue>nguyendinhhuy14052000@gmail.com</PDFValue>
										</PDFItem>
									</PDFList>
								</PDFSection>

								<PDFSection>
									<PDFHeading1>PROPOSED IDEA</PDFHeading1>
									<PDFList>
										<PDFItem column>
											<PDFKey>Your Idea</PDFKey>
											{/* <PDFValue>{detailDrawing?.additionalInformation.idea}</PDFValue> */}
											<PDFValue>
												My dream house is a modern house not far from the sea. On the ground-floor, there're four rooms.
												There is a living-room with a white sofa, a black armchair and a coffee table. My living room
												has a lot of paints and bibelots,.. There is a lamp, a French windows with a view of the garden,
												a television set and a phone. My dream house has a fully-equiped kitchen, with a fridge, a rator
												and a door out to the garden. There is a bathroom with a shower and a toilet. Finally, there is
												a study-room with a desk and a computer. On the first floor, there are three bed-rooms and a
												bath. In my bedroom, there is a wardrobe, a king-sized bed. There are a lot of pictures of me,
												and a television set. There is a balcony with a view of the sea. My house is really beautiful
												and spacious. n the garden, there are a lot of fruit trees. The is a patio in front of the
												house, and there is a driveway with a gate. The walls of my house are pure white because white
												walls look fresh. And all of the all windows in my dream house have blinds.
											</PDFValue>
										</PDFItem>
										{/* <PDFItem column>
											<PDFKey>Entities</PDFKey>
											<Stack className="flex-wrap gap-4">
												{detailDrawing?.additionalInformation.entities?.map((entity) => (
													<Text key={entity} className={"flex-grow px-2 text-gray-700"}>
														{entity}
													</Text>
												))}
											</Stack>
										</PDFItem> */}
									</PDFList>
								</PDFSection>

								<PDFSection>
									<PDFHeading1>RECOMMENDED DESIGN</PDFHeading1>

									<PDFHeading2>1. Initial parameters</PDFHeading2>
									<PDFList>
										<PDFItem>
											<PDFKey>Width</PDFKey>
											<PDFValue>{detailDrawing?.width} m</PDFValue>
										</PDFItem>
										<PDFItem>
											<PDFKey>Height</PDFKey>
											<PDFValue>{detailDrawing?.height} m</PDFValue>
										</PDFItem>
										<PDFItem>
											<PDFKey>Area</PDFKey>
											<PDFValue>
												{detailDrawing?.width && detailDrawing?.height && detailDrawing?.width * detailDrawing?.height}{" "}
												m<sup>2</sup>
											</PDFValue>
										</PDFItem>
										<PDFItem>
											<PDFKey>Rooms</PDFKey>
											<PDFValue>4</PDFValue>

											{/* <PDFList className="flex-grow">
												{detailDrawing?.rooms?.map((room) => (
													<PDFItem key={room.name}>
														<PDFKey className="basis-1/5">{room.name}</PDFKey>
														<PDFValue className="basis-4/5">{room.amount} rooms</PDFValue>
													</PDFItem>
												))}
											</PDFList> */}
										</PDFItem>
									</PDFList>

									<PDFHeading2>2. Suggestion</PDFHeading2>
									<PDFList>
										<PDFItem>
											<PDFKey>Floor plans</PDFKey>
											<Stack>
												<img src={detailDrawing?.boundaryImg} className="h-64 flex-grow" />
												<img src={detailDrawing?.crossSectionImg} className="h-64 flex-grow" />
											</Stack>
										</PDFItem>
										<PDFItem>
											<PDFKey>3D Design</PDFKey>
											<Stack>
												<img src={`${process.env.PUBLIC_URL}/images/3d.png`} className="h-96 flex-grow" />
											</Stack>
										</PDFItem>
									</PDFList>

									<PDFHeading2>3. Furniture</PDFHeading2>
									<PDFList>
										{materials.map((material: any) => (
											<PDFItem key={material?._id}>
												<PDFKey>{material.name}</PDFKey>
												<PDFImage label={material?.name} note={`${formatPrice(material?.price)} VND`}>
													<Stack className="flex-wrap">
														{material?.images?.map((image: string) => (
															<img key={image} src={image} className="h-64 flex-grow" />
														))}
													</Stack>
												</PDFImage>
											</PDFItem>
										))}
									</PDFList>
								</PDFSection>

								<PDFSection>
									<PDFHeading1>ESTIMATION COST</PDFHeading1>
									<table className="border-collapse border border-gray-300 font-body">
										<thead className="bg-blue-300 text-gray-900">
											<tr>
												<th className="px-2 border border-gray-300">Item</th>
												<th className="px-2 border border-gray-300">Quantity</th>
												<th className="px-2 border border-gray-300">Unit price</th>
												<th className="px-2 border border-gray-300">Amount</th>
											</tr>
										</thead>
										<tbody>
											{materials?.map((material: any) => (
												<tr key={material?._id}>
													<td className="px-2 border border-gray-300">{material?.name}</td>
													<td className="px-2 border border-gray-300">{material?.amount}</td>
													<td className="px-2 border border-gray-300">{formatPrice(material?.price)} VND</td>
													<td className="px-2 border border-gray-300">
														{formatPrice(material?.price && material?.amount && material?.price * material?.amount)} VND
													</td>
												</tr>
											))}
											<tr className="bg-yellow-100">
												<td className="px-2 border border-gray-300 font-bold" colSpan={3}>
													Total
												</td>
												<td className="px-2 border border-gray-300 font-bold">{formatPrice(totalPrice)} VND</td>
											</tr>
										</tbody>
									</table>
								</PDFSection>
							</Stack>
						</Stack>
					</Stack>

					<Stack className="justify-center gap-4 mt-6">
						<Button
							type="outline"
							className="!px-4 !py-1"
							// onClick={handleEstimationSaved}
							onClick={() => {
								window.open("https://home-lab-ai.s3.ap-southeast-1.amazonaws.com/Floor+Plan+Views.pdf", "_blank");
							}}
						>
							View Floor Plan
						</Button>
					</Stack>
				</Carousel>
			</section>
		</>
	);
};

export default Order;
