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
import { TOP_NAV_MENU_LIST } from "constant";
import { FaSyncAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = ({ handleClick, user, handleLogout }) => {
  return (
    <Box
      pl={3}
      pt={3}
      pr={3}
      position="fixed"
      width="100%"
      color="brand.nav_color"
      zIndex={1}
      bg="linear-gradient(103deg, rgba(244,240,255,1) 0%, rgba(238,239,241,1) 100%)"
    >
      <Flex justify="start" align="flex-end">
        <VStack align="start" m={0}>
          <Logo />
          <Text fontWeight="bold">
            Fractional Departments
            <IconButton
              size="sm"
              icon={<FaSyncAlt />}
              // onClick={onClick}
              aria-label="Refresh"
              variant="round"
            />
          </Text>
        </VStack>

        {TOP_NAV_MENU_LIST.map((menu, index) => (
          <Stack ml="2em" key={menu.id}>
            <Link to={menu?.path}>
              <NavButton
                handleClick={handleClick}
                color="primary"
                menu={menu}
                label={menu.name}
              />
            </Link>
          </Stack>
        ))}
        <Spacer />
        <UserProfile user={user} handleLogout={handleLogout} />
      </Flex>
    </Box>
  );
};
export default Navbar;
