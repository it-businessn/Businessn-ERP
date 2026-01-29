import { Stack } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import ChatMessages from "erp-modules/sales/dashboard/rightpane/ChatMessages";
import MiniCalendar from "erp-modules/sales/dashboard/rightpane/MiniCalendar";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AppointmentHistory from "./AppointmentHistory";
import TasksHistory from "./TasksHistory";
import TicketHistory from "./TicketHistory";

const RightPane = ({
	selectedUser,
	company,
	payGroupSchedule,
	closestRecord,
	closestRecordIndex,
}) => {
	const [count, setCount] = useState(0);
	const TABS = [
		{
			id: 0,
			type: "Tickets",
			count,
			name: <TicketHistory setCount={setCount} userId={selectedUser?.fullName} company={company} />,
		},
		// {
		// 	id: 1,
		// 	type: "Messages",
		// 	name: <ChatMessages userId={selectedUser?._id} company={company} />,
		// },
		// {
		// 	id: 2,
		// 	type: "Tasks",
		// 	name: <TasksHistory userId={selectedUser?._id} company={company} />,
		// },
		// {
		// 	id: 3,
		// 	type: "Appointments",
		// 	name: <AppointmentHistory userId={selectedUser?._id} company={company} />,
		// },
	];
	const [viewMode, setViewMode] = useState(TABS[0].type);
	const showComponent = (viewMode) => TABS.find(({ type }) => type === viewMode)?.name;

	return (
		<BoxCard p={0} title={"Activity Manager"}>
			<Stack spacing={3}>
				<MiniCalendar user={selectedUser} company={company} isPayrollDashboard />

				<TabsButtonGroup mb={0} tabs={TABS} setViewMode={setViewMode} viewMode={viewMode} />
				{showComponent(viewMode)}
			</Stack>
		</BoxCard>
	);
};

export default RightPane;
