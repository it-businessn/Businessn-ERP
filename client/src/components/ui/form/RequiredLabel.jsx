import { FormLabel, Text } from "@chakra-ui/react";

const RequiredLabel = ({ label, required, name, fontWeight, visibility }) => {
	return (
		<FormLabel
			fontWeight={fontWeight}
			// htmlFor={name}
			visibility={visibility}
		>
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
