import { Box, Flex, Spacer, Stack } from "@chakra-ui/react";
import { NavButton, UserProfile } from "components";
import Logo from "components/logo";
import { getTopNavMenu } from "config/constant";
import { useState } from "react";
import Sidebar from "../features/sidebar";

const DashboardLayout = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState("");
  const handleClick = (menu) => setActiveMenu(menu);
  return (
    <>
      <Box flex={1} p={4} bg="#000">
        <Flex justify="start" align="center">
          <Logo />
          {getTopNavMenu()?.map((menu, index) => (
            <Stack ml="2em" color="#fff" key={menu.id}>
              <NavButton
                handleClick={handleClick}
                color="primary"
                menu={menu}
                label={menu.name}
              />
            </Stack>
          ))}
          <Spacer />
          <UserProfile />
        </Flex>
      </Box>
      <Flex
        as="section"
        direction={{
          base: "column",
          lg: "row",
        }}
        bg="bg.canvas"
      >
        <Sidebar activeMenu={activeMenu ? activeMenu : { name: "Insights" }} />
        {children}
      </Flex>
    </>
  );
};

export default DashboardLayout;
