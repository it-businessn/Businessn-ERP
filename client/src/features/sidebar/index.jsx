import { Flex, Stack } from "@chakra-ui/react";
import MenuItem from "./MenuItem";
import "./Sidebar.css";

const Sidebar = ({ activeMenu }) => {
  return (
    <Flex
      boxShadow="md"
      maxW={"15vw"}
      p={2}
      minW="15vw"
      mt="6.7em"
      color="brand.nav_color"
      maxHeight={`calc(100vh - 6.7em)`}
      overflowY="auto"
    >
      <Stack justify="start" width="full" my={0}>
        {/* <Heading fontSize="xl" mr={"auto"}>
          {activeMenu?.name === "Sales" && "CRM DASHBOARD"}
        </Heading> */}
        {activeMenu?.children?.length &&
          activeMenu?.children?.map((menu) => (
            <MenuItem key={crypto.randomUUID()} menu={menu} />
          ))}
      </Stack>
    </Flex>
  );
};

export default Sidebar;
