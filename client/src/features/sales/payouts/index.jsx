import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Flex,
	HStack,
	Icon,
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
	VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { CiPercent } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { RxDotFilled } from "react-icons/rx";
import { TbCalendarDollar } from "react-icons/tb";
import * as api from "services";
import { useBreakpointValue } from "services/Breakpoint";
import { generateLighterShade } from "utils";

const Payouts = () => {
	const { isMobile } = useBreakpointValue();

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
	const payouts = [
		{
			salesId: "12345",
			date: "2024-02-20",
			amount: "$5000",
			salesPerson: "John Doe",
			status: "Approved",
		},
		{
			salesId: "67890",
			date: "2024-02-21",
			amount: "$7500",
			salesPerson: "Jane Smith",
			status: "Pending",
		},
		{
			salesId: "13579",
			date: "2024-02-22",
			amount: "$6000",
			salesPerson: "Bob Johnson",
			status: "In Progress",
		},
		{
			salesId: "24680",
			date: "2024-02-23",
			amount: "$8000",
			salesPerson: "Alice Williams",
			status: "Approved",
		},
		{
			salesId: "98765",
			date: "2024-02-24",
			amount: "$7000",
			salesPerson: "Charlie Brown",
			status: "Pending",
		},
	];
	payouts.map((payout) => {
		payout.statusColor = payout.status === "Approved" ? "#6da585" : "#ed6175";
		payout.statusBgColor =
			payout.status === "Approved"
				? generateLighterShade("#6da585", 0.8)
				: generateLighterShade("#ed6175", 0.8);
		return payout;
	});
	const data = {
		labels: ["January", "February", "March", "April", "May"],
		datasets: [
			{
				label: "Dataset 1",
				data: [10, 20, 30, 40, 50],
				backgroundColor: "rgba(75,192,192,1)",
				borderWidth: 1,
			},
			{
				label: "Dataset 2",
				data: [20, 30, 10, 5, 25],
				backgroundColor: "#537eee",
				borderWidth: 1,
			},
		],
	};
	let delayed;
	const options = {
		animation: {
			onComplete: () => {
				delayed = true;
			},
			delay: (context) => {
				let delay = 0;
				if (context.type === "data" && context.mode === "default" && !delayed) {
					delay = context.dataIndex * 300 + context.datasetIndex * 100;
				}
				return delay;
			},
		},
		scales: {
			x: {
				stacked: true,
			},
			y: {
				stacked: true,
			},
		},
	};

	useEffect(() => {
		fetchAllContacts();
	}, []);

	return (
		<Box p={{ base: "1em", md: "2em" }}>
			<Text fontWeight="bold">Payouts</Text>
			<SimpleGrid columns={{ base: 1, lg: 2 }} spacing="5" my="5">
				<SimpleGrid columns={{ base: 1, md: 2 }} spacing="5">
					<Box
						p="1em"
						bg={"brand.primary_bg"}
						border="3px solid white"
						borderRadius="10px"
						fontWeight="bold"
						justifyContent="space-between"
						display="flex"
						flexDir={"column"}
					>
						<VStack alignItems="self-start" spacing={5}>
							<Icon as={CiPercent} color="#ed6175" boxSize={10} />
							<Text fontWeight="bold">Pending Sales</Text>
							<Text mr="3" fontSize={"xl"} fontWeight="900">
								1205
							</Text>
						</VStack>

						<Flex borderTop="2px solid #e8ebf4">
							<Button
								bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
								bgClip="text"
								size={"xxs"}
								rightIcon={
									<IconButton
										icon={<ArrowForwardIcon />}
										color="purple.500"
										p={"0.4em"}
										size={"xxs"}
										_hover={{ bg: "#8385d5", color: "brand.100" }}
									/>
								}
							>
								See all sales
							</Button>
						</Flex>
					</Box>
					<Box
						p="1em"
						bg={"brand.primary_bg"}
						border="3px solid white"
						borderRadius="10px"
						fontWeight="bold"
						justifyContent="space-between"
						display="flex"
						flexDir={"column"}
					>
						<VStack alignItems="self-start" spacing={5}>
							<Icon as={TbCalendarDollar} color="#6da585" boxSize={10} />
							<Text fontWeight="bold">Upcoming Payrolls</Text>
							<Text mr="3" fontSize={"xl"} fontWeight="900">
								1205
							</Text>
						</VStack>

						<Flex borderTop="2px solid #e8ebf4">
							<Button
								bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
								bgClip="text"
								size={"xxs"}
								rightIcon={
									<IconButton
										icon={<ArrowForwardIcon />}
										color="purple.500"
										p={"0.4em"}
										size={"xxs"}
										_hover={{ bg: "#8385d5", color: "brand.100" }}
									/>
								}
							>
								Pay all payrolls
							</Button>
						</Flex>
					</Box>
				</SimpleGrid>

				<Box
					color={"brand.nav_color"}
					p="1em"
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
						<Text fontWeight="bold">Key Metrics of Sales</Text>
						<Select width="100px" border={"none"} fontSize={"xs"}>
							<option>This week </option>
							<option>This week Month</option>
						</Select>
					</Flex>
					<Box w={{ base: "90%", md: "80%", xl: "55%" }} mx={"auto"}>
						<Bar data={data} options={options} />
					</Box>
				</Box>
			</SimpleGrid>
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
							<Text fontWeight="bold">All Sales</Text>
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
						<Text fontWeight="bold">All Sales</Text>
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
						</HStack>
					</Flex>
				)}

				{/* {!contacts && <Loader />} */}
				{payouts && (
					<Box overflow="auto" h={"50vh"}>
						<Table color={"brand.nav_color"} bg={"brand.primary_bg"}>
							<Thead>
								<Tr fontSize="xs">
									<Th fontWeight={"bolder"} p={0}>
										Sales ID
									</Th>
									<Th fontWeight={"bolder"}>Date </Th>
									<Th fontWeight={"bolder"}>Amount</Th>
									<Th fontWeight={"bolder"}>Sales Person </Th>
									<Th p={0}>Status</Th>
									<Th p={0}></Th>
								</Tr>
							</Thead>
							<Tbody color={"brand.nav_color"}>
								{payouts.map((payout) => (
									<Tr key={payout.salesId}>
										<Td fontSize={"xs"} p={0}>
											{payout.salesId}
										</Td>
										<Td fontSize={"xs"}>{payout.date}</Td>
										<Td fontSize={"xs"}>{payout.amount}</Td>
										<Td fontSize={"xs"}>{payout.salesPerson}</Td>
										<Td fontSize={"xs"} pl={0}>
											<Flex align="center">
												<HStack
													bg={payout.statusBgColor}
													color={payout.statusColor}
													px={2}
													spacing={0}
													borderRadius={"10px"}
												>
													<RxDotFilled />
													<Text>{payout.status}</Text>
												</HStack>
											</Flex>
										</Td>
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
		</Box>
	);
};

export default Payouts;
