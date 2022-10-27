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
import Button from "../components/button";
import H5 from "../components/typography/h5";

const HiringPage = () => {
	return (
		<Body>
			<section className="pt-36 container mx-auto">
				<Carousel title="Step 01: Complete your design" defaultOpened>
					<Stack className="gap-x-8">
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
								<div className="basis-1/4">
									<StaticImage
										src="../images/fake-avatar.png"
										alt="suggested-design"
										className=" rounded-full border-white border-2 "
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
										<StaticImage
											src="../images/xd-logo.png"
											alt="suggested-design"
											className="w-8 h-8"
											aspectRatio={1}
										/>
										<StaticImage
											src="../images/revit-logo.png"
											alt="suggested-design"
											className="w-8 h-8"
											aspectRatio={1}
										/>
									</Stack>
									<div>
										<Button className="" type="outline">
											Order Now
										</Button>
									</div>
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
						<Stack className="basis-1/2 gap-2 items-stretch">
							<Stack className="basis-1/2 gap-y-6" column={true}>
								{Array.from(Array(8).keys()).map((_, i) => {
									return (
										<Stack className="gap-6" key={`abc${i}`}>
											<div className="basis-1/4">
												<StaticImage
													src="../images/fake-avatar.png"
													alt="suggested-design"
													className=" rounded-full border-white border-2 "
													aspectRatio={1}
												/>
											</div>
											<Stack column className="basis-3/4">
												<H3 className="text-gray-700">Thomas Miller</H3>
												<Text className="text-gray-500">3 years experienced </Text>
												<Text className="text-gray-500">USA </Text>
											</Stack>
										</Stack>
									);
								})}
							</Stack>
							<Stack className="basis-1/2 gap-y-6" column={true}>
								{Array.from(Array(8).keys()).map((_, i) => {
									return (
										<Stack className="gap-6" key={`abc${i}`}>
											<div className="basis-1/4">
												<StaticImage
													src="../images/fake-avatar.png"
													alt="suggested-design"
													className=" rounded-full border-white border-2 "
													aspectRatio={1}
												/>
											</div>
											<Stack column className="basis-3/4">
												<H3 className="text-gray-700">Thomas Miller</H3>
												<Text className="text-gray-500">3 years experienced </Text>
												<Text className="text-gray-500">USA </Text>
											</Stack>
										</Stack>
									);
								})}
							</Stack>
						</Stack>
					</Stack>

					<Stack column={true} className="pb-8">
						<div className="mt-8 ">
							<Button className="px-8" type="outline">
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
				</Carousel>
			</section>
		</Body>
	);
};

export default HiringPage;

export const Head: HeadFC = () => <Seo title="Make Order" />;
