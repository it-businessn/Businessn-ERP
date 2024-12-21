import { Tbody, Td, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import TicketService from "services/TicketService";
import { mmmDayYearFormat } from "utils/convertDate";

const OpenTicket = ({ company, setShowAddEntry, showAddEntry, filter, setTicketRefresh }) => {
	const [ticketData, setTicketData] = useState([]);

	useEffect(() => {
		const fetchAllTickets = async () => {
			try {
				const { data } = await TicketService.getInfo();
				setTicketData(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllTickets();
	}, []);

	const cols = [
		"Ticket Number",
		"Category",
		"Priority",
		"Assignee",
		"Originator",
		"Description",
		"Ticket Opened",
		"Ticket Closed",
		"Days Opened",
		"Status",
		"Action",
	];
	return (
		<TableLayout cols={cols} position="sticky" zIndex={3} top={-1} height="73vh">
			<Tbody>
				{(!ticketData || ticketData?.length === 0) && (
					<EmptyRowRecord data={ticketData} colSpan={cols.length} />
				)}
				{ticketData?.map((ticket) => {
					const approveStatusBtnCss = { color: "var(--primary_bg)", bg: "var(--pending)" };
					return (
						<Tr key={ticket?._id} _hover={{ bg: "var(--phoneCall_bg_light)" }}>
							<Td py={0}>
								<TextTitle title={ticket?.ticketNumber} />
							</Td>
							<Td py={0}>
								<TextTitle title={ticket?.category} />
							</Td>
							<Td py={0}>
								<NormalTextTitle size="sm" title={ticket?.priority} />
							</Td>
							<Td>{ticket?.assignee}</Td>
							<Td py={0}>
								<NormalTextTitle size="sm" title={ticket?.originator} />
							</Td>
							<Td py={0}>
								<NormalTextTitle size="sm" title={ticket?.issue} />
							</Td>
							<Td py={0}>
								<NormalTextTitle size="sm" title={mmmDayYearFormat(ticket?.ticketOpenedDate)} />
							</Td>
							<Td py={0}>
								<NormalTextTitle size="sm" title={mmmDayYearFormat(ticket?.ticketClosedDate)} />
							</Td>
							<Td py={0}>
								<NormalTextTitle size="sm" title={ticket?.ticketDaysOpened} />
							</Td>
							<Td py={0}>
								<PrimaryButton
									cursor="text"
									color={approveStatusBtnCss.color}
									bg={approveStatusBtnCss.bg}
									name={ticket?.status}
									size="xs"
									px={0}
									hover={{
										bg: approveStatusBtnCss.bg,
										color: approveStatusBtnCss.color,
									}}
								/>
							</Td>
						</Tr>
					);
				})}
			</Tbody>
		</TableLayout>
	);
};

export default OpenTicket;
