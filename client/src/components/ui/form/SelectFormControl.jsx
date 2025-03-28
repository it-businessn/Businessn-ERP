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
	size,
}) => {
	return (
		<FormControlMain>
			{label && <RequiredLabel label={label} required={required} htmlFor={name} />}
			<Select
				w={w}
				name={name}
				value={valueText}
				icon={icon}
				onChange={handleChange}
				placeholder={placeholder}
				size={size}
			>
				{options?.map((_) => {
					return (
						<option
							key={_?.value || _[valueParam] || _}
							value={_[valueParam] || _}
							style={{ color: isPayType && getPayTypeStyle(_[name]).color }}
						>
							{_?.name || _[name] || _}
						</option>
					);
				})}
			</Select>
		</FormControlMain>
	);
};

export default SelectFormControl;
