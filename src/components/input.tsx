import React, { HTMLAttributes } from "react";
import { joinTxts } from "../utils/text.util";
import Stack from "./layout/stack";
import Text from "./typography/text";

type InputProps = {
	error?: string;
	after?: JSX.Element;
	inputClassName?: string;
	refInput?: any;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const Input = ({ error, after, className = "", inputClassName = "", refInput, ...props }: InputProps) => {
	return (
		<Stack className={joinTxts("gap-2 items-center", className)}>
			<Stack column className="gap-1 flex-grow">
				<input
					ref={refInput}
					className={joinTxts("form-input font-body font-medium text-base flex-grow w-full px-2 py-1", inputClassName)}
					{...props}
				/>
				{error && <Text className="text-red-500">{error}</Text>}
			</Stack>
			{after}
		</Stack>
	);
};

export default Input;
