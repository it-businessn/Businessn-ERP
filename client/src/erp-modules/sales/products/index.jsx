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
import { doughnutOptions } from "constant";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { useBreakpointValue } from "services/Breakpoint";
import ContactService from "services/ContactService";
import { calcTotal } from "utils";
import { productsInfo } from "../../../data";
import "./products.css";

const Products = () => {
	const { isMobile, isIpad } = useBreakpointValue();

	const [selectedDateFilter, setSelectedDateFilter] = useState("This Week");

	const handleDateFilterChange = (event) => {
		setSelectedDateFilter(event.target.value);
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

	const [totalCost, setTotalCost] = useState(0);
	const [totalQuantity, setTotalQuantity] = useState(0);

	useEffect(() => {
		setTotalCost(calcTotal(productsInfo, "cost", "quantity"));
		setTotalQuantity(calcTotal(productsInfo, "quantity"));
		fetchAllContacts();
	}, []);

	const groupedData = productsInfo.reduce((acc, product) => {
		const category = product.category;
		acc[category] = (acc[category] || 0) + product.quantity;
		return acc;
	}, {});

	const sumQuantity = calcTotal(productsInfo, "quantity");

	const percentages = {};
	for (const category in groupedData) {
		percentages[category] = ((groupedData[category] / sumQuantity) * 100).toFixed(2);
	}

	const combinedData = Object.keys(percentages);
	const data = Object.values(groupedData);
	const labels = combinedData.map((category, index) => `${category} - ${data[index]}%`);

	const productsChartData = {
		labels,
		datasets: [
			{
				data,
				backgroundColor: ["#517ae8", "#67afc8", "#8aa8ee", "#c4f7d8", "#caeaf5"],
				hoverBackgroundColor: ["#517ae8", "#67afc8", "#8aa8ee", "#c4f7d8", "#caeaf5"],
			},
		],
	};
	const customTooltips = {
		callbacks: {
			label(tooltipItem) {
				// return `${data.labels[tooltipItem.index]}: ${
				// 	data.datasets[0].data[tooltipItem.index]
				// }%`;
				return tooltipItem.label;
			},
		},
	};

	return (
		<PageLayout title={"Products"}>
			{/* <Box
	 	p={{ base: "1em", md: "2em" }}
			overflowY={{ base: "hidden", md: "auto" }}
			h={{ base: "auto", md: "70vh", lg: "auto" }}
		 > */}

			<Box
				overflow="auto"
				p="1em"
				bg={"var(--primary_bg)"}
				border="3px solid var(--main_color)"
				borderRadius="10px"
				fontWeight="bold"
				mb="1em"
			>
				<Text fontWeight="bold" mb="1em" color={"var(--nav_color)"}>
					Product Categories
				</Text>
				<SimpleGrid columns={{ base: 1, md: 1, lg: 2, xl: 3 }} spacing="1em">
					<Box
						p="1em"
						bg={"var(--primary_bg)"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
						fontWeight="bold"
					>
						<Text fontWeight="bold" color={"var(--main_color_black)"} mt="2" mb="1">
							All Categories
						</Text>
						<Box w={{ base: "70%", md: "50%", lg: "70%", xl: "70%" }} mx={"auto"}>
							<Doughnut data={productsChartData} options={doughnutOptions("0%")} />
						</Box>
					</Box>
					<Box
						p="1em"
						bg={"var(--primary_bg)"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
						fontWeight="bold"
					>
						<Flex justify="space-between" align="center" mb="2">
							<Text fontWeight="bold">Inventory</Text>
						</Flex>
						<SimpleGrid columns={2} gap={4}>
							<Box
								p={4}
								border={"2px solid var(--filter_border_color)"}
								borderRadius={"10px"}
								justifyContent="space-evenly"
								display="flex"
								flexDir="column"
							>
								<Text fontSize="xs" fontWeight="bold" color={"var(--nav_color)"}>
									Total SKUs
								</Text>
								<Text mr="3" fontSize={"1.25em"}>
									{productsInfo.length}
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
									Total Products
								</Text>
								<Text mr="3" fontSize={"1.25em"}>
									{totalQuantity}
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
									$ Inventory #Skus
								</Text>
								<Text mr="3" fontSize={"1.25em"}>
									${totalCost}
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
						<SimpleGrid columns={2} gap={4}>
							<Box
								p={4}
								border={"2px solid var(--filter_border_color)"}
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
								display={{ base: "none", xl: "flex" }}
								p={8}
								borderRadius={"10px"}
								justifyContent="space-evenly"
								flexDir="column"
							/>
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
							<Text fontWeight="bold">Products</Text>
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
						<Text fontWeight="bold">Products</Text>
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
						</HStack>
					</Flex>
				)}
				{/* {contacts && ( */}
				<Box overflow="auto" h="350px">
					<Table color={"var(--nav_color)"} bg={"var(--primary_bg)"}>
						<Thead>
							<Tr fontSize="xs">
								<Th fontWeight={"bolder"} p={0}>
									Product ID
								</Th>
								<Th fontWeight={"bolder"} p={0}>
									Name
								</Th>
								<Th fontWeight={"bolder"} p={0}>
									Product Category
								</Th>
								<Th fontWeight={"bolder"} p={0}>
									Price
								</Th>
								<Th p={0}>Cost</Th>
								<Th fontWeight={"bolder"} p={0}>
									Qty on hand
								</Th>
							</Tr>
						</Thead>
						<Tbody color={"var(--nav_color)"}>
							{productsInfo.map(({ _id, name, category, base_price, cost, quantity }, index) => (
								<Tr key={_id}>
									<Td fontSize={"xs"} p={0}>
										{_id}
									</Td>
									<Td fontSize={"xs"} p={0}>
										{name}
									</Td>
									<Td fontSize={"xs"} p={0}>
										{category}
									</Td>
									<Td fontSize={"xs"} p={0}>
										{base_price}
									</Td>
									<Td fontSize={"xs"} p={1}>
										{cost}
									</Td>
									<Td fontSize={"xs"} p={0}>
										{quantity}
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</Box>
				{/* )} */}
			</Box>
		</PageLayout>
	);
};

export default Products;
