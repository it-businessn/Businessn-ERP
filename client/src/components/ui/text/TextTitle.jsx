import { Text } from "@chakra-ui/react";

const TextTitle = ({ title, mb, size, weight = "bold" }) => (
	<Text fontWeight={weight} mb={mb} fontSize={size}>
		{title}
	</Text>
);

export default TextTitle;
