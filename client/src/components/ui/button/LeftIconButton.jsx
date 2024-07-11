import { Button } from "@chakra-ui/react";

const LeftIconButton = ({
	handleClick,
	icon,
	name,
	flex,
	colorScheme,
	color = "var(--main_color)",
	border,
	variant = "outline",
	isFilter,
	size = "xs",
	borderRadius,
	w,
	type,
	bg,
	_hover,
}) => {
	return (
		<Button
			type={type}
			w={w}
			size={size}
			border={border}
			onClick={handleClick}
			flex={flex}
			color={!colorScheme && color}
			bg={bg || (!colorScheme && !isFilter && "var(--primary_button_bg)")}
			colorScheme={colorScheme}
			variant={variant}
			fontWeight={!isFilter && "bold"}
			_hover={_hover || { bg: "transparent", color: "var(--main_color_black)" }}
			leftIcon={icon}
			borderRadius={borderRadius}
		>
			{name}
		</Button>
	);
};

export default LeftIconButton;
