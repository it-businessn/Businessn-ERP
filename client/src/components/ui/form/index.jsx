import { FormControl } from "@chakra-ui/react";

const FormControlMain = ({ children, isRequired }) => {
	return <FormControl isRequired={isRequired}>{children}</FormControl>;
};

export default FormControlMain;
