import { AttachmentIcon } from "@chakra-ui/icons";
import {
	Badge,
	Box,
	Flex,
	HStack,
	IconButton,
	Select,
	Table,
	Tbody,
	Td,
	Thead,
	Tooltip,
	Tr,
	useToast,
} from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import SortableTh from "components/ui/table/SortableTh";
import TextTitle from "components/ui/text/TextTitle";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import { MY_TICKETS_FILTER, SUPPORT_CATEGORY, ticketPersonName } from "constant";
import ActionAll from "erp-modules/payroll/timesheets/ActionAll";
import { TICKET_ACTION_STATUS } from "erp-modules/payroll/timesheets/data";
import useDepartment from "hooks/useDepartment";
import useSortableData from "hooks/useSortableData";
import { useEffect, useRef, useState } from "react";
import { CgNotes } from "react-icons/cg";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import TicketService from "services/TicketService";
import { longTimeFormat } from "utils/convertDate";
import CategoryFilter from "./CategoryFilter";
import NewTicket from "./NewTicket";
import NoteDetails from "./NoteDetails";

// TABLE-SORT: sort by what the cells show (originator falls back to the customer / lead)
const sortByOriginator = (ticket) => ticketPersonName(ticket);

const OpenTicket = ({ company, setShowAddEntry, showAddEntry, userId, employees }) => {
	const TICKET_TABLE_COLS = [
		{ name: "Ticket Number", key: "ticketNumber" },
		{ name: "Category", key: "category" },
		{ name: "Priority", key: "priority" },
		{ name: "Assignee", key: "assignee" },
		{ name: "Originator", key: sortByOriginator },
		{ name: "Topic", key: "topic" },
		{ name: "Description", key: "issue" },
		{ name: "Ticket Opened", key: "createdOn" },
		{ name: "Days Open", key: "ticketDaysOpened" },
		{ name: "Status", key: "" },
		// BUG-TKT-01: open tickets had no way to change their status (handleUpdate
		// was never called); same status menu as the Closed tab
		{ name: "Action", key: "" },
	];
	const [ticketData, setTicketData] = useState(null);
	const { sortedItems, sortConfig, requestSort } = useSortableData(ticketData);
	const [refresh, setRefresh] = useState(false);
	const [openNote, setOpenNote] = useState(false);
	const [rowData, setRowData] = useState(null);
	// TICKET-DETAILS: the details window gets the whole ticket (it only got the description)
	const openDetails = (id) => {
		setRowData(ticketData?.find((ticket) => ticket._id === id) || null);
		setOpenNote(true);
	};
	const [ticketsCount, setTicketsCount] = useState(null);
	const [presentTitle, setPresentTitle] = useState({
		title: "Present",
		color: "var(--primary_bg)",
	});
	const [filterName, setFilterName] = useState(null);
	const scrollRef = useRef(null);
	const [isScrolling, setIsScrolling] = useState(false);
	const depts = useDepartment(company);

	useEffect(() => {
		const fetchAllTickets = async () => {
			try {
				const { data } = await TicketService.getOpenTicket(userId, company);
				data?.map((_) => {
					_.bg = TICKET_ACTION_STATUS.find(({ name }) => name === _.status)?.color;
					return _;
				});
				setTicketData(data);
			} catch (error) {
				console.error(error);
				setTicketData([]);
			}
		};
		const fetchAggregateTickets = async () => {
			try {
				const { data } = await TicketService.getAggregateTicketCount(userId, company);
				setTicketsCount(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllTickets();
		fetchAggregateTickets();
	}, [refresh]);

	const toast = useToast();

	const handleUpdate = async (action, id) => {
		try {
			const { data } = await TicketService.updateInfo({ status: action }, id);
			if (data) {
				toast({
					title: "Action updated successfully.",
					status: "success",
					duration: 1500,
					isClosable: true,
				});
				setRefresh((prev) => !prev);
			}
		} catch (error) {
			toast({
				title: "Could not update the ticket.",
				description: error?.response?.data?.message || "Please try again.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};

	// SUPPORT-QUEUE: Support tickets (public support / contact forms) can be reassigned
	const handleReassign = async (id, assignee) => {
		if (!assignee) return;
		try {
			await TicketService.updateInfo({ assignee }, id);
			toast({ title: `Ticket assigned to ${assignee}.`, status: "success", duration: 2000, isClosable: true });
			setRefresh((prev) => !prev);
		} catch (error) {
			toast({
				title: "Could not reassign the ticket.",
				description: error?.response?.data?.message || "Please try again.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};

	const handleFilter = async (name) => {
		try {
			const { data } = await TicketService.filterTicket(userId, company, name);
			data?.tickets?.map((_) => {
				_.bg = TICKET_ACTION_STATUS.find(({ name }) => name === _.status)?.color;
				return _;
			});
			setFilterName(data?.category);
			setTicketData(data?.tickets);
		} catch (error) {
			console.error(error);
		}
	};

	const filterTicket = (name) => {
		handleFilter(name);
	};

	const scrollRight = () => {
		if (scrollRef.current) {
			scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
			setIsScrolling(true);
		}
	};

	const scrollLeft = () => {
		if (scrollRef.current) {
			scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
		}
	};

	return (
		<>
			{ticketsCount && (
				<HStack justifyContent="space-between">
					{isScrolling && (
						<IconButton
							minW="auto"
							background="transparent"
							color="var(--nav_color)"
							icon={<SlArrowLeft fontSize="2em" />}
							aria-label="Scroll left"
							position="absolute"
							left={0}
							top="30%"
							transform="translateY(-50%)"
							onClick={scrollLeft}
							zIndex={1}
						/>
					)}
					<HStack
						m="0 1em 1em 1em"
						spacing={3}
						ref={scrollRef}
						overflowX="auto"
						css={{
							"&::-webkit-scrollbar": { display: "none" },
							"-ms-overflow-style": "none",
							"scrollbar-width": "none",
						}}
					>
						<CategoryFilter
							index={0}
							name={MY_TICKETS_FILTER}
							isMyChannel
							data={ticketsCount?.myTicketsCount}
							filterTicket={filterTicket}
							presentTitle={presentTitle}
							setPresentTitle={setPresentTitle}
							filterName={filterName}
						/>
						{depts?.map(({ name, _id }, index) => (
							<CategoryFilter
								index={index + 1}
								key={_id}
								name={name}
								data={ticketsCount?.openTicketsByCategory.find(({ _id }) => _id === name)}
								filterTicket={filterTicket}
								presentTitle={presentTitle}
								setPresentTitle={setPresentTitle}
								filterName={filterName}
							/>
						))}
					</HStack>
					<IconButton
						minW="auto"
						color="var(--nav_color)"
						background="transparent"
						icon={<SlArrowRight fontSize="2em" />}
						aria-label="Scroll right"
						position="absolute"
						right={0}
						top="30%"
						transform="translateY(-50%)"
						onClick={scrollRight}
						zIndex={1}
					/>
				</HStack>
			)}
			<Box overflow="auto" className="ticket_container" css={tabScrollCss}>
				<Table variant="simple" size="sm">
					<Thead position={"sticky"} zIndex={3} top={-1} bg="var(--primary_bg)">
						<Tr>
							{TICKET_TABLE_COLS?.map((col) => (
								<SortableTh
									sortKey={col.key}
									sortConfig={sortConfig}
									onSort={requestSort}
									pl={["Category", "Topic", "Description"]?.includes(col.name) && 0}
									key={col.name}
									py={3}
									borderBottom="2px solid"
									borderColor="var(--filter_border_color)"
								>
									<TextTitle width="auto" title={col.name} />
								</SortableTh>
							))}
						</Tr>
					</Thead>
					<Tbody>
						{(!ticketData || ticketData?.length === 0) && (
							<EmptyRowRecord data={ticketData} colSpan={TICKET_TABLE_COLS.length} />
						)}
						{sortedItems?.map(
							({
								ticketNumber,
								category,
								assignee,
								priority,
								topic,
								issue,
								status,
								ticketDaysOpened,
								createdOn,
								originator,
								file,
								originalname,
								_id,
								bg,
								clientFirstName,
								clientLastName,
								leadId,
							}) => {
								const isSupport = category === SUPPORT_CATEGORY;
								// support-form and lead tickets have no originator: show the customer / lead
								const originatorName = ticketPersonName({ originator, clientFirstName, clientLastName, leadId });
								return (
									<Tr
										key={_id}
										_hover={{ bg: "var(--phoneCall_bg_light)" }}
										borderBottom="1px solid"
										borderColor="var(--filter_border_color)"
									>
										<Td py={3}>
											<Box
												as="button"
												onClick={() => openDetails(_id)}
												textAlign="left"
												color="var(--banner_bg)"
												_hover={{ textDecor: "underline" }}
												title="Open ticket details"
											>
												<TextTitle title={ticketNumber} />
											</Box>
										</Td>
										<Td py={3} px={2}>
											<TextTitle title={category} />
										</Td>
										<Td py={3}>
											<Badge
												colorScheme={
													(priority?.toString()?.toLowerCase() || "") === "high"
														? "red"
														: (priority?.toString()?.toLowerCase() || "") === "medium"
														? "orange"
														: "green"
												}
												variant="subtle"
												px={2}
												py={1}
												borderRadius="md"
											>
												{priority || "Low"}
											</Badge>
										</Td>
										<Td py={3}>
											{isSupport && employees?.length ? (
												<Select
													size="sm"
													minW="150px"
													borderRadius="var(--radius)"
													value={assignee || ""}
													placeholder="Unassigned"
													onChange={(e) => handleReassign(_id, e.target.value)}
												>
													{assignee && !employees.some((emp) => emp?.fullName === assignee) && (
														<option value={assignee}>{assignee}</option>
													)}
													{employees.map((emp) => (
														<option key={emp?._id || emp?.fullName} value={emp?.fullName}>
															{emp?.fullName}
														</option>
													))}
												</Select>
											) : (
												<NormalTextTitle size="sm" title={assignee || "Unassigned"} />
											)}
										</Td>
										<Td py={3}>
											<NormalTextTitle size="sm" title={originatorName} />
										</Td>
										<Td py={3} px={2}>
											<NormalTextTitle whiteSpace="nowrap" size="sm" title={topic} />
										</Td>
										<Td py={3} maxW="150px" px={2}>
											<Tooltip label={issue}>
												<HStack spacing={1}>
													<NormalTextTitle maxW="150px" size="sm" title={issue} />
													<Flex
														cursor="pointer"
														gap={1}
														onClick={() => {
															openDetails(_id);
														}}
													>
														<CgNotes size="12px" />
														{file && <AttachmentIcon />}
													</Flex>
												</HStack>
											</Tooltip>
										</Td>
										<Td py={3}>
											<NormalTextTitle size="sm" title={longTimeFormat(createdOn)} />
										</Td>
										<Td py={3}>
											<NormalTextTitle size="sm" title={ticketDaysOpened} />
										</Td>
										<Td py={3}>
											<Badge
												bg={bg}
												color="white"
												px={3}
												py={1}
												borderRadius="md"
												fontWeight="medium"
											>
												{status}
											</Badge>
										</Td>
										<Td py={3}>
											<ActionAll
												id={_id}
												w="108px"
												isRowAction
												status={status}
												handleButtonClick={(action) => handleUpdate(action, _id)}
												actions={TICKET_ACTION_STATUS}
											/>
										</Td>
									</Tr>
								);
							},
						)}
					</Tbody>
				</Table>
			</Box>
			{showAddEntry && (
				<NewTicket
					company={company}
					showAddEntry={showAddEntry}
					setRefresh={setRefresh}
					setShowAddEntry={setShowAddEntry}
					userId={userId}
					employees={employees}
					depts={depts}
				/>
			)}
			{openNote && <NoteDetails isOpen={openNote} setIsOpen={setOpenNote} data={rowData} />}
		</>
	);
};

export default OpenTicket;
