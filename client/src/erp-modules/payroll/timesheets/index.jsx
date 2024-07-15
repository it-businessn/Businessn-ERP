import SectionLayout from "components/ui/SectionLayout";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";

import { useEffect, useState } from "react";
import TimesheetService from "services/TimesheetService";
import { isManager } from "utils";
import LocalStorageService from "services/LocalStorageService";
import Timecard from "./Timecard";
import Timesheet from "./Timesheet";

const Timesheets = () => {
	const loggedInUser = LocalStorageService.getItem("user");
	const isManagerView = isManager(loggedInUser?.role);
	const [timesheets, setTimesheets] = useState(null);

	const fetchAllEmployeeTimesheet = async () => {
		try {
			const response = isManagerView
				? await TimesheetService.getTimesheets()
				: await TimesheetService.getTimesheetById(loggedInUser?._id);
			setTimesheets(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllEmployeeTimesheet();
	}, []);

	const TABS = [
		{
			id: 0,
			type: "Timesheet",
			name: (
				<Timesheet
					timesheets={timesheets}
					// setIsRefresh={setIsRefresh}
				/>
			),
		},
		{
			id: 1,
			type: "Timecards",
			name: <Timecard timesheets={timesheets} />,
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
