import TextTitle from "./text/TextTitle";

const NormalTextTitle = ({
	title,
	size = "md",
	visibility,
	whiteSpace,
	align,
	mt,
	color,
	width,
	mb,
	weight = "normal",
	bg,
	textDecoration,
	onClick,
	cursor,
	textTransform,
	p,
	maxW,
	fontStyle,
	flex,
}) => (
	<TextTitle
		em={fontStyle}
		textTransform={textTransform}
		onClick={onClick}
		weight={weight}
		bg={bg}
		flex={flex}
		size={size}
		title={title}
		visibility={visibility}
		whiteSpace={whiteSpace}
		align={align}
		mt={mt}
		mb={mb}
		p={p}
		color={color}
		width={width}
		textDecoration={textDecoration}
		cursor={cursor}
		maxW={maxW}
	/>
);

export default NormalTextTitle;
