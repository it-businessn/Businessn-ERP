import { Box } from "@chakra-ui/react";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import MessageBubble from "./MessageBubble";

const ChatHistory = ({ isDashboard, conversations, selectedGroupMember, userId }) => {
	return (
		<Box
			pr={3}
			w={"100%"}
			minH={!isDashboard && "55vh"}
			maxH={!isDashboard && "66vh"}
			overflowY={"auto"}
			css={tabScrollCss}
		>
			{conversations?.map((msg) => (
				<MessageBubble
					isDashboard={isDashboard}
					selectedGroupMember={selectedGroupMember?.fullName || msg.senderName}
					key={msg._id}
					message={msg?.text}
					isMyMessage={msg.sender === userId}
					timestamp={msg.timestamp}
				/>
			))}
		</Box>
	);
};

export default ChatHistory;
