import { Button } from "@chakra-ui/react";

const OutlineButton = ({
	label,
	size = "sm",
	onClick,
	colorScheme,
	ml,
	name,
}) => (
	<Button
		variant={"outline"}
		onClick={onClick}
		size={size}
		px={"1em"}
		type="submit"
		color={!colorScheme && "var(--primary_button_bg)"}
		colorScheme={colorScheme}
		ml={ml}
		name={name}
	>
		{label}
	</Button>
);

export default OutlineButton;
