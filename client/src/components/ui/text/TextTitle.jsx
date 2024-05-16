import { Text } from "@chakra-ui/react";

const TextTitle = ({ title, mb, size }) => (
	<Text fontWeight="bold" mb={mb} fontSize={size}>
		{title}
	</Text>
);

export default TextTitle;
