import { Button } from "@chakra-ui/react";
import { generateLighterShade } from "utils";

const RadioButtonGroup = ({ data, selectedFilter, handleFilterClick }) => {
	return (
		<>
			{data.map((name) => (
				<Button
					key={name}
					borderRadius={selectedFilter === name ? "50px" : 0}
					border={selectedFilter === name ? "1px" : "none"}
					p={"1em"}
					color={
						selectedFilter === name
							? "var(--primary_button_bg)"
							: "var(--tab_radio)"
					}
					bgColor={
						selectedFilter === name && generateLighterShade("#537eee", 0.8)
					}
					onClick={() => handleFilterClick(name)}
					variant={"outline"}
					size="xs"
				>
					{name}
				</Button>
			))}
		</>
	);
};

export default RadioButtonGroup;
