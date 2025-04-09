import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
	Box,
	HStack,
	IconButton,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tooltip,
	Tr,
	useToast,
} from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { TICKET_ACTION_STATUS } from "erp-modules/payroll/timesheets/data";
import useDepartment from "hooks/useDepartment";
import { useEffect, useRef, useState } from "react";
import { CgNotes } from "react-icons/cg";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import TicketService from "services/TicketService";
import { longTimeFormat } from "utils/convertDate";
import CategoryFilter from "./CategoryFilter";
import NewTicket from "./NewTicket";
import NoteDetails from "./NoteDetails";
import StatusCol from "./StatusCol";

const OpenTicket = ({ company, setShowAddEntry, showAddEntry, userId, employees }) => {
	const TICKET_TABLE_COLS = [
		{ name: "Ticket Number", key: "ticketNumber" },
		{ name: "Category", key: "category" },
		{ name: "Priority", key: "priority" },
		{ name: "Assignee", key: "assignee" },
		{ name: "Originator", key: "originator" },
		{ name: "Topic", key: "topic" },
		{ name: "Description", key: "issue" },
		{ name: "Ticket Opened", key: "createdOn" },
		{ name: "Days Open", key: "ticketDaysOpened" },
		{ name: "Status", key: "" },
	];
	const [ticketData, setTicketData] = useState([]);
	const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
	const [refresh, setRefresh] = useState(false);
	const [openNote, setOpenNote] = useState(false);
	const [rowData, setRowData] = useState(null);
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

	const sortedData = [...ticketData].sort((a, b) => {
		if (!sortConfig.key) return 0;
		const aVal = a[sortConfig.key];
		const bVal = b[sortConfig.key];

		if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
		if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
		return 0;
	});

	const requestSort = (key) => {
		let direction = "asc";
		if (!key) return;
		if (sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}
		setSortConfig({ key, direction });
	};

	const getSortIcon = (key) => {
		if (sortConfig.key !== key) return null;
		return sortConfig.direction === "asc" ? <TriangleUpIcon ml={2} /> : <TriangleDownIcon ml={2} />;
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
							name="My"
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
			<Box overflow="auto" height="calc(100vh - 475px)">
				<Table variant="simple">
					<Thead position={"sticky"} zIndex={3} top={-1}>
						<Tr>
							{TICKET_TABLE_COLS?.map((col) => (
								<Th
									pl={["Category", "Topic", "Description"]?.includes(col.name) && 0}
									key={col.name}
									onClick={() => requestSort(col.key)}
									cursor="pointer"
								>
									<HStack spacing={0}>
										<TextTitle width="auto" title={col.name} />
										{getSortIcon(col.key)}
									</HStack>
								</Th>
							))}
						</Tr>
					</Thead>
					<Tbody>
						{(!ticketData || ticketData?.length === 0) && (
							<EmptyRowRecord data={ticketData} colSpan={TICKET_TABLE_COLS.length} />
						)}
						{sortedData?.map(
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
							}) => {
								return (
									<Tr key={_id} _hover={{ bg: "var(--phoneCall_bg_light)" }}>
										<Td py={0}>
											<TextTitle title={ticketNumber} />
										</Td>
										<Td py={0} px={1}>
											<TextTitle title={category} />
										</Td>
										<Td py={0}>
											<NormalTextTitle size="sm" title={priority} />
										</Td>
										<Td py={0}>
											<NormalTextTitle size="sm" title={assignee} />
										</Td>
										<Td py={0}>
											<NormalTextTitle size="sm" title={originator} />
										</Td>
										<Td py={0} maxW="100px" px={1}>
											<Tooltip label={topic}>
												<span>
													<NormalTextTitle maxW="100px" size="sm" title={topic} />
												</span>
											</Tooltip>
										</Td>
										<Td py={0} maxW="100px" px={1}>
											<Tooltip label={issue}>
												<HStack spacing={0}>
													<NormalTextTitle maxW="100px" size="sm" title={issue} />
													<CgNotes
														size="12px"
														cursor="pointer"
														onClick={() => {
															setOpenNote(true);
															setRowData({ issue, topic, ticketNumber, file, originalname });
														}}
													/>
												</HStack>
											</Tooltip>
										</Td>
										<Td py={0}>
											<NormalTextTitle size="sm" title={longTimeFormat(createdOn)} />
										</Td>
										<Td py={0}>
											<NormalTextTitle size="sm" title={ticketDaysOpened} />
										</Td>
										<Td py={0}>
											<StatusCol
												id={_id}
												w="108px"
												bg={bg}
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
