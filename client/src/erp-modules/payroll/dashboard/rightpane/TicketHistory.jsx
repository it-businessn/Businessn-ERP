import { Box, HStack, List, ListItem, VStack } from "@chakra-ui/react";
import SkeletonLoader from "components/SkeletonLoader";
import LinkButton from "components/ui/button/LinkButton";
import TextTitle from "components/ui/text/TextTitle";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import NoteDetails from "erp-modules/project-management/tickets/NoteDetails";
import { useEffect, useRef, useState } from "react";
import TicketService from "services/TicketService";

const TicketHistory = ({ userId, company, setCount, height = "calc(100vh - 528px)" }) => {
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
		<Box
			fontWeight="bold"
			borderTop={"1.5px solid var(--main_color_black)"}
			maxH={height}
			overflowY={"auto"}
			css={tabScrollCss}
		>
			<List spacing={2}>
				{isLoading ? (
					<SkeletonLoader />
				) : ticketData?.length ? (
					ticketData?.map(
						({ _id, ticketNumber, category, priority, topic, issue, file, originalname }) => (
							<ListItem key={_id}>
								<HStack
									justifyContent="space-between"
									alignItems="end"
									spacing={0}
									p={"1em"}
									pb={0}
									borderTop={"1.5px solid var(--main_color_black)"}
								>
									<VStack spacing={0}>
										<TextTitle size="xs" title={`Ticket#: ${ticketNumber}`} />
										<TextTitle size="xs" title={`Category: ${category}`} />
										<TextTitle size="xs" title={`Priority: ${priority}`} />
										<TextTitle size="xs" whiteSpace="wrap" title={`Topic: ${topic}`} />
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
							</ListItem>
						),
					)
				) : (
					<TextTitle color="var(--banner_bg)" p="10px" title={"No record found"} />
				)}
			</List>
			{openNote && (
				<NoteDetails isOpen={openNote} setIsOpen={setOpenNote} data={ticketDetails.current} />
			)}
		</Box>
	);
};

export default TicketHistory;
