import * as React from "react";
import Stack from "../components/layout/stack";
import Button from "../components/button";
import H5 from "../components/typography/h5";
import H2 from "../components/typography/h2";
import H4 from "../components/typography/h4";
import { ReactComponent as ArrowRight } from "../svgs/arrow_right.svg";
import { ReactComponent as Work } from "../svgs/work.svg";
import { ReactComponent as Style } from "../svgs/style.svg";
import { RouteComponentProps } from "@reach/router";

const coins = [
	{
		icon: "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ethereum-ETH-icon.png",
		symbol: "ETH",
		value: 0.37,
		color: "#553C9A",
	},
	{
		icon: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
		symbol: "AVAX",
		value: 46.4,
		color: "#E53E3E",
	},
	{
		icon: "https://user-images.githubusercontent.com/12424618/54043975-b6cdb800-4182-11e9-83bd-0cd2eb757c6e.png",
		symbol: "BNB",
		value: 6.4,
		color: "#D69E2E",
	},
];

const MarketplacePage = (props: RouteComponentProps) => {
	return (
		<section className="container mx-auto">
			<Stack>
				<div className="basis-1/2">
					<H2 className="!text-5xl text-blue-700 !leading-tight">
						We help you in finding <br /> the<span className="text-blue-500"> best partners</span> as well as <br />
						complementary <span className="text-blue-500">interiors</span> <br />
						for your <span className="text-gray-100 bg-blue-700 px-2">dream home.</span>
					</H2>
				</div>
				<Stack column={true} className="basis-1/2 p-8 gap-8">
					<Stack className="gap-4">
						<Button className="!px-4 !py-1" type="fill" LeftItem={Work}>
							Publish Now
						</Button>
						<Button className="!px-4 !py-1" type="outline" LeftItem={Style}>
							Save
						</Button>
					</Stack>
					<H4 className="text-gray-500 !text-2xl">
						You are designer but waiting for a sweet idea? We have many ideas and wonderful bounties are waiting for
						you.
					</H4>
					<Stack className="items-center gap-1">
						<H5 className="text-blue-700 !text-base">See our best hiring</H5>
						<ArrowRight />
					</Stack>
					<Stack className="gap-2 justify-end">
						<img
							src={"https://cryptologos.cc/logos/avalanche-avax-logo.png"}
							alt="suggested-design"
							className=" rounded-full border-white border-2 "
							width={32}
							height={32}
						/>
						<img
							src={"https://cryptologos.cc/logos/avalanche-avax-logo.png"}
							alt="suggested-design"
							className=" rounded-full border-white border-2 "
							width={32}
							height={32}
						/>
						<img
							src={"https://cryptologos.cc/logos/avalanche-avax-logo.png"}
							alt="suggested-design"
							className=" rounded-full border-white border-2 "
							width={32}
							height={32}
						/>
					</Stack>
				</Stack>
			</Stack>

			<Stack className="flex-wrap">
				{Array.from(Array(8).keys()).map((e, i) => {
					return (
						<div key={i} className="basis-1/3 p-8 border-r-[1px] border-b-[1px] border-gray-300">
							<img
								src="../images/suggested-designs/33.png"
								alt="suggested-design"
								className="cursor-pointer basis-1/2 hover:scale-110 hover:shadow-md hover:z-10"
							/>
							<Stack className="gap-x-6 mt-4 ">
								{coins.map((coin, index) => {
									return (
										<Stack key={index} className="gap-1 justify-center items-center">
											<img
												src={"https://cryptologos.cc/logos/avalanche-avax-logo.png"}
												alt="suggested-design"
												className="rounded-full border-white border-2 "
												width={24}
												height={24}
											/>
											<H5 className="text-base" style={{ color: coin.color }}>
												{coin.symbol}
											</H5>
										</Stack>
									);
								})}
							</Stack>
						</div>
					);
				})}
			</Stack>
		</section>
	);
};

export default MarketplacePage;
