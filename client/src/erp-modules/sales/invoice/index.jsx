import { ArrowForwardIcon } from "@chakra-ui/icons";
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
import { activityChartData, doughnutOptions } from "constant";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { useBreakpointValue } from "services/Breakpoint";
import ContactService from "services/ContactService";
import { generateLighterShade } from "utils";
import InvoiceReceipt from "./InvoiceReceipt";

const Invoice = () => {
	const { isMobile } = useBreakpointValue();
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
	const fetchAllInvoices = () => {
		const invoiceData = [
			{
				InvoiceNumber: "INV-001",
				ClientName: "John Doe",
				Amount: 1000.0,
				DueDate: "2024-03-01",
				Status: "Paid",
			},
			{
				InvoiceNumber: "INV-002",
				ClientName: "Jane Smith",
				Amount: 750.5,
				DueDate: "2024-02-28",
				Status: "Unpaid",
			},
			{
				InvoiceNumber: "INV-003",
				ClientName: "Bob Johnson",
				Amount: 1200.75,
				DueDate: "2024-03-10",
				Status: "Unpaid",
			},
		];
		invoiceData.map((invoice) => {
			invoice.statusColor = invoice.Status === "Paid" ? "#6da585" : "#ed6175";
			invoice.statusBgColor =
				invoice.Status === "Paid"
					? generateLighterShade("#6da585", 0.8)
					: generateLighterShade("#ed6175", 0.8);
			return invoice;
		});
		setContacts(invoiceData);
	};
	useEffect(() => {
		fetchAllInvoices();
	}, []);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [currentInvoice, setInvoice] = useState(null);

	const openInvoice = (invoice) => {
		setInvoice((prev) => invoice);
		setIsDrawerOpen(true);
	};

	const closeDrawer = () => {
		setInvoice(null);
		setIsDrawerOpen(false);
	};
	return (
		<Box
			p={{ base: "1em", md: "2em" }}
			h={{ base: "auto", md: "70vh", lg: "auto" }}
			overflow={"auto"}
		>
			<Text fontWeight="bold" mb={"1em"}>
				Invoices
			</Text>
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
					Invoice Categories
				</Text>
				<SimpleGrid columns={{ base: 1, lg: 2 }} spacing="1em">
					<Box
						px="1em"
						bg={"var(--primary_bg)"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
						fontWeight="bold"
					>
						<Text fontWeight="bold" color={"var(--main_color_black)"} mt="2" mb="1">
							Data
						</Text>
						<Box w={{ base: "70%", md: "55%", xl: "40%" }} mx={"auto"}>
							<Doughnut data={activityChartData} options={doughnutOptions("50%")} />
						</Box>
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
							<Text fontWeight="bold">Invoices</Text>
							<Button
								bg="var(--primary_button_bg)"
								size="xs"
								color={"var(--primary_bg)"}
								variant={"solid"}
								_hover={{ color: "var(--main_color_black)" }}
								borderRadius={"10px"}
							>
								Add new invoices
							</Button>
						</Flex>
						<HStack spacing="1em" mt="1em">
							<Button
								color={"var(--nav_color)"}
								leftIcon={<MdOutlineFilterList />}
								border={"2px solid var(--filter_border_color)"}
								borderRadius={"10px"}
								variant={"ghost"}
								_hover={{ color: "var(--main_color_black)", bg: "transparent" }}
							>
								Filter
							</Button>
							<InputGroup
								borderRadius={"10px"}
								border={"1px solid var(--filter_border_color)"}
								fontSize="sm"
								fontWeight="bold"
							>
								<InputLeftElement children={<FaSearch />} />
								<Input
									_placeholder={{
										color: "var(--nav_color)",
										fontSize: "sm",
									}}
									color={"var(--nav_color)"}
									bg={"var(--primary_bg)"}
									type="text"
									placeholder="Search here"
									pr="4.5rem"
								/>
							</InputGroup>
						</HStack>
					</Flex>
				) : (
					<Flex>
						<Text fontWeight="bold">Invoices</Text>
						<Spacer />
						<HStack w={{ lg: "50%" }} spacing={3} justify={"flex-end"}>
							<Button
								color={"var(--nav_color)"}
								size="xs"
								leftIcon={<MdOutlineFilterList />}
								border={"2px solid var(--filter_border_color)"}
								borderRadius={"10px"}
								variant={"ghost"}
								_hover={{ color: "var(--main_color_black)", bg: "transparent" }}
								ml={2}
							>
								Filter
							</Button>
							<InputGroup
								size="xs"
								w={"40%"}
								borderRadius={"10px"}
								border={"1px solid var(--filter_border_color)"}
								fontSize="xs"
								fontWeight="bold"
							>
								<InputLeftElement size="xs" children={<FaSearch />} />
								<Input
									size="xs"
									_placeholder={{
										color: "var(--nav_color)",
										fontSize: "sm",
									}}
									color={"var(--nav_color)"}
									bg={"var(--primary_bg)"}
									type="text"
									placeholder="Search here"
									pr="4.5rem"
									py={"1.1em"}
								/>
							</InputGroup>
							<Button
								bg="var(--primary_button_bg)"
								size="xs"
								color={"var(--primary_bg)"}
								variant={"solid"}
								_hover={{ color: "var(--main_color_black)" }}
								borderRadius={"10px"}
								px={"2em"}
							>
								Add new invoices
							</Button>
						</HStack>
					</Flex>
				)}
				{contacts && (
					<Box overflow="auto" h={"50vh"}>
						<Table color={"var(--nav_color)"} bg={"var(--primary_bg)"}>
							<Thead>
								<Tr>
									<Th fontWeight={"bolder"} p={0}>
										Invoice number
									</Th>
									<Th fontWeight={"bolder"}>Client name </Th>
									<Th fontWeight={"bolder"}>Amount</Th>
									<Th fontWeight={"bolder"}>Due date</Th>
									<Th>Status</Th>
									<Th></Th>
								</Tr>
							</Thead>
							<Tbody color={"var(--nav_color)"}>
								{contacts.map((invoice, index) => (
									<Tr key={invoice.InvoiceNumber}>
										<Td fontSize={"xs"} p={0}>
											{`#${invoice.InvoiceNumber}`}
										</Td>
										<Td fontSize={"xs"}>{invoice.ClientName}</Td>
										<Td fontSize={"xs"}>{invoice.Amount}</Td>
										<Td fontSize={"xs"}>{invoice.DueDate}</Td>
										<Td fontSize={"xs"}>
											<Flex align="center">
												<HStack
													bg={invoice.statusBgColor}
													color={invoice.statusColor}
													px={2}
													borderRadius={"10px"}
												>
													<Text>{invoice.Status}</Text>
												</HStack>
											</Flex>
										</Td>
										<Td fontSize={"xs"}>
											<Button
												onClick={() => openInvoice(invoice)}
												bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
												bgClip="text"
												size={"xxs"}
												rightIcon={
													<ArrowForwardIcon
														color="purple.500"
														bg={"#dedaf4"}
														borderRadius="full"
														w={"1.5em"}
														h={"1.5em"}
														p={"3px"}
														_hover={{
															bg: "#8385d5",
															color: "var(--main_color)",
														}}
													/>
												}
												variant="link"
											>
												See details
											</Button>
										</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</Box>
				)}
			</Box>
			<InvoiceReceipt
				isMobileView={isMobile}
				invoice={currentInvoice}
				isOpen={isDrawerOpen}
				onClose={closeDrawer}
			/>
		</Box>
	);
};

export default Invoice;
