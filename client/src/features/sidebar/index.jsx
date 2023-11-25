import { Button, Flex, Stack } from "@chakra-ui/react";
import MenuItem from "./MenuItem";
import "./Sidebar.css";

const Sidebar = ({ activeMenu }) => {
  return (
    <Flex
      bg="bg.surface"
      boxShadow="md"
      maxW={"15vw"}
      p={2}
      minH="85vh"
      minW="15vw"
    >
      <Stack justify="start" width="full">
        <Button width="full" bg="#000">
          {activeMenu?.name}
        </Button>
        {activeMenu?.children?.length &&
          activeMenu?.children?.map((menu) => (
            <MenuItem
              textTransform="uppercase"
              key={crypto.randomUUID()}
              menu={menu}
            />
          ))}
      </Stack>
    </Flex>
  );
};

export default Sidebar;
