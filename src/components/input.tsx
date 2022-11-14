import React from "react";

interface InputProps {
	label?: string;
	type?: React.HTMLInputTypeAttribute;
	placeholder?: string;
	value: string;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
	error?: string;
}

const Input = ({ label, type = "text", placeholder = "", value, onChange, error }: InputProps) => {
	return (
		<div>
			{label && <label className="block text-gray-500 text-sm font-bold mb-2">Material</label>}
			<input
				className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 mb-3 leading-tight focus:outline-none focus:shadow-outline"
				value={value}
				onChange={onChange}
				type={type}
				placeholder={placeholder}
			/>
			{error && <p className="text-red-500 text-xs italic">Please choose a password.</p>}
		</div>
	);
};

export default Input;
