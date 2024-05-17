import { Text } from "@chakra-ui/react";

const TextTitle = ({
	title,
	mb,
	size,
	weight = "bold",
	color,
	width,
	align,
	mt,
	p,
	flex,
}) => (
	<Text
		flex={flex}
		p={p}
		fontWeight={weight}
		mt={mt}
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
