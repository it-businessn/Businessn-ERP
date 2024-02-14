import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerOverlay, Flex, useDisclosure } from "@chakra-ui/react";
import { TOP_NAV_MENU_LIST } from "constant";
import Navbar from "features/home/Navbar";
import Sidebar from "features/sidebar";
import MobileSidebar from "features/sidebar/MobileSidebar";
import { useEffect, useState } from "react";
import { isMobileView } from "services/device";

const DashboardLayout = ({ children, user, handleLogout }) => {
  const [activeMenu, setActiveMenu] = useState(TOP_NAV_MENU_LIST[0]);
  const handleClick = (menu) => setActiveMenu(menu);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isMobile, setIsMobileView] = useState(isMobileView());

  const handleResize = () => {
    setIsMobileView(isMobileView());
  };

  useEffect(() => {
    if (isOpen) {
      window.removeEventListener("resize", handleResize);
    } else {
      window.addEventListener("resize", handleResize);
    } return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  const handleMenuItemClick = () => onClose();

  return (
    <>
      <Navbar
        user={user}
        handleClick={handleClick}
        handleLogout={handleLogout}
        onOpen={onOpen}
        isMobile={isMobile}
      />
      <Flex
        minH={"100vh"}
        as="section"
      >
        {!isMobile &&
          <Sidebar
            activeMenu={activeMenu ? activeMenu : { name: "CRM Dashboard" }}
          />
        }
        {children}
      </Flex>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} maxW="300px">
        <DrawerOverlay>
          <DrawerContent bg="linear-gradient(0deg, rgb(228 235 255) 0%, rgb(240 245 255) 100%)"
            maxHeight={"100vh"}
            overflowY="auto">
            <DrawerCloseButton />
            <DrawerBody>
              <MobileSidebar
                activeMenu={activeMenu ? activeMenu : { name: "CRM Dashboard" }}
                handleMenuItemClick={handleMenuItemClick}
              />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default DashboardLayout;
