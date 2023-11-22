import { Button, Flex, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuItem from "./MenuItem";
import "./Sidebar.css";

const Sidebar = ({ activeMenu }) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const navigate = useNavigate();

  const [sideMenu, setActiveSideMenu] = useState(activeMenu);
  const handleClick = (action) => setActiveSideMenu(action);

  return (
    <Flex
      minW="13vw"
      minH="100vh"
      flex="1"
      bg="bg.surface"
      boxShadow="md"
      maxW={{
        base: "full",
        sm: "xs",
      }}
      py={{
        base: "3",
        sm: "8",
      }}
      px={2}
    >
      <Stack justify="centre" spacing="1" width="full">
        <Stack justify="start">
          <Button width="full" bg="#000">
            {activeMenu?.name}
          </Button>
          {activeMenu?.children?.length &&
            activeMenu?.children?.map((menu) => (
              <MenuItem
                isOpenMenu={isOpenMenu}
                textTransform="uppercase"
                key={crypto.randomUUID()}
                menu={menu}
              />
            ))}
        </Stack>
      </Stack>
    </Flex>
  );
};

export default Sidebar;
