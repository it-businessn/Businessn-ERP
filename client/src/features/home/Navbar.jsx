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

const Navbar = ({ handleClick, user }) => {
  return (
    <Box
      pl={3}
      pt={3}
      pr={3}
      bg="#000"
      position="fixed"
      width="100%"
      zIndex={1}
    >
      <Flex justify="start" align="flex-end">
        <VStack align="start" m={0}>
          <Logo />
          <Text fontWeight="bold" color="brand.100">
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
          <Stack ml="2em" color="#fff" key={menu.id}>
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
        <UserProfile user={user} />
      </Flex>
    </Box>
  );
};
export default Navbar;
