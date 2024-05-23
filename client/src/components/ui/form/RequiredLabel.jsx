import { FormLabel, Text } from "@chakra-ui/react";

const RequiredLabel = ({ label, required, name }) => {
	return (
		<FormLabel htmlFor={name}>
			{label}
			{required && (
				<Text as={"span"} color="red">
					{" "}
					*
				</Text>
			)}
		</FormLabel>
	);
};

export default RequiredLabel;
