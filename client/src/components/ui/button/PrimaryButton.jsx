import { Button } from "@chakra-ui/react";

const PrimaryButton = ({
	name,
	onOpen,
	isLoading,
	px,
	loadingText,
	isDisabled = false,
	size,
	minW,
	flex,
	rightIcon,
	bg = "var(--primary_button_bg)",
	color = "var(--primary_bg)",
	hover = {
		color: "var(--main_color_black)",
		bg: "transparent",
		border: "1px solid var(--primary_button_bg)",
	},
	cursor,
	w,
	ml,
	mt,
	my,
	textTransform,
	fontWeight,
	fontSize,
	whiteSpace,
}) => {
	return (
		<Button
			fontSize={fontSize}
			textTransform={textTransform}
			flex={flex}
			minW={minW}
			isDisabled={isDisabled}
			isLoading={isLoading}
			onClick={onOpen}
			bg={bg}
			px={{ base: px ? px : "2em" }}
			color={color}
			_hover={hover}
			ml={ml}
			mt={mt}
			my={my}
			size={size}
			type="submit"
			borderRadius={"10px"}
			loadingText={loadingText}
			rightIcon={rightIcon}
			cursor={cursor}
			w={w}
			fontWeight={fontWeight}
			whiteSpace={whiteSpace}
		>
			{name}
		</Button>
	);
};

export default PrimaryButton;
