import React from "react";
import Button from "./button";
import Stack from "./layout/stack";
import H4 from "./typography/h4";

interface DialogBoxProps {
	message: string;
	accept: () => void;
	cancel: () => void;
}

const DialogBox = ({ accept, message, cancel }: DialogBoxProps) => {
	return (
		<Stack className="w-full h-screen bg-blackAlpha-400 fixed top-0 left-0 z-50 justify-center items-center ">
			<Stack className="p-3 w-64 h-64 rounded bg-white flex-col justify-around items-center">
				<H4 className="text-center">{message}</H4>
				<Stack className="justify-around w-full">
					<Button className="bg-red-700 hover:bg-red-500" onClick={cancel}>
						Cancel
					</Button>
					<Button onClick={accept}>Accept</Button>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default DialogBox;
