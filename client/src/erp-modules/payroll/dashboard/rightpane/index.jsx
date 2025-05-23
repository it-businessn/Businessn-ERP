import BoxCard from "components/ui/card";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import ChatMessages from "erp-modules/sales/dashboard/rightpane/ChatMessages";
import MiniCalendar from "erp-modules/sales/dashboard/rightpane/MiniCalendar";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AppointmentHistory from "./AppointmentHistory";
import PayrollUserStatInfo from "./PayrollUserStatInfo";
import TasksHistory from "./TasksHistory";
import TicketHistory from "./TicketHistory";

const RightPane = ({
	selectedUser,
	selectedPayGroup,
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
			name: <ChatMessages userId={selectedPayGroup?._id} company={company} />,
		},
		{
			id: 2,
			type: "Tasks",
			name: <TasksHistory title="ASFASF" />,
		},
		{
			id: 3,
			type: "Appointments",
			name: <AppointmentHistory title="ASFAASFSAFSF" />,
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
			<MiniCalendar user={selectedUser} company={company} isPayrollDashboard />
			<TabsButtonGroup tabs={TABS} setViewMode={setViewMode} viewMode={viewMode} />
			{showComponent(viewMode)}
		</BoxCard>
	);
};

export default RightPane;
