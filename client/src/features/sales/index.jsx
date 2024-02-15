import { ArrowDownIcon, ArrowForwardIcon, ArrowUpIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Flex,
  Grid,
  HStack,
  Icon,
  IconButton,
  Select,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import {
  activityChartData,
  callsMadeBarData,
  leaderBoardData,
  meetingsData,
  upcomingTask,
} from "constant";
import { useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { FaAward } from "react-icons/fa";
import { GiDiamondTrophy } from "react-icons/gi";
import { HiOutlineReceiptPercent } from "react-icons/hi2";
import { RxCaretRight } from "react-icons/rx";
import { TfiTarget } from "react-icons/tfi";
import MeetingsConductedTable from "./MeetingsConductedTable";

const CRMDashboard = () => {
  const [selectedDateFilter, setSelectedDateFilter] = useState("This Week");

  const handleDateFilterChange = (event) => {
    setSelectedDateFilter(event.target.value);
    // Fetch data based on the selected date filter
    // Update the 'data' array with the fetched data
  };

  const callsBarData = {
    labels: callsMadeBarData.map((item) => item.day),
    datasets: [
      {
        label: "Calls Made",
        data: callsMadeBarData.map((item) => item.call),
        backgroundColor: "#5580f1",
        borderRadius: 12,
        fill: false,
      },
    ],
  };
  const emailsBarData = {
    labels: callsMadeBarData.map((item) => item.day),
    datasets: [
      {
        label: "Emails Sent",
        data: callsMadeBarData.map((item) => item.call),
        backgroundColor: "#61a9c1",
        borderRadius: 12,
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
  const activityChartOptions = {
    cutout: "50%",
    plugins: {
      datalabels: {
        display: false,
      },
    },
  };

  return (
    <Box p={6} mt={{ base: "3em", md: 0 }}
      overflow={"auto"}>
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing="5" color={"brand.200"}>
        <Box
          p="4"
          bg={"brand.primary_bg"}
          border="3px solid white"
          borderRadius="10px"
          fontWeight="bold"
        >
          <Flex justify="space-between" align="center" mb="2">
            <Icon as={TfiTarget} color="#cda4a8" boxSize={8} />
            <Select width="120px" border={"none"} fontSize={"sm"}>
              <option>This month</option>
              <option>Last month</option>
            </Select>
          </Flex>
          <Text fontSize="sm" fontWeight="bold">
            New Opportunities
          </Text>
          <Flex align="center" color={"brand.600"}>
            <Text mr="3" fontSize="2em">
              100
            </Text>
            <Icon mr="1" as={TfiTarget} color="green.500" />
            <Text color="green.500" fontSize="xs">
              10%
            </Text>
          </Flex>
        </Box>{" "}
        <Box
          p="4"
          bg={"brand.primary_bg"}
          border="3px solid white"
          borderRadius="10px"
          fontWeight="bold"
        >
          <Flex justify="space-between" align="center" mb="2">
            <Icon as={FaAward} color="#9fd4d0" boxSize={8} />
            <Select width="120px" border={"none"} fontSize={"sm"}>
              <option>This month</option>
              <option>Last month</option>
            </Select>
          </Flex>
          <Text fontSize="sm" fontWeight="bold">
            No. of opportunities in the pipeline
          </Text>
          <Flex align="center" color={"brand.600"}>
            <Text mr="3" fontSize="2em">
              55
            </Text>
            <Icon mr="1" as={ArrowDownIcon} color="red.500" />
            <Text color="red.500" fontSize="xs">
              2.22%
            </Text>
          </Flex>
        </Box>{" "}
        <Box
          p="4"
          bg={"brand.primary_bg"}
          border="3px solid white"
          borderRadius="10px"
          fontWeight="bold"
        >
          <Flex justify="space-between" align="center" mb="2">
            <Icon as={GiDiamondTrophy} color="#a5a4e0" boxSize={8} />
            <Select width="120px" border={"none"} fontSize={"sm"}>
              <option>This month</option>
              <option>Last month</option>
            </Select>
          </Flex>
          <Text fontSize="sm" fontWeight="bold">
            Value of opportunities in the pipeline
          </Text>
          <Flex align="center" color={"brand.600"}>
            <Text mr="3" fontSize="2em">
              $345
            </Text>
            <Icon mr="1" as={ArrowUpIcon} color="green.500" />
            <Text color="green.500" fontSize="xs">
              3.34%
            </Text>
          </Flex>
        </Box>{" "}
        <Box
          p="4"
          bg={"brand.primary_bg"}
          border="3px solid white"
          borderRadius="10px"
          fontWeight="bold"
        >
          <Flex justify="space-between" align="center" mb="2">
            <Icon as={HiOutlineReceiptPercent} color="#e0bb6c" boxSize={8} />
            <Select width="120px" border={"none"} fontSize={"sm"}>
              <option>This month</option>
              <option>Last Month</option>
            </Select>
          </Flex>
          <Text fontSize="sm" fontWeight="bold">
            Total Sales
          </Text>
          <Flex align="center" color={"brand.600"}>
            <Text mr="3" fontSize="2em">
              122
            </Text>
            <Icon mr="1" as={ArrowUpIcon} color="green.500" />
            <Text color="green.500" fontSize="xs">
              1.22%
            </Text>
          </Flex>
        </Box>
      </SimpleGrid>

      <Grid templateColumns="1fr 1fr 1fr" gap={5} mt="4" width="100%">
        <Box
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
              Leaderboard
            </Text>
            <Select width="120px" border={"none"} fontSize={"sm"}>
              <option>This month</option>
              <option>Last Month</option>
            </Select>
          </Flex>
          <Table color={"brand.nav_color"} bg={"brand.primary_bg"}>
            <Thead>
              <Tr>
                <Th>Position</Th>
                <Th>Salesperson </Th>
                <Th>Category</Th>
                <Th>Value</Th>
              </Tr>
            </Thead>
            <Tbody color={"brand.nav_color"}>
              {leaderBoardData.map((item, index) => (
                <Tr key={index} fontSize={"sm"}>
                  <Td>{item.position}</Td>
                  <Td>{item.salesperson}</Td>
                  <Td>
                    <Flex align="center">
                      <Icon as={item.icon} />
                      <Text ml="2"> {item.category}</Text>
                    </Flex>
                  </Td>
                  <Td>
                    ${item.value}
                    <Text fontSize={"xs"} as={"span"} fontWeight="normal">
                      {`/ this month`}
                    </Text>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Box
          p="4"
          bg={"brand.primary_bg"}
          border="3px solid white"
          borderRadius="10px"
          fontWeight="bold"
          color={"brand.nav_color"}
        >
          <Text fontSize="lg" fontWeight="bold" mt="2" mb="2">
            Activity Tracking
          </Text>
          <Box textAlign="center">
            <Doughnut data={activityChartData} options={activityChartOptions} />
            <Box display="flex" justifyContent="center" mt="2">
              <HStack mr="4">
                <Box w="1rem" h="1rem" bg="#517ae8" mr="1" />
                <Text>Calls-65%</Text>
              </HStack>
              <HStack mr="4">
                <Box w="1rem" h="1rem" bg="#67afc8" mr="1" />
                <Text>Emails-25%</Text>
              </HStack>
              <HStack>
                <Box w="1rem" h="1rem" bg="#8aa8ee" mr="1" />
                <Text>Meetings-10%</Text>
              </HStack>
            </Box>
          </Box>
        </Box>
        <Box
          color={"brand.nav_color"}
          p="4"
          bg={"brand.primary_bg"}
          border="3px solid white"
          borderRadius="10px"
          fontWeight="bold"
        >
          <Text mt={2} mb={5} fontSize="lg" fontWeight="bold">
            Contacts Added
          </Text>{" "}
          <Table color={"brand.nav_color"} bg={"brand.primary_bg"}>
            <Thead>
              <Tr fontSize={"sm"}>
                <Th>#ID</Th>
                <Th> Name</Th>
                <Th>Email</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody border={"none"} color={"brand.nav_color"}>
              {leaderBoardData.map((item, index) => (
                <Tr key={index} fontSize={"sm"}>
                  <Td>#{item.id}</Td>
                  <Td border={"none"} py={0}>
                    <Flex align="center">
                      <Avatar
                        size="sm"
                        src={item.profilePic}
                        name={item.salesperson}
                      />
                      <Text ml="2">{item.salesperson}</Text>
                    </Flex>
                  </Td>
                  <Td border={"none"} py={0}>
                    {"user@gmail.com"}
                  </Td>
                  <Td border={"none"} py={0}>
                    <IconButton
                      icon={<ArrowForwardIcon />}
                      borderRadius="full"
                      size={"xs"}
                      color="purple.500"
                      bg={"#dedaf4"}
                      boxShadow="md"
                      _hover={{ bg: "#8385d5", color: "brand.100" }}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Grid>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="5" mt="4">
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
            mb="2"
            color={"brand.nav_color"}
          >
            <Text fontSize="lg" fontWeight="bold">
              Calls Made
            </Text>
            <Select width="120px" border={"none"} fontSize={"sm"}>
              <option>Last Week</option>
              <option>Last Month</option>
            </Select>
          </Flex>
          <Bar data={callsBarData} options={options} />
        </Box>

        <Box
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
              Emails Sent
            </Text>
            <Select width="120px" border={"none"} fontSize={"sm"}>
              <option>Last Week</option>
              <option>Last Month</option>
            </Select>
          </Flex>
          <Bar data={emailsBarData} options={options} />
        </Box>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4" mt="4">
        <Box
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
              Meetings Conducted
            </Text>
            <Select width="120px" border={"none"} fontSize={"sm"}>
              <option>Last Week</option>
              <option>This Week</option>
            </Select>
          </Flex>
          <MeetingsConductedTable meetingsData={meetingsData} />
        </Box>
        <Box
          p="4"
          color={"brand.nav_color"}
          bg={"brand.primary_bg"}
          border="3px solid white"
          borderRadius="10px"
          fontWeight="bold"
        >
          <Text mt={2} mb={5} fontSize="lg" fontWeight="bold">
            Upcoming
          </Text>
          <Table color={"brand.nav_color"} bg={"brand.primary_bg"} p={0}>
            <Tbody border={"none"} color={"brand.nav_color"}>
              {upcomingTask.map((item, index) => (
                <Tr key={index} fontSize={"sm"}>
                  <Td width={"80px"} p={2}>
                    <IconButton
                      bg={"#d8dce9"}
                      color={"#8d8fb3"}
                      _hover={{ color: "brand.600" }}
                      icon={item.icon}
                      size="sm"
                      aria-label="Calendar Icon"
                    />
                  </Td>
                  <Td border={"none"} p={0}>
                    <VStack spacing={0}>
                      <Text w={"100%"} fontSize="sm" fontWeight="bolder">
                        {item.title}
                      </Text>
                      <Text w={"100%"} fontSize="sm" color={"#8b8b8b"}>
                        detailed text
                      </Text>
                    </VStack>
                  </Td>

                  <Td width={"100px"} border={"none"} py={0}>
                    <IconButton
                      icon={<Icon as={RxCaretRight} boxSize={8} />}
                      color={"#8b8b8b"}
                      size={"lg"}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default CRMDashboard;
