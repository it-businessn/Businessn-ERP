import { Box, Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import MessageBubble from "erp-modules/project-management/communication/MessageBubble";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { BsFillSendFill } from "react-icons/bs";
import CommunicationService from "services/CommsService";

const ChatHistory = ({
	currentConversation,
	userId,
	isRefresh,
	setIsRefresh,
	company,
}) => {
	const [messages, setMessages] = useState(null);
	const [message, setMessage] = useState("");
	useEffect(() => {
		const fetchConversationHistory = async () => {
			try {
				const response = await CommunicationService.messageHistory({
					id: currentConversation._id,
					type: currentConversation.conversationType,
				});
				setMessages(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchConversationHistory();
	}, [isRefresh]);

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			sendMessage();
		}
	};
	const createConversation = async () => {
		const participants = currentConversation?.participants.map(
			(item) => item._id,
		);
		try {
			const response = await CommunicationService.createConversation({
				participants,
				conversationType: currentConversation?.conversationType,
				groupName: currentConversation.groupName,
				companyName: company,
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
					receiverId: currentConversation.participant._id,
					companyName: company,
				});
			} else {
				await CommunicationService.createGroupMessages({
					id,
					text: message,
					senderId: userId,
					companyName: company,
				});
			}
			setIsRefresh((prev) => !prev);
			setMessage("");
		} catch (error) {
			setMessage("An error occurred. Please try again.");
		}
	};
	return (
		<VStack w={"100%"}>
			<Text p="10px">
				{currentConversation?.isPersonal
					? currentConversation?.participant?.fullName
					: currentConversation?.groupName}
			</Text>
			<Box pr={3} w={"100%"} overflowY={"auto"}>
				{messages?.map((msg) => (
					<MessageBubble
						isDashboard
						selectedGroupMember={msg?.sender.fullName}
						key={msg._id}
						message={msg?.text}
						isMyMessage={msg.sender._id === userId}
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
	);
};

export default ChatHistory;
