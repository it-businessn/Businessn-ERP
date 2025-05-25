import { Flex, Stack, IconButton } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import MenuItem from "../ui/menu/MenuItem";
import MobileSidebar from "./MobileSidebar";
import { useState } from "react";

const Sidebar = ({ activeMenu, handleMenuItemClick, isMobile, isOpen, onClose }) => {
  const menuList = activeMenu?.children?.filter((item) => item.permissions);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return isMobile ? (
    <MobileSidebar
      isOpen={isOpen}
      onClose={onClose}
      activeMenu={activeMenu}
      handleMenuItemClick={handleMenuItemClick}
      menuList={menuList}
    />
  ) : (
    <Flex
      boxShadow="md"
      maxW={isCollapsed ? "4rem" : { md: "24vw", lg: "18vw", xl: "12vw" }}
      p={0}
      minW={isCollapsed ? "4rem" : { md: "24vw", lg: "18vw", xl: "12vw" }}
      mt="6.5em"
      maxHeight={`calc(var(--custom_height))`}
      overflowY="auto"
      position="relative"
      transition="all 0.3s ease"
    >
      <IconButton
        icon={
          isCollapsed ? (
            <MdKeyboardArrowRight color="var(--primary_button_bg)" />
          ) : (
            <MdKeyboardArrowLeft color="var(--primary_button_bg)" />
          )
        }
        onClick={handleToggleCollapse}
        position="absolute"
        right="-12px"
        top="1rem"
        size="sm"
        borderRadius="50%"
        bg="white"
        boxShadow="md"
        zIndex="1"
        _hover={{ bg: "gray.100" }}
      />
      <Stack justify="start" width="full" my={0} spacing={0}>
        {menuList?.map(
          (menu) =>
            menu?.permissions?.canAccessModule && (
              <MenuItem
                key={menu.path}
                menu={menu}
                parent={activeMenu.id}
                isCollapsed={isCollapsed}
              />
            )
        )}
        {!isCollapsed && (
          <TextTitle mt={5} title="Tools" color="var(--primary_button_bg)" p="0 1em" />
        )}
        <MenuItem
          navigatePath={"/tickets"}
          menu={{
            path: "tickets",
            name: "Tickets",
            children: [],
            icon: <IoDocumentTextOutline />,
          }}
          isCollapsed={isCollapsed}
        />
      </Stack>
    </Flex>
  );
};

export default Sidebar;
