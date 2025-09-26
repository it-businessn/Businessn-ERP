import { Button } from "@chakra-ui/react";

const OutlineButton = ({
	label,
	size = "sm",
	onClick,
	colorScheme,
	ml,
	mr,
	name,
	color = "var(--primary_button_bg)",
	borderColor,
	minW,
	bg,
	w,
	isDisabled,
	h,
	minH,
}) => (
	<Button
		isDisabled={isDisabled}
		bg={bg}
		minW={minW}
		variant={"outline"}
		onClick={onClick}
		size={size}
		px={"1em"}
		h={h}
		type="submit"
		color={!colorScheme && color}
		colorScheme={colorScheme}
		ml={ml}
		mr={mr}
		minH={minH}
		name={name}
		w={w}
		borderColor={borderColor}
	>
		{label}
	</Button>
);

export default OutlineButton;
