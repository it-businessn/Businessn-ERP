import { Box } from "@chakra-ui/react";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import { useEffect, useState } from "react";
import CalendarTable from "./CalendarTable";
import TaskTable from "./TaskTable";

const UpcomingList = ({
	selectedUser,
	events,
	meetings,
	appointments,
	setIsRefresh,
}) => {
	const CALENDAR_COLS = ["Description", "From", "To", "Event Link", "Location"];
	const TABS = [
		{
			type: "Tasks",
			name: (
				<TaskTable
					cols={["Name", "Priority", "Due date"]}
					selectedUser={selectedUser}
				/>
			),
		},
		{
			type: "Events",
			name: (
				<CalendarTable
					setIsRefresh={setIsRefresh}
					data={events}
					filter="event"
					cols={CALENDAR_COLS}
					filterText="Event"
				/>
			),
		},
		{
			type: "Meetings",
			name: (
				<CalendarTable
					setIsRefresh={setIsRefresh}
					data={meetings}
					filter="meeting"
					cols={CALENDAR_COLS}
					filterText="Meeting"
				/>
			),
		},
		{
			type: "Appointments",
			name: (
				<CalendarTable
					setIsRefresh={setIsRefresh}
					data={appointments}
					filter="phoneCall"
					cols={["Description", "From", "To", "hideCol1", "hideCol2"]}
					filterText="Appointment"
				/>
			),
		},
	];
	const [viewMode, setViewMode] = useState(TABS[0].type);

	const [componentName, setComponentName] = useState(TABS[0].name);

	useEffect(() => {
		setComponentName(TABS.find(({ type }) => type === viewMode)?.name);
	}, [viewMode]);

	return (
		<>
			<Box mb={4} bg={"var(--main_color)"} borderRadius={"1em"} px="5px">
				<TabsButtonGroup
					tabs={TABS}
					setViewMode={setViewMode}
					viewMode={viewMode}
				/>
			</Box>
			{componentName}
		</>
	);
};

export default UpcomingList;
