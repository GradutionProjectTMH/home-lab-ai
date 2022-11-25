import * as React from "react";
import Body from "../body";
import Button from "../../components/button";
import Input from "../../components/input";
import Stack from "../../components/layout/stack";
import Slider from "../../components/slider";
import H4 from "../../components/typography/h4";
import * as productApi from "../../apis/product.api";
import { Products } from "../../interfaces/product.interface";
import H5 from "../../components/typography/h5";
import { ReactComponent as Star } from "../../svgs/star.svg";
import H3 from "../../components/typography/h3";
import { RouteComponentProps } from "@reach/router";
import { formatPrice } from "../../utils/format-price";

const material = {
	images: [
		"https://cafefcdn.com/thumb_w/650/203337114487263232/2022/11/11/photo1668130846770-16681308470161870726782.jpg",
		"https://media.loveitopcdn.com/2071/upload/images/cau-truc-va-thanh-phan-hoa-hoc-cua-thep.jpg",
		"https://image.thanhnien.vn/w1024/Uploaded/2022/vjryqdxwp/2021_09_19/satthep-chihieu_uver_keev.jpg",
		"https://cdnimg.vietnamplus.vn/t620/uploaded/ivpycivo/2022_01_19/thep_chong_an_mon.jpg",
	],
};

type VerifyMaterialProps = {
	id?: string;
} & RouteComponentProps;

const VerifyMaterial = ({ id }: VerifyMaterialProps) => {
	const [isLoader, setIsLoader] = React.useState<boolean>(true);
	const [material, setMaterial] = React.useState<Products>();

	const fetchDetailDrawing = async () => {
		if (!id) return;
		try {
			const result = await productApi.getById(id);

			setMaterial(result);
		} catch (error: any) {
			throw error;
		} finally {
			setIsLoader(false);
		}
	};

	React.useEffect(() => {
		fetchDetailDrawing();
	}, [isLoader]);
	console.log(material);

	if (isLoader) return <></>;
	return (
		<section className="container mx-auto">
			<Stack className="items-stretch px-6 pt-6 pb-32 gap-10">
				<Stack className="basis-1/2 h-[400px]">{material?.images && <Slider images={material?.images} />}</Stack>
				<Stack column={true} className="basis-1/2  justify-between">
					<Stack column={true} className="gap-3">
						<div>
							<H4 className="text-2xl text-gray-700">{material?.name}</H4>
							<Stack className="gap-4 items-center">
								<H5 className="text-gray-500 !text-base !font-normal">Origin: ...</H5> |{" "}
								<H5 className="text-gray-500 !text-base !font-normal">Reviews:</H5>
								<Stack className="gap-1">
									<Star />
									<Star />
									<Star />
									<Star />
									<Star />
								</Stack>
							</Stack>
						</div>
						<H3 className="!text-5xl text-blue-300">{formatPrice(material?.price || 0)} $</H3>
						<Stack className="gap-4 ">
							<H5 className="!text-base !font-normal text-gray-500">Inspection status: </H5>
							<H5 className="!text-base !font-black text-red-500">Untested</H5>
						</Stack>

						<H5 className="!text-base !font-normal text-gray-500">{material?.description}</H5>
					</Stack>
					<Button>Verify now</Button>
				</Stack>
			</Stack>
		</section>
	);
};

export default VerifyMaterial;
