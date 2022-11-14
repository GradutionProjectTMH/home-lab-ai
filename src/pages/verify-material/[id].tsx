import * as React from "react";
import Body from "../../components/body";
import Button from "../../components/button";
import Input from "../../components/input";
import Stack from "../../components/layout/stack";
import Slider from "../../components/slider";
import H4 from "../../components/typography/h4";
import * as productApi from "../../apis/product.api";
import { Products } from "../../interfaces/product.interface";
const material = {
	images: [
		"https://cafefcdn.com/thumb_w/650/203337114487263232/2022/11/11/photo1668130846770-16681308470161870726782.jpg",
		"https://media.loveitopcdn.com/2071/upload/images/cau-truc-va-thanh-phan-hoa-hoc-cua-thep.jpg",
		"https://image.thanhnien.vn/w1024/Uploaded/2022/vjryqdxwp/2021_09_19/satthep-chihieu_uver_keev.jpg",
		"https://cdnimg.vietnamplus.vn/t620/uploaded/ivpycivo/2022_01_19/thep_chong_an_mon.jpg",
	],
};

const VerifyMaterial = ({ params }: any) => {
	const [isLoader, setIsLoader] = React.useState<boolean>(true);
	const [detailDrawing, setDetailDrawing] = React.useState<Products>();

	const fetchDetailDrawing = async () => {
		if (!params.id) return;
		try {
			const result = await productApi.getById(params.id);

			setDetailDrawing(result);
		} catch (error: any) {
			throw error;
		} finally {
			setIsLoader(false);
		}
	};

	React.useEffect(() => {
		setIsLoader(false);
		// fetchDetailDrawing();
	}, [isLoader]);

	if (isLoader) return <></>;
	return (
		<Body>
			<section className="pt-36 container mx-auto">
				<Stack className="items-stretch p-6 gap-10">
					<Stack className="basis-1/2 h-[400px]">
						<Slider images={material.images} />
					</Stack>
					<Stack className="basis-1/2">
						<H4>Thép phế liệu</H4>
					</Stack>
				</Stack>
			</section>
		</Body>
	);
};

export default VerifyMaterial;
