import React, { HTMLAttributes, ReactNode } from "react";
import { joinTxts } from "../utils/text.util";
import Stack from "./layout/stack";
import Text from "./typography/text";

type SelectProps = {
	options: (string | number)[];
	error?: string;
	after?: JSX.Element;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;

const Select = ({ placeholder = "", value, onChange, error, after, className = "", options }: SelectProps) => {
	return (
		<Stack className={joinTxts("gap-2", className)}>
			<Stack column className="gap-1 flex-grow">
				<select
					className="font-body font-medium text-base w-full flex-grow px-2 py-1"
					value={value}
					onChange={onChange}
					placeholder={placeholder}
				>
					{options.map((item) => (
						<option key={item} value={item}>
							{item}
						</option>
					))}
				</select>
				{error && <Text className="text-red-500">{error}</Text>}
			</Stack>
			{after}
		</Stack>
	);
};

export default Select;
