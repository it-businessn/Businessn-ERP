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
	textDecoration,
	onClick,
	borderRadius,
	mr,
	cursor,
	textTransform,
	maxW,
	h,
	borderTop,
}) => (
	<Text
		borderTop={borderTop}
		textTransform={textTransform}
		cursor={cursor}
		mr={mr}
		onClick={onClick}
		borderRadius={borderRadius}
		bg={bg}
		flex={flex}
		p={p}
		fontWeight={weight}
		mt={mt}
		mb={mb}
		fontSize={size}
		fontStyle={em}
		color={color}
		width={{ base: "100%", xl: width }}
		h={h}
		align={align}
		textOverflow={"ellipsis"}
		whiteSpace={whiteSpace}
		overflow={"hidden"}
		visibility={visibility}
		border={border}
		borderLeftWidth={borderLeftWidth}
		textDecoration={textDecoration}
		maxW={maxW}
	>
		{title}
	</Text>
);

export default TextTitle;
