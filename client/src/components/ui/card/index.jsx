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
}) => (
	<Box
		bg={"var(--primary_bg)"}
		border={`${borderWidth} solid var(--main_color)`}
		borderRadius="10px"
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
		px={px}
	>
		{children}
	</Box>
);

export default BoxCard;
