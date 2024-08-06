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
			>
				{options?.map((_) => (
					<option key={_?.value || _[name]} value={_?.value}>
						{_?.name || _[name]}
					</option>
				))}
			</Select>
		</FormControlMain>
	);
};

export default SelectFormControl;
