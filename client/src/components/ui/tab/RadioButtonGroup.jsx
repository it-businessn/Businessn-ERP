import { Button } from "@chakra-ui/react";
import { generateLighterShade } from "utils";

const RadioButtonGroup = ({
	name,
	selectedFilter,
	handleFilterClick,
	fontSize,
	rightIcon,
	w,
	borderRadius = "50px",
	p = "1em",
	h,
	whiteSpace,
}) => {
	return (
		<Button
			whiteSpace={whiteSpace}
			borderRadius={selectedFilter === name ? borderRadius : 0}
			border={selectedFilter === name ? "1px" : "none"}
			p={p}
			color={selectedFilter === name ? "var(--primary_button_bg)" : "var(--tab_radio)"}
			bgColor={selectedFilter === name && generateLighterShade("#537eee", 0.8)}
			onClick={() => handleFilterClick(name)}
			variant={"outline"}
			size="xs"
			fontSize={fontSize}
			rightIcon={rightIcon}
			w={w}
			h={h}
		>
			{name}
		</Button>
	);
};

export default RadioButtonGroup;
