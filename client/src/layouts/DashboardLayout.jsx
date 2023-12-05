import { Flex } from "@chakra-ui/react";
import Navbar from "features/home/Navbar";
import Sidebar from "features/sidebar";
import { useState } from "react";

const DashboardLayout = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState("");
  const handleClick = (menu) => setActiveMenu(menu);

  return (
    <>
      <Navbar handleClick={handleClick} />
      <Flex
        as="section"
        direction={{
          base: "column",
          lg: "row",
        }}
        bg="bg.canvas"
        overflow="hidden"
      >
        <Sidebar activeMenu={activeMenu ? activeMenu : { name: "Insights" }} />
        {children}
      </Flex>
    </>
  );
};

export default DashboardLayout;
