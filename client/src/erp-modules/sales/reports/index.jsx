import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
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
} from "@chakra-ui/react";
import Loader from "components/Loader";
import { callsMadeBarData } from "constant";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { useBreakpointValue } from "services/Breakpoint";
import ContactService from "services/ContactService";

const SalesReport = () => {
	const { isMobile, isIpad } = useBreakpointValue();

	const [contacts, setContacts] = useState(null);
	const fetchAllContacts = async () => {
		try {
			const response = await ContactService.getContacts();
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
		<Box
			p={{ base: "1em", md: "2em" }}
			h={{ base: "auto", md: "70vh", lg: "auto" }}
			overflow={"auto"}
		>
			<Text fontWeight="bold">Sales Reports</Text>
			<Flex direction="column" h="100%">
				<SimpleGrid
					columns={{ base: 1, lg: 2 }}
					spacing="5"
					my="5"
					h={{ xl: "50%" }}
				>
					<Box
						color={"brand.nav_color"}
						p="1em"
						bg={"brand.primary_bg"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
						fontWeight="bold"
					>
						<Flex
							justify="space-between"
							align="center"
							color={"brand.nav_color"}
						>
							<Text fontWeight="bold">Sales Overview</Text>
							<Select width="90px" border={"none"} fontSize={"xs"}>
								<option>Weekly </option>
								<option>Last Month</option>
							</Select>
						</Flex>
						<Box w={{ base: "90%", md: "90%", xl: "60%" }} mx={"auto"}>
							<Bar data={callsBarData} options={options} />
						</Box>
					</Box>
					<Box
						overflow="auto"
						p="1em"
						bg={"brand.primary_bg"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
						fontWeight="bold"
					>
						<Flex
							justify="space-between"
							align="center"
							mb="2"
							color={"brand.nav_color"}
						>
							<Text fontWeight="bold">Sales Metrics Summary</Text>
						</Flex>
						<SimpleGrid columns={2} gap={4} h={"85%"}>
							<Box
								p={4}
								border={"2px solid var(--filter_border_color)"}
								borderRadius={"10px"}
								justifyContent="space-evenly"
								display="flex"
								flexDir="column"
							>
								<Text fontSize="xs" fontWeight="bold" color={"brand.nav_color"}>
									Total sales
								</Text>
								<Text mr="3" fontSize={"1.25em"}>
									$100,500
								</Text>
							</Box>
							<Box
								p={4}
								border={"2px solid var(--filter_border_color)"}
								borderRadius={"10px"}
								justifyContent="space-evenly"
								display="flex"
								flexDir="column"
							>
								<Text fontSize="xs" fontWeight="bold" color={"brand.nav_color"}>
									Total leads
								</Text>
								<Text mr="3" fontSize={"1.25em"}>
									455
								</Text>
							</Box>
							<Box
								p={4}
								border={"2px solid var(--filter_border_color)"}
								borderRadius={"10px"}
								justifyContent="space-evenly"
								display="flex"
								flexDir="column"
							>
								<Text fontSize="xs" fontWeight="bold" color={"brand.nav_color"}>
									Conversion rate
								</Text>
								<Text mr="3" fontSize={"1.25em"}>
									55%
								</Text>
							</Box>
							<Box
								p={4}
								border={"2px solid var(--filter_border_color)"}
								borderRadius={"10px"}
								justifyContent="space-evenly"
								display="flex"
								flexDir="column"
							>
								<Text fontSize="xs" fontWeight="bold" color={"brand.nav_color"}>
									Top selling product
								</Text>
								<Text mr="3" fontSize={"1.25em"}>
									Product 1
								</Text>
							</Box>
						</SimpleGrid>
					</Box>
				</SimpleGrid>
				<Box
					p="1em"
					bg={"brand.primary_bg"}
					border="2px solid var(--main_color)"
					borderRadius="10px"
					color={"brand.nav_color"}
				>
					{isMobile || isIpad ? (
						<Flex flexDir="column">
							<Flex justify="space-between">
								<Text fontWeight="bold">Sales Performance</Text>
								<Button
									bg="var(--primary_button_bg)"
									color={"brand.primary_bg"}
									variant={"solid"}
									size="xs"
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
									border={"2px solid var(--filter_border_color)"}
									borderRadius={"10px"}
									variant={"ghost"}
									size={"xs"}
									_hover={{ color: "brand.600", bg: "transparent" }}
								>
									Filter
								</Button>
								<InputGroup
									borderRadius={"10px"}
									border={"1px solid var(--filter_border_color)"}
									fontSize="xs"
									size={"xs"}
									fontWeight="bold"
								>
									<InputLeftElement children={<FaSearch />} />
									<Input
										_placeholder={{
											color: "brand.nav_color",
											fontSize: "xs",
										}}
										color={"brand.nav_color"}
										bg={"brand.primary_bg"}
										type="text"
										placeholder="Search here"
										pr="4.5rem"
										py={"1.2em"}
									/>
								</InputGroup>
							</HStack>
						</Flex>
					) : (
						<Flex>
							<Text fontWeight="bold">Sales Performance</Text>
							<Spacer />
							<HStack w={{ lg: "50%" }} spacing={3} justify={"flex-end"}>
								<Button
									color={"brand.nav_color"}
									leftIcon={<MdOutlineFilterList />}
									border={"2px solid var(--filter_border_color)"}
									borderRadius={"10px"}
									variant={"ghost"}
									size={"xs"}
									_hover={{ color: "brand.600", bg: "transparent" }}
									ml={2}
								>
									Filter
								</Button>
								<InputGroup
									w={"40%"}
									borderRadius={"10px"}
									border={"1px solid var(--filter_border_color)"}
									fontSize="xs"
									fontWeight="bold"
									size={"xs"}
								>
									<InputLeftElement children={<FaSearch />} />
									<Input
										_placeholder={{
											color: "brand.nav_color",
											fontSize: "xs",
										}}
										color={"brand.nav_color"}
										bg={"brand.primary_bg"}
										type="text"
										placeholder="Search here"
										pr="4.5rem"
										py={"1.2em"}
									/>
								</InputGroup>
								<Button
									bg="var(--primary_button_bg)"
									color={"brand.primary_bg"}
									variant={"solid"}
									size={"xs"}
									_hover={{ color: "brand.600" }}
									borderRadius={"10px"}
								>
									Add new sales
								</Button>
							</HStack>
						</Flex>
					)}

					{!contacts && <Loader />}
					{contacts && (
						<Box overflow="auto">
							<Table color={"brand.nav_color"} bg={"brand.primary_bg"}>
								<Thead>
									<Tr fontSize="xs">
										<Th fontWeight={"bolder"} p={0}>
											Date
										</Th>
										<Th fontWeight={"bolder"}>Deals </Th>
										<Th fontWeight={"bolder"}>Amount</Th>
										<Th fontWeight={"bolder"}>Top Product</Th>
										<Th p={0}></Th>
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
											<Td fontSize={"xs"} p={0}>
												<HStack>
													<Button
														bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
														bgClip="text"
														size={"xxs"}
														rightIcon={
															<IconButton
																icon={<ArrowForwardIcon />}
																borderRadius="full"
																color="purple.500"
																bg={"#dedaf4"}
																p={"0.4em"}
																size={"xxs"}
																_hover={{ bg: "#8385d5", color: "brand.100" }}
															/>
														}
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
		</Box>
	);
};

export default SalesReport;
