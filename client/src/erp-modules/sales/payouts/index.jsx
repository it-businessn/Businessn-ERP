import {
	Box,
	Button,
	Flex,
	HStack,
	Icon,
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
	useDisclosure,
	VStack,
} from "@chakra-ui/react";
import Loader from "components/Loader";
import PrimaryButton from "components/ui/button/PrimaryButton";
import RightIconButton from "components/ui/button/RightIconButton";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import { TIMESHEET_STATUS_LABEL } from "erp-modules/payroll/timesheets/data";
import { COLORS } from "erp-modules/project-management/workview/project/data";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { CiPercent } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { RxDotFilled } from "react-icons/rx";
import { TbCalendarDollar } from "react-icons/tb";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import PayoutService from "services/PayoutService";
import { generateLighterShade, isNotEnrollerOrEmployee } from "utils";
import { formatDate } from "utils/convertDate";
import AddNewSale from "./AddNewSale";

const Payouts = () => {
	const { isMobile } = useBreakpointValue();
	const loggedInUser = LocalStorageService.getItem("user");
	const company = LocalStorageService.getItem("selectedCompany");
	const [payouts, setPayouts] = useState(null);
	const [refresh, setRefresh] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const isManagerRole = isNotEnrollerOrEmployee(loggedInUser.role);

	useEffect(() => {
		const fetchAllPayouts = async () => {
			try {
				const { data } = await PayoutService.getPayouts(company);
				data.map((payout) => {
					payout.statusColor =
						payout.status === TIMESHEET_STATUS_LABEL.APPROVED ? "#6da585" : "#ed6175";
					payout.statusBgColor =
						payout.status === TIMESHEET_STATUS_LABEL.APPROVED
							? generateLighterShade("#6da585", 0.8)
							: generateLighterShade("#ed6175", 0.8);
					return payout;
				});
				setPayouts(
					isManagerRole ? data : data.filter(({ fullName }) => fullName === loggedInUser.fullName),
				);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllPayouts();
	}, [company, refresh]);

	const data = {
		labels: ["January", "February", "March", "April", "May"],
		datasets: [
			{
				label: "First Time Payout",
				data: [10, 20, 30, 40, 50],
				backgroundColor: "rgba(75,192,192,1)",
				borderWidth: 1,
			},
			{
				label: "Recurring Payout",
				data: [20, 30, 10, 5, 25],
				backgroundColor: COLORS.primary,
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

	return (
		<Box p={{ base: "1em", md: "2em" }}>
			<Text fontWeight="bold">Payouts</Text>
			<SimpleGrid columns={{ base: 1, lg: 2 }} spacing="5" my="5">
				<SimpleGrid columns={{ base: 1, md: 2 }} spacing="5">
					<Box
						p="1em"
						bg={"var(--primary_bg)"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
						fontWeight="bold"
						justifyContent="space-between"
						display="flex"
						flexDir={"column"}
					>
						<VStack alignItems="self-start" spacing={5}>
							<Icon as={CiPercent} color="#ed6175" boxSize={10} />
							<Text fontWeight="bold">Total Active Customers</Text>
							<Text mr="3" fontSize={"xl"} fontWeight="900">
								1205
							</Text>
						</VStack>

						<Flex borderTop="var(--highlight_border)">
							<Button bgGradient="var(--highlight_gradient)" bgClip="text" size={"xxs"}>
								See all sales
								<RightIconButton />
							</Button>
						</Flex>
					</Box>
					<Box
						p="1em"
						bg={"var(--primary_bg)"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
						fontWeight="bold"
						justifyContent="space-between"
						display="flex"
						flexDir={"column"}
					>
						<VStack alignItems="self-start" spacing={5}>
							<Icon as={TbCalendarDollar} color="#6da585" boxSize={10} />
							<Text fontWeight="bold">Next Payouts</Text>
							<Text mr="3" fontSize={"xl"} fontWeight="900">
								1205
							</Text>
						</VStack>

						<Flex borderTop="var(--highlight_border)">
							<Button bgGradient="var(--highlight_gradient)" bgClip="text" size={"xxs"}>
								View all payouts
								<RightIconButton />
							</Button>
						</Flex>
					</Box>
				</SimpleGrid>

				<Box
					color={"var(--nav_color)"}
					p="1em"
					bg={"var(--primary_bg)"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
				>
					<Flex justify="space-between" align="center" color={"var(--nav_color)"}>
						<Text fontWeight="bold">Payouts Forecast</Text>
						<Select width="100px" border={"none"} fontSize={"xs"}>
							<option>This week </option>
							<option>This month</option>
						</Select>
					</Flex>
					<Box w={{ base: "90%", md: "80%", xl: "55%" }} mx={"auto"}>
						<Bar data={data} options={options} />
					</Box>
				</Box>
			</SimpleGrid>
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
							<Text fontWeight="bold">All Sales</Text>
						</Flex>
						<HStack spacing="1em" mt="1em">
							{isManagerRole && <PrimaryButton onOpen={onOpen} name={"Add new sale"} size={"xs"} />}
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
						<Text fontWeight="bold">All Sales</Text>
						<Spacer />
						<HStack w={{ lg: "50%" }} spacing={3} justify={"flex-end"}>
							{isManagerRole && <PrimaryButton onOpen={onOpen} name={"Add new sale"} size={"xs"} />}
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
				{!payouts && <Loader />}
				{payouts && (
					<Box overflow="auto" h={"50vh"} css={tabScrollCss}>
						<Table color={"var(--nav_color)"} bg={"var(--primary_bg)"}>
							<Thead>
								<Tr fontSize="xs">
									<Th fontWeight={"bolder"} p={0}>
										Sales ID
									</Th>
									<Th fontWeight={"bolder"}>Date </Th>
									<Th fontWeight={"bolder"}>Amount</Th>
									<Th fontWeight={"bolder"}>Affiliate</Th>
									<Th fontWeight={"bolder"}>Customer Name </Th>
									<Th fontWeight={"bolder"}>Customer Code </Th>
									<Th p={0}>Status</Th>
								</Tr>
							</Thead>
							<Tbody color={"var(--nav_color)"}>
								{payouts?.map((payout) => (
									<Tr key={payout._id}>
										<Td fontSize={"xs"} p={0}>
											{payout.saleId}
										</Td>
										<Td fontSize={"xs"} p={0}>
											{formatDate(payout.createdOn)}
										</Td>
										<Td fontSize={"xs"}>{payout.amount}</Td>
										<Td fontSize={"xs"}>{payout.affiliate}</Td>
										<Td fontSize={"xs"}>{payout.customerName}</Td>
										<Td fontSize={"xs"}>{payout.customerCode}</Td>
										{/* <Td fontSize={"xs"} p={0}>
											<HStack>
												<Button bgGradient="var(--highlight_gradient)" bgClip="text" size={"xxs"}>
													See details
													<RightIconButton />
												</Button>
											</HStack>
										</Td> */}
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
									</Tr>
								))}
							</Tbody>
						</Table>
					</Box>
				)}
				{isOpen && (
					<AddNewSale setIsAdded={setRefresh} isOpen={isOpen} onClose={onClose} company={company} />
				)}
			</Box>
		</Box>
	);
};

export default Payouts;
