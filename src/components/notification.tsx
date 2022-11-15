import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageType, popMessage } from "../redux/slices/message.slice";
import { RootState } from "../redux/stores/store.redux";
import { joinTxts } from "../utils/text.util";
import Stack from "./layout/stack";
import H5 from "./typography/h5";

const Notification = () => {
	const dispatch = useDispatch();
	const messages = useSelector((state: RootState) => state.message);

	const handleClosed = () => {
		dispatch(popMessage(false));
	};

	const message = messages[messages.length - 1];

	const styles: Record<MessageType, string> = {
		ERROR: "!text-red-500",
		WARNING: "!text-orange-500",
		INFO: "!text-blue-500",
		SUCCESS: "!text-green-500",
	};

	const icons: Record<MessageType, JSX.Element> = {
		ERROR: <H5 onClick={handleClosed}>X</H5>,
		WARNING: <H5 onClick={handleClosed}>X</H5>,
		INFO: <H5 onClick={handleClosed}>X</H5>,
		SUCCESS: <H5 onClick={handleClosed}>X</H5>,
	};

	return (
		message && (
			<Stack
				className={joinTxts(
					"gap-2 absolute right-0 bottom-0 mr-4 mb-4 z-[1000] px-4 py-2 shadow-lg bg-white",
					styles[message.type],
					message ? "" : "hidden",
				)}
			>
				<H5 className="break-words max-w-lg">{message.value}</H5>
				{icons[message.type]}
			</Stack>
		)
	);
};

export default Notification;
