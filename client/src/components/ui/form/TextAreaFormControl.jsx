import { FormLabel, Textarea } from "@chakra-ui/react";
import FormControlMain from ".";

const TextAreaFormControl = ({
	valueText,
	label,
	handleChange,
	required,
	name,
	rows,
}) => {
	return (
		<FormControlMain>
			<FormLabel>{label}</FormLabel>
			<Textarea
				name={name}
				value={valueText}
				onChange={handleChange}
				required={required}
				rows={rows}
			/>
		</FormControlMain>
	);
};

export default TextAreaFormControl;
