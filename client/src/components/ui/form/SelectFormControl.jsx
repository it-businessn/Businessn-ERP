import { FormLabel, Select } from "@chakra-ui/react";
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
					<option key={_?.value ?? _[name]} value={_[valueParam]}>
						{_?.name || _[name]}
					</option>
				))}
			</Select>
		</FormControlMain>
	);
};

export default SelectFormControl;
