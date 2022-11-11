import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { popMessage } from "../../redux/slices/message.slice";
import { RootState } from "../../redux/stores/store.redux";
import { joinTxts } from "../../utils/text.util";
import H5 from "../typography/h5";

const ErrorLogging = () => {
	const dispatch = useDispatch();
	const messages = useSelector((state: RootState) => state.message);

	const handleClosed = () => {
		dispatch(popMessage(false));
	};

	const error = messages.find((message) => message.type == "ERROR");

	return (
		<H5
			className={joinTxts(
				"absolute right-0 bottom-0 mr-4 mb-4 z-[1000] px-4 py-2 shadow-lg bg-white text-red-500",
				error ? "" : "hidden",
			)}
			onClick={handleClosed}
		>
			{error && error.value}
		</H5>
	);
};

export default ErrorLogging;
