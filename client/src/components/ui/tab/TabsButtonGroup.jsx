import { Button, ButtonGroup } from "@chakra-ui/react";

const TabsButtonGroup = ({ isOutlineTab, tabs, setViewMode, viewMode }) => {
	const getColor = (type) =>
		viewMode === type
			? isOutlineTab
				? "var(--primary_button_bg)"
				: "brand.100"
			: "brand.nav_color";
	const getBgColor = (type) =>
		viewMode === type
			? isOutlineTab
				? "var(--main_color)"
				: "var(--primary_button_bg)"
			: "var(--main_color)";
	const border = (type) =>
		isOutlineTab && viewMode === type && "2px solid var(--primary_button_bg)";

	return (
		<ButtonGroup variant="solid" p={0} m={0}>
			{tabs?.map(({ type }) => (
				<Button
					key={type}
					size={"sm"}
					onClick={() => setViewMode(type)}
					color={() => getColor(type)}
					bg={() => getBgColor(type)}
					borderBottom={() => border(type)}
					borderRadius={!isOutlineTab && "1em"}
					variant={isOutlineTab ? "ghost" : "solid"}
					fontWeight={isOutlineTab || viewMode === type ? "bold" : "normal"}
					_hover={{ bg: "transparent", color: "brand.600" }}
				>
					{type}
				</Button>
			))}
		</ButtonGroup>
	);
};

export default TabsButtonGroup;
