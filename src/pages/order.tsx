import * as React from "react";
import type { HeadFC } from "gatsby";
import Body from "../components/body";
import Stack from "../components/layout/stack";
import Seo from "../components/seo";
import Carousel from "../components/carousel";
import { StaticImage } from "gatsby-plugin-image";
import Strong from "../components/typography/strong";
import Text from "../components/typography/text";
import H3 from "../components/typography/h3";
import H4 from "../components/typography/h4";
import Button from "../components/button";
import TrashOutlinedSvg from "../svgs/trash-outlined.svg";
import AddTaskOutlinedSvg from "../svgs/add-task-outlined.svg";
import ForwardToInboxOutlinedSvg from "../svgs/forward-to-inbox-outlined.svg";
import H1 from "../components/typography/h1";

const OrderPage = () => {
	return (
		<Body>
			<section className="pt-36 container mx-auto">
				<Carousel title="Step 01: Complete your design (Task 01)" defaultOpened>
					<Stack className="items-stretch px-6 py-12">
						<Stack className="basis-1/2 gap-8 items-stretch">
							<div className="basis-1/4">
								<StaticImage
									src="../images/fake-avatar.png"
									alt="suggested-design"
									className=" rounded-full border-white border-2"
									aspectRatio={1}
								/>
							</div>
							<Stack column className="basis-3/4 gap-4">
								<Stack className="items-end gap-2">
									<H3 className="text-gray-700">Thomas Miller</H3>
									<Strong className="text-gray-500">New York/USA</Strong>
								</Stack>
								<Text className="text-gray-500">3 years experienced in drawing 2D and 3D </Text>
								<Strong className="text-blue-700">Public design</Strong>
								<Stack className="gap-2">
									<StaticImage
										src="../images/figma-logo.png"
										alt="suggested-design"
										className="w-8 h-8"
										aspectRatio={1}
									/>
									<StaticImage src="../images/xd-logo.png" alt="suggested-design" className="w-8 h-8" aspectRatio={1} />
									<StaticImage
										src="../images/revit-logo.png"
										alt="suggested-design"
										className="w-8 h-8"
										aspectRatio={1}
									/>
								</Stack>
								<Strong className="text-green-500">I have finished 3D model for your first floor.</Strong>
							</Stack>
						</Stack>

						<Stack className="basis-1/2 gap-2 items-stretch">
							<StaticImage
								src="../images/suggested-designs/33.png"
								alt="suggested-design"
								className="cursor-pointer basis-1/2 hover:scale-110 hover:shadow-md hover:z-10"
							/>
							<StaticImage
								src="../images/suggested-designs/33.png"
								alt="suggested-design"
								className="cursor-pointer basis-1/2 hover:scale-110 hover:shadow-md hover:z-10"
							/>
						</Stack>
					</Stack>

					<Stack className="pt-8 justify-between items-center mx-6">
						<H4>Choose 3D model for your first floor:</H4>
						<Button type="ghost" className="px-4 py-1 text-red-500 fill-red-500" LeftItem={TrashOutlinedSvg}>
							Reject all drafts
						</Button>
					</Stack>

					<Stack className="mx-6 mt-2 gap-4">
						<Stack column className="basis-1/3 items-stretch">
							<StaticImage
								src="../images/fake-2d.png"
								alt="suggested-design"
								className="border-white border-4 cursor-pointer hover:scale-110 hover:shadow-md hover:z-10"
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

						<Stack column className="basis-1/3 items-stretch">
							<StaticImage
								src="../images/fake-2d.png"
								alt="suggested-design"
								className="border-white border-4 cursor-pointer hover:scale-110 hover:shadow-md hover:z-10"
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

						<Stack column className="basis-1/3 items-stretch">
							<StaticImage
								src="../images/fake-2d.png"
								alt="suggested-design"
								className="border-white border-4 cursor-pointer hover:scale-110 hover:shadow-md hover:z-10"
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
					</Stack>
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
							<StaticImage
								src="../images/living-room.webp"
								alt="suggested-design"
								className="cursor-pointer hover:scale-110 hover:shadow-md hover:z-10"
							/>
						</Stack>
					</Stack>
				</Carousel>
			</section>
		</Body>
	);
};

export default OrderPage;

export const Head: HeadFC = () => <Seo title="Make Order" />;
