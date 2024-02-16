import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue
} from "@chakra-ui/react";
import { callsMadeBarData } from "constant";
import Loader from "features/Loader";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import * as api from "services";

const SalesReport = () => {
  const isMobileView = useBreakpointValue({
    base: true,
    md: false,
  });
  const [contacts, setContacts] = useState(null);
  const fetchAllContacts = async () => {
    try {
      const response = await api.getContacts();
      response.data.map((item) => (item.comm = "Meeting"));
      setContacts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const callsBarData = {
    labels: callsMadeBarData.map((item) => item.day),
    datasets: [
      {
        label: "Sales",
        data: callsMadeBarData.map((item) => item.call),
        backgroundColor: "#5580f1",
        borderRadius: 12,
        fill: false,
      },
    ],
  };
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          borderDash: [3, 3],
          drawBorder: false,
        },
        ticks: {
          font: {
            weight: "bold",
            family: "Inter Variable,-apple-system,system-ui,sans-serif",
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            weight: "bold",
            family: "Inter Variable,-apple-system,system-ui,sans-serif",
          },
          autoSkip: false,
        },
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 0,
        bottom: 0,
      },
    },
    legend: {
      display: false,
    },
  };
  useEffect(() => {
    fetchAllContacts();
  }, []);
  return (
    <Container maxW={"100vw"} overflow="hidden"
      mt={5}>
      {isMobileView &&
        <Text fontSize="lg" fontWeight="bold">
          Sales Reports
        </Text>}
      <Flex direction="column" h="100%">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="5" my="5" h={"50%"}>
          <Box
            color={"brand.nav_color"}
            p="4"
            bg={"brand.primary_bg"}
            border="3px solid white"
            borderRadius="10px"
            fontWeight="bold"
          >
            <Flex
              justify="space-between"
              align="center"
              color={"brand.nav_color"}
            >
              <Text fontSize="lg" fontWeight="bold">
                Sales Overview
              </Text>
              <Select width="100px" border={"none"} fontSize={"sm"}>
                <option>Weekly </option>
                <option>Last Month</option>
              </Select>
            </Flex>
            <Bar data={callsBarData} options={options} />
          </Box>
          <Box overflow="auto"
            p="4"
            bg={"brand.primary_bg"}
            border="3px solid white"
            borderRadius="10px"
            fontWeight="bold"
          >
            <Flex
              justify="space-between"
              align="center"
              mb="2"
              color={"brand.nav_color"}
            >
              <Text fontSize="lg" fontWeight="bold">
                Sales Metrics Summary
              </Text>
            </Flex>
            <SimpleGrid columns={2} gap={4} h={"85%"}>
              <Box p={4} border={"2px solid #d3d3d3"} borderRadius={"10px"} justifyContent="space-evenly" display="flex" flexDir="column">
                <Text fontSize="sm" fontWeight="bold" color={"brand.nav_color"}>
                  Total sales
                </Text>
                <Text mr="3" fontSize={{ base: "1.5em", md: "2em" }}>
                  $100,500
                </Text>
              </Box>
              <Box p={4} border={"2px solid #d3d3d3"} borderRadius={"10px"} justifyContent="space-evenly" display="flex" flexDir="column">
                <Text fontSize="sm" fontWeight="bold" color={"brand.nav_color"}>
                  Total leads
                </Text>
                <Text mr="3" fontSize={{ base: "1.5em", md: "2em" }}>
                  455
                </Text>
              </Box>
              <Box p={4} border={"2px solid #d3d3d3"} borderRadius={"10px"} justifyContent="space-evenly" display="flex" flexDir="column">
                <Text fontSize="sm" fontWeight="bold" color={"brand.nav_color"}>
                  Conversion rate
                </Text>
                <Text mr="3" fontSize={{ base: "1.5em", md: "2em" }}>
                  55%
                </Text>
              </Box>
              <Box p={4} border={"2px solid #d3d3d3"} borderRadius={"10px"} justifyContent="space-evenly" display="flex" flexDir="column">
                <Text fontSize="sm" fontWeight="bold" color={"brand.nav_color"}>
                  Top selling product
                </Text>
                <Text mr="3" fontSize={{ base: "1em", md: "2em" }}>
                  Product 1
                </Text>
              </Box>
            </SimpleGrid>
          </Box>
        </SimpleGrid>
        <Box
          p="4"
          mb="5"
          bg={"brand.primary_bg"}
          border="2px solid white"
          borderRadius="10px"
          color={"brand.nav_color"}
        >
          {isMobileView ?
            <Flex flexDir="column">
              <Flex justify="space-between">
                <Text fontSize="lg" fontWeight="bold">
                  Sales Performance
                </Text>
                <Button
                  bg={"#537eee"}
                  color={"brand.primary_bg"}
                  variant={"solid"}
                  _hover={{ color: "brand.600" }}
                  borderRadius={"10px"}
                >
                  Add new sales
                </Button>
              </Flex>
              <HStack spacing="1em" mt="1em">
                <Button
                  color={"brand.nav_color"}
                  leftIcon={<MdOutlineFilterList />}
                  border={"2px solid #d3d3d3"}
                  borderRadius={"10px"}
                  variant={"ghost"}
                  _hover={{ color: "brand.600", bg: "transparent" }}

                >
                  Filter
                </Button>
                <InputGroup
                  borderRadius={"10px"}
                  border={"1px solid #d3d3d3"}
                  fontSize="sm"
                  fontWeight="bold"
                >
                  <InputLeftElement children={<FaSearch />} />
                  <Input
                    _placeholder={{
                      color: "brand.nav_color",
                      fontSize: "sm",
                    }}
                    color={"brand.nav_color"}
                    bg={"brand.primary_bg"}
                    type="text"
                    placeholder="Search here"
                    pr="4.5rem"
                  />
                </InputGroup>
              </HStack>
            </Flex>
            : <Flex>
              <Text fontSize="lg" fontWeight="bold">
                Sales Performance
              </Text>
              <Spacer />
              <HStack w={"50%"} spacing={3} justify={"flex-end"}>
                <Button
                  color={"brand.nav_color"}
                  leftIcon={<MdOutlineFilterList />}
                  border={"2px solid #d3d3d3"}
                  borderRadius={"10px"}
                  variant={"ghost"}
                  _hover={{ color: "brand.600", bg: "transparent" }}
                  ml={2}
                >
                  Filter
                </Button>
                <InputGroup
                  w={"40%"}
                  borderRadius={"10px"}
                  border={"1px solid #d3d3d3"}
                  fontSize="sm"
                  fontWeight="bold"
                >
                  <InputLeftElement children={<FaSearch />} />
                  <Input
                    _placeholder={{
                      color: "brand.nav_color",
                      fontSize: "sm",
                    }}
                    color={"brand.nav_color"}
                    bg={"brand.primary_bg"}
                    type="text"
                    placeholder="Search here"
                    pr="4.5rem"
                  />
                </InputGroup>
                <Button
                  bg={"#537eee"}
                  color={"brand.primary_bg"}
                  variant={"solid"}
                  _hover={{ color: "brand.600" }}
                  borderRadius={"10px"}
                >
                  Add new sales
                </Button>
              </HStack>
            </Flex>}

          {!contacts && <Loader />}
          {contacts && (<Box overflow="auto">
            <Table color={"brand.nav_color"} bg={"brand.primary_bg"}>
              <Thead>
                <Tr>
                  <Th fontWeight={"bolder"} p={0}>
                    Date
                  </Th>
                  <Th fontWeight={"bolder"}>Deals </Th>
                  <Th fontWeight={"bolder"}>Amount</Th>
                  <Th fontWeight={"bolder"}>Top Product</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody color={"brand.nav_color"}>
                {contacts.map((contact, index) => (
                  <Tr key={contact._id}>
                    <Td fontSize={"xs"} p={0}>
                      04/02/2024
                    </Td>
                    <Td fontSize={"xs"}>{contact.companyName}</Td>
                    <Td fontSize={"xs"}>$345</Td>
                    <Td fontSize={"xs"}>Product1</Td>
                    <Td fontSize={"xs"}>
                      <HStack>
                        <Button
                          bgGradient="linear-gradient(103deg, rgba(107,73,201,1) 0%, rgba(180,165,222,1) 43%, rgba(36,249,225,1) 100%);"
                          bgClip="text"
                          size={"xs"}
                          rightIcon={
                            <IconButton
                              icon={<ArrowForwardIcon />}
                              borderRadius="full"
                              color="purple.500"
                              size={"xs"}
                              bg={"#dedaf4"}
                              boxShadow="md"
                              _hover={{ bg: "#8385d5", color: "brand.100" }}
                            />
                          }
                          variant="link"
                        >
                          See details
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          )}
        </Box>
      </Flex>
    </Container>
  );
};

export default SalesReport;
