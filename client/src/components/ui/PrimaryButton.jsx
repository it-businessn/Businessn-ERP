import { Button } from "@chakra-ui/react";

const PrimaryButton = ({ name, onOpen, isLoading, px, isDisabled = false }) => {
	return (
		<Button
			isDisabled={isDisabled}
			isLoading={isLoading}
			onClick={onOpen}
			bg={"brand.primary_button_bg"}
			px={{ lg: px ? px : "3em" }}
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

export default PrimaryButton;
