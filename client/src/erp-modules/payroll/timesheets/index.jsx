import { HStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import useCompany from "hooks/useCompany";
import usePaygroup from "hooks/usePaygroup";
import useTimesheet from "hooks/useTimesheet";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import { useParams } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import { getDefaultDate, isManager } from "utils";
import DateFilterPopup from "./DateFilterPopup";
import ExtraTimeEntryModal from "./ExtraTimeEntryModal";
import SearchFilter from "./SearchFilter";
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

	const { payGroupSchedule, closestRecord, closestRecordIndex } = usePaygroup(
		company,
		false,
	);
	const lastRecord =
		payGroupSchedule?.length > 0 && payGroupSchedule[closestRecordIndex - 1];
	const [refresh, setRefresh] = useState(false);
	const [filter, setFilter] = useState(null);
	const timesheets = useTimesheet(company, userId, refresh, filter);

	const [date, setDate] = useState(getDefaultDate);

	const [selectedFilter, setSelectedFilter] = useState("Today");
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [showDateFilter, setShowDateFilter] = useState(false);
	const [showOtherFilter, setShowOtherFilter] = useState(false);
	const toggleDateFilter = () => setShowDateFilter(!showDateFilter);
	const toggleOtherFilter = () => setShowOtherFilter(!showOtherFilter);

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
						"TM Badge ID",
						"Clock In",
						"Clock Out",
						"Start Break1",
						"End Break1",
						"Start Break2",
						"End Break2",
						"Start Break3",
						"End Break3",
						"Total Hours (HH:mm)",
					]}
					data={timesheets}
				/>
			),
		},
	];

	const [viewMode, setViewMode] = useState(TABS[0].type);
	const showComponent = (viewMode) =>
		TABS.find(({ type }) => type === viewMode)?.name;

	return (
		<PageLayout
			width="full"
			title={"Timesheets"}
			showDate
			valueText1={date}
			handleChange={(value) => setDate(value)}
			isTimesheet
		>
			<HStack spacing={3} justify={"flex-end"} mt={-8}>
				<SearchFilter />
				<PrimaryButton
					size={"sm"}
					name={"Add request"}
					onOpen={() => setShowAddEntry(true)}
				/>
			</HStack>

			{showAddEntry && (
				<ExtraTimeEntryModal
					company={company}
					showAddEntry={showAddEntry}
					setRefresh={setRefresh}
					setShowAddEntry={setShowAddEntry}
				/>
			)}
			<HStack w={"100%"} justifyContent={"start"} gap={5}>
				<TabsButtonGroup
					w={"30%"}
					mt={4}
					isOutlineTab
					tabs={TABS}
					setViewMode={setViewMode}
					viewMode={viewMode}
				/>
				<DateFilterPopup
					toggleDateFilter={toggleDateFilter}
					showDateFilter={showDateFilter}
					selectedFilter={selectedFilter}
					setSelectedFilter={setSelectedFilter}
					endDate={endDate}
					setEndDate={setEndDate}
					startDate={startDate}
					setStartDate={setStartDate}
					setFilter={setFilter}
					closestRecord={closestRecord}
					lastRecord={lastRecord}
				/>
				{/* <OtherFilter
					showOtherFilter={showOtherFilter}
					toggleOtherFilter={toggleOtherFilter}
				/> */}
			</HStack>

			{showComponent(viewMode)}
		</PageLayout>
	);
};

export default Timesheets;
