import {
	Avatar,
	Box,
	Button,
	HStack,
	Input,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import CommunicationService from "services/CommsService";
import MessageBubble from "./MessageBubble";

const Conversation = ({
	groupMembers,
	selectedGroup,
	selectedGroupMember,
	userId,
	conversations,
	setConversations,
	isDashboard,
}) => {
	const [message, setMessage] = useState("");
	const [isRefresh, setIsRefresh] = useState(false);

	useEffect(() => {
		const fetchGroupConversations = async () => {
			try {
				const response = await CommunicationService.getGroupConversationByName(
					selectedGroup?.name,
				);
				response?.data[0]?.groupMessages.map((msg) => {
					msg.senderName = groupMembers.find(
						(_) => _._id === msg.sender,
					)?.fullName;
					return msg;
				});
				setConversations(response?.data[0]?.groupMessages || []);
			} catch (error) {
				console.error("Error fetching conversations:", error);
			}
		};
		const fetchTwoUsersConversations = async () => {
			try {
				const response = await CommunicationService.getTwoUsersConversation({
					userId1: selectedGroupMember._id,
					userId2: userId,
				});
				setConversations(response?.data[0]?.messages || []);
			} catch (error) {
				console.error("Error fetching conversations:", error);
			}
		};
		if (selectedGroup?.name && !selectedGroupMember) {
			fetchGroupConversations();
		}
		if (selectedGroupMember) {
			fetchTwoUsersConversations();
		}
	}, [selectedGroup?.name, isRefresh, selectedGroupMember?._id]);

	const createConversation = async () => {
		try {
			const type = selectedGroupMember ? "one-on-one" : "group";
			const participants = [];
			if (selectedGroupMember) {
				participants.push(selectedGroupMember._id, userId);
			} else {
				groupMembers.forEach((member) => participants.push(member._id));
			}
			const response = await CommunicationService.createConversation({
				participants,
				conversationType: type,
				groupName: selectedGroup.name,
			});
			return { id: response.data._id, type: response.data.conversationType };
		} catch (error) {
			setMessage("An error occurred. Please try again.");
		}
	};

	const sendMessage = async () => {
		try {
			const { id, type } = await createConversation();

			if (type === "one-on-one") {
				await CommunicationService.sendMessage({
					text: message,
					senderId: userId,
					receiverId: selectedGroupMember._id,
				});
			} else {
				await CommunicationService.createGroupMessages({
					id,
					text: message,
					senderId: userId,
				});
			}
			setIsRefresh((prev) => !prev);
			setMessage("");
		} catch (error) {
			setMessage("An error occurred. Please try again.");
		}
	};
	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			sendMessage();
		}
	};
	return (
		<Box p={isDashboard ? 0 : "1em"} w={"100%"}>
			{!isDashboard && (
				<HStack>
					<Avatar name="JK" />
					<VStack align={"start"} spacing={1}>
						<Text fontWeight="bold">
							{selectedGroupMember
								? selectedGroupMember?.fullName
								: selectedGroup?.name}
						</Text>
						<Text fontSize={"xs"}>{selectedGroupMember?.email}</Text>
					</VStack>
				</HStack>
			)}
			<VStack w={"100%"}>
				<Box
					pr={3}
					w={"100%"}
					minH={!isDashboard && "55vh"}
					maxH={!isDashboard && "66vh"}
					overflowY={"auto"}
				>
					{conversations?.map((msg) => (
						<MessageBubble
							isDashboard={isDashboard}
							selectedGroupMember={
								selectedGroupMember?.fullName || msg.senderName
							}
							key={msg._id}
							message={msg?.text}
							isMyMessage={msg.sender === userId}
							timestamp={msg.timestamp}
						/>
					))}
				</Box>

				<HStack
					w={"100%"}
					spacing={2}
					alignItems={"center"}
					borderRadius={"20px"}
					border={"2px solid #eee"}
				>
					<Input
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
						onKeyPress={handleKeyPress}
					/>

					<Button
						onClick={sendMessage}
						isDisabled={!selectedGroup}
						variant={"ghost"}
						size={"sm"}
						rightIcon={<BsFillSendFill />}
						bg={"brand.primary_bg"}
						color={"brand.primary_button_bg"}
					>
						Send
					</Button>
				</HStack>
			</VStack>
		</Box>
	);
};

export default Conversation;