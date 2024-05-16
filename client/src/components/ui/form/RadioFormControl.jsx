import { FormLabel, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import FormControlMain from ".";

const RadioFormControl = ({ label, handleChange, options, isRequired }) => {
	return (
		<FormControlMain isRequired={isRequired}>
			<FormLabel>{label}</FormLabel>
			<RadioGroup defaultValue="virtual" onChange={handleChange} name="type">
				<Stack direction="row">
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
