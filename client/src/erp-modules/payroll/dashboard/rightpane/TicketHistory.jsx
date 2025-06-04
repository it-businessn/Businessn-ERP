import { Box, HStack, List, ListItem, VStack } from "@chakra-ui/react";
import SkeletonLoader from "components/SkeletonLoader";
import LinkButton from "components/ui/button/LinkButton";
import BoxCard from "components/ui/card";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import NoteDetails from "erp-modules/project-management/tickets/NoteDetails";
import { useEffect, useRef, useState } from "react";
import TicketService from "services/TicketService";

const TicketHistory = ({ userId, company, setCount }) => {
	const [ticketData, setTicketData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [openNote, setOpenNote] = useState(false);
	const ticketDetails = useRef(null);

	useEffect(() => {
		const fetchAllUserTickets = async () => {
			try {
				setIsLoading(true);
				const { data } = await TicketService.getOpenTicket(userId, company);

				setTicketData(data);
				setCount(data?.length);
				setIsLoading(false);
			} catch (error) {
				console.error(error);
			}
		};
		if (userId) fetchAllUserTickets();
	}, [userId]);

	return (
		<Box maxH={"calc(100vh - 533px)"} mt={3} overflowY={"auto"}>
			<List spacing={2}>
				{isLoading ? (
					<SkeletonLoader />
				) : ticketData?.length ? (
					ticketData?.map(
						({ _id, ticketNumber, category, priority, topic, issue, file, originalname }) => (
							<ListItem key={_id}>
								<BoxCard p={" 0.5em 1em"} boxShadow="sm">
									<HStack justifyContent="space-between" alignItems="end" spacing={0}>
										<VStack spacing={0}>
											<TextTitle size="xs" title={`Ticket#: ${ticketNumber}`} />
											<TextTitle size="xs" title={`Category: ${category}`} />
											<TextTitle size="xs" title={`Priority: ${priority}`} />
											<TextTitle size="xs" title={`Topic: ${topic}`} />
										</VStack>
										<LinkButton
											onClick={() => {
												setOpenNote(true);
												ticketDetails.current = { issue, topic, ticketNumber, file, originalname };
											}}
											textDecor="underline"
											fontSize="xs"
											name="More details"
										/>
									</HStack>
								</BoxCard>
							</ListItem>
						),
					)
				) : (
					<BoxCard p="0.5em">
						<NormalTextTitle size="sm" title="No record found" />
					</BoxCard>
				)}
			</List>
			{openNote && (
				<NoteDetails isOpen={openNote} setIsOpen={setOpenNote} data={ticketDetails.current} />
			)}
		</Box>
	);
};

export default TicketHistory;
