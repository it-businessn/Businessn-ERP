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
	display,
	fontWeight,
	visibility,
	handleConfirm,
}) => {
	return (
		<FormControlMain isInvalid={isInvalid}>
			<RequiredLabel
				name={name}
				label={label}
				required={required}
				// htmlFor={name}
				fontWeight={fontWeight}
				visibility={visibility}
			/>
			<Input
				onFocus={handleConfirm}
				display={display}
				type={type}
				name={name}
				value={valueText}
				onChange={handleChange}
				required={required}
				placeholder={placeholder}
				visibility={visibility}
				border={"none"}
			/>
			{error && <FormHelperText color="red.500">{error}</FormHelperText>}
		</FormControlMain>
	);
};

export default InputFormControl;
