import { Text } from "@chakra-ui/react";

const CardTitle = ({ title }) => {
	return (
		<Text mt={2} mb={2} fontWeight="bold">
			{title}
		</Text>
	);
};

export default CardTitle;
