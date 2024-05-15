import { FormLabel, Select } from "@chakra-ui/react";
import FormControlMain from ".";

const SelectFormControl = ({
	name,
	label,
	valueText,
	handleChange,
	options,
}) => {
	return (
		<FormControlMain>
			<FormLabel>{label}</FormLabel>
			<Select name={name} value={valueText} onChange={handleChange}>
				{options.map(({ name, value }) => (
					<option key={value} value={value}>
						{name}
					</option>
				))}
			</Select>
		</FormControlMain>
	);
};

export default SelectFormControl;
