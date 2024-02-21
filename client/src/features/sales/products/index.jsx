import {
	Box,
	Button,
	Flex,
	HStack,
	Input,
	InputGroup,
	InputLeftElement,
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
import { activityChartData } from "constant";
import Loader from "features/Loader";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import * as api from "services";
import { useBreakpointValue } from "services/Breakpoint";

const Products = () => {
	const { isMobile } = useBreakpointValue();

	const [selectedDateFilter, setSelectedDateFilter] = useState("This Week");

	const handleDateFilterChange = (event) => {
		setSelectedDateFilter(event.target.value);
	};

	const activityChartOptions = {
		cutout: "0%",
		plugins: {
			datalabels: {
				display: true,
			},
		},
		legend: {
			position: "bottom",
			align: "center",
		},
	};
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

	useEffect(() => {
		fetchAllContacts();
	}, []);
	return (
		<Box p={"1em"} overflow={"hidden"}>
			<Text fontWeight="bold" mb={"0.5em"}>
				Products
			</Text>

			<Box
				overflow="auto"
				p="1em"
				bg={"brand.primary_bg"}
				border="3px solid white"
				borderRadius="10px"
				fontWeight="bold"
				mb="1em"
			>
				<Text fontWeight="bold" mb="1em" color={"brand.nav_color"}>
					Product Categories
				</Text>
				<SimpleGrid columns={{ base: 1, md: 1, lg: 3 }} spacing="1em">
					<Box
						px="1em"
						bg={"brand.primary_bg"}
						border="3px solid white"
						borderRadius="10px"
						fontWeight="bold"
					>
						<Text fontWeight="bold" color={"brand.600"} mt="2" mb="1">
							All Categories
						</Text>
						<Box w={{ base: "70%", xl: "55%" }} mx={"auto"}>
							<Doughnut
								data={activityChartData}
								options={activityChartOptions}
							/>
						</Box>
					</Box>
					<Box
						p="1em"
						bg={"brand.primary_bg"}
						border="3px solid white"
						borderRadius="10px"
						fontWeight="bold"
					>
						<Flex justify="space-between" align="center" mb="2">
							<Text fontWeight="bold">Inventory</Text>
						</Flex>
						<SimpleGrid columns={2} gap={4} h={"85%"}>
							<Box
								p={4}
								border={"2px solid #d3d3d3"}
								borderRadius={"10px"}
								justifyContent="space-evenly"
								display="flex"
								flexDir="column"
							>
								<Text fontSize="xs" fontWeight="bold" color={"brand.nav_color"}>
									Total SKUs
								</Text>
								<Text mr="3" fontSize={"1.25em"}>
									123
								</Text>
							</Box>
							<Box
								p={4}
								border={"2px solid #d3d3d3"}
								borderRadius={"10px"}
								justifyContent="space-evenly"
								display="flex"
								flexDir="column"
							>
								<Text fontSize="xs" fontWeight="bold" color={"brand.nav_color"}>
									Total Products
								</Text>
								<Text mr="3" fontSize={"1.25em"}>
									455
								</Text>
							</Box>
							<Box
								p={4}
								border={"2px solid #d3d3d3"}
								borderRadius={"10px"}
								justifyContent="space-evenly"
								display="flex"
								flexDir="column"
							>
								<Text fontSize="xs" fontWeight="bold" color={"brand.nav_color"}>
									$ Inventory #Skus
								</Text>
								<Text mr="3" fontSize={"1.25em"}>
									$55
								</Text>
							</Box>
						</SimpleGrid>
					</Box>
					<Box
						p="1em"
						bg={"brand.primary_bg"}
						border="3px solid white"
						borderRadius="10px"
						fontWeight="bold"
					>
						<Flex justify="space-between" align="center" mb="2">
							<Text fontWeight="bold">Key Metrics</Text>
						</Flex>
						<SimpleGrid columns={2} gap={4} h={"80%"}>
							<Box
								p={4}
								border={"2px solid #d3d3d3"}
								borderRadius={"10px"}
								justifyContent="space-evenly"
								display="flex"
								flexDir="column"
							>
								<Text fontSize="xs" fontWeight="bold">
									Sell-through
								</Text>
								<Text mr="3" fontSize={"1.25em"}>
									45%
								</Text>
							</Box>
							<Box
								p={4}
								border={"2px solid #d3d3d3"}
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
							{!isMobile && (
								<Box
									p={8}
									borderRadius={"10px"}
									justifyContent="space-evenly"
									display="flex"
									flexDir="column"
								/>
							)}
						</SimpleGrid>
					</Box>
				</SimpleGrid>
			</Box>
			<Box
				p="1em"
				bg={"brand.primary_bg"}
				border="2px solid white"
				borderRadius="10px"
				color={"brand.nav_color"}
			>
				{isMobile ? (
					<Flex flexDir="column">
						<Flex justify="space-between">
							<Text fontWeight="bold">Products</Text>
							{/* <Button
								bg={"#537eee"}
								color={"brand.primary_bg"}
								variant={"solid"}
								size="xs"
								_hover={{ color: "brand.600" }}
								borderRadius={"10px"}
							>
								Add new sales
							</Button> */}
						</Flex>
						<HStack spacing="1em" mt="1em">
							<Button
								color={"brand.nav_color"}
								leftIcon={<MdOutlineFilterList />}
								border={"2px solid #d3d3d3"}
								borderRadius={"10px"}
								variant={"ghost"}
								size={"xs"}
								_hover={{ color: "brand.600", bg: "transparent" }}
							>
								Filter
							</Button>
							<InputGroup
								borderRadius={"10px"}
								border={"1px solid #d3d3d3"}
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
						<Text fontWeight="bold">Products</Text>
						<Spacer />
						<HStack w={{ lg: "50%" }} spacing={3} justify={"flex-end"}>
							<Button
								color={"brand.nav_color"}
								leftIcon={<MdOutlineFilterList />}
								border={"2px solid #d3d3d3"}
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
								border={"1px solid #d3d3d3"}
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
							{/* <Button
								bg={"#537eee"}
								color={"brand.primary_bg"}
								variant={"solid"}
								size={"xs"}
								_hover={{ color: "brand.600" }}
								borderRadius={"10px"}
							>
								Add new sales
							</Button> */}
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
										Product ID
									</Th>
									<Th fontWeight={"bolder"}>Name </Th>
									<Th fontWeight={"bolder"}>Product Category</Th>
									<Th fontWeight={"bolder"}> Price</Th>
									<Th p={0}>Cost</Th>
									<Th fontWeight={"bolder"}> List Price</Th>
									<Th fontWeight={"bolder"}> Qty on hand</Th>
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
										<Td fontSize={"xs"}>Product1</Td>
										<Td fontSize={"xs"}>Product1</Td>
										<Td fontSize={"xs"}>Product1</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default Products;
