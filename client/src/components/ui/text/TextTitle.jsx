import { Text } from "@chakra-ui/react";

const TextTitle = ({
	title,
	mb,
	size,
	weight = "bold",
	color,
	width = "100%",
	align,
	mt,
	p,
	flex,
	whiteSpace = "nowrap",
	em,
	visibility,
	border,
	borderLeftWidth,
	bg,
}) => (
	<Text
		bg={bg}
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
		visibility={visibility}
		border={border}
		borderLeftWidth={borderLeftWidth}
	>
		{title}
	</Text>
);

export default TextTitle;
