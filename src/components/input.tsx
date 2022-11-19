import React, { HTMLAttributes } from "react";
import Text from "./typography/text";

type InputProps = {
	error?: string;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const Input = ({ type = "text", placeholder = "", value, onChange, error }: InputProps) => {
	return (
		<div>
			<input
				className="font-body font-medium text-base text-gray-700"
				value={value}
				onChange={onChange}
				type={type}
				placeholder={placeholder}
			/>
			{error && <Text className="text-red-500">{error}</Text>}
		</div>
	);
};

export default Input;
