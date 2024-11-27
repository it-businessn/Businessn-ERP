import BoxCard from "components/ui/card";
import ChatMessages from "erp-modules/sales/dashboard/rightpane/ChatMessages";
import MiniCalendar from "erp-modules/sales/dashboard/rightpane/MiniCalendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import PayrollUserStatInfo from "./PayrollUserStatInfo";

const RightPane = ({
	selectedUser,
	selectedPayGroup,
	company,
	payGroupSchedule,
	closestRecord,
	closestRecordIndex,
}) => {
	return (
		<BoxCard>
			<PayrollUserStatInfo
				name={selectedUser?.fullName}
				email={selectedUser?.email}
				payGroupSchedule={payGroupSchedule}
				closestRecord={closestRecord}
				closestRecordIndex={closestRecordIndex}
			/>
			<MiniCalendar user={selectedUser} company={company} isPayrollDashboard />
			<ChatMessages userId={selectedPayGroup?._id} company={company} />
		</BoxCard>
	);
};

export default RightPane;
