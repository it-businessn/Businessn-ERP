import { Button } from "@chakra-ui/react";

const OutlineButton = ({ label, size = "sm" }) => (
	<Button
		variant={"outline"}
		// onClick={onOpen}
		size={size}
		px={"1em"}
		type="submit"
		color={"var(--primary_button_bg)"}
	>
		{label}
	</Button>
);

export default OutlineButton;
