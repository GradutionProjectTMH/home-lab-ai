import React, { useEffect, useRef } from "react";
import Button from "../button";
import Input from "../input";
import Stack from "../layout/stack";
import Modal from "../modal";
import Text from "../typography/text";
import UploadFile from "../upload-file";
import * as uploadFileApi from "../../apis/upload-file.api";
import * as hireApi from "../../apis/hire.api";
import { FloorDesign } from "../../interfaces/hire.interface";

interface ModelDetailDrawingProps {
	isShownModal: boolean;
	idHire: string;
	numberFloor: number;
	floorDesigns: FloorDesign[] | undefined;
	setIsLoader: React.Dispatch<React.SetStateAction<boolean>>;
	setIsShownModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModelDetailDrawing = ({
	idHire,
	isShownModal,
	setIsShownModal,
	setIsLoader,
	numberFloor,
	floorDesigns,
}: ModelDetailDrawingProps) => {
	const [coohomeUrl, setCoohomeUrl] = React.useState<string>();
	const [description, setDescription] = React.useState<string>();
	const [image, setImage] = React.useState<File | null>();
	const [imagePreview, setImagePreview] = React.useState<string | null>();
	const [imageUrl, setImageUrl] = React.useState<string | null>();

	const inputFileRef = useRef<HTMLInputElement>();
	const wrapperImageRef = useRef<HTMLDivElement>();

	const onDragEnter = () => wrapperImageRef.current?.classList.add("dragover");

	const onDragLeave = () => wrapperImageRef.current?.classList.remove("dragover");

	const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		wrapperImageRef.current?.classList.remove("dragover");
		handleImageData(e.dataTransfer.files);
	};

	const updateHire = async () => {
		if (!coohomeUrl) return;
		if (!imageUrl) return;
		if (!floorDesigns) floorDesigns = [];
		try {
			const index = floorDesigns.findIndex((floorDesign) => floorDesign.floor === numberFloor);
			if (index === -1) {
				floorDesigns = [
					...floorDesigns,
					{
						floor: numberFloor,
						designs: [
							{
								coHomeUrl: coohomeUrl,
								image: imageUrl,
								isChoose: false,
							},
						],
					},
				];
			} else {
				floorDesigns[index].designs = [
					...floorDesigns[index].designs,
					{
						coHomeUrl: coohomeUrl,
						image: imageUrl,
						isChoose: false,
					},
				];
			}

			await hireApi.updateHire(idHire, {
				floorDesigns,
			});
			setIsShownModal(false);
			setIsLoader(true);
		} catch (error: any) {
			throw error;
		}
	};

	useEffect(() => {
		if (image) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(image);
		} else {
			setImagePreview(null);
		}
	}, [image]);

	const handleInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		handleImageData(e.target.files);
	};

	const handleImageData = async (files: FileList | null) => {
		if (files && files.length > 0) {
			setImage(files[0]);
			try {
				const result = await uploadFileApi.uploadFile(files[0]);
				setImageUrl(result[0]);
			} catch (error) {
				setImageUrl(null);
				throw error;
			}
		} else {
			setImage(null);
		}
	};

	const handleClickInputFile = () => {
		inputFileRef.current?.click();
	};

	const handleClickChooseAnotherPhoto = () => {
		setImage(null);
	};

	const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		updateHire();
	};
	return (
		<Modal
			className="justify-center"
			title="Submit performance results"
			isShown={isShownModal}
			onClose={() => setIsShownModal(false)}
		>
			<form onSubmit={handleSubmitForm} className="w-full">
				<Stack column={true} className="justify-between h-full py-6">
					<Stack className=" px-4 py-4 gap-6">
						<Stack column={true} className="basis-1/2 gap-3">
							<Stack className="items-center">
								<Text className="text-gray-500 w-28">Coohome url:</Text>
								<Input value={coohomeUrl} onChange={(e) => setCoohomeUrl(e.target.value)} />
							</Stack>
							<Stack className="items-center">
								<Text className="text-gray-500 w-28">Description:</Text>
								<Input value={description} onChange={(e) => setDescription(e.target.value)} />
							</Stack>
						</Stack>
						<Stack className="basis-1/2 justify-center">
							<Stack column={true} className="w-full">
								<Text className="text-gray-500 w-28">Image:</Text>
								{imagePreview ? (
									<>
										<img src={imagePreview} alt="" />
										<Button className="!px-4 !py-2 mt-2" type="outline" onClick={handleClickChooseAnotherPhoto}>
											Choose another photo
										</Button>
									</>
								) : (
									<div
										ref={wrapperImageRef as React.LegacyRef<HTMLDivElement>}
										onDragEnter={onDragEnter}
										onDragLeave={onDragLeave}
										onDrop={onDrop}
										onDragOver={onDragOver}
										className="drop-file-input w-full h-80"
										onClick={handleClickInputFile}
									>
										<UploadFile text="Click to upload or drag and drop" />
										<input
											ref={inputFileRef as React.LegacyRef<HTMLInputElement>}
											type={"file"}
											onChange={handleInputFileChange}
											className="invisible"
											accept="image/*"
										/>
									</div>
								)}
							</Stack>
						</Stack>
					</Stack>
					<Stack className="px-6 justify-end">
						<Button typeButton="submit" type="fill">
							Submit
						</Button>
					</Stack>
				</Stack>
			</form>
		</Modal>
	);
};

export default ModelDetailDrawing;
