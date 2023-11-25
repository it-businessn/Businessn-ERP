import {
    Box,
    Drawer,
    DrawerContent,
    DrawerOverlay,
    Flex,
    useDisclosure,
} from "@chakra-ui/react";
import { ToggleButton } from "components";
import { Sidebar } from "layouts";

const Navbar = ({ user }) => {
    const { isOpen, onToggle, onClose } = useDisclosure();
    return (
        <Box
            width="full"
            py="4"
            px={{
                base: "4",
                md: "8",
            }}
            bg="bg-surface"
            boxShadow="sm"
        >
            <Flex justify="space-between">
                {/* <Logo /> */}
                <ToggleButton
                    isOpen={isOpen}
                    aria-label="Open Menu"
                    onClick={onToggle}
                />
                <Drawer
                    isOpen={isOpen}
                    placement="left"
                    onClose={onClose}
                    isFullHeight
                    preserveScrollBarGap
                    // Only disabled for showcase
                    trapFocus={false}
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <Sidebar user={user} />
                    </DrawerContent>
                </Drawer>
            </Flex>
        </Box>
    );
};
export default Navbar;
