import { Button, ButtonGroup } from "@chakra-ui/react";

const TabsButtonGroup = ({ tabs, setViewMode, viewMode }) => {
	return (
		<ButtonGroup variant="solid" p={0} m={0}>
			{tabs?.map(({ type }) => (
				<Button
					key={type}
					size={"sm"}
					onClick={() => setViewMode(type)}
					color={viewMode === type ? "brand.100" : "brand.nav_color"}
					bg={
						viewMode === type ? "var(--primary_button_bg)" : "var(--main_color)"
					}
					borderRadius={"1em"}
					variant={"solid"}
					fontWeight={viewMode === type ? "bold" : "normal"}
					_hover={{ bg: "transparent", color: "brand.600" }}
				>
					{type}
				</Button>
			))}
		</ButtonGroup>
	);
};

export default TabsButtonGroup;
