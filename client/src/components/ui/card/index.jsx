import { Box } from "@chakra-ui/react";

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
}) => (
	<Box
		minW={minW}
		flexWrap={flexWrap}
		boxShadow={boxShadow}
		bg={bg}
		border={`${borderWidth} solid var(--main_color)`}
		borderRadius={borderRadius}
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
		minH={minH}
		w={width}
	>
		{children}
	</Box>
);

export default BoxCard;
