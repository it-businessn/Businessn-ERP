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
      minH="84vh"
      minW="15vw"
      mt="7em"
    >
      <Stack justify="start" width="full">
        <Button width="full" bg="#000">
          {activeMenu?.name}
        </Button>
        {activeMenu?.children?.length &&
          activeMenu?.children?.map((menu) => (
            <MenuItem key={crypto.randomUUID()} menu={menu} />
          ))}
      </Stack>
    </Flex>
  );
};

export default Sidebar;
