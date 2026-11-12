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
	// UI-02: the app's primary button (screens may still pass their own colours)
	bg = "var(--banner_bg)",
	color = "var(--main_color)",
	hover = { bg: "var(--primary_btn_hover)" },
	cursor,
	w,
	ml,
	mt,
	my,
	textTransform,
	fontWeight,
	fontSize,
	whiteSpace,
	borderRadius = "var(--radius)",
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
			borderRadius={borderRadius}
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
