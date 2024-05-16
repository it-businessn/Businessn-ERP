import { Button } from "@chakra-ui/react";

const PrimaryButton = ({
	name,
	onOpen,
	isLoading,
	px,
	loadingText,
	isDisabled = false,
	ml,
	size,
	minW,
	flex,
	mt,
}) => {
	return (
		<Button
			mt={mt}
			flex={flex}
			minW={minW}
			isDisabled={isDisabled}
			isLoading={isLoading}
			onClick={onOpen}
			bg={"brand.primary_button_bg"}
			px={{ base: px ? px : "2em" }}
			color={"brand.primary_bg"}
			_hover={{
				color: "brand.600",
				bg: "transparent",
				border: "1px solid var(--primary_button_bg)",
			}}
			ml={ml}
			size={size}
			type="submit"
			borderRadius={"10px"}
			loadingText={loadingText}
		>
			{name}
		</Button>
	);
};

export default PrimaryButton;
