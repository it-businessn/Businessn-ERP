import { Button } from "@chakra-ui/react";

const OutlineButton = ({
	label,
	size = "sm",
	onClick,
	colorScheme,
	ml,
	name,
	color = "var(--primary_button_bg)",
	borderColor,
	minW,
	bg,
}) => (
	<Button
		bg={bg}
		minW={minW}
		variant={"outline"}
		onClick={onClick}
		size={size}
		px={"1em"}
		type="submit"
		color={!colorScheme && color}
		colorScheme={colorScheme}
		ml={ml}
		name={name}
		borderColor={borderColor}
	>
		{label}
	</Button>
);

export default OutlineButton;
