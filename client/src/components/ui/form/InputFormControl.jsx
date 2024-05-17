import { FormHelperText, FormLabel, Input } from "@chakra-ui/react";
import FormControlMain from ".";

const InputFormControl = ({
	valueText,
	label,
	handleChange,
	required,
	name,
	placeholder,
	type = "text",
	isInvalid,
	error,
}) => {
	return (
		<FormControlMain isInvalid={isInvalid}>
			<FormLabel htmlFor={name}>{label}</FormLabel>
			<Input
				type={type}
				name={name}
				value={valueText}
				onChange={handleChange}
				required={required}
				placeholder={placeholder}
			/>
			{error && <FormHelperText color="red.500">{error}</FormHelperText>}
		</FormControlMain>
	);
};

export default InputFormControl;
