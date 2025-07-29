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
	name = "type",
}) => {
	return (
		<FormControlMain isRequired={isRequired}>
			<FormLabel>{label}</FormLabel>
			<RadioGroup defaultValue={defaultVal} onChange={handleChange} name={name} size={size}>
				<Stack direction={direction}>
					{options.map(({ name, value, id }) => (
						<Radio key={name} value={value || id}>
							{name}
						</Radio>
					))}
				</Stack>
			</RadioGroup>
		</FormControlMain>
	);
};

export default RadioFormControl;
