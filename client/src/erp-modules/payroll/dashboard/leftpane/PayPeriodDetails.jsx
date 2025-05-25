import { Grid, Flex, Box, HStack, Icon, Text, Center } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import { leaveApprovalPath, payrollEmployeePath, timesheetPath } from "routes";
import { FiUsers, FiClock, FiCalendar, FiAlertCircle, FiChevronRight } from "react-icons/fi";

const PayPeriodDetails = ({ employees, activeUsers, handleClick }) => {
  const items = [
    {
      title: "Total Active Workforce",
      description: employees,
      linkTo: {
        title: "Employees",
        path: payrollEmployeePath,
      },
      icon: FiUsers,
      color: "#000",
    },
    {
      title: "Currently Active",
      description: activeUsers,
      linkTo: {
        title: "Timesheets",
        path: timesheetPath,
      },
      icon: FiClock,
      color: "#000",
    },
    {
      title: "Currently On Leave",
      description: "NA",
      linkTo: {
        title: "Leave Approvals",
        path: leaveApprovalPath,
      },
      icon: FiCalendar,
      color: "#000",
    },
    {
      title: "Leave Requests Pending",
      description: "NA",
      linkTo: {
        title: "Leave Approvals",
        path: leaveApprovalPath,
      },
      icon: FiAlertCircle,
      color: "#000",
    },
  ];

  return (
    <BoxCard p={{ base: "0 1rem 1rem", md: "0 1.25rem 1.25rem" }} overflowY="hidden" bg={"white"}>
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 4, md: 5 }}>
        {items?.map((item) => (
          <Box
            key={item.title}
            p={4}
            borderRadius="md"
            borderBottom="1px solid"
            borderColor="#000"
            position="relative"
            pb={10}
            boxShadow="0px 4px 6px rgba(0, 0, 0, 0.05)"
            transition="all 0.2s ease"
            _hover={{
              bg: "#000",
              boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.08)",
              transform: "translateY(-2px)",
              transition: "all 0.2s ease",
            }}
          >
            <Flex mb={4} align="center">
              <Icon as={item.icon} boxSize={5} color={item.color} mr={2} />
              <Text fontSize="sm" color="#000" fontWeight="medium">
                {item.title}
              </Text>
            </Flex>

            <Flex align="center" justify="center" mb={3}>
              <Center
                w={{ base: "45px", md: "50px" }}
                h={{ base: "45px", md: "50px" }}
                borderRadius="full"
                bg={item.color}
                color="white"
                border="1px solid"
                borderColor={item.color}
              >
                <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium">
                  {item.description}
                </Text>
              </Center>
            </Flex>

            <HStack
              spacing={1}
              onClick={() => handleClick(item?.linkTo?.path)}
              cursor="pointer"
              color="#000"
              fontWeight="medium"
              fontSize="sm"
              _hover={{ color: "#000" }}
              display="inline-flex"
              position="absolute"
              bottom={3}
              right={4}
            >
              <Text>{item.linkTo.title}</Text>
              <Icon as={FiChevronRight} boxSize={4} />
            </HStack>
          </Box>
        ))}
      </Grid>
    </BoxCard>
  );
};

export default PayPeriodDetails;
