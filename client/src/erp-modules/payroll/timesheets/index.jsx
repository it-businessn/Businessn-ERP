import { Stack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import useCompany from "hooks/useCompany";
import useTimesheet from "hooks/useTimesheet";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import { useParams } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import { getDefaultDate, isManager } from "utils";
import ExtraTimeEntryModal from "./ExtraTimeEntryModal";
import Timecard from "./Timecard";
import Timesheet from "./Timesheet";

const Timesheets = () => {
	const { id } = useParams();
	const { company } = useCompany(
		LocalStorageService.getItem("selectedCompany"),
	);
	const loggedInUser = LocalStorageService.getItem("user");
	const isManagerView = isManager(loggedInUser?.role);
	const userId = id ? id : isManagerView ? null : loggedInUser._id;

	const [refresh, setRefresh] = useState(false);
	const timesheets = useTimesheet(company, userId, refresh);

	const [showAddEntry, setShowAddEntry] = useState(false);

	const TABS = [
		{
			id: 0,
			type: "Timesheet",
			name: (
				<Timesheet
					cols={[
						"Employee Name",
						"Worked Date",
						"Status",
						"Department",
						"Pay Rate",
						"Pay Type",
						"Start Time",
						"End Time",
						"Break/Lunch",
						"Total Worked Hours",
						"Action",
					]}
					setRefresh={setRefresh}
					data={timesheets}
					company={company}
				/>
			),
		},
		{
			id: 1,
			type: "Timecards",
			name: (
				<Timecard
					cols={[
						"Employees",
						"Status",
						"Clock In",
						"Clock Out",
						"Start Break",
						"End Break",
						"Clock In",
						"Clock Out",
						"Total Hours (HH:mm)",
					]}
					data={timesheets}
				/>
			),
		},
	];

	const [viewMode, setViewMode] = useState(TABS[0].type);
	const [date, setDate] = useState(getDefaultDate);

	const showComponent = (viewMode) =>
		TABS.find(({ type }) => type === viewMode)?.name;

	return (
		<PageLayout
			title={"Timesheets"}
			showDate
			valueText1={date}
			handleChange={(value) => setDate(value)}
		>
			<Stack spacing={0} align={"end"} mt={-10}>
				<PrimaryButton
					size={"sm"}
					name={"Add request"}
					onOpen={() => setShowAddEntry(true)}
				/>
				{showAddEntry && (
					<ExtraTimeEntryModal
						company={company}
						showAddEntry={showAddEntry}
						setRefresh={setRefresh}
						setShowAddEntry={setShowAddEntry}
					/>
				)}
			</Stack>
			<TabsButtonGroup
				mt={4}
				isOutlineTab
				tabs={TABS}
				setViewMode={setViewMode}
				viewMode={viewMode}
			/>
			{showComponent(viewMode)}
		</PageLayout>
	);
};

export default Timesheets;
