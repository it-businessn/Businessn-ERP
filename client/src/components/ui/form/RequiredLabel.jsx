import { FormLabel, Text } from "@chakra-ui/react";

const RequiredLabel = ({
	label,
	required,
	name,
	fontWeight,
	visibility,
	hideLabel,
}) => {
	return (
		<FormLabel
			fontWeight={fontWeight}
			display={hideLabel && "none"}
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
