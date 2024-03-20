import { Button } from "@chakra-ui/react";

const ActionButton = ({
	name,
	isLoading,
	onClick,
	px,
	mt,
	isDisabled = false,
}) => {
	return (
		<Button
			isDisabled={isDisabled}
			isLoading={isLoading}
			onClick={onClick}
			bg={"brand.primary_button_bg"}
			mt={mt}
			px={{ base: px ? px : "2em" }}
			color={"brand.primary_bg"}
			_hover={{
				color: "brand.primary_button_bg",
				bg: "brand.700",
				border: "1px solid var(--primary_button_bg)",
			}}
			type="submit"
			borderRadius={"10px"}
		>
			{name}
		</Button>
	);
};

export default ActionButton;
