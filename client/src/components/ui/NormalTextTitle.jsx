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
}) => (
	<TextTitle
		weight={weight}
		bg={bg}
		size={size}
		title={title}
		visibility={visibility}
		whiteSpace={whiteSpace}
		align={align}
		mt={mt}
		mb={mb}
		color={color}
		width={width}
	/>
);

export default NormalTextTitle;
