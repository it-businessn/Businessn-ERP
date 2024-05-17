import { FormControl } from "@chakra-ui/react";

const FormControlMain = ({ children, isRequired, isInvalid }) => {
	return (
		<FormControl isRequired={isRequired} isInvalid={isInvalid}>
			{children}
		</FormControl>
	);
};

export default FormControlMain;
