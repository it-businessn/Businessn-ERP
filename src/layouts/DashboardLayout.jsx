import { Flex, useBreakpointValue } from "@chakra-ui/react";
import Sidebar from "../features/sidebar";

const DashboardLayout = ({ children }) => {
  const isDesktop = useBreakpointValue({
    base: false,
    lg: true,
  });
  return (
    <Flex
      as="section"
      direction={{
        base: "column",
        lg: "row",
      }}
      bg="bg.canvas"
    >
      <Sidebar />
      {children}
    </Flex>
  );
};

export default DashboardLayout;
