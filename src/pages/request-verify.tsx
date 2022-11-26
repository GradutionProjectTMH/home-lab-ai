import * as React from "react";
import Button from "../components/button";
import Input from "../components/input";
import Stack from "../components/layout/stack";
import H1 from "../components/typography/h1";
import H2 from "../components/typography/h2";
import H3 from "../components/typography/h3";
import Text from "../components/typography/text";

const RequestVerify = () => {
	const [material, setMaterial] = React.useState({
		name: "",
		image: "",
		price: 0,
	});

	const handleMaterialChanged = (key: string, value: any) => {
		setMaterial({
			...material,
			[key]: value,
		});
	};

	// const handleSendRequestButtonClicked = async () => {
	//   let flag = true;
	//   Object.keys(material).forEach(key => {
	//     flag = flag && (material[key])
	//   })
	// }

	return (
		<section className="container mx-auto">
			<Stack className="justify-center gap-8">
				<Stack className="relative basis-1/2 w-2/5 justify-center items-center">
					<img src={`${process.env.PUBLIC_URL}/images/verify-bg.jpg`} className="object-contain w-full" />
					<Stack className="absolute top-0 left-0 w-full h-full justify-center items-center bg-whiteAlpha-700 cursor-pointer opacity-0 hover:opacity-100">
						<H3>Click to add Material image</H3>
					</Stack>
				</Stack>
				<Stack column className="basis-1/2 items-stretch gap-4">
					<H2>Request Material</H2>

					<Stack column className="gap-2 items-stretch">
						<Stack className="items-center gap-2">
							<Text className="!text-gray-500 w-16 whitespace-nowrap">
								Area <span className="!text-red-500">*</span>:
							</Text>
							<Input
								placeholder="50"
								className="!text-blue-500 w-72"
								type="text"
								value={material.name}
								onChange={(event) => handleMaterialChanged("name", Number(event?.target.value))}
							/>
						</Stack>

						<Stack className="items-center gap-2">
							<Text className="!text-gray-500 w-16 whitespace-nowrap">
								Price <span className="!text-red-500">*</span>:
							</Text>
							<Input
								placeholder="50"
								className="!text-blue-500 w-72"
								type="text"
								value={material.name}
								onChange={(event) => handleMaterialChanged("name", Number(event?.target.value))}
								after={<Text className="text-blue-500">VND</Text>}
							/>
						</Stack>
					</Stack>

					<Stack>
						<Button>Send Request</Button>
					</Stack>
				</Stack>
			</Stack>
		</section>
	);
};

export default RequestVerify;
