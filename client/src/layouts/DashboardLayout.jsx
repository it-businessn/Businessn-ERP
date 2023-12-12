import { Flex } from "@chakra-ui/react";
import { TOP_NAV_MENU_LIST } from "constant";
import Navbar from "features/home/Navbar";
import Sidebar from "features/sidebar";
import { useState } from "react";

const DashboardLayout = ({ children, user, handleLogout }) => {
  const [activeMenu, setActiveMenu] = useState(TOP_NAV_MENU_LIST[0]);
  const handleClick = (menu) => setActiveMenu(menu);

  return (
    <>
      <Navbar
        user={user}
        handleClick={handleClick}
        handleLogout={handleLogout}
      />
      <Flex
        as="section"
        direction={{
          base: "column",
          lg: "row",
        }}
        bg="bg.canvas"
        overflow="hidden"
      >
        <Sidebar activeMenu={activeMenu ? activeMenu : { name: "Sales" }} />
        {children}
      </Flex>
    </>
  );
};

export default DashboardLayout;
