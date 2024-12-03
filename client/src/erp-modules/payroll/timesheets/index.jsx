import { HStack, IconButton } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import useCompany from "hooks/useCompany";
import useDepartment from "hooks/useDepartment";
import useEmployees from "hooks/useEmployees";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { IoRefresh } from "react-icons/io5";
import { useParams } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import { isManager } from "utils";
import { getDefaultDate, getMomentDate } from "utils/convertDate";
import DateFilterPopup from "./DateFilterPopup";
import OtherFilter from "./OtherFilter";
import Timecard from "./Timecard";
import Timesheet from "./Timesheet";

const Timesheets = () => {
	const { id } = useParams();
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const loggedInUser = LocalStorageService.getItem("user");
	const isManagerView = isManager(loggedInUser?.role);
	const userId = id ? id : isManagerView ? null : loggedInUser._id;

	const { payGroupSchedule, closestRecord, closestRecordIndex } = usePaygroup(company, false);
	const lastRecord = payGroupSchedule?.length > 0 && payGroupSchedule[closestRecordIndex - 1];

	const [dataRefresh, setDataRefresh] = useState(false);
	const [filter, setFilter] = useState(null);
	const { employees } = useEmployees(false, company, false, true);
	const departments = useDepartment(company);

	const [date, setDate] = useState(getDefaultDate);

	// const [selectedFilter, setSelectedFilter] = useState("This pay period");
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	const [showDateFilter, setShowDateFilter] = useState(false);
	const [showEmpFilter, setShowEmpFilter] = useState(false);
	const [showDeptFilter, setShowDeptFilter] = useState(false);
	const [showCCFilter, setShowCCFilter] = useState(false);
	const [showAddEntry, setShowAddEntry] = useState(false);

	const [filteredEmployees, setFilteredEmployees] = useState([]);
	const [filteredDept, setFilteredDept] = useState([]);
	const [filteredCC, setFilteredCC] = useState([]);

	const toggleDateFilter = () => setShowDateFilter(!showDateFilter);
	const toggleEmpFilter = () => setShowEmpFilter((prev) => !prev);
	const toggleDeptFilter = () => setShowDeptFilter((prev) => !prev);
	const toggleCCFilter = () => setShowCCFilter((prev) => !prev);
	const handleFilter = () => console.log(filteredEmployees);

	useEffect(() => {
		if (closestRecord && !startDate && !endDate) {
			setStartDate(getMomentDate(closestRecord?.payPeriodStartDate));
			setEndDate(getMomentDate(closestRecord?.payPeriodEndDate));
		}
	}, [closestRecord]);

	useEffect(() => {
		if (filteredEmployees) {
			setFilter((prev) => ({
				...prev,
				filteredEmployees,
			}));
		}
		if (startDate) {
			setFilter((prev) => ({
				...prev,
				startDate,
			}));
		}
		if (endDate) {
			setFilter((prev) => ({
				...prev,
				endDate,
			}));
		}
		if (filteredDept) {
			setFilter((prev) => ({
				...prev,
				filteredDept,
			}));
		}
		if (filteredCC) {
			setFilter((prev) => ({
				...prev,
				filteredCC,
			}));
		}

		setShowEmpFilter(false);
		setShowDeptFilter(false);
		setShowCCFilter(false);
	}, [startDate, endDate, filteredEmployees, filteredDept, filteredCC]);

	const handleRefresh = () => setDataRefresh(!dataRefresh);

	const TABS = [
		{
			id: 0,
			type: "Timesheet",
			name: (
				<Timesheet
					setTimesheetRefresh={setDataRefresh}
					company={company}
					userId={userId}
					filter={filter}
					showAddEntry={showAddEntry}
					setShowAddEntry={setShowAddEntry}
				/>
			),
		},
		{
			id: 1,
			type: "Timecards",
			name: (
				<Timecard
					setTimecardRefresh={setDataRefresh}
					company={company}
					userId={userId}
					timecardRefresh={dataRefresh}
				/>
			),
		},
	];

	const [viewMode, setViewMode] = useState(TABS[0].type);
	const showComponent = (viewMode) => TABS.find(({ type }) => type === viewMode)?.name;
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
				<IconButton
					size={"sm"}
					bg={"var(--primary_button_bg)"}
					color={"var(--main_color)"}
					icon={<IoRefresh style={{ fontSize: "20px" }} />}
					variant={"solid"}
					onClick={handleRefresh}
				/>
				<PrimaryButton size={"sm"} name={"Add record"} onOpen={() => setShowAddEntry(true)} />
			</HStack>

			<HStack w={"90%"} justifyContent={"start"} gap={5} position="sticky" zIndex={4}>
				<TabsButtonGroup
					w={"20%"}
					mt={4}
					isOutlineTab
					tabs={TABS}
					setViewMode={setViewMode}
					viewMode={viewMode}
				/>
				<DateFilterPopup
					toggleDateFilter={toggleDateFilter}
					setEndDate={setEndDate}
					setStartDate={setStartDate}
					closestRecord={closestRecord}
					lastRecord={lastRecord}
					startDate={startDate}
					endDate={endDate}
				/>
				<OtherFilter
					showOtherFilter={showEmpFilter}
					toggleOtherFilter={toggleEmpFilter}
					handleFilter={handleFilter}
					data={employees}
					filteredData={filteredEmployees}
					setFilteredData={setFilteredEmployees}
					helperText="employee"
				/>
				<OtherFilter
					showOtherFilter={showDeptFilter}
					toggleOtherFilter={toggleDeptFilter}
					handleFilter={handleFilter}
					data={departments}
					filteredData={filteredDept}
					setFilteredData={setFilteredDept}
					helperText="department"
				/>
				{/* <OtherFilter
					showOtherFilter={showCCFilter}
					toggleOtherFilter={toggleCCFilter}
					handleFilter={handleFilter}
					data={roles}
					filteredData={filteredCC}
					setFilteredData={setFilteredCC}
					helperText="cost center"
				/> */}
			</HStack>

			{showComponent(viewMode)}
		</PageLayout>
	);
};

export default Timesheets;
