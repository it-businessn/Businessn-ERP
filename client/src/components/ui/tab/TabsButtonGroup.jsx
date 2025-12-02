import { Badge, Box, Button, ButtonGroup, Icon } from "@chakra-ui/react";

const TabsButtonGroup = ({ isOutlineTab, tabs, setViewMode, viewMode, mt, w, mb = 4 }) => {
	const getColor = (type) => (viewMode === type ? "var(--main_color)" : "var(--nav_menu)");
	const getBgColor = (type, highlightColor = null) =>
		viewMode === type
			? isOutlineTab
				? "var(--nav_menu)"
				: highlightColor || "#6b596b"
			: "var(--main_color)";
	const border = (type) => isOutlineTab && viewMode === type && "2px solid var(--banner_bg)";

	return (
		<Box mb={mb} mt={mt} bg={"var(--primary_bg)"} borderRadius={"1em"} px="5px" w={w}>
			<ButtonGroup variant="solid" p={0} m={0}>
				{tabs?.map(({ type, count, icon, highlightColor }) =>
					type === "Tickets" ? (
						<Box key={type} display="flex" alignItems="center" gap="0">
							<Button
								size={"sm"}
								onClick={() => setViewMode(type)}
								color={getColor(type)}
								bg={getBgColor(type, highlightColor)}
								borderBottom={border(type)}
								borderRadius={!isOutlineTab && "1em"}
								variant={isOutlineTab ? "ghost" : "solid"}
								fontWeight={isOutlineTab || viewMode === type ? "bold" : "normal"}
								_hover={{ bg: getBgColor(type, highlightColor) }}
							>
								{icon ? <Icon as={icon} boxSize="5" /> : type}
							</Button>
							<Badge
								pos="relative"
								mt={"-20px"}
								ml={"-8px"}
								colorScheme="red"
								borderRadius="full"
								px="2"
							>
								{count}
							</Badge>
						</Box>
					) : (
						<Button
							key={type}
							size={"sm"}
							onClick={() => setViewMode(type)}
							color={getColor(type)}
							bg={getBgColor(type, highlightColor)}
							borderBottom={border(type)}
							borderRadius={"1em"}
							variant={isOutlineTab ? "ghost" : "solid"}
							fontWeight={isOutlineTab || viewMode === type ? "bold" : "normal"}
							_hover={{ bg: getBgColor(type, highlightColor) }}
						>
							{icon ? <Icon as={icon} boxSize="5" /> : type}
						</Button>
					),
				)}
			</ButtonGroup>
		</Box>
	);
};

export default TabsButtonGroup;
