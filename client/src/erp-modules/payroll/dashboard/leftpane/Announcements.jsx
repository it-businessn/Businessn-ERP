import { Box, Button, HStack, Input, Stack, VStack } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
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
				title: "Can Statutory Holidays Be Moved to Another Day?",
				message: `Yes! Employers and employees may agree in writing to observe a statutory holiday on a different day — for example, moving a mid-week holiday to Monday for convenience.
				Key Points
•	Agreement: Both parties must consent in writing.
•	Entitlements: The substituted day must offer the same pay and benefits as the original holiday.
•	Records: Keep a copy of the agreement for at least four years.
Reference: Section 48, Employment Standards Act (British Columbia).
Please contact your representative if you have any questions — they’ll be happy to help!`,
				senderId: "bot",
				companyName: company,
			});
		} catch (error) {
			setMessage("An error occurred. Please try again.", error);
		}
	};
	return (
		<Stack
			spacing={"3em"}
			alignItems="start"
			justifyContent="start"
			position="relative"
			zIndex={1}
			justify="space-between"
			align="center"
			p={"4em"}
			color="white"
			height={"calc(95vh - 145px)"}
			overflowY={"auto"}
			css={tabScrollCss}
		>
			<HStack
				w={"100%"}
				spacing={0}
				alignItems={"center"}
				borderRadius={"20px"}
				bg={"var(--primary_bg)"}
			>
				<Input
					size="sm"
					placeholder="Type your message..."
					border={"none"}
					bg={"var(--primary_bg)"}
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
					color={"var(--primary_button_bg)"}
				>
					Send
				</Button>
			</HStack>
			<Box css={tabScrollCss}>
				{announcements?.map(({ title, message, createdOn, _id }, index) => (
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
								{index == 0 && (
									<>
										<NormalTextTitle
											whiteSpace="pre-wrap"
											title="Yes! Employers and employees may agree in writing to observe a statutory holiday on a different day — for example, moving a mid-week holiday to Monday for convenience."
											size="xs"
										/>

										<NormalTextTitle whiteSpace="pre-wrap" title="Key Points" size="xs" />
										<NormalTextTitle
											whiteSpace="pre-wrap"
											title="•	Agreement: Both parties must consent in writing."
											size="xs"
										/>
										<NormalTextTitle
											whiteSpace="pre-wrap"
											title="•	Entitlements: The substituted day must offer the same pay and benefits as the original holiday."
											size="xs"
										/>
										<NormalTextTitle
											whiteSpace="pre-wrap"
											title="•	Records: Keep a copy of the agreement for at least four years."
											size="xs"
										/>
										<NormalTextTitle
											whiteSpace="pre-wrap"
											title="Reference: Section 48, Employment Standards Act (British Columbia)."
											size="xs"
										/>
										<NormalTextTitle
											whiteSpace="pre-wrap"
											title="Please contact your representative if you have any questions — they’ll be happy to help!"
											size="xs"
										/>
									</>
								)}
								{index == 1 && (
									<>
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
									</>
								)}
							</VStack>
						</Box>

						<NormalTextTitle title={moment(createdOn).fromNow()} size="xs" />
					</Box>
				))}
			</Box>
		</Stack>
	);
};

export default Announcements;
