import {
	Box,
	Button,
	Flex,
	HStack,
	Input,
	InputGroup,
	InputLeftElement,
	Progress,
	SimpleGrid,
	Spacer,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	VStack,
} from "@chakra-ui/react";
import { activityChartData, doughnutOptions } from "constant";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { useBreakpointValue } from "services/Breakpoint";
import ContactService from "services/ContactService";

const Orders = () => {
	const { isMobile } = useBreakpointValue();

	const [selectedDateFilter, setSelectedDateFilter] = useState("This Week");

	const handleDateFilterChange = (event) => {
		setSelectedDateFilter(event.target.value);
		// Fetch data based on the selected date filter
	};
	const [contacts, setContacts] = useState(null);
	const fetchAllContacts = async () => {
		try {
			const { data } = await ContactService.getContacts();
			data.map((item) => (item.comm = "Meeting"));
			setContacts(data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllContacts();
	}, []);
	return (
		<PageLayout title={"Orders"}>
			{/* <Box
			p={{ base: "1em", md: "2em" }}
			h={{ base: "auto", md: "70vh", lg: "auto" }}
			overflow="auto"
		> */}

			<Box
				p="1em"
				bg={"var(--primary_bg)"}
				border="3px solid var(--main_color)"
				borderRadius="10px"
				fontWeight="bold"
				mb="1em"
			>
				<Text fontWeight="bold" mb="1em" color={"var(--nav_color)"}>
					Order Categories
				</Text>
				<SimpleGrid columns={{ base: 1, lg: 3 }} spacing="1em">
					<Box
						px="1em"
						bg={"var(--primary_bg)"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
						fontWeight="bold"
					>
						<Text fontWeight="bold" color={"var(--main_color_black)"} mt="2" mb="1">
							Open stage mix
						</Text>
						<VStack>
							<Box h={"40px"} />
							<Box w={{ base: "70%", md: "50%", lg: "100%", xl: "65%" }} mx={"auto"}>
								<Doughnut data={activityChartData} options={doughnutOptions("0%")} />
							</Box>
						</VStack>
					</Box>
					<Box
						p="1em"
						bg={"var(--primary_bg)"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
						fontWeight="bold"
					>
						<Flex justify="space-between" align="center" mb="2">
							<Text fontWeight="bold">Orders to fulfill</Text>
						</Flex>
						<SimpleGrid columns={{ base: 2, md: 1 }} gap={4} h={"85%"}>
							<Box
								p={4}
								border={"2px solid var(--filter_border_color)"}
								borderRadius={"10px"}
								justifyContent="space-evenly"
								display="flex"
								flexDir="column"
							>
								<Text fontSize="xs" fontWeight="bold" color={"var(--nav_color)"}>
									Orders to be Fulfilled
								</Text>
								<Text mr="3" fontSize={"1.25em"}>
									123
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
								<Text fontSize="xs" fontWeight="bold" color={"var(--nav_color)"}>
									New Order
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
								<Text fontSize="xs" fontWeight="bold" color={"var(--nav_color)"}>
									Approved Orders
								</Text>
								<Text mr="3" fontSize={"1.25em"}>
									$55
								</Text>
							</Box>
						</SimpleGrid>
					</Box>
					<Box
						p="1em"
						bg={"var(--primary_bg)"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
						fontWeight="bold"
					>
						<Flex justify="space-between" align="center" mb="2">
							<Text fontWeight="bold">Key Metrics</Text>
						</Flex>
						<SimpleGrid columns={{ base: 2, md: 1 }} gap={4} h={"80%"}>
							<Box
								p={4}
								border={"2px solid var(--filter_border_color)"}
								borderRadius={"10px"}
								justifyContent="space-evenly"
								display="flex"
								flexDir="column"
							>
								<Text fontSize="xs" fontWeight="bold">
									Fulfillment Rate
								</Text>
								<Text mr="3" fontSize={"1.25em"}>
									45%
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
								<Text fontSize="xs" fontWeight="bold">
									Time to fulfill
								</Text>
								<Text mr="3" fontSize={"1.25em"}>
									5 days
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
								<Text fontSize="xs" fontWeight="bold">
									Average order value
								</Text>
								<Text mr="3" fontSize={"1.25em"}>
									$100
								</Text>
							</Box>
						</SimpleGrid>
					</Box>
				</SimpleGrid>
			</Box>
			<Box
				p="1em"
				bg={"var(--primary_bg)"}
				border="2px solid var(--main_color)"
				borderRadius="10px"
				color={"var(--nav_color)"}
			>
				{isMobile ? (
					<Flex flexDir="column">
						<Flex justify="space-between">
							<Text fontWeight="bold">Orders</Text>
							{/* <Button
								bg="var(--primary_button_bg)"
								color={"var(--primary_bg)"}
								variant={"solid"}
								size="xs"
								_hover={{ color: "var(--main_color_black)" }}
								borderRadius={"10px"}
							>
								Add new sales
							</Button> */}
						</Flex>
						<HStack spacing="1em" mt="1em">
							<Button
								color={"var(--nav_color)"}
								leftIcon={<MdOutlineFilterList />}
								border={"2px solid var(--filter_border_color)"}
								borderRadius={"10px"}
								variant={"ghost"}
								size={"xs"}
								_hover={{ color: "var(--main_color_black)", bg: "transparent" }}
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
										color: "var(--nav_color)",
										fontSize: "xs",
									}}
									color={"var(--nav_color)"}
									bg={"var(--primary_bg)"}
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
						<Text fontWeight="bold">Orders</Text>
						<Spacer />
						<HStack w={{ lg: "50%" }} spacing={3} justify={"flex-end"}>
							<Button
								color={"var(--nav_color)"}
								leftIcon={<MdOutlineFilterList />}
								border={"2px solid var(--filter_border_color)"}
								borderRadius={"10px"}
								variant={"ghost"}
								size={"xs"}
								_hover={{ color: "var(--main_color_black)", bg: "transparent" }}
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
										color: "var(--nav_color)",
										fontSize: "xs",
									}}
									color={"var(--nav_color)"}
									bg={"var(--primary_bg)"}
									type="text"
									placeholder="Search here"
									pr="4.5rem"
									py={"1.2em"}
								/>
							</InputGroup>
							<Button
								bg="var(--primary_button_bg)"
								color={"var(--primary_bg)"}
								variant={"solid"}
								size={"xs"}
								px={"1em"}
								_hover={{ color: "var(--main_color_black)" }}
								borderRadius={"10px"}
							>
								Add new orders
							</Button>
						</HStack>
					</Flex>
				)}
				{contacts && (
					<Box overflow="auto" height={"30vh"}>
						<Table color={"var(--nav_color)"} bg={"var(--primary_bg)"}>
							<Thead>
								<Tr fontSize="xs">
									<Th fontWeight={"bolder"} p={0}>
										Order ID
									</Th>
									<Th fontWeight={"bolder"}>Created On </Th>
									<Th fontWeight={"bolder"}>Status</Th>
									<Th fontWeight={"bolder"}> Amount</Th>
									<Th p={0}>Sales Person</Th>
									<Th fontWeight={"bolder"}> Paid</Th>
								</Tr>
							</Thead>
							<Tbody color={"var(--nav_color)"}>
								{contacts.map((contact, index) => (
									<Tr key={contact._id}>
										<Td fontSize={"xs"} p={0}>
											04/02/2024
										</Td>
										<Td fontSize={"xs"}>{contact.companyName}</Td>
										<Td fontSize={"xs"}>$345</Td>
										<Td fontSize={"xs"}>Product1</Td>
										<Td fontSize={"xs"} p={0}>
											<Progress colorScheme="blue" size="sm" bg={"#d5def5"} value={55} />
											<Text fontSize={"xs"}>Paid, preparing for shipment</Text>
										</Td>
										<Td fontSize={"xs"}>Product1</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</Box>
				)}
			</Box>
		</PageLayout>
	);
};

export default Orders;
