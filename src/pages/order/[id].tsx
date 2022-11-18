import * as React from "react";
import Stack from "../../components/layout/stack";
import Carousel from "../../components/carousel";
import Button from "../../components/button";
import H1 from "../../components/typography/h1";
import { DetailDrawing } from "../../interfaces/detail-drawing.interface";
import * as detailDrawingApi from "../../apis/detail-drawing.api";
import HiringSuccess from "../../components/order/step-one/hiring-success";
import Hiring from "../../components/order/step-one/hiring";

const Order = ({ params }: any) => {
	const [isLoader, setIsLoader] = React.useState<boolean>(true);
	const [detailDrawing, setDetailDrawing] = React.useState<DetailDrawing>();

	const fetchDetailDrawing = async () => {
		if (!params.id) return;
		try {
			const result = await detailDrawingApi.getById(params.id);

			setDetailDrawing(result);
		} catch (error: any) {
			throw error;
		} finally {
			setIsLoader(false);
		}
	};

	React.useEffect(() => {
		fetchDetailDrawing();
	}, [isLoader]);

	if (isLoader) return <></>;

	return (
		<>
			<section className="pt-36 container mx-auto">
				<Carousel title="Step 01: Complete your design (Task 01)" defaultOpened>
					{detailDrawing?.hire ? (
						<HiringSuccess detailDrawing={detailDrawing} />
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
		</>
	);
};

export default Order;
