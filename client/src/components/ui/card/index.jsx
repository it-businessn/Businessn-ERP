import { Box } from "@chakra-ui/react";
import TextTitle from "../text/TextTitle";

const BoxCard = ({
	children,
	display,
	flexDir,
	fontWeight,
	gap,
	h,
	justifyContent,
	mt,
	overflowY = "auto",
	p = "1em",
	px,
	borderWidth = "3px",
	minH,
	bg = "var(--primary_bg)",
	width,
	boxShadow,
	flexWrap,
	pb,
	borderRadius = "10px",
	minW,
	borderColor = "var(--main_color)",
	css,
	pt,
	flex,
	title,
	borderBottomWidth,
}) => (
	<Box
		flex={flex}
		css={css}
		minW={minW}
		flexWrap={flexWrap}
		boxShadow={boxShadow}
		bg={bg}
		border={`${borderWidth} solid var(--main_color_black)`}
		borderLeft={"none"}
		borderRight={"none"}
		borderBottomWidth={borderBottomWidth}
		borderRadius={0}
		color={"var(--nav_color)"}
		display={display}
		flexDir={flexDir}
		fontWeight={fontWeight}
		gap={gap}
		height={h}
		justifyContent={justifyContent}
		mt={mt}
		overflow={"hidden"}
		overflowY={overflowY}
		p={p}
		pb={pb}
		px={px}
		pt={pt}
		minH={minH}
		w={width}
	>
		{title && (
			<TextTitle
				p="1em"
				mb={3}
				size="lg"
				color="var(--banner_bg)"
				title={title}
				borderBottom={`1.5px solid var(--main_color_black)`}
			/>
		)}
		{children}
	</Box>
);

export default BoxCard;
