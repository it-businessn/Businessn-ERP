import { FormLabel, Input } from "@chakra-ui/react";
import FormControlMain from ".";

const InputFormControl = ({
	valueText,
	label,
	handleChange,
	required,
	name,
	placeholder,
	type = "text",
}) => {
	return (
		<FormControlMain>
			<FormLabel>{label}</FormLabel>
			<Input
				type={type}
				name={name}
				value={valueText}
				onChange={handleChange}
				required={required}
				placeholder={placeholder}
			/>
		</FormControlMain>
	);
};

export default InputFormControl;
