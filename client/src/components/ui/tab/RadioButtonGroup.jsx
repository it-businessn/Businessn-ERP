import { Button } from "@chakra-ui/react";
import { generateLighterShade } from "utils";

const RadioButtonGroup = ({ name, selectedFilter, handleFilterClick, fontSize, rightIcon }) => {
	return (
		<Button
			borderRadius={selectedFilter === name ? "50px" : 0}
			border={selectedFilter === name ? "1px" : "none"}
			p={"1em"}
			color={selectedFilter === name ? "var(--primary_button_bg)" : "var(--tab_radio)"}
			bgColor={selectedFilter === name && generateLighterShade("#537eee", 0.8)}
			onClick={() => handleFilterClick(name)}
			variant={"outline"}
			size="xs"
			fontSize={fontSize}
			rightIcon={rightIcon}
		>
			{name}
		</Button>
	);
};

export default RadioButtonGroup;
