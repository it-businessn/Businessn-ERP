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
	rightIcon,
	bg = "var(--primary_button_bg)",
	color = "var(--primary_bg)",
}) => {
	return (
		<Button
			mt={mt}
			flex={flex}
			minW={minW}
			isDisabled={isDisabled}
			isLoading={isLoading}
			onClick={onOpen}
			bg={bg}
			px={{ base: px ? px : "2em" }}
			color={color}
			_hover={{
				color: "var(--main_color_black)",
				bg: "transparent",
				border: "1px solid var(--primary_button_bg)",
			}}
			ml={ml}
			size={size}
			type="submit"
			borderRadius={"10px"}
			loadingText={loadingText}
			rightIcon={rightIcon}
		>
			{name}
		</Button>
	);
};

export default PrimaryButton;
