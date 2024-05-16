import { FormLabel, Textarea } from "@chakra-ui/react";
import FormControlMain from ".";

const TextAreaFormControl = ({
	valueText,
	label,
	handleChange,
	required,
	name,
}) => {
	return (
		<FormControlMain>
			<FormLabel>{label}</FormLabel>
			<Textarea
				name={name}
				value={valueText}
				onChange={handleChange}
				required={required}
			/>
		</FormControlMain>
	);
};

export default TextAreaFormControl;
