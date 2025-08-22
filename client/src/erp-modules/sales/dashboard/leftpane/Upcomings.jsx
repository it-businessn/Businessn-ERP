import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import { useEffect, useState } from "react";
import CalendarTable from "./CalendarTable";
import UpcomingTaskTable from "./UpcomingTaskTable";

const UpcomingList = ({ selectedUser, company, setIsRefresh, setStats }) => {
	const CALENDAR_COLS = ["Description", "From", "To", "Event Link", "Location"];
	const TABS = [
		{
			type: "Tasks",
			name: (
				<UpcomingTaskTable
					cols={["Name", "Priority", "Due date"]}
					user={selectedUser}
					company={company}
				/>
			),
		},
		{
			type: "Events",
			name: (
				<CalendarTable
					setIsRefresh={setIsRefresh}
					filter="event"
					cols={CALENDAR_COLS}
					filterText="Event"
					setStats={setStats}
					user={selectedUser}
					company={company}
				/>
			),
		},
		{
			type: "Meetings",
			name: (
				<CalendarTable
					setIsRefresh={setIsRefresh}
					filter="meeting"
					cols={CALENDAR_COLS}
					filterText="Meeting"
					setStats={setStats}
					user={selectedUser}
					company={company}
				/>
			),
		},
		{
			type: "Appointments",
			name: (
				<CalendarTable
					setIsRefresh={setIsRefresh}
					filter="phoneCall"
					cols={["Description", "From", "To", "hideCol1", "hideCol2"]}
					filterText="Appointment"
					setStats={setStats}
					user={selectedUser}
					company={company}
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
			<TabsButtonGroup tabs={TABS} setViewMode={setViewMode} viewMode={viewMode} />
			{componentName}
		</>
	);
};

export default UpcomingList;
