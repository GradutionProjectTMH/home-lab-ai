import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { popError } from "../../redux/slices/error.slice";
import { RootState } from "../../redux/stores/store.redux";
import { joinTxts } from "../../utils/text.util";
import H5 from "../typography/h5";

const ErrorLogging = () => {
	const dispatch = useDispatch();
	const errors = useSelector((state: RootState) => state.error);

	const handleClosed = () => {
		dispatch(popError(1));
	};

	return (
		<H5
			className={joinTxts(
				"absolute right-0 bottom-0 mr-4 mb-4 z-[1000] px-4 py-2 shadow-lg bg-white text-red-500",
				errors.length == 0 ? "hidden" : "",
			)}
			onClick={handleClosed}
		>
			{errors.length > 0 && errors[errors.length - 1]}
		</H5>
	);
};

export default ErrorLogging;
