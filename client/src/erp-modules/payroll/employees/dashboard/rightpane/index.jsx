import BoxCard from "components/ui/card";
import UserStatInfo from "components/ui/UserStatInfo";
import ChatMessages from "erp-modules/sales/dashboard/rightpane/ChatMessages";
import MiniCalendar from "erp-modules/sales/dashboard/rightpane/MiniCalendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const RightPane = ({ selectedUser, stats, company }) => {
	return (
		<BoxCard>
			<UserStatInfo
				name={selectedUser?.fullName}
				email={selectedUser?.email}
				stats={stats}
			/>
			<MiniCalendar user={selectedUser} company={company} isPayrollDashboard />
			<ChatMessages userId={selectedUser._id} company={company} />
		</BoxCard>
	);
};

export default RightPane;
