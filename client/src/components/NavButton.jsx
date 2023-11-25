import { Button, HStack, Icon, Text } from "@chakra-ui/react";

const NavButton = (props) => {
  const { icon, label, textTransform, handleClick, ...buttonProps } = props;
  return (
    <Button
      variant={buttonProps.variant ? buttonProps.variant : "ghost"}
      justifyContent="start"
      {...buttonProps}
    >
      <HStack spacing="3">
        {icon && <Icon as={icon} boxSize="6" color="subtle" />}
        <Text
          onClick={() => handleClick(buttonProps.menu)}
          color={buttonProps.color}
          textTransform={textTransform ? textTransform : "capitalize"}
        >
          {label}
        </Text>
      </HStack>
    </Button>
  );
};
export default NavButton;
