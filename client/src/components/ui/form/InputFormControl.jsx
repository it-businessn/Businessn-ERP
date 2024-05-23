import { FormHelperText, Input } from "@chakra-ui/react";
import FormControlMain from ".";
import RequiredLabel from "./RequiredLabel";

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
			<RequiredLabel
				name={name}
				label={label}
				required={required}
				htmlFor={name}
			/>
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
