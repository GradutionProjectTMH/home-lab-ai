import * as React from "react";
import { ReactComponent as ArrowRight } from "../../svgs/arrow_right.svg";
import { ReactComponent as Work } from "../../svgs/work.svg";
import { ReactComponent as Style } from "../../svgs/style.svg";
import { Link, RouteComponentProps } from "@reach/router";
import Stack from "../../components/layout/stack";
import H2 from "../../components/typography/h2";
import Button from "../../components/button";
import H4 from "../../components/typography/h4";
import H5 from "../../components/typography/h5";
import * as hireApi from "../../apis/hire.api";
import { Hire } from "../../interfaces/hire.interface";
import { STATUS_HIRE } from "../../enums/hiring.enum";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/stores/store.redux";
import { ROLE } from "../../enums/user.enum";

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
	const user = useSelector((state: RootState) => state.user);

	const [hires, setHires] = React.useState<Hire[]>([]);
	const [selectedTag, setSelectedTag] = React.useState<number>(0);

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
			<Stack className="pb-8">
				<div className="basis-1/2">
					<H2 className="!text-5xl text-blue-700 !leading-tight">List order</H2>
				</div>
			</Stack>

			<Stack>
				<Button type={selectedTag === 0 ? "fill" : "ghost"} onClick={() => setSelectedTag(0)}>
					Complete
				</Button>
				<Button type={selectedTag === 1 ? "fill" : "ghost"} onClick={() => setSelectedTag(1)}>
					Pending
				</Button>
				<Button type={selectedTag === 2 ? "fill" : "ghost"} onClick={() => setSelectedTag(2)}>
					Working
				</Button>
				<Button type={selectedTag === 3 ? "fill" : "ghost"} onClick={() => setSelectedTag(3)}>
					Canceled
				</Button>
			</Stack>
			<Stack className="flex-wrap">
				{hires.length > 0 ? (
					hires
						.filter((hire) => {
							if (selectedTag === 0) {
								return hire.status === STATUS_HIRE.COMPLETE;
							}
							if (selectedTag === 1) {
								return hire.status === STATUS_HIRE.PENDING;
							}
							if (selectedTag === 2) {
								return hire.status === STATUS_HIRE.ACCEPT;
							}
							if (selectedTag === 3) {
								return hire.status === STATUS_HIRE.CANCELED;
							}
						})
						.map((hire, i) => {
							return (
								<div key={i} className="basis-1/3 p-8 border-r-[1px] border-b-[1px] border-t-[1px] border-gray-300">
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
										<Link to={`/${user?.role === ROLE.DESIGNER ? "detail-drawing" : "order"}/${hire.detailDrawingId}`}>
											{hire.designer?.firstName} {hire.designer?.lastName}
										</Link>
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
