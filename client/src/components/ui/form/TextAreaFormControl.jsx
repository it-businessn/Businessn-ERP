import { Textarea } from "@chakra-ui/react";
import FormControlMain from ".";
import RequiredLabel from "./RequiredLabel";

const TextAreaFormControl = ({
	valueText,
	label,
	handleChange,
	required,
	name,
	rows,
	maxLength,
}) => {
	return (
		<FormControlMain>
			<RequiredLabel label={label} required={required} htmlFor={name} />
			<Textarea
				maxLength={maxLength}
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
