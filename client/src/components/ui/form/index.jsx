import { FormControl } from "@chakra-ui/react";

const FormControlMain = ({ children, isRequired, isInvalid, visibility }) => {
	return (
		<FormControl
			isRequired={isRequired}
			isInvalid={isInvalid}
			visibility={visibility}
		>
			{children}
		</FormControl>
	);
};

export default FormControlMain;
