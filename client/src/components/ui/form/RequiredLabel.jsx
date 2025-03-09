import { FormLabel } from "@chakra-ui/react";
import MandatoryField from "./MandatoryField";

const RequiredLabel = ({
	label,
	required,
	name,
	fontWeight,
	visibility,
	hideLabel,
	subRequired,
	fontSize,
}) => {
	return (
		<FormLabel
			fontWeight={fontWeight}
			display={hideLabel && "none"}
			htmlFor={name}
			visibility={visibility}
			fontSize={fontSize}
		>
			{label}
			{required && <MandatoryField color={"red"} />}
			{subRequired && <MandatoryField color={"orange"} />}
		</FormLabel>
	);
};

export default RequiredLabel;
