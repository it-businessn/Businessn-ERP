import { Flex, Stack } from "@chakra-ui/react";
import MenuItem from "./MenuItem";
import "./Sidebar.css";

const MobileSidebar = ({ activeMenu, handleMenuItemClick }) => {
    return (
        <Flex
            p={2}
            color="brand.nav_color"
        >
            <Stack justify="start" width="full" my={0}>
                {activeMenu?.children?.length &&
                    activeMenu?.children?.map((menu) => (
                        <MenuItem
                            handleMenuItemClick={handleMenuItemClick}
                            key={crypto.randomUUID()}
                            menu={menu} />
                    ))}
            </Stack>
        </Flex>
    );
};

export default MobileSidebar;
