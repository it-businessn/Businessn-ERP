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
}) => (
	<TextTitle
		weight="normal"
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
