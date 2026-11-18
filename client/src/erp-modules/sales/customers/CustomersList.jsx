import {
	Box,
	Flex,
	HStack,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	Spacer,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useDisclosure,
} from "@chakra-ui/react";
import HighlightButton from "components/ui/button/HighlightButton";
import LeftIconButton from "components/ui/button/LeftIconButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import SortableTh from "components/ui/table/SortableTh";
import TextTitle from "components/ui/text/TextTitle";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import useManager from "hooks/useManager";
import useSalesAgentData from "hooks/useSalesAgentData";
import useSortableData from "hooks/useSortableData";
import PageLayout from "layouts/PageLayout";
import { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { useBreakpointValue } from "services/Breakpoint";
import ContactService from "services/ContactService";
import LeadsService from "services/LeadsService";
import { generateLighterShade, isNotEnrollerOrEmployee } from "utils";
import SearchFilter from "../lead docket/SearchFilter";
import AddNewOpportunity from "../opportunities/AddNewOpportunity";

const CustomersList = ({ user, handleProfileView, icons, company }) => {
	const [contacts, setContacts] = useState(false);
	// BUG-SEARCH-01: searching filtered the loaded list itself, so rows removed by a
	// search never came back (deleting letters or clearing the box). The search
	// is now a filter on top of the loaded list.
	const [search, setSearch] = useState("");
	const shownContacts = useMemo(() => {
		const term = search.trim().toLowerCase();
		if (!Array.isArray(contacts) || !term) return contacts;
		return contacts.filter(
			(acc) =>
				acc?.leadId?.opportunityName?.toLowerCase().includes(term) ||
				acc?.leadId?.name?.toLowerCase().includes(term),
		);
	}, [contacts, search]);
	const { sortedItems, sortConfig, requestSort } = useSortableData(shownContacts);
	const { isMobile } = useBreakpointValue();
	const [isAdded, setIsAdded] = useState(false);

	const [refresh, setRefresh] = useState(false);
	const assignees = useSalesAgentData(company, false, true);
	const managers = useManager(company);
	const [companies, setCompanies] = useState(null);

	useEffect(() => {
		const fetchAllCompanies = async () => {
			try {
				const { data } = await LeadsService.getLeadCompanies(company);
				setCompanies(data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchAllCompanies();
	}, [refresh]);

	const handleInputChange = (value) => setSearch(value || "");
	const handleEdit = (id) => {
		console.log(id);
	};

	const { isOpen, onOpen, onClose } = useDisclosure();
	const isManagerRole = isNotEnrollerOrEmployee(user?.role);

	const fetchAllContacts = async () => {
		try {
			const { data } = await ContactService.getOnboardedContacts(company);

			setContacts(
				isManagerRole
					? data
					: data?.filter((lead) => lead.leadId.primaryAssignee[0]?.name === user.fullName),
			);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllContacts();
	}, [isAdded]);

	return (
		<PageLayout width="full" title={"Customers"} showBgLayer>
			{isMobile ? (
				<Flex flexDir="column">
					<Flex justify="space-between">
						<TextTitle title="Customers" mb={"0.5em"} />
						{/* <PrimaryButton name={"Add new customer"} size={"xs"} /> */}
					</Flex>
					<HStack spacing="1em" mt="1em">
						<SearchFilter />
					</HStack>
				</Flex>
			) : (
				<Flex>
					<TextTitle title="Customers" />
					<Spacer />
					<HStack w={{ lg: "50%" }} spacing={3} justify={"flex-end"}>
						<LeftIconButton
							color={"var(--nav_color)"}
							border={"2px solid var(--filter_border_color)"}
							name={"Filter"}
							borderRadius={"10px"}
							variant={"ghost"}
							isFilter
							size="xs"
							ml={2}
							// handleClick={() => setShowEditDetails(true)}
							icon={<MdOutlineFilterList />}
						/>
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
									fontSize: "xs",
								}}
								color={"var(--nav_color)"}
								bg={"var(--primary_bg)"}
								type="text"
								placeholder="Search here"
								pr="4.5rem"
								py={"1.1em"}
								onChange={(e) => handleInputChange(e.target.value)}
							/>
						</InputGroup>
						<PrimaryButton onOpen={() => onOpen()} name={"Add new customer"} size={"xs"} />
					</HStack>
				</Flex>
			)}
			{contacts && (
				<Box overflow="auto" css={tabScrollCss}>
					<Table color={"var(--nav_color)"} bg={"var(--primary_bg)"}>
						<Thead>
							<Tr>
								<SortableTh
									sortKey="leadId.opportunityName"
									sortConfig={sortConfig}
									onSort={requestSort}
									fontWeight={"bolder"}
									p={0}
								>
									Customer name
								</SortableTh>
								<SortableTh
									sortKey="leadId.name"
									sortConfig={sortConfig}
									onSort={requestSort}
									fontWeight={"bolder"}
								>
									Company{" "}
								</SortableTh>
								<SortableTh
									sortKey="leadId.email"
									sortConfig={sortConfig}
									onSort={requestSort}
									fontWeight={"bolder"}
								>
									Email
								</SortableTh>
								<Th fontWeight={"bolder"}>Communication History</Th>
								<Th></Th>
								{/* <Th></Th> */}
							</Tr>
						</Thead>
						<Tbody color={"var(--nav_color)"}>
							{shownContacts.length === 0 && <EmptyRowRecord data={shownContacts} colSpan={5} />}
							{sortedItems.map(({ _id, leadId, meetings, notes }) => (
								<Tr key={_id}>
									<Td fontSize={"xs"} p={0} textTransform={"capitalize"}>
										{leadId.opportunityName}
									</Td>
									<Td fontSize={"xs"} textTransform={"capitalize"}>
										{leadId.name}
									</Td>
									<Td fontSize={"xs"}>{leadId.email}</Td>
									<Td fontSize={"xs"}>
										<Flex align="center">
											<HStack
												// bg={generateLighterShade("#5e51c5", 0.8)}
												// color={"#5e51c5"}
												p={2}
												w={"30%"}
												onClick={() => {
													handleProfileView(_id);
												}}
												justify={"space-around"}
											>
												{icons.map(({ icon, label }) => (
													<IconButton
														key={label}
														icon={icon}
														bg={generateLighterShade("#537eee", 0.8)}
														borderRadius="50%"
														size={"xxs"}
														color={"var(--primary_button_bg)"}
														_hover={{
															bg: "transparent",
															color: "var(--main_color_black)",
														}}
													/>
												))}
												{/* <NormalTextTitle
													title={
														meetings.length === 0
															? "No history"
															: meetings.length
													}
												/> */}
											</HStack>
										</Flex>
									</Td>
									<Td fontSize={"xs"}>
										<HStack>
											<HighlightButton
												name={"See full profile"}
												onClick={() => {
													handleProfileView(_id);
												}}
											/>
											{/* <LinkButton name="Onboard" onClick={handleClick} /> */}
										</HStack>
									</Td>
									{/* <Td>
											<IconButton
												icon={<RiMore2Fill />}
												size="sm"
												variant="ghost"
												onClick={() => handleEdit(_id)}
											/>
										</Td> */}
								</Tr>
							))}
						</Tbody>
					</Table>
				</Box>
			)}
			{isOpen && (
				<AddNewOpportunity
					setIsAdded={setIsAdded}
					isOpen={isOpen}
					onClose={() => onClose()}
					company={company}
					assignees={assignees}
					managers={managers}
					companies={companies}
					setRefresh={setRefresh}
				/>
			)}
		</PageLayout>
	);
};

export default CustomersList;
