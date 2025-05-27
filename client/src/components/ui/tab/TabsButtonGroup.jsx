import { Box, Button, ButtonGroup, Icon } from "@chakra-ui/react";

const TabsButtonGroup = ({ isOutlineTab, tabs, setViewMode, viewMode, mt, w, mb = 4 }) => {
	const getColor = (type) =>
		viewMode === type
			? isOutlineTab
				? "var(--primary_button_bg)"
				: "var(--main_color)"
			: "var(--nav_color)";
	const getBgColor = (type, highlightColor = null) =>
		viewMode === type
			? isOutlineTab
				? "var(--main_color)"
				: highlightColor || "var(--primary_button_bg)"
			: "var(--main_color)";
	const border = (type) =>
		isOutlineTab && viewMode === type && "2px solid var(--primary_button_bg)";

	return (
		<Box mb={mb} mt={mt} bg={"var(--main_color)"} borderRadius={"1em"} px="5px" w={w}>
			<ButtonGroup variant="solid" p={0} m={0}>
				{tabs?.map(({ type, icon, highlightColor }) => (
					<Button
						key={type}
						size={"sm"}
						onClick={() => setViewMode(type)}
						color={getColor(type)}
						bg={getBgColor(type, highlightColor)}
						borderBottom={border(type)}
						borderRadius={!isOutlineTab && "1em"}
						variant={isOutlineTab ? "ghost" : "solid"}
						fontWeight={isOutlineTab || viewMode === type ? "bold" : "normal"}
						_hover={{ bg: getBgColor(type, highlightColor), color: "var(--main_color_black)" }}
					>
						{icon ? <Icon as={icon} boxSize="5" /> : type}
					</Button>
				))}
			</ButtonGroup>
		</Box>
	);
};

export default TabsButtonGroup;
