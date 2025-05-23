import BoxCard from "components/ui/card";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import AppointmentHistory from "erp-modules/payroll/dashboard/rightpane/AppointmentHistory";
import PayrollUserStatInfo from "erp-modules/payroll/dashboard/rightpane/PayrollUserStatInfo";
import TasksHistory from "erp-modules/payroll/dashboard/rightpane/TasksHistory";
import TicketHistory from "erp-modules/payroll/dashboard/rightpane/TicketHistory";
import ChatMessages from "erp-modules/sales/dashboard/rightpane/ChatMessages";
import MiniCalendar from "erp-modules/sales/dashboard/rightpane/MiniCalendar";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";

const RightPane = ({
	selectedUser,
	company,
	payGroupSchedule,
	closestRecord,
	closestRecordIndex,
}) => {
	const TABS = [
		{
			id: 0,
			type: "Tickets",
			name: <TicketHistory userId={selectedUser?.fullName} company={company} />,
		},
		{
			id: 1,
			type: "Messages",
			name: <ChatMessages userId={selectedUser?._id} company={company} />,
		},
		{
			id: 2,
			type: "Tasks",
			name: <TasksHistory userId={selectedUser?._id} company={company} />,
		},
		{
			id: 3,
			type: "Appointments",
			name: <AppointmentHistory userId={selectedUser?._id} company={company} />,
		},
	];

	const [viewMode, setViewMode] = useState(TABS[0].type);
	const showComponent = (viewMode) => TABS.find(({ type }) => type === viewMode)?.name;

	return (
		<BoxCard>
			<PayrollUserStatInfo
				name={selectedUser?.fullName}
				email={selectedUser?.email}
				payGroupSchedule={payGroupSchedule}
				closestRecord={closestRecord}
				closestRecordIndex={closestRecordIndex}
			/>
			<MiniCalendar user={selectedUser} company={company} isPayrollDashboard />{" "}
			<TabsButtonGroup tabs={TABS} setViewMode={setViewMode} viewMode={viewMode} />
			{showComponent(viewMode)}
		</BoxCard>
	);
};

export default RightPane;
