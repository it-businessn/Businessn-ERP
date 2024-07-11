import { Box } from "@chakra-ui/react";
import UserStatInfo from "components/ui/UserStatInfo";
import ChatMessages from "erp-modules/sales/dashboard/rightpane/ChatMessages";
import MiniCalendar from "erp-modules/sales/dashboard/rightpane/MiniCalendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const RightPane = ({ selectedUser, stats, company }) => {
	return (
		<Box
			overflow={"hidden"}
			overflowY={"auto"}
			p="1em"
			bg={"var(--primary_bg)"}
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
