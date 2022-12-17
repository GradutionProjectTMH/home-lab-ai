import React from "react";

interface DropdownProps {
	value: string;
	options: Record<"label" | "value", string>[];
	onChange: (value: string) => void;
}
const Dropdown = ({ value, options, onChange }: DropdownProps) => {
	return (
		<div>
			<select
				value={value}
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
					onChange(e.target.value);
				}}
			>
				{options.map((option, index) => (
					<option value={option.value} selected={value === option.value} key={index}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
};

export default Dropdown;
