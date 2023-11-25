import {
  Box,
  Flex,
  IconButton,
  Spacer,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { NavButton, UserProfile } from "components";
import Logo from "components/logo";
import { getTopNavMenu } from "config/constant";
import { Sidebar } from "layouts";
import { useState } from "react";
import { FaSyncAlt } from "react-icons/fa";

const DashboardLayout = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState("");
  const handleClick = (menu) => setActiveMenu(menu);

  return (
    <>
      <Box flex={1} pl={3} pt={3} pr={3} bg="#000">
        <Flex justify="start" align="flex-end">
          <VStack align="start" m={0}>
            <Logo />
            <Text fontWeight="bold" color="brand.100">
              Fractional Departments{" "}
              <IconButton
                size="sm"
                icon={<FaSyncAlt />}
                // onClick={onClick}
                aria-label="Refresh"
                variant="round"
              />
            </Text>
          </VStack>

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
