import { Text } from "@chakra-ui/react";

const TextTitle = ({
	title,
	mb,
	size,
	weight = "bold",
	color,
	width,
	align,
}) => (
	<Text
		fontWeight={weight}
		mb={mb}
		fontSize={size}
		color={color}
		width={width}
		align={align}
	>
		{title}
	</Text>
);

export default TextTitle;
