import { Stack, Switch, Text } from "@chakra-ui/react";

const SwitchMenu = ({ action, handleSwitch }) => {
    const { name, description, isActive } = action;
    return (
        <Stack justify="space-between" direction="row">
            <Stack sx={{ marginTop: "1em" }} fontSize="sm">
                <Text color="emphasized" fontWeight="medium">
                    {name}
                </Text>
                <Text color="muted">{description}</Text>
            </Stack>
            <Switch
                defaultChecked={isActive}
                onChange={(e) => handleSwitch(action, e.target.checked)}
            />
        </Stack>
    );
};

export default SwitchMenu;
