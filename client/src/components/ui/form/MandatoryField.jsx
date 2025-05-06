import { Text } from "@chakra-ui/react";

const MandatoryField = ({ color }) => (
	<Text as={"span"} color={color}>
		{" "}
		*
	</Text>
);
export default MandatoryField;
