import { HStack, Tbody, Td, Tooltip, Tr, useToast } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import ActionAll from "erp-modules/payroll/timesheets/ActionAll";
import { TICKET_ACTION_STATUS } from "erp-modules/payroll/timesheets/data";
import { useEffect, useState } from "react";
import { CgNotes } from "react-icons/cg";
import TicketService from "services/TicketService";
import { longTimeFormat } from "utils/convertDate";
import NewTicket from "./NewTicket";
import NoteDetails from "./NoteDetails";

const ClosedTicket = ({ company, setShowAddEntry, showAddEntry, userId, employees }) => {
	const [ticketData, setTicketData] = useState([]);
	const [refresh, setRefresh] = useState(false);
	const [openNote, setOpenNote] = useState(false);
	const [rowData, setRowData] = useState(null);

	useEffect(() => {
		const fetchAllTickets = async () => {
			try {
				const { data } = await TicketService.getClosedTicket(userId, company);
				data?.map((_) => {
					_.bg = TICKET_ACTION_STATUS.find(({ name }) => name === _.status)?.color;
					return _;
				});
				setTicketData(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllTickets();
	}, [refresh]);

	const toast = useToast();
	const cols = [
		"Ticket Number",
		"Category",
		"Priority",
		"Assignee",
		"Originator",
		"Topic",
		"Description",
		"Ticket Opened",
		"Ticket Closed",
		"Days Opened",
		"Status",
		"Action",
	];

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
	return (
		<>
			<TableLayout
				cols={cols}
				position="sticky"
				zIndex={3}
				top={-1}
				height="calc(100vh - 230px)"
				specifyPaddingCols={["Category", "Topic", "Description"]}
				css={tabScrollCss}
			>
				<Tbody>
					{(!ticketData || ticketData?.length === 0) && (
						<EmptyRowRecord data={ticketData} colSpan={cols.length} />
					)}
					{ticketData?.map(
						({
							ticketNumber,
							category,
							assignee,
							priority,
							topic,
							issue,
							ticketClosedDate,
							status,
							ticketDaysOpened,
							createdOn,
							originator,
							_id,
							bg,
							file,
							originalname,
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
										<NormalTextTitle
											size="sm"
											title={ticketClosedDate && longTimeFormat(ticketClosedDate)}
										/>
									</Td>
									<Td py={0}>
										<NormalTextTitle size="sm" title={ticketDaysOpened} />
									</Td>
									<Td py={0}>
										<PrimaryButton
											cursor="text"
											color="var(--primary_bg)"
											bg={bg}
											name="Closed"
											size="sm"
											fontWeight="bold"
											px={0}
											hover={{
												bg,
												color: "var(--primary_bg)",
											}}
										/>
									</Td>
									<Td py={0} pl={0}>
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
			</TableLayout>
			{showAddEntry && (
				<NewTicket
					company={company}
					showAddEntry={showAddEntry}
					setRefresh={setRefresh}
					setShowAddEntry={setShowAddEntry}
					userId={userId}
					employees={employees}
				/>
			)}
			{openNote && <NoteDetails isOpen={openNote} setIsOpen={setOpenNote} data={rowData} />}
		</>
	);
};

export default ClosedTicket;
