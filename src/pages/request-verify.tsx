import { ContractReceipt, ContractTransaction, ethers } from "ethers";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import IPFS from "../apis/ipfs.api";
import Button from "../components/button";
import Carousel from "../components/carousel";
import Input from "../components/input";
import Stack from "../components/layout/stack";
import SpringLoading from "../components/SpringLoading";
import H1 from "../components/typography/h1";
import H2 from "../components/typography/h2";
import H3 from "../components/typography/h3";
import Strong from "../components/typography/strong";
import Text from "../components/typography/text";
import { pushError, pushSuccess } from "../redux/slices/message.slice";
import { RootState } from "../redux/stores/store.redux";

const RequestVerify = () => {
	const dispatch = useDispatch();
	const ether = useSelector((state: RootState) => state.ether);

	const [material, setMaterial] = React.useState<Record<string, any>>({
		name: "",
		description: "",
		price: 0,
		paymentToken: ethers.constants.AddressZero,
		bounty: ethers.utils.parseEther("10"),
		image: [],
	});
	const [search, setSearch] = React.useState<string>("");
	const [onlyMyMaterial, setOnlyMyMaterial] = React.useState<boolean>(false);

	const fileRef = React.useRef<HTMLInputElement>(null);

	const handleFileAreaClicked = () => {
		fileRef.current?.click();
	};

	const handleMaterialChanged = (key: string, value: any) => {
		setMaterial({
			...material,
			[key]: value,
		});
	};

	const handleFileChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		console.log(event);
	};

	// React.useEffect(() => {
	// 	if (ipfsService) {
	// 		IPFS.upload(
	// 			JSON.stringify({
	// 				text: "hello",
	// 			}),
	// 		).then(console.log);
	// 	}
	// }, [ipfsService]);

	const handleSendRequestButtonClicked = async () => {
		let flag = true;
		Object.keys(material).forEach((key) => {
			flag = flag && material[key];
		});

		if (!flag) {
			dispatch(pushError("Please fill all required fields"));
			return;
		}

		const { path: ipfsPath } = await IPFS.upload(
			JSON.stringify({
				name: material.name,
				description: material.description,
				price: material.price,
			}),
		);

		const transaction: ContractTransaction = await ether!.contract.Material.connect(
			ether!.provider.getSigner(),
		).requestItem(material.name, ipfsPath, material.paymentToken, material.bounty, { value: material.bounty });
		const receipt: ContractReceipt = await transaction.wait();

		dispatch(pushSuccess("Request Success"));
	};

	React.useEffect(() => {
		(async () => {
			if (ether) {
				const item = await ether.contract.Material.items(1);
				console.log(item);
			}
		})();
	}, [ether]);

	return (
		<SpringLoading
			situations={[
				{ percent: 0, duration: 0 },
				{ percent: 60, duration: 200 },
				{ percent: 100, duration: 800 },
			]}
		>
			<section className="container mx-auto">
				<Stack className="justify-center gap-8">
					<Stack className="relative basis-1/2 w-2/5 justify-center items-center">
						<img src={`${process.env.PUBLIC_URL}/images/verify-bg.jpg`} className="object-contain w-full" />
						<Stack
							className="absolute top-0 left-0 w-full h-full justify-center items-center bg-whiteAlpha-700 cursor-pointer opacity-0 hover:opacity-100"
							onClick={handleFileAreaClicked}
						>
							<H3>Click to add Material image</H3>
							<input ref={fileRef} className="hidden" type="file" onChange={handleFileChanged} />
						</Stack>
					</Stack>
					<Stack column className="basis-1/2 items-stretch gap-4">
						<H2>Request Material</H2>

						<Stack column className="gap-2 items-stretch">
							<Stack className="items-center gap-2">
								<Text className="!text-gray-500 w-32 whitespace-nowrap">
									Name <span className="!text-red-500">*</span>:
								</Text>
								<Input
									placeholder="50"
									className="!text-blue-500 w-72"
									type="text"
									value={material.name}
									onChange={(event) => handleMaterialChanged("name", event?.target.value)}
								/>
							</Stack>

							<Stack className="items-center gap-2">
								<Text className="!text-gray-500 w-32 whitespace-nowrap">
									Description <span className="!text-red-500">*</span>:
								</Text>
								<Input
									placeholder="50"
									className="!text-blue-500 w-72"
									type="text"
									value={material.description}
									onChange={(event) => handleMaterialChanged("description", event?.target.value)}
								/>
							</Stack>

							<Stack className="items-center gap-2">
								<Text className="!text-gray-500 w-32 whitespace-nowrap">
									Price <span className="!text-red-500">*</span>:
								</Text>
								<Input
									placeholder="50"
									className="!text-blue-500 w-72"
									type="number"
									value={material.price}
									onChange={(event) => handleMaterialChanged("price", Number(event?.target.value))}
									after={<Text className="text-blue-500">VND</Text>}
								/>
							</Stack>
						</Stack>

						<Stack>
							<Button disabled={!ether} onClick={handleSendRequestButtonClicked}>
								Send Request
							</Button>
						</Stack>
					</Stack>
				</Stack>
			</section>

			<section className="pt-16 container mx-auto">
				<Carousel title="Request list" defaultOpened>
					<Stack column className="gap-4 mt-4">
						<Stack className="gap-8">
							<Input
								placeholder="Search by name"
								className="!text-blue-500 w-72"
								type="text"
								value={search}
								onChange={(event) => setSearch(event?.target.value)}
							/>
							<Stack className="items-center">
								<Text className="text-gray-500 w-52">Only show my materials:</Text>
								<input type="checkbox" checked={onlyMyMaterial} onChange={() => setOnlyMyMaterial(!onlyMyMaterial)} />
							</Stack>
						</Stack>

						<table className="table-auto font-body flex-grow">
							<thead className="bg-gray-200 text-gray-900">
								<tr>
									<th className="border border-r-0 border-l-0 px-0 text-left border-gray-300"></th>
									<th className="border border-r-0 border-l-0 px-0 text-left border-gray-300">Id</th>
									<th className="border border-r-0 border-l-0 px-0 text-left border-gray-300">Name</th>
									<th className="border border-r-0 border-l-0 px-0 text-left border-gray-300">Price</th>
									<th className="border border-r-0 border-l-0 px-0 text-left border-gray-300">Status</th>
								</tr>
							</thead>
							<tbody>
								<tr key={material?._id} className="cursor-pointer hover:bg-gray-50">
									<td className="border border-r-0 border-l-0 px-0 border-gray-300">
										<img src={`${process.env.PUBLIC_URL}/images/verify-bg.jpg`} className="object-contain w-32" />
									</td>
									<td className="border border-r-0 border-l-0 px-0 border-gray-300">afkasdkasdha</td>
									<td className="border border-r-0 border-l-0 px-0 border-gray-300">Chair</td>
									<td className="border border-r-0 border-l-0 px-0 border-gray-300">200.000 VND</td>
									<td className="border border-r-0 border-l-0 px-0 border-gray-300">Verified</td>
								</tr>
							</tbody>
						</table>
					</Stack>
				</Carousel>
			</section>
		</SpringLoading>
	);
};

export default RequestVerify;
