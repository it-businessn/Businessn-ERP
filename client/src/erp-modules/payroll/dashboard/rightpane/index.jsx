import { Box, VStack } from "@chakra-ui/react";
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
		<BoxCard borderWidth="0" bg="var(--primary_bg)" p={0}>
			<VStack spacing={"1em"} align="stretch">
				<Box bg="white" borderRadius="lg" p={4} boxShadow="sm">
					<MiniCalendar user={selectedUser} company={company} isPayrollDashboard />
				</Box>

				<Box bg="white" py={2} px={4} borderRadius="lg" boxShadow="sm">
					<TabsButtonGroup
						mb={1}
						mt={1}
						tabs={TABS}
						setViewMode={setViewMode}
						viewMode={viewMode}
					/>
				</Box>
			</VStack>
			{showComponent(viewMode)}
		</BoxCard>
	);
};

export default RightPane;
