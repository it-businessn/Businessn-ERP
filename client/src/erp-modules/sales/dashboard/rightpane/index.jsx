import { Box } from "@chakra-ui/react";
import UserStatInfo from "components/ui/UserStatInfo";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ChatMessages from "./ChatMessages";
import MiniCalendar from "./MiniCalendar";

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
			<UserStatInfo
				name={selectedUser?.fullName}
				email={selectedUser?.email}
				stats={stats}
			/>
			<MiniCalendar user={selectedUser} company={company} />
			<ChatMessages userId={selectedUser._id} company={company} />
		</Box>
	);
};

export default RightPane;
