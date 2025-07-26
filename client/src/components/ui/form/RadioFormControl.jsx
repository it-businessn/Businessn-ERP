import { FormLabel, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import FormControlMain from ".";

const RadioFormControl = ({
	label,
	handleChange,
	options,
	isRequired,
	defaultVal = "virtual",
	size,
	direction = "row",
}) => {
	return (
		<FormControlMain isRequired={isRequired}>
			<FormLabel>{label}</FormLabel>
			<RadioGroup defaultValue={defaultVal} onChange={handleChange} name="type" size={size}>
				<Stack direction={direction}>
					{options.map(({ name, value }) => (
						<Radio key={value} value={value}>
							{name}
						</Radio>
					))}
				</Stack>
			</RadioGroup>
		</FormControlMain>
	);
};

export default RadioFormControl;
