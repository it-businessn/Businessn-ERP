import { ArrowDownIcon, ArrowForwardIcon, ArrowUpIcon } from "@chakra-ui/icons";
import {
	Avatar,
	Box,
	Flex,
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
	BAR_DATA,
	activityChartData,
	doughnutOptions,
	leaderBoardData,
	meetingsData,
	upcomingTask,
} from "constant";
import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { FaAward } from "react-icons/fa";
import { GiDiamondTrophy } from "react-icons/gi";
import { HiOutlineReceiptPercent } from "react-icons/hi2";
import { RxCaretRight } from "react-icons/rx";
import { TfiTarget } from "react-icons/tfi";
import UserService from "services/UserService";
import MeetingsConductedTable from "./MeetingsConductedTable";

const CRMDashboard = () => {
	const [selectedDateFilter, setSelectedDateFilter] = useState("This Week");

	const handleDateFilterChange = (event) => {
		setSelectedDateFilter(event.target.value);
		// Fetch data based on the selected date filter
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
		plugins: {
			legend: {
				display: false,
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
	};

	const [agents, setAgents] = useState(null);
	useEffect(() => {
		const fetchAllAgents = async () => {
			try {
				const response = await UserService.getAllUsers();
				setAgents(response.data.filter((user) => user.role.includes("Sales")));
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllAgents();
	}, []);
	return (
		<Box p={{ base: "1em", md: "2em" }} overflow={"hidden"}>
			<Text fontWeight="bold" mb={"0.5em"}>
				CRM Dashboard
			</Text>{" "}
			<SimpleGrid
				mb={"1em"}
				columns={{ base: 1, md: 2, lg: 4 }}
				spacing="1em"
				color={"brand.200"}
			>
				<Box
					px="1em"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
				>
					<Flex
						justify="space-between"
						align="center"
						mb="1"
						w={{ base: "auto", md: "106%" }}
					>
						<Icon as={TfiTarget} color="#cda4a8" boxSize={5} />
						<Select width="auto" border={"none"} fontSize={"xs"} p={0}>
							<option>This month</option>
							<option>Last month</option>
						</Select>
					</Flex>
					<Text fontSize="xs" fontWeight="bold">
						New Opportunities
					</Text>
					<Flex align="center" color={"brand.600"}>
						<Text mr="3" fontWeight="900">
							100
						</Text>
						<Icon mr="1" as={TfiTarget} color="green.500" />
						<Text color="green.500" fontSize="xs">
							10%
						</Text>
					</Flex>
				</Box>
				<Box
					px="1em"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
				>
					<Flex
						justify="space-between"
						align="center"
						mb="1"
						w={{ base: "auto", md: "106%" }}
					>
						<Icon as={FaAward} color="#9fd4d0" boxSize={5} />
						<Select width="auto" border={"none"} fontSize={"xs"} p={0}>
							<option>This month</option>
							<option>Last month</option>
						</Select>
					</Flex>
					<Text fontSize="xs" fontWeight="bold">
						No. of opportunities in the pipeline
					</Text>
					<Flex align="center" color={"brand.600"}>
						<Text mr="3" fontWeight="900">
							55
						</Text>
						<Icon mr="1" as={ArrowDownIcon} color="red.500" />
						<Text color="red.500" fontSize="xs">
							2.22%
						</Text>
					</Flex>
				</Box>
				<Box
					px="1em"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
				>
					<Flex
						justify="space-between"
						align="center"
						mb="1"
						w={{ base: "auto", md: "106%" }}
					>
						<Icon as={GiDiamondTrophy} color="#a5a4e0" boxSize={5} />
						<Select width="auto" border={"none"} fontSize={"xs"} p={0}>
							<option>This month</option>
							<option>Last month</option>
						</Select>
					</Flex>
					<Text fontSize="xs" fontWeight="bold">
						Value of opportunities in the pipeline
					</Text>
					<Flex align="center" color={"brand.600"}>
						<Text mr="3" fontWeight="900">
							$345
						</Text>
						<Icon mr="1" as={ArrowUpIcon} color="green.500" />
						<Text color="green.500" fontSize="xs">
							3.34%
						</Text>
					</Flex>
				</Box>
				<Box
					px="1em"
					pb="10px"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
				>
					<Flex
						justify="space-between"
						align="center"
						mb="1"
						w={{ base: "auto", md: "106%" }}
					>
						<Icon as={HiOutlineReceiptPercent} color="#e0bb6c" boxSize={5} />
						<Select width="auto" border={"none"} fontSize={"xs"} ml={"1em"}>
							<option>This month</option>
							<option>Last Month</option>
						</Select>
					</Flex>
					<Text fontSize="xs" fontWeight="bold">
						Total Sales
					</Text>
					<Flex align="center" color={"brand.600"}>
						<Text mr="3" fontWeight="900">
							122
						</Text>
						<Icon mr="1" as={ArrowUpIcon} color="green.500" />
						<Text color="green.500" fontSize="xs">
							1.22%
						</Text>
					</Flex>
				</Box>
			</SimpleGrid>
			<SimpleGrid columns={{ base: 1, md: 1, lg: 3 }} spacing="1em">
				<Box
					px="1em"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
					h="350px"
				>
					<Flex
						justify="space-between"
						align="center"
						mb="1"
						color={"brand.nav_color"}
					>
						<Text fontWeight="bold">Leaderboard</Text>
						<Select width="auto" border={"none"} fontSize={"xs"} ml={"1em"}>
							<option>This month</option>
							<option>Last Month</option>
						</Select>
					</Flex>
					<Box overflow="auto" h="85%">
						<Table size="sm" color={"brand.nav_color"} bg={"brand.primary_bg"}>
							<Thead>
								<Tr>
									<Th p={0}>Position</Th>
									<Th>Salesperson </Th>
									<Th>Category</Th>
									<Th>Value</Th>
								</Tr>
							</Thead>
							<Tbody color={"brand.nav_color"}>
								{leaderBoardData.map((item, index) => (
									<Tr key={index}>
										<Td fontSize={"xs"} p={0}>
											{item.position}
										</Td>
										<Td fontSize={"xs"}>{item.salesperson}</Td>
										<Td fontSize={"xs"}>
											<Flex align="center">
												<Icon as={item.icon} />
												<Text ml="2"> {item.category}</Text>
											</Flex>
										</Td>
										<Td fontSize={"xs"}>
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
				</Box>
				<Box
					px="1em"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
					color={"brand.nav_color"}
					h={{ base: "auto", md: "350px" }}
				>
					<Text fontWeight="bold" mt="2" mb="1">
						Activity Tracking
					</Text>
					<VStack spacing={0}>
						<Box h={"30px"} />
						<Box
							w={{ base: "50%", md: "50%", lg: "100%", xl: "65%" }}
							h={{ base: "50%", md: "50%", lg: "100%", xl: "65%" }}
							m={"0 auto"}
						>
							<Doughnut
								data={activityChartData}
								options={doughnutOptions("50%")}
							/>
						</Box>
					</VStack>
				</Box>
				<Box
					color={"brand.nav_color"}
					px="1em"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
					h="350px"
				>
					<Text mt={2} mb={3} fontWeight="bold">
						Contacts Added
					</Text>
					<Box overflow="auto" h="85%">
						<Table size="sm" color={"brand.nav_color"} bg={"brand.primary_bg"}>
							<Thead>
								<Tr>
									<Th p={0}>#ID</Th>
									<Th> Name</Th>
									<Th>Email</Th>
									<Th></Th>
								</Tr>
							</Thead>
							<Tbody border={"none"} color={"brand.nav_color"}>
								{agents?.map(({ _id, fullName, email }, index) => (
									<Tr key={_id}>
										<Td fontSize={"xs"} p={0}>
											#{index + 1}
										</Td>
										<Td fontSize={"xs"} border={"none"} py={0}>
											<Flex align="center">
												<Avatar
													size="sm"
													src=""
													// src={item.profilePic}
													name={fullName}
												/>
												<Text ml="2">{fullName}</Text>
											</Flex>
										</Td>
										<Td fontSize={"xs"} border={"none"} py={0}>
											{email}
										</Td>
										<Td border={"none"} py={0}>
											<IconButton
												icon={<ArrowForwardIcon size="xs" />}
												borderRadius="full"
												size={"xs"}
												color="purple.500"
												bg={"#dedaf4"}
												_hover={{ bg: "#8385d5", color: "brand.100" }}
											/>
										</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</Box>
				</Box>
			</SimpleGrid>
			<SimpleGrid columns={{ base: 1, md: 1, lg: 2 }} spacing="1em" mt="4">
				{BAR_DATA.map((bar) => (
					<Box
						key={bar.title}
						color={"brand.nav_color"}
						px="1em"
						bg={"brand.primary_bg"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
						fontWeight="bold"
					>
						<Flex
							justify="space-between"
							align="center"
							mb="1"
							color={"brand.nav_color"}
							w={{ base: "auto", md: "103%" }}
						>
							<Text fontWeight="bold">{bar.title}</Text>
							<Select width="auto" border={"none"} fontSize={"xs"} ml={"1em"}>
								<option>Last Week</option>
								<option>Last Month</option>
							</Select>
						</Flex>
						<Box
							w={{ base: "70%", md: "65%", lg: "70%", xl: "50%" }}
							mx={"auto"}
						>
							<Bar data={bar.data} options={options} />
						</Box>
					</Box>
				))}
			</SimpleGrid>
			<SimpleGrid columns={{ base: 1, md: 1, lg: 2 }} spacing="4" mt="4">
				<Box
					px="1em"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
				>
					<Flex
						justify="space-between"
						align="center"
						mb="1"
						color={"brand.nav_color"}
						w={{ base: "auto", md: "103%" }}
					>
						<Text fontWeight="bold">Meetings Conducted</Text>
						<Select width="auto" border={"none"} fontSize={"xs"} ml={"1em"}>
							<option>Last Week</option>
							<option>This Week</option>
						</Select>
					</Flex>
					<Box overflow="auto">
						<MeetingsConductedTable meetingsData={meetingsData} />
					</Box>
				</Box>
				<Box
					px="1em"
					color={"brand.nav_color"}
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
				>
					<Text mt={2} mb={2} fontWeight="bold">
						Upcoming
					</Text>
					<Table
						color={"brand.nav_color"}
						bg={"brand.primary_bg"}
						size={"small"}
					>
						<Tbody border={"none"} color={"brand.nav_color"}>
							{upcomingTask.map((item, index) => (
								<Tr key={item.title}>
									<Td width={"80px"} p={0}>
										<IconButton
											bg={"#d8dce9"}
											color={"#8d8fb3"}
											_hover={{ color: "brand.600" }}
											icon={item.icon}
											size="sm"
											aria-label="Calendar Icon"
										/>
									</Td>
									<Td border={"none"} p={0} fontSize={"xs"}>
										<VStack spacing={0}>
											<Text w={"100%"} fontSize="xs" fontWeight="bold">
												{item.title}
											</Text>
											<Text w={"100%"} fontSize="xs" color={"#8b8b8b"}>
												detailed text
											</Text>
										</VStack>
									</Td>

									<Td width={"100px"} border={"none"} py={0}>
										<IconButton
											icon={<Icon as={RxCaretRight} boxSize={5} />}
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
