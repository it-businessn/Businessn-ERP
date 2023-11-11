import { Button, HStack, Icon, Text } from "@chakra-ui/react";

const NavButton = (props) => {
    const { icon, label, ...buttonProps } = props;
    return (
        <Button variant="ghost" justifyContent="start" {...buttonProps}>
            <HStack spacing="3">
                <Icon as={icon} boxSize="6" color="subtle" />
                <Text>{label}</Text>
            </HStack>
        </Button>
    );
};
export default NavButton;
