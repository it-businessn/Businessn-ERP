import { FormLabel, Text } from "@chakra-ui/react";

const RequiredLabel = ({
	label,
	required,
	name,
	fontWeight,
	visibility,
	hideLabel,
	subRequired,
}) => {
	const SpanText = ({ color }) => (
		<Text as={"span"} color={color}>
			{" "}
			*
		</Text>
	);
	return (
		<FormLabel
			fontWeight={fontWeight}
			display={hideLabel && "none"}
			// htmlFor={name}
			visibility={visibility}
		>
			{label}
			{required && <SpanText color={"red"} />}
			{subRequired && <SpanText color={"orange"} />}
		</FormLabel>
	);
};

export default RequiredLabel;
