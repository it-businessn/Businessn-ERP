import { FormLabel, Input } from "@chakra-ui/react";
import FormControlMain from ".";

const InputFormControl = ({
	valueText,
	label,
	handleChange,
	required,
	name,
}) => {
	return (
		<FormControlMain>
			<FormLabel>{label}</FormLabel>
			<Input
				type="text"
				name={name}
				value={valueText}
				onChange={handleChange}
				required={required}
			/>
		</FormControlMain>
	);
};

export default InputFormControl;
