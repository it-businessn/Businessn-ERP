import { Select } from "@chakra-ui/react";
import { getPayTypeStyle } from "erp-modules/payroll/timesheets/data";
import FormControlMain from ".";
import RequiredLabel from "./RequiredLabel";

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
	required,
}) => {
	return (
		<FormControlMain>
			<RequiredLabel label={label} required={required} htmlFor={name} />
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
						key={_?.value || _[valueParam]}
						value={_[valueParam] || _}
						style={{ color: isPayType && getPayTypeStyle(_[name]).color }}
					>
						{_?.name || _[name] || _}
					</option>
				))}
			</Select>
		</FormControlMain>
	);
};

export default SelectFormControl;
