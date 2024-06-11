import { Box } from "@chakra-ui/react";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import { useEffect, useState } from "react";
import TaskService from "services/TaskService";
import CalendarTable from "./CalendarTable";
import TaskTable from "./TaskTable";

const UpcomingList = ({
	selectedUser,
	events,
	meetings,
	appointments,
	setIsRefresh,
	company,
}) => {
	const [tasks, setTasks] = useState([]);
	useEffect(() => {
		const fetchAllUserTasks = async () => {
			try {
				const response = await TaskService.getTaskByAssignee({
					name: selectedUser?.fullName,
					company,
				});

				setTasks(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllUserTasks();
	}, [selectedUser, company]);

	const CALENDAR_COLS = ["Description", "From", "To", "Event Link", "Location"];
	const TABS = [
		{
			type: "Tasks",
			name: (
				<TaskTable
					tasks={tasks}
					cols={["Name", "Priority", "Due date"]}
					company={company}
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
