import { Stack } from "@chakra-ui/react";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import UserStatInfo from "components/ui/UserStatInfo";
import AppointmentHistory from "erp-modules/payroll/dashboard/rightpane/AppointmentHistory";
import TasksHistory from "erp-modules/payroll/dashboard/rightpane/TasksHistory";
import TicketHistory from "erp-modules/payroll/dashboard/rightpane/TicketHistory";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ChatMessages from "./ChatMessages";
import MiniCalendar from "./MiniCalendar";

const RightPane = ({ selectedUser, stats, company }) => {
	const [count, setCount] = useState(0);
	const TABS = [
		{
			id: 0,
			type: "Tickets",
			count,
			name: <TicketHistory setCount={setCount} userId={selectedUser?.fullName} company={company} />,
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
		<Stack spacing={2}>
			<UserStatInfo name={selectedUser?.fullName} email={selectedUser?.email} stats={stats} />
			<MiniCalendar user={selectedUser} company={company} />
			<TabsButtonGroup tabs={TABS} setViewMode={setViewMode} viewMode={viewMode} mb={0} />
			{showComponent(viewMode)}
		</Stack>
	);
};

export default RightPane;
