import * as React from "react";
import { ReactComponent as ArrowRight } from "../../svgs/arrow_right.svg";
import { ReactComponent as Work } from "../../svgs/work.svg";
import { ReactComponent as Style } from "../../svgs/style.svg";
import { RouteComponentProps } from "@reach/router";
import Stack from "../../components/layout/stack";
import H2 from "../../components/typography/h2";
import Button from "../../components/button";
import H4 from "../../components/typography/h4";
import H5 from "../../components/typography/h5";
import * as hireApi from "../../apis/hire.api";
import { Hire } from "../../interfaces/hire.interface";

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

const OrderPage = (props: RouteComponentProps) => {
	const [hires, setHires] = React.useState<Hire[]>([]);

	const fetchDataHire = async () => {
		try {
			const res = await hireApi.getAll();
			setHires(res.data);
		} catch (error) {
			throw error;
		}
	};

	React.useEffect(() => {
		fetchDataHire();
	}, []);

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
				{hires.length > 0 ? (
					hires.map((hire, i) => {
						return (
							<div key={i} className="basis-1/3 p-8 border-r-[1px] border-b-[1px] border-gray-300">
								<Stack>
									<img
										src={hire.detailDrawing?.boundaryImg}
										alt="suggested-design"
										className="cursor-pointer w-1/2 hover:scale-110 hover:shadow-md hover:z-10"
									/>
									<img
										src={hire.detailDrawing?.crossSectionImg}
										alt="suggested-design"
										className="cursor-pointer w-1/2 hover:scale-110 hover:shadow-md hover:z-10"
									/>
								</Stack>
								<Stack className="gap-x-6 mt-4 ">
									{hire.designer?.firstName} {hire.designer?.lastName}
								</Stack>
							</div>
						);
					})
				) : (
					<H5>You currently have no orders</H5>
				)}
			</Stack>
		</section>
	);
};

export default OrderPage;
