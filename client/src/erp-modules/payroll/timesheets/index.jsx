import { HStack, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import useCompany from "hooks/useCompany";
import usePaygroup from "hooks/usePaygroup";
import useTimesheet from "hooks/useTimesheet";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { useParams } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import { getDefaultDate, isManager } from "utils";
import DateFilterModal from "./DateFilterModal";
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

	const { payGroupSchedule, closestRecord, closestRecordIndex } = usePaygroup(
		company,
		false,
	);
	const lastRecord = payGroupSchedule[closestRecordIndex - 1];
	const [refresh, setRefresh] = useState(false);
	const [filter, setFilter] = useState(null);
	const timesheets = useTimesheet(company, userId, refresh, filter);

	const [showDateFilter, setShowDateFilter] = useState(false);
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
	const [date, setDate] = useState(getDefaultDate);

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
				<LeftIconButton
					color={"var(--nav_color)"}
					border={"2px solid var(--filter_border_color)"}
					name={"Filter"}
					borderRadius={"10px"}
					variant={"ghost"}
					isFilter
					size="xs"
					ml={2}
					handleClick={() => setShowDateFilter(true)}
					icon={<MdOutlineFilterList />}
				/>
				<InputGroup
					size="xs"
					w={"40%"}
					borderRadius={"10px"}
					border={"1px solid var(--filter_border_color)"}
					fontSize="xs"
					fontWeight="bold"
				>
					<InputLeftElement size="xs" children={<FaSearch />} />
					<Input
						size="xs"
						_placeholder={{
							color: "var(--nav_color)",
							fontSize: "xs",
						}}
						color={"var(--nav_color)"}
						bg={"var(--primary_bg)"}
						type="text"
						placeholder="Search by employee name or department or cost center"
						pr="4.5rem"
						py={"1.1em"}
					/>
				</InputGroup>
				<PrimaryButton
					size={"sm"}
					name={"Add request"}
					onOpen={() => setShowAddEntry(true)}
				/>
			</HStack>
			{showDateFilter && (
				<DateFilterModal
					showDateFilter={showDateFilter}
					setShowDateFilter={setShowDateFilter}
					thisPayPeriod={closestRecord}
					lastPayPeriod={lastRecord}
					setFilter={setFilter}
				/>
			)}
			{showAddEntry && (
				<ExtraTimeEntryModal
					company={company}
					showAddEntry={showAddEntry}
					setRefresh={setRefresh}
					setShowAddEntry={setShowAddEntry}
				/>
			)}
			{showAddEntry && (
				<ExtraTimeEntryModal
					company={company}
					showAddEntry={showAddEntry}
					setRefresh={setRefresh}
					setShowAddEntry={setShowAddEntry}
				/>
			)}
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
