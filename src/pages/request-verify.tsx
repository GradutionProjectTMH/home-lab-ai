import { ContractReceipt, ContractTransaction, ethers } from "ethers";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import IPFS from "../apis/ipfs.api";
import { createProduct } from "../apis/product.api";
import Button from "../components/button";
import Accordion from "../components/accordion";
import Dropdown from "../components/dropdown";
import Input from "../components/input";
import Stack from "../components/layout/stack";
import SpringLoading from "../components/SpringLoading";
import H1 from "../components/typography/h1";
import H2 from "../components/typography/h2";
import H3 from "../components/typography/h3";
import Strong from "../components/typography/strong";
import Text from "../components/typography/text";
import { TYPE_PRODUCT } from "../enums/product.enum";
import { Product, ProductVerify } from "../interfaces/product.interface";
import { pushError, pushSuccess } from "../redux/slices/message.slice";
import { RootState } from "../redux/stores/store.redux";

const productTypeOptions: Record<"value" | "label", string>[] = [
	{
		label: "Furniture",
		value: TYPE_PRODUCT.FURNITURE,
	},
	{
		label: "Material",
		value: TYPE_PRODUCT.MATERIAL,
	},
];

const RequestVerify = () => {
	const dispatch = useDispatch();
	const ether = useSelector((state: RootState) => state.ether);

	const [productVerify, setProductVerify] = React.useState<ProductVerify>({
		name: "",
		type: TYPE_PRODUCT.FURNITURE,
		bounty: ethers.utils.parseEther("0"),
		paymentToken: ethers.constants.AddressZero,
	});
	const [search, setSearch] = React.useState<string>("");
	const [onlyMyMaterial, setOnlyMyMaterial] = React.useState<boolean>(false);

	const fileRef = React.useRef<HTMLInputElement>(null);
	const [files, setFiles] = React.useState<File[]>([]);

	const handleFileAreaClicked = () => {
		fileRef.current?.click();
	};

	const handleProductVerifyChanged = (key: string, value: any) => {
		setProductVerify({
			...productVerify,
			[key]: value,
		});
	};

	const handleFileChanged = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) return;

		const files = Array.from(event.target.files);
		setFiles(files);
	};

	const handleSendRequestButtonClicked = async () => {
		// Validation
		if (files.length > 0) {
			dispatch(pushError("Please put your material sources"));
			return;
		}

		let flag = true;
		Object.keys(productVerify).forEach((key) => {
			flag = flag && productVerify[key as keyof ProductVerify];
		});

		if (!flag) {
			dispatch(pushError("Please fill all required fields"));
			return;
		}

		// Upload data to IPFS
		const ipfsData = files.slice(1).map((file) => ({
			path: file.name,
			content: file,
		}));
		const { directory: ipfsDirectory, files: ipfsFiles } = await IPFS.uploadMany(ipfsData);

		// Send Transaction to smart contract
		const transaction: ContractTransaction = await ether!.contract.Material.connect(
			ether!.provider.getSigner(),
		).requestItem(
			productVerify.name!,
			IPFS.getIPFSUrlFromPath(ipfsDirectory.cid.toString()),
			productVerify.paymentToken,
			productVerify.bounty,
			{ value: productVerify.bounty },
		);
		const receipt: ContractReceipt = await transaction.wait();

		createProduct(productVerify);
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
							<input ref={fileRef} className="hidden" type="file" multiple onChange={handleFileChanged} />
						</Stack>
					</Stack>
					<Stack column className="basis-1/2 items-stretch gap-4 pr-8">
						<H2>Request Material</H2>

						<Stack column className="gap-2 items-stretch">
							<Stack className="items-center gap-2">
								<Text className="!text-gray-500 w-32 whitespace-nowrap">
									Name <span className="!text-red-500">*</span>:
								</Text>
								<Input
									placeholder="50"
									className="!text-blue-500 flex-grow"
									type="text"
									value={productVerify.name}
									onChange={(event) => handleProductVerifyChanged("name", event?.target.value)}
								/>
							</Stack>

							<Stack className="items-center gap-2">
								<Text className="!text-gray-500 w-32 whitespace-nowrap">
									Product type <span className="!text-red-500">*</span>:
								</Text>
								<Dropdown
									value={productVerify.type!}
									options={productTypeOptions}
									onChange={(newValue) => {
										handleProductVerifyChanged("type", newValue);
									}}
								/>
							</Stack>

							<Stack className="items-center gap-2">
								<Text className="!text-gray-500 w-32 whitespace-nowrap">
									Description <span className="!text-red-500">*</span>:
								</Text>
								<Input
									placeholder="Short description for this material"
									className="!text-blue-500 flex-grow"
									type="text"
									value={productVerify.description}
									onChange={(event) => handleProductVerifyChanged("description", event?.target.value)}
								/>
							</Stack>

							<Stack className="items-center gap-2">
								<Text className="!text-gray-500 w-32 whitespace-nowrap">
									Price <span className="!text-red-500">*</span>:
								</Text>
								<Input
									placeholder="50"
									className="!text-blue-500 flex-grow"
									type="number"
									value={productVerify.price}
									onChange={(event) => handleProductVerifyChanged("price", Number(event?.target.value))}
									after={<Text className="text-blue-500">VND</Text>}
								/>
							</Stack>
						</Stack>

						<Stack>
							<Button disabled={!ether} onClick={handleSendRequestButtonClicked} className="flex-grow">
								Send Request
							</Button>
						</Stack>
					</Stack>
				</Stack>
			</section>

			<section className="pt-16 container mx-auto">
				<Accordion title="Request list" defaultOpened>
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
								<tr key={productVerify?._id} className="cursor-pointer hover:bg-gray-50">
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
				</Accordion>
			</section>
		</SpringLoading>
	);
};

export default RequestVerify;
