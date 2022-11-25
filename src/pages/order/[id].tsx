import * as React from "react";
import Stack from "../../components/layout/stack";
import Carousel from "../../components/carousel";
import Button from "../../components/button";
import H1 from "../../components/typography/h1";
import { DetailDrawing } from "../../interfaces/detail-drawing.interface";
import * as detailDrawingApi from "../../apis/detail-drawing.api";
import HiringSuccess from "../../components/order/step-one/hiring-success";
import Hiring from "../../components/order/step-one/hiring";
import { RouteComponentProps } from "@reach/router";
import { ReactComponent as DownloadSvg } from "../../svgs/download.svg";
import jsPDF from "jspdf";
import pdfDoc, { fontFaces } from "../../apis/js-pdf.api";
import { PDFHeading1, PDFItem, PDFList, PDFSection, PDFKey, PDFValue, PDFHeading2 } from "./estimation";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/stores/store.redux";

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
			// fontFaces: [new FontFace("myfont", "url(https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,800&family=Poppins:wght@300;400;500;600;700;800&display=swap)")],
			fontFaces,
			width: 3508 / 2,
			windowWidth: 3508,
		});
	};

	React.useEffect(() => {
		fetchDetailDrawing();
	}, [isLoader]);

	if (isLoader) return <></>;

	console.log(detailDrawing);

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

			<section className="pt-16 container mx-auto">
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
			</section>

			<section className="pt-16 container mx-auto">
				<Carousel title="Step 02: Estimation" defaultOpened>
					<Stack className="justify-center items-center">
						<Stack ref={pdfContent} column className="container w-[877px] bg-white p-16 gap-8">
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
										<PDFValue>Nguyendinhhuy14052000@gmail.com</PDFValue>
									</PDFItem>
								</PDFList>
							</PDFSection>

							<PDFSection>
								<PDFHeading1>PROPOSED IDEA</PDFHeading1>
								<PDFList>
									<PDFItem column>
										<PDFKey>Your Idea</PDFKey>
										<PDFValue>
											It’s safe to say that I have given my dream house a considerable amount of thought. But first I
											must say that I’m currently residing in a small apartment in District 3, Saigon, a thriving
											metropolis in southern Vietnam. However, I dream of moving to the breathtakingly beautiful
											mountainous area of Dalat, located in the central highland of Vietnam. My special house would have
											a variety of features. Firstly, it would be a two-storey detached house built from glass and
											timber with an outdoor terrace so that my family can sunbathe every day. I would also want to have
											an infinity swimming pool and an immaculately kept garden because I’m very passionate about flora
											and fauna. There is no greater feeling than being able to enjoy the idyllic scene that Dalat has
											to offer while relaxing in the water. Last but not least, it would be wonderful if my house had a
											spacious living room with a fireplace as well as an open-plan modern kitchen and a cozy dining
											room where I can invite all my friends over for dinner sometimes. The reason why I want to have
											this splendid house is because I really appreciate the cold weather that Dalat has to offer and
											would love to immerse myself in the local culture there. The house would be big enough for all of
											the family to enjoy at once. Moreover, I would love nothing more than to be at one with nature and
											I think that house would really allow me to do that in a safe and comfortable environment. Dalat
											is also not too far from Ho Chi Minh City, so it might be convenient for travelling back and forth
											between the two locations if I need to.
										</PDFValue>
									</PDFItem>
									<PDFItem column>
										<PDFKey>Our recommendation</PDFKey>
										<PDFValue>Huhu</PDFValue>
									</PDFItem>
								</PDFList>
							</PDFSection>

							<PDFSection>
								<PDFHeading1>RECOMMENDED DESIGN</PDFHeading1>

								<PDFHeading2>1. Initial parameters</PDFHeading2>
								<PDFList>
									<PDFItem>
										<PDFKey>Width</PDFKey>
										<PDFValue>10 m</PDFValue>
									</PDFItem>
									<PDFItem>
										<PDFKey>Height</PDFKey>
										<PDFValue>20 m</PDFValue>
									</PDFItem>
									<PDFItem>
										<PDFKey>Area</PDFKey>
										<PDFValue>
											20 m<sup>2</sup>
										</PDFValue>
									</PDFItem>
									<PDFItem>
										<PDFKey>Rooms</PDFKey>
										<PDFList className="flex-grow">
											<PDFItem>
												<PDFKey className="basis-1/5">Living Room</PDFKey>
												<PDFValue className="basis-4/5">01 rooms</PDFValue>
											</PDFItem>
											<PDFItem>
												<PDFKey className="basis-1/5">Public Area</PDFKey>
												<PDFValue className="basis-4/5">02 rooms</PDFValue>
											</PDFItem>
											<PDFItem>
												<PDFKey className="basis-1/5">Bathroom</PDFKey>
												<PDFValue className="basis-4/5">01 rooms</PDFValue>
											</PDFItem>
										</PDFList>
									</PDFItem>
								</PDFList>

								<PDFHeading2>2. Suggestion</PDFHeading2>
								<PDFList>
									<PDFItem>
										<PDFKey>Floor plans</PDFKey>
										<Stack>
											<img src={detailDrawing?.boundaryImg} width={128} className="w-64" />
											<img src={detailDrawing?.crossSectionImg} width={128} className="w-64" />
										</Stack>
									</PDFItem>
								</PDFList>
							</PDFSection>
						</Stack>
					</Stack>

					<Stack className="justify-center gap-4 mt-6">
						<Button type="outline" LeftItem={DownloadSvg} className="!px-4 !py-1" onClick={handleEstimationSaved}>
							Save As PDF
						</Button>
					</Stack>
				</Carousel>
			</section>
		</>
	);
};

export default Order;
