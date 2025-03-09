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
	border,
	hideLabel,
	w,
	size,
	readOnly = false,
	subRequired,
	maxLength,
	fontSize,
}) => {
	return (
		<FormControlMain isInvalid={isInvalid}>
			<RequiredLabel
				fontSize={fontSize}
				subRequired={subRequired}
				hideLabel={hideLabel}
				name={name}
				label={label}
				required={required}
				htmlFor={name}
				fontWeight={fontWeight}
				visibility={visibility}
			/>
			{maxLength && <FormHelperText>Max characters: {maxLength}</FormHelperText>}
			<Input
				maxLength={maxLength}
				onBlur={handleConfirm}
				display={display}
				type={type}
				name={name}
				value={valueText}
				onChange={handleChange}
				required={required}
				placeholder={placeholder}
				visibility={visibility}
				border={border}
				w={w}
				size={size}
				readOnly={readOnly}
			/>
			{error && <FormHelperText color="red.500">{error}</FormHelperText>}
		</FormControlMain>
	);
};

export default InputFormControl;
