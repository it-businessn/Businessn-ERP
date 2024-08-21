import {
	Avatar,
	Box,
	Button,
	HStack,
	IconButton,
	Text,
	VStack,
} from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaUsers } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import CommunicationService from "services/CommsService";
import UserService from "services/UserService";
import ChatHistory from "./ChatHistory";

const ChatMessages = ({ userId, company }) => {
	const [userConversation, setUserConversation] = useState(null);
	const [currentChat, setCurrentChat] = useState(null);
	const [currentConversation, setCurrentConversation] = useState(null);
	const [isRefresh, setIsRefresh] = useState(false);

	const [groups, setGroups] = useState(null);
	useEffect(() => {
		const fetchAllUserConversation = async () => {
			try {
				const response = await CommunicationService.getUserConversations({
					userId,
					company,
				});
				response.data.forEach((conversation) => {
					conversation.isPersonal =
						conversation.conversationType === "one-on-one";
					conversation.participant = conversation.isPersonal
						? conversation.participants.find(({ _id }) => _id !== userId)
						: null;

					conversation.participantMsg = conversation.isPersonal
						? conversation.messages.length > 0
							? conversation.messages[conversation.messages.length - 1]?.text
							: ""
						: conversation.groupMessages.length > 0
						? conversation.groupMessages[
								conversation.groupMessages.length - 1
						  ]?.text.slice(0, 50)
						: "";
				});
				setUserConversation(response.data);
				if (response.data.length === 0) {
					fetchAllGroups();
				}
			} catch (error) {
				console.error(error);
			}
		};
		if (userId) {
			fetchAllUserConversation();
		}
	}, [isRefresh, userId, company]);

	const fetchAllGroups = async () => {
		try {
			const response = await UserService.getAllMemberGroups({
				userId,
				company,
			});
			setGroups(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleStartChat = (group) => {
		group.conversationType = "group";
		group.participants = group.members;
		group.groupName = group.name;
		setCurrentConversation(group);
		setCurrentChat([]);
	};

	const handleChat = (conversation, isPersonal) => {
		setCurrentConversation(conversation);
		setCurrentChat(
			isPersonal ? conversation.messages : conversation.groupMessages,
		);
	};

	const NoMessage = ({ title }) => <TextTitle p="10px" title={title} />;

	return (
		<Box mt={2} fontWeight="bold">
			{userConversation ? (
				<>
					<HStack>
						{currentChat && (
							<IoMdArrowRoundBack onClick={() => setCurrentChat(null)} />
						)}
						<NoMessage title={"Chat History"} />
					</HStack>
					{currentChat ? (
						<ChatHistory
							userId={userId}
							currentConversation={currentConversation}
							isRefresh={isRefresh}
							setIsRefresh={setIsRefresh}
							company={company}
						/>
					) : (
						<VStack align="stretch" spacing={2}>
							{userConversation?.length === 0 && (
								<>
									{!groups?.length && (
										<NoMessage title={"No recent conversation found."} />
									)}
									{groups?.map((group) => (
										<HStack
											key={group._id}
											w={"100%"}
											spacing={"1em"}
											bg={"var(--lead_cards_bg)"}
											cursor="pointer"
											onClick={() => handleStartChat(group)}
										>
											<Box
												borderRadius="50%"
												bg="var(--primary_button_bg)"
												size={"sm"}
												display="flex"
												alignItems="center"
												justifyContent="center"
											>
												<IconButton
													icon={<FaUsers />}
													variant="solid"
													color="white"
													size="sm"
													aria-label="Avatar Icon"
													_hover={{ bg: "transparent" }}
												/>
											</Box>
											<Button
												justifyContent={"space-between"}
												p={0}
												variant="ghost"
												fontSize="xs"
											>
												<VStack align={"self-start"}>
													<TextTitle title={group.name} />
												</VStack>
											</Button>
										</HStack>
									))}
								</>
							)}
							{userConversation?.map((conversation) => (
								<HStack
									w={"100%"}
									key={conversation._id}
									spacing={"1em"}
									bg={"var(--lead_cards_bg)"}
									cursor="pointer"
									onClick={() =>
										handleChat(conversation, conversation.isPersonal)
									}
								>
									{conversation.isPersonal ? (
										<>
											<Avatar
												size={"sm"}
												name={conversation?.participant?.fullName}
											/>
											<Button
												justifyContent={"space-between"}
												p={0}
												variant="ghost"
												fontSize="xs"
											>
												<VStack align={"self-start"}>
													<Text fontWeight="bold">
														{conversation?.participant?.fullName}
													</Text>
													<Text>{conversation.participantMsg}</Text>
												</VStack>
											</Button>
										</>
									) : (
										<>
											<Box
												borderRadius="50%"
												bg="var(--primary_button_bg)"
												size={"sm"}
												display="flex"
												alignItems="center"
												justifyContent="center"
											>
												<IconButton
													icon={<FaUsers />}
													variant="solid"
													color="white"
													size="sm"
													aria-label="Avatar Icon"
													_hover={{ bg: "transparent" }}
												/>
											</Box>
											<Button
												justifyContent={"space-between"}
												p={0}
												variant="ghost"
												fontSize="xs"
											>
												<VStack align={"self-start"}>
													<Text fontWeight="bold">
														{conversation?.groupName}
													</Text>

													<Text>{conversation.participantMsg}</Text>
												</VStack>
											</Button>
										</>
									)}
								</HStack>
							))}
						</VStack>
					)}
				</>
			) : (
				<NoMessage title="No communications found" />
			)}
		</Box>
	);
};

export default ChatMessages;
