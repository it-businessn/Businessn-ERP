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
	whiteSpace = "nowrap",
	em,
}) => (
	<Text
		flex={flex}
		p={p}
		fontWeight={weight}
		mt={mt}
		mb={mb}
		fontSize={size}
		fontStyle={em}
		color={color}
		width={width}
		align={align}
		textOverflow={"ellipsis"}
		whiteSpace={whiteSpace}
		overflow={"hidden"}
		w={"100%"}
	>
		{title}
	</Text>
);

export default TextTitle;
