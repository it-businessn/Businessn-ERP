import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";

const RightIconButton = ({
	icon = <ArrowForwardIcon />,
	handleIconClick,
	cursor,
	color = "purple.500",
}) => {
	return (
		<Box
			cursor={cursor}
			color={color}
			d="flex"
			p={"0.4em"}
			size={"xxs"}
			_hover={{ bg: "transparent" }}
			onClick={handleIconClick}
		>
			{icon}
		</Box>
	);
};

export default RightIconButton;
