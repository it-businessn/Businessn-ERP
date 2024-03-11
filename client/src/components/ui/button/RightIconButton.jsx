import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";

const RightIconButton = () => {
	return (
		<Box
			color="purple.500"
			d="flex"
			p={"0.4em"}
			size={"xxs"}
			_hover={{ bg: "transparent" }}
		>
			<ArrowForwardIcon />
		</Box>
	);
};

export default RightIconButton;
