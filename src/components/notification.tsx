import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageType, popMessage } from "../redux/slices/message.slice";
import { RootState } from "../redux/stores/store.redux";
import { joinTxts } from "../utils/text.util";
import Stack from "./layout/stack";
import H5 from "./typography/h5";
import { ReactComponent as ClearSvg } from "../svgs/clear.svg";
import { ReactComponent as LoopSvg } from "../svgs/loop.svg";

const Notification = () => {
	const dispatch = useDispatch();
	const messages = useSelector((state: RootState) => state.message);

	const handleClosed = () => {
		dispatch(popMessage(null));
	};

	const message = messages[messages.length - 1];

	const styles: Record<MessageType, string> = {
		ERROR: "!text-red-500",
		WARNING: "!text-orange-500",
		INFO: "!text-blue-500",
		SUCCESS: "!text-green-500",
		LOADING: "!text-blue-500",
	};

	const icons: Record<MessageType, JSX.Element> = {
		ERROR: <ClearSvg onClick={handleClosed} className="cursor-pointer fill-red-500 w-6 h-6" />,
		WARNING: <ClearSvg onClick={handleClosed} className="cursor-pointer fill-orange-500 w-6 h-6" />,
		INFO: <ClearSvg onClick={handleClosed} className="cursor-pointer fill-blue-500 w-6 h-6" />,
		SUCCESS: <ClearSvg onClick={handleClosed} className="cursor-pointer fill-green-500 w-6 h-6" />,
		LOADING: <LoopSvg onClick={handleClosed} className="cursor-pointer fill-blue-500 w-6 h-6 animate-spin" />,
	};

	return (
		message && (
			<Stack
				className={joinTxts(
					"items-center gap-2 fixed right-0 bottom-0 max-h-80 overflow-scroll mr-4 mb-4 z-[1000] px-4 py-2 shadow-lg bg-white",
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
