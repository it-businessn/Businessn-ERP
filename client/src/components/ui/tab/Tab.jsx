import { Button, HStack, Icon, Text } from "@chakra-ui/react";

const Tab = ({
	icon,
	label,
	textTransform,
	handleClick,
	variant,
	...buttonProps
}) => {
	return (
		<Button
			variant={variant ? variant : "ghost"}
			justifyContent="start"
			onClick={() => handleClick(buttonProps.menu)}
		>
			<HStack spacing="3">
				{icon && <Icon as={icon} boxSize="6" color="subtle" />}
				<Text
					color={buttonProps.color}
					whiteSpace={"pre-wrap"}
					textTransform={textTransform ? textTransform : "capitalize"}
				>
					{label}
				</Text>
			</HStack>
		</Button>
	);
};
export default Tab;
