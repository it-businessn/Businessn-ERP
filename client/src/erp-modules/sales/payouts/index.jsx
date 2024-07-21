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
import PrimaryButton from "components/ui/button/PrimaryButton";

import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import PayoutService from "services/PayoutService";
import { formatDate, isManager } from "utils";
import AddNewSale from "./AddNewSale";

const Payouts = () => {
	const loggedInUser = LocalStorageService.getItem("user");
	const { isMobile } = useBreakpointValue();
	const [payouts, setPayouts] = useState(null);
	const [isAdded, setIsAdded] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const isManagerUser = isManager(loggedInUser.role);

	const company = LocalStorageService.getItem("selectedCompany");
	useEffect(() => {
		const fetchAllPayouts = async () => {
			try {
				const response = await PayoutService.getPayouts(company);

				setPayouts(
					isManagerUser
						? response.data
						: response.data.filter((_) => _.fullName === loggedInUser.fullName),
				);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllPayouts();
	}, [company, isAdded]);

	return (
		<PageLayout title={"Payouts"} showBgLayer>
			{isMobile ? (
				<Flex flexDir="column">
					<Flex justify="space-between">
						<Text fontWeight="bold">All Sales</Text>
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
					<Text fontWeight="bold">All Sales</Text>
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

			{payouts && (
				<Box overflow="auto" h={"50vh"}>
					<Table color={"var(--nav_color)"} bg={"var(--primary_bg)"}>
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
						<Tbody color={"var(--nav_color)"}>
							{payouts?.map((payout) => (
								<Tr key={payout._id}>
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
		</PageLayout>
	);
};

export default Payouts;
