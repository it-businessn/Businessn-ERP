import {
  Button,
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { ImProfile } from "react-icons/im";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const ActionSidebar = ({ sideMenu }) => {
  const [active, setActive] = useState(false);
  return (
    <Flex
      flex="1"
      bg="#f1f5f8"
      boxShadow="md"
      maxW={{
        base: "full",
        sm: "xs",
      }}
      minH="100vh"
      px={{
        base: "4",
        sm: "6",
      }}
    >
      <Stack justify="space-around" alignItems="start" minW="17vw">
        {sideMenu &&
          sideMenu.children?.length &&
          sideMenu.children?.map((action, index) => (
            <NavLink
              to={action.path}
              // className="super-nav"
              onClick={() => setActive(true)}
            >
              <VStack key={action} alignItems="start">
                <IconButton
                  // onClick={applyFilter}
                  icon={<ImProfile fontSize="3rem" />}
                  variant="ghost"
                  fontWeight="light"
                  ml="3em"
                  color="#a1a3a1"
                />
                <HStack spacing="3" alignItems="center">
                  <Button
                    size="xs"
                    borderRadius="50%"
                    bg="#a1a3a1"
                    // bg={active ? "#4293e4" : "#abb4c2"}
                  >
                    {index + 1}
                  </Button>
                  <Text
                    fontSize="sm"
                    color="#a1a3a1"
                    // color={active ? "#4293e4" : "#abb4c2"}
                    textTransform="uppercase"
                  >
                    {action.name}
                  </Text>
                </HStack>
              </VStack>
            </NavLink>
          ))}
      </Stack>
    </Flex>
  );
};

export default ActionSidebar;
