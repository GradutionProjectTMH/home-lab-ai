import React from "react";
import Stack from "./layout/stack";
import { ReactComponent as CloudUpload } from "../svgs/cloud_upload_256.svg";
import H2 from "./typography/h2";

interface UploadFileProps {
	text?: string;
}

const UploadFile = ({ text = "Upload result" }: UploadFileProps) => {
	return (
		<Stack
			column={true}
			className=" w-full h-full  border-dashed border-gray-400 rounded justify-center items-center border-8 cursor-pointer  hover:bg-gray-200"
		>
			<CloudUpload className="fill-gray-400 " />
			<H2 className="text-gray-400  pointer-events-none">{text}</H2>
		</Stack>
	);
};

export default UploadFile;
