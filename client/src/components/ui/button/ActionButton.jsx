import { Button } from "@chakra-ui/react";

const ActionButton = ({ name, isLoading, onClick, px, mt, isDisabled = false, size, leftIcon }) => {
	return (
		<Button
			size={size}
			isDisabled={isDisabled}
			isLoading={isLoading}
			onClick={onClick}
			bg={"var(--nav_menu)"}
			mt={mt}
			px={{ base: px ? px : "2em" }}
			color={"var(--primary_bg)"}
			_hover={{
				color: "var(--primary_button_bg)",
				bg: "var(--lead_cards_bg)",
				border: "1px solid var(--primary_button_bg)",
			}}
			type="submit"
			borderRadius={"10px"}
			leftIcon={leftIcon}
		>
			{name}
		</Button>
	);
};

export default ActionButton;
