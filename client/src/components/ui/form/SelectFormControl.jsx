import { FormLabel, Select } from "@chakra-ui/react";
import { getPayTypeStyle } from "erp-modules/payroll/timesheets/data";
import FormControlMain from ".";

const SelectFormControl = ({
	name,
	label,
	valueText,
	handleChange,
	options,
	icon,
	w,
	placeholder,
	valueParam = "value",
	isPayType,
}) => {
	return (
		<FormControlMain>
			<FormLabel>{label}</FormLabel>
			<Select
				w={w}
				name={name}
				value={valueText}
				icon={icon}
				onChange={handleChange}
				placeholder={placeholder}
			>
				{options?.map((_) => (
					<option
						key={_?.value ?? _[valueParam]}
						value={_[valueParam]}
						style={{ color: isPayType && getPayTypeStyle(_[name]).color }}
					>
						{_?.name || _[name]}
					</option>
				))}
			</Select>
		</FormControlMain>
	);
};

export default SelectFormControl;
