import { Box } from "@chakra-ui/react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ChatMessages from "./ChatMessages";
import MiniCalendar from "./MiniCalendar";
import UserMeetingInfo from "./UserMeetingInfo";

const RightPane = ({ selectedUser, stats, company }) => {
	return (
		<Box
			overflow={"hidden"}
			overflowY={"auto"}
			p="1em"
			bg={"brand.primary_bg"}
			border="3px solid var(--main_color)"
			borderRadius="10px"
		>
			<UserMeetingInfo
				stats={stats}
				selectedUser={selectedUser}
				company={company}
			/>
			<MiniCalendar user={selectedUser} company={company} />
			<ChatMessages userId={selectedUser._id} company={company} />
		</Box>
	);
};

export default RightPane;
