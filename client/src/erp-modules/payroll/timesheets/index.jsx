import SectionLayout from "components/ui/SectionLayout";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import { useState } from "react";
import Timecard from "./Timecard";
import Timesheet from "./Timesheet";

const Timesheets = () => {
	const TABS = [
		{
			id: 0,
			type: "Timesheet",
			name: (
				<Timesheet
				// employees={employees}
				// setFilteredEmployees={setFilteredEmployees}
				// filteredEmployees={filteredEmployees}
				// setIsRefresh={setIsRefresh}
				/>
			),
		},
		{
			id: 1,
			type: "Timecards",
			name: (
				<Timecard
				// employees={employees}
				// setFilteredEmployees={setFilteredEmployees}
				// filteredEmployees={filteredEmployees}
				/>
			),
		},
	];
	const [viewMode, setViewMode] = useState(TABS[0].type);
	const showComponent = (viewMode) =>
		TABS.find(({ type }) => type === viewMode)?.name;

	return (
		<SectionLayout title="Timesheets">
			<TabsButtonGroup
				isOutlineTab
				tabs={TABS}
				setViewMode={setViewMode}
				viewMode={viewMode}
			/>
			{showComponent(viewMode)}
		</SectionLayout>
	);
};

export default Timesheets;
