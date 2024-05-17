import { Button } from "@chakra-ui/react";

const LeftIconButton = ({
	handleClick,
	icon,
	name,
	flex,
	colorScheme,
	color = "brand.100",
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
			_hover={_hover || { bg: "transparent", color: "brand.600" }}
			leftIcon={icon}
			borderRadius={borderRadius}
		>
			{name}
		</Button>
	);
};

export default LeftIconButton;
