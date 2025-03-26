import BoxCard from "components/ui/card";
import PayrollUserStatInfo from "erp-modules/payroll/dashboard/rightpane/PayrollUserStatInfo";
import ChatMessages from "erp-modules/sales/dashboard/rightpane/ChatMessages";
import MiniCalendar from "erp-modules/sales/dashboard/rightpane/MiniCalendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const RightPane = ({
	selectedUser,
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
			<ChatMessages userId={selectedUser._id} company={company} />
		</BoxCard>
	);
};

export default RightPane;
