import {
	Box,
	Button,
	Flex,
	HStack,
	Input,
	InputGroup,
	InputLeftElement,
	Spacer,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useDisclosure,
} from "@chakra-ui/react";
import Loader from "components/Loader";
import PrimaryButton from "components/ui/button/PrimaryButton";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import PayoutService from "services/PayoutService";
import { formatDate, isManager } from "utils";
import AddNewSale from "./AddNewSale";

const Payouts = () => {
	const { isMobile } = useBreakpointValue();
	const [payouts, setPayouts] = useState(null);
	const user = LocalStorageService.getItem("user");
	const [company, setCompany] = useState(
		LocalStorageService.getItem("selectedCompany"),
	);
	const [isAdded, setIsAdded] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const isManagerUser = isManager(user.role);
	useEffect(() => {
		const handleSelectedCompanyChange = (event) => setCompany(event.detail);

		document.addEventListener(
			"selectedCompanyChanged",
			handleSelectedCompanyChange,
		);

		return () => {
			document.removeEventListener(
				"selectedCompanyChanged",
				handleSelectedCompanyChange,
			);
		};
	}, []);

	useEffect(() => {
		const fetchAllPayouts = async () => {
			try {
				const response = await PayoutService.getPayouts(company);

				setPayouts(
					isManagerUser
						? response.data
						: response.data.filter((_) => _.fullName === user.fullName),
				);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllPayouts();
	}, [company, isAdded]);

	return (
		<Box p={{ base: "1em", md: "2em" }}>
			<Text fontWeight="bold">Payouts</Text>
			<Box
				p="1em"
				bg={"brand.primary_bg"}
				border="2px solid var(--main_color)"
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
						<Text fontWeight="bold">All Sales</Text>
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
							{isManagerUser && (
								<PrimaryButton
									onOpen={onOpen}
									name={"Add new sale"}
									size={"xs"}
								/>
							)}
						</HStack>
					</Flex>
				)}
				{isOpen && (
					<AddNewSale
						setIsAdded={setIsAdded}
						isOpen={isOpen}
						onClose={onClose}
						company={company}
					/>
				)}
				{!payouts && <Loader />}

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
								</Tr>
							</Thead>
							<Tbody color={"brand.nav_color"}>
								{payouts?.map((payout) => (
									<Tr key={payout.salesId}>
										<Td fontSize={"xs"} p={0}>
											{payout.saleId}
										</Td>
										<Td fontSize={"xs"}>{formatDate(payout.createdOn)}</Td>
										<Td fontSize={"xs"}>{payout.amount}</Td>
										<Td fontSize={"xs"}>{payout.fullName}</Td>
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
