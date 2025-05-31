import { Box, Button, HStack, Input, VStack } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import moment from "moment";
import { useEffect, useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import CommunicationService from "services/CommsService";

const Announcements = ({ company }) => {
	const [announcements, setAnnouncements] = useState(null);
	const [message, setMessage] = useState("");

	useEffect(() => {
		const fetchAnnouncements = async () => {
			try {
				const { data } = await CommunicationService.getAnnouncement(company);
				setAnnouncements(data);
			} catch (error) {
				console.error("Error fetching conversations:", error);
			}
		};
		fetchAnnouncements();
	}, []);

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			sendMessage();
		}
	};

	const sendMessage = async () => {
		try {
			await CommunicationService.addAnnouncement({
				title: "Minimum Wage Increase Effective June 1, 2025",
				message: `As per the recent update from the Government of British Columbia, the general minimum wage increased from $17.40 to $17.85 per hour, effective June 1, 2025. To ensure compliance with the Employment Standards Act, please follow the steps below: Wage Adjustment Requirements
•	Effective Date: The new rate of $17.85/hour applies to all hours worked on or after June 1, 2025, regardless of the pay period or pay date.
•	Do Not Pro-rate: If an employee works a shift that begins in May and ends in June, only the June hours must be paid at the new rate.Please ask your representative if you have any questions and they will be happy to help you!`,
				senderId: "bot",
				companyName: company,
			});
		} catch (error) {
			setMessage("An error occurred. Please try again.", error);
		}
	};
	return (
		<BoxCard bg={"white"} pb={0} h={"93%"}>
			<VStack w={"100%"} h={"100%"} justifyContent="space-between" alignItems="start">
				{announcements?.map(({ title, message, createdOn, _id }) => (
					<Box key={_id} w={"70%"}>
						<Box
							borderRadius="lg"
							bg={"var(--receiver_msg_bg)"}
							color={"black"}
							px={3}
							py={1.5}
							justifyContent={"flex-start"}
						>
							<VStack alignItems={"self-start"} spacing={0}>
								<TextTitle title="Support Assistant" size="xs" whiteSpace="wrap" />
								<NormalTextTitle title={title} size="xs" whiteSpace="wrap" />
								{/* {message?.split("\n")?.map((msg, i) => {
										const newMsg = msg.replace(" \n ", "");
										return (
											<NormalTextTitle
												key={`msg_${i}`}
												whiteSpace="pre-wrap"
												title={newMsg}
												size="xs"
											/>
										);
									})} */}
								<NormalTextTitle
									whiteSpace="pre-wrap"
									title="As per the recent update from the Government of British Columbia, the general minimum wage increased from $17.40 to $17.85 per hour, effective June 1, 2025."
									size="xs"
								/>
								<NormalTextTitle
									whiteSpace="pre-wrap"
									title="To ensure compliance with the Employment Standards Act, please follow the steps below: "
									size="xs"
								/>
								<NormalTextTitle
									whiteSpace="pre-wrap"
									title="Wage Adjustment Requirements"
									size="xs"
								/>
								<NormalTextTitle
									whiteSpace="pre-wrap"
									title="•	Effective Date: The new rate of $17.85/hour applies to all hours worked on or
											after June 1, 2025, regardless of the pay period or pay date. "
									size="xs"
								/>
								<NormalTextTitle
									whiteSpace="pre-wrap"
									title="•	Do Not Pro-rate: If an employee works a shift that begins in May and ends in June, only the June hours must be paid at the new rate."
									size="xs"
								/>

								<NormalTextTitle
									whiteSpace="pre-wrap"
									title="Please ask your representative if you have any questions and they will be happy to help you!"
									size="xs"
								/>
							</VStack>
						</Box>

						<NormalTextTitle title={moment(createdOn).fromNow()} size="xs" />
					</Box>
				))}
				<HStack
					w={"100%"}
					spacing={2}
					alignItems={"center"}
					borderRadius={"20px"}
					border={"2px solid #eee"}
				>
					<Input
						size="sm"
						placeholder="Type your message..."
						bg={"transparent"}
						border={"none"}
						_focusVisible={{
							border: "none",
							outline: "none",
							boxShadow: "none",
						}}
						_focus={{ border: "none", outline: "none", boxShadow: "none" }}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						// onKeyPress={handleKeyPress}
						readOnly
					/>

					<Button
						onClick={sendMessage}
						isDisabled={true}
						variant={"ghost"}
						size={"sm"}
						rightIcon={<BsFillSendFill />}
						bg={"var(--primary_bg)"}
						color={"var(--primary_button_bg)"}
					>
						Send
					</Button>
				</HStack>
			</VStack>
		</BoxCard>
	);
};

export default Announcements;
